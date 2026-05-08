import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider, SignIn, SignUp } from "@clerk/react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";

import Home from "@/pages/home";
import Colleges from "@/pages/colleges/index";
import CollegeDetail from "@/pages/colleges/[id]";
import Compare from "@/pages/compare";
import Predict from "@/pages/predict";
import Discussions from "@/pages/discussions/index";
import DiscussionDetail from "@/pages/discussions/[id]";
import Saved from "@/pages/saved";
import AuthPage from "@/pages/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/colleges" component={Colleges} />
      <Route path="/colleges/:id" component={CollegeDetail} />
      <Route path="/compare" component={Compare} />
      <Route path="/predict" component={Predict} />
      <Route path="/discussions" component={Discussions} />
      <Route path="/discussions/:id" component={DiscussionDetail} />
      <Route path="/saved" component={Saved} />
      <Route path="/sign-in">
        <AuthPage mode="sign-in" />
      </Route>
      <Route path="/sign-up">
        <AuthPage mode="sign-up" />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Layout>
              <Router />
            </Layout>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
