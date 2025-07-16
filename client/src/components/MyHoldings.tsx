import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface Holding {
  amount: string;
  averageCost: string;
  cryptocurrency: {
    id: string;
    symbol: string;
    name: string;
    currentPrice: string;
    priceChangePercentage24h: string;
  };
}

interface PortfolioData {
  holdings: Holding[];
}

export default function MyHoldings() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const { subscribe, unsubscribe } = useWebSocket();

  const { data: initialData, isLoading } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio"],
  });

  useEffect(() => {
    if (initialData) {
      setPortfolioData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const handlePriceUpdate = (data: any[]) => {
      if (!portfolioData) return;
      
      const updatedHoldings = portfolioData.holdings.map(holding => {
        const updatedCrypto = data.find(crypto => crypto.id === holding.cryptocurrency.id);
        if (updatedCrypto) {
          return {
            ...holding,
            cryptocurrency: {
              ...holding.cryptocurrency,
              currentPrice: updatedCrypto.current_price.toString(),
              priceChangePercentage24h: updatedCrypto.price_change_percentage_24h?.toString() || '0',
            }
          };
        }
        return holding;
      });

      setPortfolioData({ ...portfolioData, holdings: updatedHoldings });
    };

    subscribe('priceUpdate', handlePriceUpdate);
    return () => unsubscribe('priceUpdate');
  }, [subscribe, unsubscribe, portfolioData]);

  const getCryptoIcon = (symbol: string) => {
    const icons: Record<string, { icon: string; color: string }> = {
      BTC: { icon: '₿', color: 'bg-orange-500' },
      ETH: { icon: 'Ξ', color: 'bg-blue-500' },
      BNB: { icon: 'B', color: 'bg-yellow-500' },
      ADA: { icon: 'A', color: 'bg-blue-400' },
      SOL: { icon: 'S', color: 'bg-purple-500' },
    };
    
    return icons[symbol] || { icon: symbol.charAt(0), color: 'bg-gray-500' };
  };

  if (isLoading) {
    return (
      <Card className="bg-[hsl(240,3.7%,15.9%)] rounded-xl p-6 border border-[hsl(240,3.7%,15.9%)]">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-700 rounded mb-1 w-12"></div>
                    <div className="h-3 bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-700 rounded mb-1 w-20"></div>
                  <div className="h-3 bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const holdings = portfolioData?.holdings || [];

  return (
    <Card className="bg-[hsl(240,3.7%,15.9%)] rounded-xl p-6 border border-[hsl(240,3.7%,15.9%)]">
      <h3 className="text-xl font-bold mb-6">My Holdings</h3>
      
      {holdings.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <i className="fas fa-wallet text-4xl mb-4"></i>
          <p>No holdings yet</p>
          <p className="text-sm">Use the admin panel to simulate trades</p>
        </div>
      ) : (
        <div className="space-y-4">
          {holdings.map((holding) => {
            const amount = parseFloat(holding.amount);
            const currentPrice = parseFloat(holding.cryptocurrency.currentPrice);
            const averageCost = parseFloat(holding.averageCost || '0');
            const currentValue = amount * currentPrice;
            const costBasis = amount * averageCost;
            const pnl = currentValue - costBasis;
            const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
            
            const { icon, color } = getCryptoIcon(holding.cryptocurrency.symbol.toUpperCase());
            
            return (
              <div key={holding.cryptocurrency.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                    {icon}
                  </div>
                  <div>
                    <p className="font-medium">{holding.cryptocurrency.symbol.toUpperCase()}</p>
                    <p className="text-gray-400 text-sm">{amount.toFixed(4)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  <p className={`text-sm ${pnl >= 0 ? 'text-[hsl(142,76%,36%)]' : 'text-[hsl(0,84%,60%)]'}`}>
                    {pnl >= 0 ? '+' : ''}${pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
