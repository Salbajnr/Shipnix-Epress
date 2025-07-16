import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState } from "react";

interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  currentPrice: string;
  priceChangePercentage24h: string;
}

export default function PriceTicker() {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const { subscribe, unsubscribe } = useWebSocket();

  const { data: initialCryptos } = useQuery<Cryptocurrency[]>({
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

  if (!cryptos.length) {
    return (
      <div className="bg-[hsl(240,3.7%,15.9%)] border-b border-[hsl(240,3.7%,15.9%)] py-2">
        <div className="text-center text-gray-400">Loading prices...</div>
      </div>
    );
  }

  return (
    <div className="bg-[hsl(240,3.7%,15.9%)] border-b border-[hsl(240,3.7%,15.9%)] py-2 overflow-hidden">
      <div className="price-ticker whitespace-nowrap">
        <div className="inline-flex items-center space-x-8 text-sm animate-marquee">
          {cryptos.slice(0, 5).map((crypto) => {
            const change = parseFloat(crypto.priceChangePercentage24h);
            const isPositive = change >= 0;
            
            return (
              <span 
                key={crypto.id}
                className={`inline-flex items-center ${isPositive ? 'text-[hsl(142,76%,36%)]' : 'text-[hsl(0,84%,60%)]'}`}
              >
                {crypto.symbol} ${parseFloat(crypto.currentPrice).toLocaleString()} {isPositive ? '+' : ''}{change.toFixed(2)}%
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
