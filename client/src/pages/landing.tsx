import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[hsl(240,10%,3.9%)] text-white flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-[hsl(207,90%,54%)] rounded-2xl flex items-center justify-center">
              <i className="fas fa-coins text-white text-2xl"></i>
            </div>
            <h1 className="text-4xl font-bold">CoinStats</h1>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Cryptocurrency Portfolio Tracker</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Track your cryptocurrency investments with real-time prices, portfolio management, 
            and comprehensive market data. Join thousands of crypto investors who trust CoinStats.
          </p>
        </div>

        <Card className="bg-[hsl(240,3.7%,15.9%)] border-[hsl(240,3.7%,15.9%)] mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-[hsl(207,90%,54%)] rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-chart-line text-white"></i>
                </div>
                <h3 className="font-semibold mb-2">Real-Time Prices</h3>
                <p className="text-gray-400 text-sm">
                  Live cryptocurrency prices powered by CoinGecko API with 30-second updates
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[hsl(142,76%,36%)] rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-wallet text-white"></i>
                </div>
                <h3 className="font-semibold mb-2">Portfolio Tracking</h3>
                <p className="text-gray-400 text-sm">
                  Comprehensive portfolio management with holdings, transactions, and performance metrics
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[hsl(258,90%,66%)] rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <i className="fas fa-gem text-white"></i>
                </div>
                <h3 className="font-semibold mb-2">NFT Collections</h3>
                <p className="text-gray-400 text-sm">
                  Track top NFT collections with floor prices and 24h percentage changes
                </p>
              </div>
            </div>

            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,48%)] text-white px-8 py-3 text-lg rounded-lg"
            >
              Get Started - Sign In
            </Button>
          </CardContent>
        </Card>

        <div className="text-sm text-gray-500">
          <p>Free to use • Real market data • Secure authentication</p>
        </div>
      </div>
    </div>
  );
}
