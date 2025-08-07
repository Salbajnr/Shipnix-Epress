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

  // Real-time package status update mutation
  const updatePackageStatusMutation = useMutation({
    mutationFn: async (data: { packageId: number; status: string; location?: string }) => {
      return await apiRequest('PATCH', `/api/packages/${data.packageId}/status`, {
        status: data.status,
        location: data.location,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Package status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update package status",
        variant: "destructive",
      });
    },
  });

  const createTestPackage = async () => {
    try {
      const testPackageData = {
        senderName: `Test Sender ${Date.now()}`,
        senderEmail: "test@example.com",
        senderPhone: "+1-555-123-4567",
        senderAddress: "123 Test Street, Test City, TC 12345",
        recipientName: `Test Recipient ${Date.now()}`,
        recipientEmail: "recipient@example.com", 
        recipientPhone: "+1-555-987-6543",
        recipientAddress: "456 Recipient Ave, Recipient City, RC 67890",
        description: "Test Package - Demo Item",
        weight: "1.5",
        dimensions: "20x15x10 cm",
        shippingCost: "25.99",
        paymentMethod: "card",
        scheduledTimeSlot: "morning",
      };

      await apiRequest('POST', '/api/packages', testPackageData);
      toast({
        title: "Success",
        description: "Test package created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to create test package",
        variant: "destructive",
      });
    }
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
                onClick={createTestPackage}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Create Test Package
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
