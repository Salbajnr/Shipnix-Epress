import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import TopCryptocurrencies from "@/components/TopCryptocurrencies";
import PriceTicker from "@/components/PriceTicker";
import MyHoldings from "@/components/MyHoldings";
import AdminPanel from "@/components/AdminPanel";
import { TrendingUp, DollarSign, Users, Activity } from "lucide-react";

export default function CryptoHome() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Header />
      
      {/* Price Ticker */}
      <PriceTicker />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.firstName || 'Trader'}!
          </h1>
          <p className="text-xl text-gray-400">
            Track prices, manage your portfolio, and execute trades with confidence.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-400">Portfolio Value</span>
              </div>
              <p className="text-2xl font-bold text-green-400">$47,832.45</p>
              <p className="text-xs text-green-500">+12.3% (24h)</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-400">24h Change</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">+$5,234.12</p>
              <p className="text-xs text-blue-500">+12.3%</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-gray-400">Active Positions</span>
              </div>
              <p className="text-2xl font-bold text-purple-400">7</p>
              <p className="text-xs text-gray-400">BTC, ETH, ADA...</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-gray-400">Trading Volume</span>
              </div>
              <p className="text-2xl font-bold text-orange-400">$125.8K</p>
              <p className="text-xs text-orange-500">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Trading Interface */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Market Data */}
          <div className="lg:col-span-2 space-y-6">
            <TopCryptocurrencies />
            <MyHoldings />
          </div>

          {/* Right Column - Trading Panel */}
          <div>
            <AdminPanel />
          </div>
        </div>
      </div>
    </div>
  );
}