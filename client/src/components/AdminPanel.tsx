import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminPanel() {
  const [transactionForm, setTransactionForm] = useState({
    type: 'buy',
    cryptoId: 'bitcoin',
    amount: '',
    price: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isConnected } = useWebSocket();

  const cryptocurrencyOptions = [
    { id: 'bitcoin', name: 'Bitcoin (BTC)' },
    { id: 'ethereum', name: 'Ethereum (ETH)' },
    { id: 'cardano', name: 'Cardano (ADA)' },
    { id: 'solana', name: 'Solana (SOL)' },
    { id: 'binancecoin', name: 'BNB (BNB)' },
  ];

  const simulateTransactionMutation = useMutation({
    mutationFn: async (data: any) => {
      const totalValue = (parseFloat(data.amount) * parseFloat(data.price)).toString();
      return await apiRequest('POST', '/api/admin/simulate-transaction', {
        ...data,
        totalValue,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction simulated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      setTransactionForm({ type: 'buy', cryptoId: 'bitcoin', amount: '', price: '' });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to simulate transaction",
        variant: "destructive",
      });
    },
  });

  const simulateMarketMutation = useMutation({
    mutationFn: async (action: 'bull' | 'bear') => {
      return await apiRequest('POST', '/api/admin/simulate-market', { action });
    },
    onSuccess: (_, action) => {
      toast({
        title: "Market Simulation",
        description: `${action === 'bull' ? 'Bull' : 'Bear'} market simulation applied`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cryptocurrencies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to simulate market",
        variant: "destructive",
      });
    },
  });

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionForm.amount || !transactionForm.price) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    simulateTransactionMutation.mutate(transactionForm);
  };

  const generateRandomTransaction = () => {
    const randomCrypto = cryptocurrencyOptions[Math.floor(Math.random() * cryptocurrencyOptions.length)];
    const randomType = Math.random() > 0.5 ? 'buy' : 'sell';
    const randomAmount = (Math.random() * 10 + 0.1).toFixed(4);
    const randomPrice = (Math.random() * 50000 + 1000).toFixed(2);

    simulateTransactionMutation.mutate({
      type: randomType,
      cryptoId: randomCrypto.id,
      amount: randomAmount,
      price: randomPrice,
    });
  };

  return (
    <div id="admin" className="mt-12">
      <Card className="bg-[hsl(240,3.7%,15.9%)] rounded-xl p-6 border border-[hsl(240,3.7%,15.9%)]">
        <h3 className="text-xl font-bold mb-6 text-[hsl(207,90%,54%)]">Admin Panel - Simulate Transactions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Add Fake Transaction</h4>
            <form onSubmit={handleTransactionSubmit} className="space-y-4">
              <div>
                <Label className="block text-sm font-medium mb-2">Transaction Type</Label>
                <Select 
                  value={transactionForm.type}
                  onValueChange={(value) => setTransactionForm(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="w-full bg-[hsl(240,10%,3.9%)] border-[hsl(240,3.7%,15.9%)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                    <SelectItem value="swap">Swap</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium mb-2">Cryptocurrency</Label>
                <Select 
                  value={transactionForm.cryptoId}
                  onValueChange={(value) => setTransactionForm(prev => ({ ...prev, cryptoId: value }))}
                >
                  <SelectTrigger className="w-full bg-[hsl(240,10%,3.9%)] border-[hsl(240,3.7%,15.9%)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptocurrencyOptions.map((crypto) => (
                      <SelectItem key={crypto.id} value={crypto.id}>
                        {crypto.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium mb-2">Amount</Label>
                <Input 
                  type="number" 
                  step="0.0001" 
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full bg-[hsl(240,10%,3.9%)] border-[hsl(240,3.7%,15.9%)] text-white" 
                  placeholder="0.0000" 
                />
              </div>
              <div>
                <Label className="block text-sm font-medium mb-2">Price (USD)</Label>
                <Input 
                  type="number" 
                  step="0.01"
                  value={transactionForm.price}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full bg-[hsl(240,10%,3.9%)] border-[hsl(240,3.7%,15.9%)] text-white" 
                  placeholder="0.00" 
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[hsl(207,90%,54%)] hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                disabled={simulateTransactionMutation.isPending}
              >
                {simulateTransactionMutation.isPending ? 'Adding...' : 'Add Transaction'}
              </Button>
            </form>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Portfolio Controls</h4>
            <div className="space-y-3">
              <Button 
                onClick={() => simulateMarketMutation.mutate('bull')}
                className="w-full bg-[hsl(142,76%,36%)] hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                disabled={simulateMarketMutation.isPending}
              >
                Simulate Bull Run (+10% all assets)
              </Button>
              <Button 
                onClick={() => simulateMarketMutation.mutate('bear')}
                className="w-full bg-[hsl(0,84%,60%)] hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                disabled={simulateMarketMutation.isPending}
              >
                Simulate Bear Market (-10% all assets)
              </Button>
              <Button 
                onClick={generateRandomTransaction}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                disabled={simulateTransactionMutation.isPending}
              >
                Add Random Transaction
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-[hsl(240,10%,3.9%)] rounded-lg">
              <h5 className="font-medium mb-2">API Status</h5>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-[hsl(142,76%,36%)]' : 'bg-[hsl(0,84%,60%)]'}`}></div>
                <span className="text-sm">
                  {isConnected ? 'WebSocket Connected' : 'WebSocket Disconnected'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Real-time updates active</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
