import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useListQuestions, useListColleges, useCreateQuestion, getListQuestionsQueryKey } from "@workspace/api-client-react";
import { MessageSquare, PlusCircle, Clock, MapPin, Loader2, ArrowRight, Lock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatTimeAgo, getCategoryBadgeColor } from "@/lib/utils";

function nameToColor(name: string): string {
  const colors = ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-rose-500","bg-amber-500","bg-cyan-500","bg-pink-500","bg-indigo-500"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className={`h-9 w-9 ${nameToColor(name)} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2 ring-background`}>
      {initials || "?"}
    </div>
  );
}

const CATEGORIES = ["All", "General", "Admissions", "Fees", "Placements", "Campus Life", "Courses", "Hostel"];

export default function Discussions() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const savedName = localStorage.getItem("userName") || "";

  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newAuthor, setNewAuthor] = useState(() => localStorage.getItem("userName") || "");
  const [newCategory, setNewCategory] = useState("General");
  const [newCollegeId, setNewCollegeId] = useState("");

  const { data, isLoading } = useListQuestions({
    page,
    limit: 10,
    ...(category !== "All" && { category })
  });

  const { data: collegesData } = useListColleges({ limit: 100 });
  const createQuestion = useCreateQuestion();

  const handleCreate = async () => {
    if (!newTitle || !newBody || !newAuthor || !newCollegeId) return;

    createQuestion.mutate({
      title: newTitle,
      body: newBody,
      authorName: newAuthor,
      category: newCategory,
      collegeId: newCollegeId
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        setNewTitle("");
        setNewBody("");
        setNewAuthor("");
        queryClient.invalidateQueries({ queryKey: getListQuestionsQueryKey() });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Student Q&A</h1>
          <p className="text-muted-foreground mt-2">Ask questions, share experiences, and help others.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shrink-0">
              <PlusCircle className="h-4 w-4" /> Ask a Question
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ask a Question</DialogTitle>
              <DialogDescription>
                Get answers from students and alumni.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  Your Name
                  {isLoggedIn && <span className="text-xs text-muted-foreground flex items-center gap-1"><Lock className="h-3 w-3" /> Locked to account</span>}
                </label>
                {isLoggedIn ? (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
                    <Avatar name={savedName} />
                    <span className="font-medium">{savedName}</span>
                  </div>
                ) : (
                  <Input value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} placeholder="e.g. Rahul K." />
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">College</label>
                <Select value={newCollegeId} onValueChange={setNewCollegeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a college" />
                  </SelectTrigger>
                  <SelectContent>
                    {collegesData?.colleges.map(c => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter(c => c !== "All").map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Question Title</label>
                <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="What do you want to know?" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Details</label>
                <Textarea value={newBody} onChange={(e) => setNewBody(e.target.value)} placeholder="Provide more context..." className="h-24" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createQuestion.isPending || !newTitle || !newBody || !newAuthor || !newCollegeId}>
                {createQuestion.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-8 overflow-x-auto pb-2">
        <Tabs value={category} onValueChange={(v) => { setCategory(v); setPage(1); }} className="w-full">
          <TabsList className="h-10">
            {CATEGORIES.map(c => (
              <TabsTrigger key={c} value={c} className="px-4">{c}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {data?.questions.length === 0 ? (
            <div className="text-center py-20 border rounded-xl border-dashed">
              <MessageSquare className="h-12 w-12 mx-auto text-muted mb-4" />
              <h3 className="text-lg font-medium">No questions found</h3>
              <p className="text-muted-foreground mt-1">Be the first to ask a question in this category.</p>
            </div>
          ) : (
            data?.questions.map((q) => (
              <Card key={q.id} className="hover:border-primary/30 transition-colors cursor-pointer" onClick={() => setLocation(`/discussions/${q.id}`)}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                        <Avatar name={q.authorName} />
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{q.authorName}</span>
                          <span>·</span>
                          <Clock className="h-3 w-3" /> {formatTimeAgo(q.createdAt)}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2 text-foreground line-clamp-1">{q.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {q.body}
                      </p>

                      <div className="flex items-center">
                        <Link href={`/colleges/${q.collegeId}`} onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center text-xs font-medium bg-primary/5 text-primary px-2.5 py-1 rounded-md hover:bg-primary/10 transition-colors">
                            <MapPin className="h-3 w-3 mr-1" />
                            {q.collegeName}
                          </div>
                        </Link>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center md:flex-col justify-end md:justify-center md:items-end mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-border/50">
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                        q.answerCount > 0 
                          ? "bg-green-50 text-green-700 border border-green-200" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <MessageSquare className="h-4 w-4" />
                        {q.answerCount > 0 ? `${q.answerCount} Answers` : "No answers yet"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <span className="flex items-center px-4 text-sm font-medium">Page {page} of {data.totalPages}</span>
          <Button variant="outline" disabled={page === data.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}