import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  currentPrice: string;
  priceChangePercentage24h: string;
}

export default function TopCryptocurrencies() {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const { subscribe, unsubscribe } = useWebSocket();

  const { data: initialCryptos, isLoading } = useQuery<Cryptocurrency[]>({
    queryKey: ["/api/cryptocurrencies"],
  });

  useEffect(() => {
    if (initialCryptos) {
      setCryptos(initialCryptos);
    }
  }, [initialCryptos]);

  useEffect(() => {
    const handlePriceUpdate = (data: any[]) => {
      const updatedCryptos = data.map(crypto => ({
        id: crypto.id,
        symbol: crypto.symbol.toUpperCase(),
        name: crypto.name,
        currentPrice: crypto.current_price.toString(),
        priceChangePercentage24h: crypto.price_change_percentage_24h?.toString() || '0',
      }));
      setCryptos(updatedCryptos);
    };

    subscribe('priceUpdate', handlePriceUpdate);
    return () => unsubscribe('priceUpdate');
  }, [subscribe, unsubscribe]);

  const getCryptoIcon = (symbol: string) => {
    const icons: Record<string, { icon: string; color: string }> = {
      BTC: { icon: '₿', color: 'bg-orange-500' },
      ETH: { icon: 'Ξ', color: 'bg-blue-500' },
      BNB: { icon: 'B', color: 'bg-yellow-500' },
      ADA: { icon: 'A', color: 'bg-blue-400' },
      SOL: { icon: 'S', color: 'bg-purple-500' },
      XRP: { icon: 'X', color: 'bg-gray-500' },
      DOT: { icon: 'D', color: 'bg-pink-500' },
      AVAX: { icon: 'A', color: 'bg-red-500' },
      LINK: { icon: 'L', color: 'bg-blue-600' },
      MATIC: { icon: 'M', color: 'bg-purple-600' },
    };
    
    return icons[symbol] || { icon: symbol.charAt(0), color: 'bg-gray-500' };
  };

  if (isLoading) {
    return (
      <Card className="bg-[hsl(240,3.7%,15.9%)] rounded-xl p-6 border border-[hsl(240,3.7%,15.9%)]">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-700 rounded mb-1 w-20"></div>
                    <div className="h-3 bg-gray-700 rounded w-12"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-700 rounded mb-1 w-24"></div>
                  <div className="h-3 bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[hsl(240,3.7%,15.9%)] rounded-xl p-6 border border-[hsl(240,3.7%,15.9%)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Top 10 Cryptocurrencies</h3>
        <button className="text-[hsl(207,90%,54%)] hover:text-blue-400 text-sm">View All</button>
      </div>
      
      <div className="space-y-3">
        {cryptos.map((crypto) => {
          const change = parseFloat(crypto.priceChangePercentage24h);
          const isPositive = change >= 0;
          const { icon, color } = getCryptoIcon(crypto.symbol);
          
          return (
            <div 
              key={crypto.id}
              className="flex items-center justify-between p-3 hover:bg-[hsl(240,10%,3.9%)] rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                  {icon}
                </div>
                <div>
                  <p className="font-medium">{crypto.name}</p>
                  <p className="text-gray-400 text-sm">{crypto.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${parseFloat(crypto.currentPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                <p className={`text-sm ${isPositive ? 'text-[hsl(142,76%,36%)]' : 'text-[hsl(0,84%,60%)]'}`}>
                  {isPositive ? '+' : ''}{change.toFixed(2)}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
