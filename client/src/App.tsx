import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import PublicTracking from "@/pages/public-tracking";
import Login from "@/pages/login";
import Register from "@/pages/register";
import CustomerDashboard from "@/pages/customer-dashboard";
import FAQPage from "@/pages/faq";
import Features from "@/pages/features";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/track" component={PublicTracking} />
      <Route path="/track/:id" component={PublicTracking} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/customer-dashboard" component={CustomerDashboard} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/support" component={FAQPage} />
      <Route path="/features" component={Features} />
      
      {/* Protected Admin Routes */}
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="shipnix-theme">
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
