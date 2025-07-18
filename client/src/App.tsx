import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import CryptoLanding from "@/pages/CryptoLanding";
import CryptoHome from "@/pages/CryptoHome";
import PublicTracking from "@/pages/public-tracking";
import Login from "@/pages/login";
import Register from "@/pages/register";
import CustomerDashboard from "@/pages/customer-dashboard";
import FAQPage from "@/pages/faq";
import CryptoFeatures from "@/pages/CryptoFeatures";

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
      <Route path="/features" component={CryptoFeatures} />
      
      {/* Protected Admin Routes */}
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={CryptoLanding} />
      ) : (
        <>
          <Route path="/" component={CryptoHome} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="shipnix-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
