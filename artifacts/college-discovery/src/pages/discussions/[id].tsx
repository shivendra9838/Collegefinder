import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useGetQuestion, useCreateAnswer, getGetQuestionQueryKey } from "@workspace/api-client-react";
import { MessageSquare, Clock, MapPin, ArrowLeft, Loader2, Send } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatTimeAgo, getCategoryBadgeColor } from "@/lib/utils";

// Generates a consistent color from a name string
function nameToColor(name: string): string {
  const colors = [
    "bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-rose-500",
    "bg-amber-500", "bg-cyan-500", "bg-pink-500", "bg-indigo-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const color = nameToColor(name);
  const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-12 w-12 text-lg" : "h-10 w-10 text-sm";
  return (
    <div className={`${sizeClass} ${color} rounded-full flex items-center justify-center text-white font-bold shrink-0 ring-2 ring-white dark:ring-zinc-900`}>
      {initials || "?"}
    </div>
  );
}

export default function DiscussionDetail() {
  const [, params] = useRoute("/discussions/:id");
  const id = params?.id || "";
  const queryClient = useQueryClient();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const savedName = localStorage.getItem("userName") || "";

  const [body, setBody] = useState("");

  const { data: question, isLoading } = useGetQuestion(id, { query: { enabled: !!id, queryKey: getGetQuestionQueryKey(id) } });
  const createAnswer = useCreateAnswer();

  const handlePostAnswer = () => {
    if (!savedName || !body) return;

    createAnswer.mutate(
      { questionId: id, authorName: savedName, body },
      {
        onSuccess: () => {
          setBody("");
          queryClient.invalidateQueries({ queryKey: getGetQuestionQueryKey(id) });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Question not found</h2>
        <Link href="/discussions">
          <Button>Back to Discussions</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/discussions" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to all questions
      </Link>

      {/* Question Card */}
      <Card className="mb-8 border-primary/10 shadow-md">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="outline" className={getCategoryBadgeColor(question.category)}>
              {question.category}
            </Badge>
            <Link href={`/colleges/${question.collegeId}`}>
              <div className="inline-flex items-center text-xs font-medium bg-primary/5 text-primary px-2.5 py-1 rounded-md hover:bg-primary/10 transition-colors cursor-pointer">
                <MapPin className="h-3 w-3 mr-1" />
                {question.collegeName}
              </div>
            </Link>
          </div>

          <h1 className="text-2xl md:text-3xl font-display font-bold mb-6">{question.title}</h1>

          <div className="flex items-start gap-4">
            <Avatar name={question.authorName} size="md" />
            <div className="flex-1 bg-muted/30 rounded-2xl rounded-tl-none p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-foreground">{question.authorName}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {formatTimeAgo(question.createdAt)}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-base/relaxed text-foreground/90">{question.body}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          {question.answers.length} {question.answers.length === 1 ? "Answer" : "Answers"}
        </h2>

        {question.answers.length === 0 ? (
          <div className="text-center py-12 border rounded-xl bg-muted/20 border-dashed mb-8">
            <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground font-medium">No answers yet</p>
            <p className="text-sm text-muted-foreground mt-1">Be the first to answer this question.</p>
          </div>
        ) : (
          <div className="space-y-5 mb-8">
            {question.answers.map((answer: any) => (
              <div key={answer.id} className="flex items-start gap-4">
                <Avatar name={answer.authorName} size="md" />
                <div className="flex-1 bg-muted/20 border border-border/40 rounded-2xl rounded-tl-none p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-foreground">{answer.authorName}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatTimeAgo(answer.createdAt)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-base text-foreground/90">{answer.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Answer */}
      {isLoggedIn ? (
        <Card className="border-primary/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <Avatar name={savedName} size="sm" />
              <span>Posting as <span className="text-primary">{savedName}</span></span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your knowledge or experience..."
              className="min-h-[120px] resize-none"
            />
          </CardContent>
          <CardFooter className="bg-muted/20 py-4 border-t">
            <Button
              onClick={handlePostAnswer}
              disabled={createAnswer.isPending || !body.trim()}
              className="gap-2"
            >
              {createAnswer.isPending
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Send className="h-4 w-4" />}
              Post Answer
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="border-dashed border-primary/20 bg-primary/5">
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-10 w-10 mx-auto text-primary/40 mb-4" />
            <h3 className="text-lg font-bold mb-2">Sign in to post an answer</h3>
            <p className="text-muted-foreground mb-4">Join the community to share your knowledge.</p>
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}