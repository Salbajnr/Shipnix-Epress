import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";

interface PortfolioData {
  portfolio: any;
  holdings: Array<{
    amount: string;
    cryptocurrency: {
      currentPrice: string;
      priceChangePercentage24h: string;
    };
  }>;
}

export default function PortfolioOverview() {
  const { data: portfolioData, isLoading } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio"],
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <Card className="bg-[hsl(240,3.7%,15.9%)] border-[hsl(240,3.7%,15.9%)] p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Calculate portfolio values
  const totalBalance = portfolioData?.holdings.reduce((total, holding) => {
    const amount = parseFloat(holding.amount);
    const price = parseFloat(holding.cryptocurrency.currentPrice);
    return total + (amount * price);
  }, 0) || 0;

  const dailyChange = portfolioData?.holdings.reduce((total, holding) => {
    const amount = parseFloat(holding.amount);
    const price = parseFloat(holding.cryptocurrency.currentPrice);
    const changePercent = parseFloat(holding.cryptocurrency.priceChangePercentage24h) / 100;
    const value = amount * price;
    return total + (value * changePercent);
  }, 0) || 0;

  const dailyChangePercent = totalBalance > 0 ? (dailyChange / totalBalance) * 100 : 0;
  const holdingsCount = portfolioData?.holdings.length || 0;

  return (
    <div className="mb-8">
      <Card className="bg-[hsl(240,3.7%,15.9%)] rounded-xl p-6 border border-[hsl(240,3.7%,15.9%)]">
        <h2 className="text-2xl font-bold mb-6">Portfolio Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Total Balance</p>
            <p className="text-3xl font-bold">${totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">24h Change</p>
            <p className={`text-2xl font-semibold ${dailyChange >= 0 ? 'text-[hsl(142,76%,36%)]' : 'text-[hsl(0,84%,60%)]'}`}>
              {dailyChange >= 0 ? '+' : ''}${dailyChange.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({dailyChange >= 0 ? '+' : ''}{dailyChangePercent.toFixed(2)}%)
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Holdings</p>
            <p className="text-2xl font-semibold">{holdingsCount} Assets</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
