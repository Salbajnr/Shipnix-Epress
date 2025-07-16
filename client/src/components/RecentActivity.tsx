import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface Transaction {
  id: number;
  type: string;
  amount: string;
  price: string;
  totalValue: string;
  isSimulated: boolean;
  createdAt: string;
  cryptocurrency: {
    symbol: string;
    name: string;
  };
}

interface PortfolioData {
  transactions: Transaction[];
}

export default function RecentActivity() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { subscribe, unsubscribe } = useWebSocket();

  const { data: portfolioData, isLoading } = useQuery<PortfolioData>({
    queryKey: ["/api/portfolio"],
  });

  useEffect(() => {
    if (portfolioData?.transactions) {
      setTransactions(portfolioData.transactions);
    }
  }, [portfolioData]);

  useEffect(() => {
    const handleNewTransaction = (data: any) => {
      setTransactions(prev => [data.transaction, ...prev.slice(0, 4)]);
    };

    subscribe('transaction', handleNewTransaction);
    return () => unsubscribe('transaction');
  }, [subscribe, unsubscribe]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return { icon: 'fas fa-arrow-up', color: 'bg-[hsl(142,76%,36%)]' };
      case 'sell':
        return { icon: 'fas fa-arrow-down', color: 'bg-[hsl(0,84%,60%)]' };
      case 'swap':
        return { icon: 'fas fa-exchange-alt', color: 'bg-[hsl(207,90%,54%)]' };
      default:
        return { icon: 'fas fa-circle', color: 'bg-gray-500' };
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  if (isLoading) {
    return (
      <Card className="bg-[hsl(240,3.7%,15.9%)] rounded-xl p-6 border border-[hsl(240,3.7%,15.9%)]">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 bg-gray-700 rounded w-16"></div>
                </div>
                <div className="h-4 bg-gray-700 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[hsl(240,3.7%,15.9%)] rounded-xl p-6 border border-[hsl(240,3.7%,15.9%)]">
      <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
      
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <i className="fas fa-history text-4xl mb-4"></i>
          <p>No recent activity</p>
          <p className="text-sm">Start trading to see activity here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.slice(0, 5).map((transaction) => {
            const { icon, color } = getActivityIcon(transaction.type);
            const amount = parseFloat(transaction.amount);
            const totalValue = parseFloat(transaction.totalValue);
            
            return (
              <div key={transaction.id} className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center`}>
                  <i className={`${icon} text-xs text-white`}></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} {amount.toFixed(4)} {transaction.cryptocurrency.symbol.toUpperCase()}
                    {transaction.isSimulated && <span className="text-yellow-500 ml-1">(Simulated)</span>}
                  </p>
                  <p className="text-gray-400 text-xs">{formatTimeAgo(transaction.createdAt)}</p>
                </div>
                <p className="text-sm font-medium">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
