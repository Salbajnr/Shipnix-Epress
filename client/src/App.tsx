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
import QuoteRequest from "@/pages/quote-request";
import QuoteManagement from "@/pages/quote-management";
import QuoteEdit from "@/pages/quote-edit";
import InvoiceManagement from "@/pages/invoice-management";
import PackageManagement from "@/pages/package-management";

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
      <Route path="/quote" component={QuoteRequest} />

      {/* Protected Admin Routes */}
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/quotes" component={QuoteManagement} />
          <Route path="/quotes/:id/edit" component={QuoteEdit} />
          <Route path="/invoices" component={InvoiceManagement} />
          <Route path="/packages" component={PackageManagement} />
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