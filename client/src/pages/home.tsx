import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Header from "@/components/Header";
import PriceTicker from "@/components/PriceTicker";
import PortfolioOverview from "@/components/PortfolioOverview";
import TopCryptocurrencies from "@/components/TopCryptocurrencies";
import PriceChart from "@/components/PriceChart";
import MyHoldings from "@/components/MyHoldings";
import TopNFTCollections from "@/components/TopNFTCollections";
import RecentActivity from "@/components/RecentActivity";
import AdminPanel from "@/components/AdminPanel";
import MobileNavigation from "@/components/MobileNavigation";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(240,10%,3.9%)] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[hsl(207,90%,54%)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-[hsl(240,10%,3.9%)] text-white font-inter">
      <Header />
      <PriceTicker />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PortfolioOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TopCryptocurrencies />
            <PriceChart />
          </div>
          
          <div className="space-y-6">
            <MyHoldings />
            <TopNFTCollections />
            <RecentActivity />
          </div>
        </div>
        
        <AdminPanel />
      </div>
      
      <MobileNavigation />
    </div>
  );
}
