import { useRoute, Link } from "wouter";
import { useGetCollege, useGetCollegeCoursesList, useGetCollegeReviews, useListQuestions, useCreateApplication } from "@workspace/api-client-react";
import { MapPin, Star, Building2, Globe, CheckCircle2, GraduationCap, IndianRupee, Users, BookOpen, MessageSquare, Clock, User, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTimeAgo, getCategoryBadgeColor } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function CollegeDetail() {
  const [, params] = useRoute("/colleges/:id");
  const id = params?.id || "";
  const { toast } = useToast();

  const { data: college, isLoading } = useGetCollege(id, { query: { queryKey: ["college", id], enabled: !!id } });
  const { data: coursesData } = useGetCollegeCoursesList(id, { query: { queryKey: ["college-courses", id], enabled: !!id } });
  const { data: reviewsData } = useGetCollegeReviews(id, { query: { queryKey: ["college-reviews", id], enabled: !!id } });
  const { data: questionsData } = useListQuestions({ collegeId: id, limit: 10 }, { query: { queryKey: ["college-questions", id], enabled: !!id } });

  const applyMutation = useCreateApplication();

  const handleApply = () => {
    applyMutation.mutate(
      { collegeId: id },
      {
        onSuccess: () => {
          toast({
            title: "Application Submitted!",
            description: `Your application to ${college?.name} is now pending review. Redirecting to college website...`,
          });
          if (college?.website) {
            setTimeout(() => {
              window.open(college.website, "_blank");
            }, 1500);
          }
        },
        onError: (err: any) => {
          toast({
            title: "Application Failed",
            description: err.message || "Something went wrong.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="w-full h-80 rounded-none" />
        <div className="container mx-auto px-4 -mt-16 relative z-10">
          <Skeleton className="w-full h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!college) return <div className="text-center py-20 text-xl font-bold">College not found.</div>;

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      {/* Hero Section */}
      <div className="relative h-80 md:h-[400px] bg-primary">
        <img 
          src={college.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000&auto=format&fit=crop"} 
          alt={college.name}
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <Card className="border-border/50 shadow-xl overflow-hidden backdrop-blur-sm bg-background/95">
          <CardContent className="p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-secondary/20 text-secondary border-none hover:bg-secondary/30">
                  {college.type}
                </Badge>
                {college.nirf && (
                  <Badge variant="outline" className="border-primary/20 text-primary">
                    NIRF Rank #{college.nirf}
                  </Badge>
                )}
                {college.accreditation && (
                  <Badge variant="outline" className="border-primary/20 text-primary">
                    {college.accreditation}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight">
                {college.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-5 w-5" />
                  {college.location}, {college.state}
                </div>
                <div className="flex items-center gap-1.5 text-yellow-600">
                  <Star className="h-5 w-5 fill-yellow-600" />
                  <span className="text-foreground font-bold">{college.rating.toFixed(1)}</span> / 5.0
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-5 w-5" />
                  Est. {college.established}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-8 border-border/50">
              <Button 
                size="lg" 
                className="w-full md:w-48 shadow-lg"
                onClick={handleApply}
                disabled={applyMutation.isPending}
              >
                {applyMutation.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying...</>
                ) : (
                  "Apply Now"
                )}
              </Button>
              {college.website && (
                <Button variant="outline" size="lg" className="w-full md:w-48 gap-2" asChild>
                  <a href={college.website} target="_blank" rel="noreferrer">
                    <Globe className="h-4 w-4" /> Official Website
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="mt-12">
          <TabsList className="w-full justify-start h-auto p-1 bg-transparent border-b rounded-none gap-6 mb-8 overflow-x-auto overflow-y-hidden">
            <TabsTrigger value="overview" className="text-base data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-3 pt-2">Overview</TabsTrigger>
            <TabsTrigger value="courses" className="text-base data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-3 pt-2">Courses & Fees</TabsTrigger>
            <TabsTrigger value="placements" className="text-base data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-3 pt-2">Placements</TabsTrigger>
            <TabsTrigger value="reviews" className="text-base data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-3 pt-2">Reviews</TabsTrigger>
            <TabsTrigger value="discussions" className="text-base data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 pb-3 pt-2">Discussions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display text-2xl">About {college.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {college.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-display text-xl">Top Courses Offered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {college.topCourses.map(course => (
                        <Badge key={course} variant="secondary" className="px-3 py-1.5 text-sm">{course}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display text-xl">Quick Facts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-dashed">
                      <span className="text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4"/> Total Students</span>
                      <span className="font-semibold">{college.totalStudents.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-dashed">
                      <span className="text-muted-foreground flex items-center gap-2"><BookOpen className="h-4 w-4"/> Faculty Count</span>
                      <span className="font-semibold">{college.facultyCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-dashed">
                      <span className="text-muted-foreground flex items-center gap-2"><Building2 className="h-4 w-4"/> Hostel</span>
                      <span className="font-semibold">{college.hostelAvailable ? "Available" : "Not Available"}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> Scholarships</span>
                      <span className="font-semibold">{college.scholarshipAvailable ? "Available" : "Not Available"}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/10">
                  <CardHeader>
                    <CardTitle className="font-display text-xl">Exams Accepted</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {college.examAccepted.map(exam => (
                        <Badge key={exam} variant="outline" className="bg-background">{exam}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <div className="grid gap-4">
              {coursesData?.courses?.map(course => (
                <Card key={course.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{course.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4"/> {course.duration}</span>
                        <span className="flex items-center gap-1"><Users className="h-4 w-4"/> {course.seats} Seats</span>
                        <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> {course.eligibility}</span>
                      </div>
                    </div>
                    <div className="text-left md:text-right shrink-0 bg-muted/50 p-4 rounded-xl md:bg-transparent md:p-0">
                      <div className="text-sm text-muted-foreground mb-1">Total Fees</div>
                      <div className="text-2xl font-bold text-primary flex items-center justify-start md:justify-end">
                        <IndianRupee className="h-5 w-5 mr-0.5" />
                        {course.fees.toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!coursesData?.courses || coursesData.courses.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">No course information available.</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="placements" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-green-50/50 border-green-100 dark:bg-green-950/20 dark:border-green-900">
                <CardContent className="p-8 text-center flex flex-col justify-center h-full min-h-[200px]">
                  <div className="text-6xl font-display font-bold text-green-600 mb-4">{college.placementPercentage}%</div>
                  <div className="text-xl font-medium text-green-800 dark:text-green-400">Overall Placement Rate</div>
                  <p className="text-green-600/70 mt-2">Consistent track record of placing students in top companies.</p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/10">
                <CardContent className="p-8 text-center flex flex-col justify-center h-full min-h-[200px]">
                  <div className="text-5xl font-display font-bold text-primary mb-4 flex items-center justify-center">
                    <IndianRupee className="h-10 w-10 mr-1" />
                    {(college.avgPackage / 100000).toFixed(2)}L
                  </div>
                  <div className="text-xl font-medium text-primary/80">Average Package</div>
                  <p className="text-primary/60 mt-2">Across all disciplines and branches.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            {reviewsData?.reviews?.map(review => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-bold text-lg">{review.reviewerName}</div>
                      <div className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</div>
                    </div>
                    <Badge variant="outline" className="bg-primary/5 border-primary/20">
                      {review.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted fill-muted"}`} 
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">"{review.comment}"</p>
                </CardContent>
              </Card>
            ))}
            {(!reviewsData?.reviews || reviewsData.reviews.length === 0) && (
              <div className="text-center py-12 text-muted-foreground">No reviews available yet.</div>
            )}
          </TabsContent>
          <TabsContent value="discussions" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-display">Student Q&A for {college.name}</h3>
              <Link href="/discussions">
                <Button size="sm" variant="outline">Ask about this college</Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {(!questionsData?.questions || questionsData.questions.length === 0) ? (
                <div className="text-center py-12 border rounded-xl border-dashed">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted mb-4" />
                  <p className="text-muted-foreground font-medium">No questions asked yet.</p>
                </div>
              ) : (
                questionsData.questions.map((q) => (
                  <Link key={q.id} href={`/discussions/${q.id}`}>
                    <Card className="hover:border-primary/30 transition-colors cursor-pointer block">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={getCategoryBadgeColor(q.category)}>
                            {q.category}
                          </Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <User className="h-3 w-3 mr-1" /> {q.authorName}
                            <span className="mx-1.5">&middot;</span>
                            <Clock className="h-3 w-3 mr-1" /> {formatTimeAgo(q.createdAt)}
                          </div>
                        </div>
                        <h4 className="text-lg font-bold mb-2 line-clamp-1">{q.title}</h4>
                        <div className="flex items-center text-sm font-medium">
                          <span className={`${q.answerCount > 0 ? "text-green-600" : "text-muted-foreground"}`}>
                            {q.answerCount > 0 ? `${q.answerCount} Answers` : "No answers yet"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
