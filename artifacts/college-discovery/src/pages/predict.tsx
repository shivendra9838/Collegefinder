import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useSearch } from "wouter";
import { Target, Loader2, Sparkles, MapPin } from "lucide-react";
import { usePredictColleges, PredictRequestExam, PredictRequestCategory } from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  exam: z.nativeEnum(PredictRequestExam, { required_error: "Please select an exam" }),
  rank: z.coerce.number().min(1, "Rank must be at least 1").max(5000000, "Invalid rank"),
  category: z.nativeEnum(PredictRequestCategory).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Predict() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const defaultExam = (searchParams.get("exam") as PredictRequestExam) || undefined;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exam: defaultExam,
      rank: undefined,
      category: PredictRequestCategory.General,
    },
  });

  const predictMutation = usePredictColleges();

  const onSubmit = (data: FormValues) => {
    predictMutation.mutate({ data });
  };

  const results = predictMutation.data;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen flex flex-col items-center">
      <div className="max-w-2xl w-full text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-full mb-6">
          <Target className="h-8 w-8 text-secondary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">College Predictor</h1>
        <p className="text-xl text-muted-foreground">
          Enter your competitive exam rank to instantly discover which colleges you have the best chance of getting into.
        </p>
      </div>

      <Card className="w-full max-w-2xl border-primary/20 shadow-xl relative overflow-hidden mb-16">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="exam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Examination</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select Exam" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(PredictRequestExam).map((exam) => (
                            <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Your Rank</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 15000" className="h-12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem className="md:w-1/2">
                    <FormLabel className="text-base">Reservation Category (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PredictRequestCategory).map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 text-lg font-bold mt-4 shadow-lg hover:shadow-xl transition-all"
                disabled={predictMutation.isPending}
              >
                {predictMutation.isPending ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Past Cutoffs...</>
                ) : (
                  <><Sparkles className="mr-2 h-5 w-5" /> Predict My Colleges</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && (
        <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h2 className="text-2xl font-display font-bold mb-6 text-center">
            Predicted Colleges for {results.exam} Rank {results.rank.toLocaleString()} ({results.category})
          </h2>
          
          {results.colleges.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {results.colleges.map((college) => {
                let badgeColor = "";
                let bgGlow = "";
                if (college.admissionChance === "High") {
                  badgeColor = "bg-green-500 text-white hover:bg-green-600";
                  bgGlow = "hover:border-green-500/50";
                } else if (college.admissionChance === "Medium") {
                  badgeColor = "bg-yellow-500 text-white hover:bg-yellow-600";
                  bgGlow = "hover:border-yellow-500/50";
                } else {
                  badgeColor = "bg-red-500 text-white hover:bg-red-600";
                  bgGlow = "hover:border-red-500/50";
                }

                return (
                  <Card key={college.id} className={`transition-all duration-300 overflow-hidden ${bgGlow}`}>
                    <CardContent className="p-0 flex h-full">
                      <div className="w-1/3 bg-muted relative">
                        <img 
                          src={college.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=400&auto=format&fit=crop"} 
                          alt={college.name} 
                          className="w-full h-full object-cover"
                        />
                        <Badge className={`absolute top-3 left-3 border-none shadow-md ${badgeColor}`}>
                          {college.admissionChance} Chance
                        </Badge>
                      </div>
                      <div className="w-2/3 p-5 flex flex-col">
                        <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{college.name}</h3>
                        <div className="flex items-center text-muted-foreground text-sm mb-4">
                          <MapPin className="h-3 w-3 mr-1" />
                          {college.location}
                        </div>
                        
                        <div className="mt-auto pt-4 border-t border-dashed">
                          <div className="flex justify-between items-center text-sm mb-3">
                            <span className="text-muted-foreground">Historical Cutoff:</span>
                            <span className="font-bold">{college.cutoffRank.toLocaleString()}</span>
                          </div>
                          <Link href={`/colleges/${college.id}`}>
                            <Button variant="outline" className="w-full text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed">
              <p className="text-lg text-muted-foreground">No colleges match your rank criteria within the top institutions.</p>
              <p className="text-sm mt-2 text-muted-foreground/70">Try modifying your category or selecting a different exam.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
