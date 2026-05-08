import { Link, useLocation } from "wouter";
import { GraduationCap, Scale, LayoutDashboard, LogIn, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton, useAuth } from "@clerk/react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Support both Clerk auth and local mock auth
  const { isSignedIn: isClerkSignedIn } = useAuth();
  const isMockSignedIn = typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true";
  const isSignedIn = isClerkSignedIn || isMockSignedIn;
  const userName = typeof window !== "undefined" ? localStorage.getItem("userName") || "" : "";

  const handleSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    setLocation("/");
    window.location.reload();
  };

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Colleges", href: "/colleges" },
    { label: "Predict", href: "/predict" },
    { label: "Discussions", href: "/discussions" },
    { label: "Compare", href: "/compare" },
  ];

  const navLink = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      className={`text-sm font-medium transition-colors hover:text-primary ${
        location === href ? "text-primary" : "text-muted-foreground"
      }`}
      onClick={() => setMobileOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl text-primary shrink-0">
            <GraduationCap className="h-6 w-6 text-secondary" />
            <span>EduDiscover</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => navLink(item.href, item.label))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 shrink-0">
            {isSignedIn ? (
              <>
                <Link href="/saved">
                  <Button
                    size="sm"
                    variant={location === "/saved" ? "default" : "outline"}
                    className="gap-2 rounded-full hidden sm:flex"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                {isClerkSignedIn ? (
                  <UserButton />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-sm font-medium text-primary">
                      {userName.charAt(0).toUpperCase()}{userName.slice(1)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-muted-foreground hover:text-foreground"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline">Sign Out</span>
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" className="gap-1.5 rounded-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t bg-background px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => navLink(item.href, item.label))}
            {isSignedIn && (
              <Link href="/saved" onClick={() => setMobileOpen(false)}>
                <Button size="sm" variant="outline" className="gap-2 w-full">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Button>
              </Link>
            )}
          </div>
        )}
      </header>

      <main className="flex-1 w-full">
        {children}
      </main>

      <footer className="bg-primary/5 py-12 mt-12 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EduDiscover. Your insider guide to Indian higher education.</p>
        </div>
      </footer>
    </div>
  );
}
