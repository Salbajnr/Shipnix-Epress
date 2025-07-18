import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: Date;
  change24h: number;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const currencies: Currency[] = [
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
    { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
    { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
    { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
    { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
    { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
    { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
    { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
    { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
    { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
    { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
    { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
    { code: "PLN", name: "Polish Zloty", symbol: "zł", flag: "🇵🇱" },
    { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
    { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" }
  ];

  const mockExchangeRates: Record<string, Record<string, number>> = {
    USD: { EUR: 0.85, GBP: 0.73, JPY: 110.0, CAD: 1.25, AUD: 1.35, CHF: 0.92, CNY: 6.45, INR: 74.5, BRL: 5.2, RUB: 73.5, KRW: 1180, SGD: 1.35, HKD: 7.8, NOK: 8.6, SEK: 8.9, DKK: 6.3, PLN: 3.8, TRY: 8.4, ZAR: 14.5 },
    EUR: { USD: 1.18, GBP: 0.86, JPY: 129.4, CAD: 1.47, AUD: 1.59, CHF: 1.08, CNY: 7.6, INR: 87.8, BRL: 6.1, RUB: 86.5, KRW: 1390, SGD: 1.59, HKD: 9.2, NOK: 10.1, SEK: 10.5, DKK: 7.4, PLN: 4.5, TRY: 9.9, ZAR: 17.1 },
    GBP: { USD: 1.37, EUR: 1.16, JPY: 150.7, CAD: 1.71, AUD: 1.85, CHF: 1.26, CNY: 8.8, INR: 102.1, BRL: 7.1, RUB: 100.8, KRW: 1616, SGD: 1.85, HKD: 10.7, NOK: 11.8, SEK: 12.2, DKK: 8.6, PLN: 5.2, TRY: 11.5, ZAR: 19.9 }
  };

  const fetchExchangeRate = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const rate = mockExchangeRates[fromCurrency]?.[toCurrency] || 1;
      const change = (Math.random() - 0.5) * 0.1; // Random change between -5% to +5%
      
      setExchangeRate({
        from: fromCurrency,
        to: toCurrency,
        rate: rate,
        lastUpdated: new Date(),
        change24h: change
      });
      
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedAmount = exchangeRate ? (parseFloat(amount) * exchangeRate.rate).toFixed(2) : "0.00";

  const getFromCurrency = () => currencies.find(c => c.code === fromCurrency);
  const getToCurrency = () => currencies.find(c => c.code === toCurrency);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes === 1) return "1 minute ago";
    return `${diffMinutes} minutes ago`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ArrowRightLeft className="h-5 w-5 text-blue-600" />
          <span>Currency Converter</span>
        </CardTitle>
        <CardDescription>
          Real-time exchange rates for international shipping
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>

        {/* From Currency */}
        <div className="space-y-2">
          <Label>From</Label>
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  <div className="flex items-center space-x-2">
                    <span>{currency.flag}</span>
                    <span>{currency.code}</span>
                    <span className="text-muted-foreground">- {currency.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={swapCurrencies}
            className="rounded-full"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* To Currency */}
        <div className="space-y-2">
          <Label>To</Label>
          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  <div className="flex items-center space-x-2">
                    <span>{currency.flag}</span>
                    <span>{currency.code}</span>
                    <span className="text-muted-foreground">- {currency.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Conversion Result */}
        {exchangeRate && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {getFromCurrency()?.symbol}{amount} = {getToCurrency()?.symbol}{convertedAmount}
              </div>
              <div className="text-sm text-muted-foreground">
                1 {fromCurrency} = {exchangeRate.rate.toFixed(4)} {toCurrency}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">24h Change:</span>
                <Badge variant={exchangeRate.change24h >= 0 ? "secondary" : "destructive"}>
                  {exchangeRate.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(exchangeRate.change24h * 100).toFixed(2)}%
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchExchangeRate}
                disabled={isLoading}
                className="h-8"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              Last updated: {formatTimeAgo(lastUpdated)}
            </div>
          </div>
        )}

        {/* Popular Conversions */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Popular Conversions</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { from: "USD", to: "EUR" },
              { from: "EUR", to: "GBP" },
              { from: "USD", to: "JPY" },
              { from: "GBP", to: "USD" },
              { from: "CAD", to: "USD" },
              { from: "AUD", to: "USD" }
            ].map((pair, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  setFromCurrency(pair.from);
                  setToCurrency(pair.to);
                }}
              >
                {pair.from}/{pair.to}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}