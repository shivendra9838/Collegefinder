import { Link } from "wouter";
import {
  useGetSavedColleges, useGetSavedComparisons,
  getGetSavedCollegesQueryKey, getGetSavedComparisonsQueryKey,
  useListApplications
} from "@workspace/api-client-react";
import { useAuth } from "@clerk/react";
import {
  Bookmark, Trash2, Scale, BookmarkX, LogIn, MapPin, Star,
  IndianRupee, Send, CheckCircle2, XCircle, Clock, GraduationCap,
  LayoutDashboard, User, ChevronRight, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Avatar component
function nameToColor(name: string): string {
  const colors = ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-rose-500","bg-amber-500","bg-cyan-500","bg-pink-500","bg-indigo-500"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function Avatar({ name, size = "lg" }: { name: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const color = nameToColor(name);
  const sizeClass = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-xl",
    xl: "h-20 w-20 text-2xl",
  }[size];
  return (
    <div className={`${sizeClass} ${color} rounded-full flex items-center justify-center text-white font-bold shrink-0 ring-4 ring-background shadow-lg`}>
      {initials || "?"}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardContent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { getToken } = useAuth();

  const { data: savedCollegesData, isLoading: loadingColleges, error: collegesError } = useGetSavedColleges({
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
  const { data: savedComparisonsData, isLoading: loadingComparisons, error: comparisonsError } = useGetSavedComparisons({
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 1,
  });
  const { data: applicationsData, isLoading: loadingApps, error: appsError } = useListApplications({
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 1,
  });

  const removeSavedCollege = useMutation({
    mutationFn: async (collegeId: string) => {
      const token = await getToken().catch(() => null);
      const mockId = localStorage.getItem("userId");
      const res = await fetch(`/api/saved/colleges/${collegeId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(mockId ? { "x-mock-user-id": mockId } : {}),
        },
      });
      if (!res.ok && res.status !== 204) throw new Error("Failed to remove");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetSavedCollegesQueryKey() });
      toast({ title: "Removed from saved" });
    },
  });

  const removeSavedComparison = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken().catch(() => null);
      const mockId = localStorage.getItem("userId");
      const res = await fetch(`/api/saved/comparisons/${id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(mockId ? { "x-mock-user-id": mockId } : {}),
        },
      });
      if (!res.ok && res.status !== 204) throw new Error("Failed to remove");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetSavedComparisonsQueryKey() });
      toast({ title: "Comparison removed" });
    },
  });

  const colleges = savedCollegesData?.savedColleges ?? [];
  const comparisons = savedComparisonsData?.savedComparisons ?? [];
  const applications = applicationsData?.applications ?? [];

  // Show error toast if any API calls fail
  if (collegesError || comparisonsError || appsError) {
    console.error("Dashboard API errors:", { collegesError, comparisonsError, appsError });
  }
  const displayName = localStorage.getItem("userName") || localStorage.getItem("userEmail")?.split('@')[0] || "Student";
  const userEmail = localStorage.getItem("userEmail") || "";
  const joinedDate = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long" });

  return (
    <div className="min-h-screen bg-muted/5">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <Avatar name={displayName} size="xl" />
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                <LayoutDashboard className="h-5 w-5 opacity-70" />
                <span className="text-primary-foreground/70 text-sm uppercase tracking-wider font-medium">My Dashboard</span>
              </div>
              <h1 className="text-4xl font-display font-bold mb-1">Welcome back, {displayName}! 👋</h1>
              {userEmail && (
                <p className="text-primary-foreground/70 flex items-center gap-1.5 justify-center md:justify-start">
                  <User className="h-4 w-4" /> {userEmail}
                </p>
              )}
              <p className="text-primary-foreground/60 text-sm mt-1">Member since {joinedDate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 -mt-8 relative z-10">
          <StatCard icon={Bookmark} label="Saved Colleges" value={colleges.length} color="bg-primary" />
          <StatCard icon={Send} label="Applications" value={applications.length} color="bg-indigo-500" />
          <StatCard icon={Scale} label="Comparisons" value={comparisons.length} color="bg-emerald-500" />
          <StatCard icon={TrendingUp} label="Shortlisted" value={applications.filter((a: any) => a.status === "Accepted").length} color="bg-rose-500" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="applications">
          <TabsList className="mb-6 h-12 gap-1">
            <TabsTrigger value="applications" className="gap-2 px-5">
              <Send className="h-4 w-4" /> Applications ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="colleges" className="gap-2 px-5">
              <Bookmark className="h-4 w-4" /> Saved ({colleges.length})
            </TabsTrigger>
            <TabsTrigger value="comparisons" className="gap-2 px-5">
              <Scale className="h-4 w-4" /> Compared ({comparisons.length})
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications">
            {loadingApps ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <Card key={i} className="h-24 animate-pulse bg-muted" />)}
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-24 border rounded-2xl border-dashed bg-muted/20">
                <Send className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="text-xl font-bold mb-2">No applications yet</h3>
                <p className="text-muted-foreground mb-6">Apply to your dream colleges and track them here.</p>
                <Link href="/colleges"><Button>Browse Colleges</Button></Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app: any) => (
                  <Card key={app.id} className="hover:border-primary/30 hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0 bg-muted">
                            <img src={app.college?.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=200"} className="h-full w-full object-cover" alt="" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-lg leading-tight mb-1 truncate">{app.college?.name}</h3>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{app.college?.location}, {app.college?.state}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Applied on {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          {app.status === "Pending" && (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1 hover:bg-amber-100">
                              <Clock className="h-3 w-3" /> Pending
                            </Badge>
                          )}
                          {app.status === "Accepted" && (
                            <Badge className="bg-green-100 text-green-700 border-green-200 gap-1 hover:bg-green-100">
                              <CheckCircle2 className="h-3 w-3" /> Accepted 🎉
                            </Badge>
                          )}
                          {app.status === "Rejected" && (
                            <Badge className="bg-red-100 text-red-700 border-red-200 gap-1 hover:bg-red-100">
                              <XCircle className="h-3 w-3" /> Rejected
                            </Badge>
                          )}
                          <Link href={`/colleges/${app.college?.id}`}>
                            <Button variant="ghost" size="sm" className="gap-1">
                              View <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Saved Colleges Tab */}
          <TabsContent value="colleges">
            {loadingColleges ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => <Card key={i} className="animate-pulse"><div className="h-40 bg-muted rounded-t-xl" /><CardContent className="p-5"><div className="h-5 bg-muted rounded w-3/4 mb-3" /><div className="h-4 bg-muted rounded w-1/2" /></CardContent></Card>)}
              </div>
            ) : colleges.length === 0 ? (
              <div className="text-center py-24 border rounded-2xl border-dashed bg-muted/20">
                <BookmarkX className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="text-xl font-bold mb-2">No saved colleges yet</h3>
                <p className="text-muted-foreground mb-6">Browse colleges and bookmark the ones you like.</p>
                <Link href="/colleges"><Button>Explore Colleges</Button></Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {colleges.map((item: any) => {
                  const college = item.college;
                  if (!college) return null;
                  return (
                    <Card key={item.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
                      <div className="relative h-44 shrink-0">
                        <img src={college.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600"} alt={college.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <Badge className="absolute top-3 left-3 bg-background/90 text-foreground">{college.type}</Badge>
                        <div className="absolute top-3 right-3 bg-background/90 text-foreground px-2 py-1 rounded text-sm font-medium flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" /> {college.rating?.toFixed(1)}
                        </div>
                      </div>
                      <CardContent className="p-5 flex flex-col flex-1">
                        <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">{college.name}</h3>
                        <div className="flex items-center text-muted-foreground text-sm mb-4">
                          <MapPin className="h-4 w-4 mr-1 shrink-0" />
                          <span className="truncate">{college.location}, {college.state}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm mb-5 mt-auto">
                          <div>
                            <p className="text-muted-foreground text-xs mb-1">Fees</p>
                            <p className="font-semibold flex items-center"><IndianRupee className="h-3 w-3 mr-0.5" />{(college.totalFees / 100000).toFixed(1)}L</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs mb-1">Avg Package</p>
                            <p className="font-semibold flex items-center text-green-600"><IndianRupee className="h-3 w-3 mr-0.5" />{(college.avgPackage / 100000).toFixed(1)}L</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/colleges/${college.id}`} className="flex-1">
                            <Button variant="outline" className="w-full text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground">View Details</Button>
                          </Link>
                          <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/30" onClick={() => removeSavedCollege.mutate(college.id)} disabled={removeSavedCollege.isPending}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Comparisons Tab */}
          <TabsContent value="comparisons">
            {loadingComparisons ? (
              <div className="space-y-4">{[1,2,3].map(i => <Card key={i} className="h-20 animate-pulse bg-muted" />)}</div>
            ) : comparisons.length === 0 ? (
              <div className="text-center py-24 border rounded-2xl border-dashed bg-muted/20">
                <Scale className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="text-xl font-bold mb-2">No saved comparisons yet</h3>
                <p className="text-muted-foreground mb-6">Compare colleges and save the results for later.</p>
                <Link href="/compare"><Button>Compare Colleges</Button></Link>
              </div>
            ) : (
              <div className="space-y-4">
                {comparisons.map((comp: any) => (
                  <Card key={comp.id} className="hover:border-primary/30 hover:shadow-md transition-all">
                    <CardContent className="p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-3 bg-emerald-100 rounded-xl shrink-0">
                          <Scale className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-lg truncate">{comp.name}</h3>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {comp.collegeIds?.length || 0} colleges · Saved {new Date(comp.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="icon" className="shrink-0 text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/30" onClick={() => removeSavedComparison.mutate(comp.id)} disabled={removeSavedComparison.isPending}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Saved() {
  const { isSignedIn: isClerkSignedIn, isLoaded } = useAuth();
  const isMockSignedIn = localStorage.getItem("isLoggedIn") === "true";
  const isSignedIn = isClerkSignedIn || isMockSignedIn;

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/10 px-4">
        <div className="p-5 bg-primary/10 rounded-full mb-6">
          <GraduationCap className="h-14 w-14 text-primary" />
        </div>
        <h2 className="text-3xl font-display font-bold mb-3">Sign in to view your Dashboard</h2>
        <p className="text-muted-foreground mb-8 text-lg text-center max-w-sm">
          Create an account or sign in to track applications, save colleges, and compare results.
        </p>
        <Link href="/sign-in">
          <Button size="lg" className="gap-2 rounded-full px-8">
            <LogIn className="h-5 w-5" /> Sign In to Continue
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button variant="ghost" size="lg" className="mt-3 rounded-full">
            Create a free account
          </Button>
        </Link>
      </div>
    );
  }

  return <DashboardContent />;
}
