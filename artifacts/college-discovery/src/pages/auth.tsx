import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage({ mode = "sign-in" }: { mode?: "sign-in" | "sign-up" }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication and sync with backend
    setTimeout(async () => {
      try {
        const res = await fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, firstName: name || email.split('@')[0] })
        });
        
        if (!res.ok) throw new Error("Sync failed");
        
        const userData = await res.json();
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", name || email.split('@')[0]);
        localStorage.setItem("userId", userData.clerkId);
        
        toast({
          title: mode === "sign-in" ? "Signed in successfully" : "Account created successfully",
          description: `Welcome to EduDiscover, ${email}!`,
        });
        
        setIsLoading(false);
        setLocation("/");
        window.location.reload();
      } catch (err) {
        toast({
          title: "Auth failed",
          description: "Could not sync with database.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-muted/10 p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/5">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-display font-bold">
            {mode === "sign-in" ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {mode === "sign-in" 
              ? "Enter your credentials to access your dashboard" 
              : "Join our community of students and alumni"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter your name</label>
              <Input 
                type="text" 
                placeholder="Full Name" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                placeholder="name@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (mode === "sign-in" ? "Sign In" : "Sign Up")}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t bg-muted/20 p-6">
          <div className="text-sm text-center text-muted-foreground">
            {mode === "sign-in" ? "Don't have an account?" : "Already have an account?"}{" "}
            <Button variant="link" className="p-0 h-auto font-bold text-primary" onClick={() => setLocation(mode === "sign-in" ? "/sign-up" : "/sign-in")}>
              {mode === "sign-in" ? "Sign Up" : "Sign In"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
