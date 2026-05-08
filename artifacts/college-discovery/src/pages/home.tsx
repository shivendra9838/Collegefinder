import { Link } from "wouter";
import { GraduationCap, ArrowRight, Search, MapPin, Star, Building2, TrendingUp, BookOpen } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useGetCollegeStats, useListColleges } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useState<string>("");
  const { isSignedIn: isClerkSignedIn } = useAuth();
  const isMockSignedIn = localStorage.getItem("isLoggedIn") === "true";
  const isSignedIn = isClerkSignedIn || isMockSignedIn;

  const { data: stats, isLoading: statsLoading } = useGetCollegeStats();
  const { data: featuredColleges, isLoading: featuredLoading } = useListColleges({ limit: 4 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/colleges?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6 py-1 px-4 rounded-full text-sm">
            The Insider Guide to Indian Higher Education
          </Badge>
          <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight mb-6">
            Find the right college for your future.
          </h1>
          <p className="text-xl lg:text-2xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Discover, compare, and choose from thousands of top-ranked institutions across India. Your journey starts here.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto bg-background/10 p-2 rounded-xl backdrop-blur-sm border border-primary-foreground/20">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-foreground/50" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for colleges, courses, or locations..." 
                className="pl-12 h-14 bg-background text-foreground text-lg rounded-lg border-0 shadow-inner"
              />
            </div>
            <Button type="submit" size="lg" className="h-14 px-8 text-lg rounded-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold">
              Search
            </Button>
          </form>

          <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-primary-foreground/70">
            <span className="font-medium text-primary-foreground/90">Popular Exams:</span>
            <Link href="/predict?exam=JEE Main" className="hover:text-secondary transition-colors">JEE Main</Link>
            <Link href="/predict?exam=CAT" className="hover:text-secondary transition-colors">CAT</Link>
            <Link href="/predict?exam=NEET" className="hover:text-secondary transition-colors">NEET</Link>
            <Link href="/predict?exam=GATE" className="hover:text-secondary transition-colors">GATE</Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse flex flex-col items-center justify-center p-6 bg-background rounded-2xl border">
                  <div className="h-10 w-10 bg-muted rounded-full mb-4" />
                  <div className="h-8 w-24 bg-muted rounded mb-2" />
                  <div className="h-4 w-32 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-4xl font-display font-bold text-foreground mb-1">{stats.totalColleges.toLocaleString()}+</h3>
                <p className="text-muted-foreground font-medium">Top Colleges</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-4">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="text-4xl font-display font-bold text-foreground mb-1">{stats.avgRating.toFixed(1)}/5</h3>
                <p className="text-muted-foreground font-medium">Average Rating</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-4xl font-display font-bold text-foreground mb-1">{stats.avgPlacement}%</h3>
                <p className="text-muted-foreground font-medium">Avg. Placement Rate</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-4xl font-display font-bold text-foreground mb-1">{stats.topLocations.length}</h3>
                <p className="text-muted-foreground font-medium">Cities Covered</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-display font-bold mb-3">Featured Colleges</h2>
            <p className="text-muted-foreground text-lg">Top-ranked institutions recommended for you.</p>
          </div>
          <Link href="/colleges">
            <Button variant="ghost" className="gap-2 text-primary hover:text-primary hover:bg-primary/5">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {featuredLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-muted" />
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-6" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-5/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : featuredColleges?.colleges ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredColleges.colleges.map(college => (
              <Card key={college.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-border/50">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <img 
                    src={college.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop"} 
                    alt={college.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 left-4 z-20 bg-background/90 text-foreground backdrop-blur-sm hover:bg-background/90 border-none">
                    {college.type}
                  </Badge>
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 text-white bg-black/40 px-2 py-1 rounded-md backdrop-blur-md text-sm font-medium">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    {college.rating.toFixed(1)}
                  </div>
                </div>
                <CardContent className="p-6 relative">
                  <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {college.name}
                  </h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1 opacity-70" />
                    {college.location}, {college.state}
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-t border-dashed">
                      <span className="text-muted-foreground">Total Fees</span>
                      <span className="font-semibold">₹{(college.totalFees / 100000).toFixed(2)}L</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-dashed">
                      <span className="text-muted-foreground">Placement</span>
                      <span className="font-semibold text-green-600">{college.placementPercentage}%</span>
                    </div>
                  </div>

                  <Link href={`/colleges/${college.id}`}>
                    <Button className="w-full mt-6 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-colors border border-primary/10">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </section>

      {/* Auth / Join Community Section */}
      {!isSignedIn && (
        <section className="py-24 bg-secondary/5 overflow-hidden relative">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto bg-background rounded-3xl overflow-hidden shadow-2xl border border-primary/5 flex flex-col md:flex-row">
              <div className="md:w-1/2 p-12 flex flex-col justify-center bg-primary text-primary-foreground">
                <h2 className="text-4xl font-display font-bold mb-6">Join our growing student community</h2>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-lg">
                    <Star className="h-5 w-5 text-secondary fill-secondary" /> Save your favorite colleges
                  </li>
                  <li className="flex items-center gap-3 text-lg">
                    <Star className="h-5 w-5 text-secondary fill-secondary" /> Track your applications
                  </li>
                  <li className="flex items-center gap-3 text-lg">
                    <Star className="h-5 w-5 text-secondary fill-secondary" /> Ask questions to alumni
                  </li>
                  <li className="flex items-center gap-3 text-lg">
                    <Star className="h-5 w-5 text-secondary fill-secondary" /> Compare colleges side-by-side
                  </li>
                </ul>
                <div className="flex flex-wrap gap-4">
                  <Link href="/sign-up">
                    <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 rounded-full font-bold">
                      Create Free Account
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white px-8 rounded-full">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 relative min-h-[300px]">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop" 
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Students studying"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-primary/95 py-20 mt-auto border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-6">
            Not sure where you stand?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Use our smart prediction tool to see which colleges you can get into based on your expected rank and category.
          </p>
          <Link href="/predict">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8 h-14 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              Try College Predictor
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
