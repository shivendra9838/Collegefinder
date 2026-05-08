import { useState } from "react";
import { Link, useSearch } from "wouter";
import { Search, MapPin, Filter, Star, IndianRupee, GraduationCap, Building } from "lucide-react";
import { useListColleges, useGetCollegeLocations, useGetCollegeCourses } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Colleges() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  
  const initialSearch = searchParams.get("search") || "";
  
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState<string>("all");
  const [course, setCourse] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data: locationsData } = useGetCollegeLocations();
  const { data: coursesData } = useGetCollegeCourses();

  const { data, isLoading } = useListColleges({
    search: search || undefined,
    location: location !== "all" ? location : undefined,
    course: course !== "all" ? course : undefined,
    page,
    limit
  }, {
    query: {
      queryKey: ["colleges", search, location, course, page, limit]
    }
  });

  const locations = locationsData?.locations || [];
  const courses = coursesData?.courses || [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden md:block w-72 flex-shrink-0 space-y-8">
          <div>
            <h2 className="text-xl font-display font-bold mb-4">Filters</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Location</Label>
                <Select value={location} onValueChange={(val) => { setLocation(val); setPage(1); }}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Course</Label>
                <Select value={course} onValueChange={(val) => { setCourse(val); setPage(1); }}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-display font-bold">
              Discover Colleges
            </h1>
            
            <div className="flex w-full sm:w-auto gap-2">
              <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search colleges..." 
                  className="pl-9 bg-background"
                />
              </form>
              
              {/* Mobile Filter Sheet */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-8 space-y-6">
                    <div className="space-y-3">
                      <Label>Location</Label>
                      <Select value={location} onValueChange={(val) => { setLocation(val); setPage(1); }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          {locations.map(loc => (
                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Course</Label>
                      <Select value={course} onValueChange={(val) => { setCourse(val); setPage(1); }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Courses</SelectItem>
                          {courses.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="h-40 bg-muted" />
                  <CardContent className="p-5">
                    <div className="h-6 bg-muted w-3/4 mb-4 rounded" />
                    <div className="h-4 bg-muted w-1/2 mb-6 rounded" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted w-full rounded" />
                      <div className="h-4 bg-muted w-full rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : data?.colleges && data.colleges.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.colleges.map(college => (
                  <Card key={college.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col">
                    <div className="relative h-48 shrink-0">
                      <img 
                        src={college.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1000&auto=format&fit=crop"} 
                        alt={college.name}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-background/90 text-foreground backdrop-blur-sm hover:bg-background/90">
                        {college.type}
                      </Badge>
                      <div className="absolute top-4 right-4 bg-background/90 text-foreground px-2 py-1 rounded text-sm font-medium flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                        {college.rating.toFixed(1)}
                      </div>
                    </div>
                    <CardContent className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                        {college.name}
                      </h3>
                      <div className="flex items-center text-muted-foreground text-sm mb-4">
                        <MapPin className="h-4 w-4 mr-1 shrink-0" />
                        <span className="truncate">{college.location}, {college.state}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-6 mt-auto">
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Fees</p>
                          <p className="font-semibold flex items-center">
                            <IndianRupee className="h-3 w-3 mr-0.5" />
                            {(college.totalFees / 100000).toFixed(2)}L
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Avg Package</p>
                          <p className="font-semibold flex items-center text-green-600">
                            <IndianRupee className="h-3 w-3 mr-0.5" />
                            {(college.avgPackage / 100000).toFixed(2)}L
                          </p>
                        </div>
                      </div>

                      <Link href={`/colleges/${college.id}`}>
                        <Button className="w-full">View Details</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {data.totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <Button 
                    variant="outline" 
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-medium mx-4">
                    Page {page} of {data.totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    disabled={page === data.totalPages}
                    onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 bg-muted/20 rounded-2xl border border-dashed">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No colleges found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => {
                  setSearch("");
                  setLocation("all");
                  setCourse("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
