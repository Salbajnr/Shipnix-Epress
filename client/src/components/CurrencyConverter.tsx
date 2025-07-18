import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, ArrowRightLeft } from "lucide-react";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

interface ExchangeRate {
  base: string;
  target: string;
  rate: number;
  lastUpdated: string;
  change24h: number;
}

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", flag: "🇵🇱" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", flag: "🇨🇿" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺" },
  { code: "RON", name: "Romanian Leu", symbol: "lei", flag: "🇷🇴" },
  { code: "BGN", name: "Bulgarian Lev", symbol: "лв", flag: "🇧🇬" },
  { code: "HRK", name: "Croatian Kuna", symbol: "kn", flag: "🇭🇷" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "ARS", name: "Argentine Peso", symbol: "$", flag: "🇦🇷" },
  { code: "CLP", name: "Chilean Peso", symbol: "$", flag: "🇨🇱" },
  { code: "COP", name: "Colombian Peso", symbol: "$", flag: "🇨🇴" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪", flag: "🇮🇱" },
  { code: "EGP", name: "Egyptian Pound", symbol: "£", flag: "🇪🇬" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭" }
];

interface CurrencyConverterProps {
  initialAmount?: number;
  initialFromCurrency?: string;
  initialToCurrency?: string;
  onConversionChange?: (from: string, to: string, amount: number, convertedAmount: number) => void;
}

export default function CurrencyConverter({
  initialAmount = 100,
  initialFromCurrency = "USD",
  initialToCurrency = "EUR",
  onConversionChange
}: CurrencyConverterProps) {
  const [amount, setAmount] = useState<string>(initialAmount.toString());
  const [fromCurrency, setFromCurrency] = useState<string>(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState<string>(initialToCurrency);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchExchangeRate = async (from: string, to: string) => {
    if (from === to) return;
    
    setIsLoading(true);
    try {
      // In production, use a real exchange rate API like exchangerate-api.com or fixer.io
      // For demo purposes, we'll simulate with mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockRates: { [key: string]: number } = {
        "USD-EUR": 0.85,
        "USD-GBP": 0.73,
        "USD-JPY": 110.0,
        "USD-CNY": 6.45,
        "EUR-USD": 1.18,
        "EUR-GBP": 0.86,
        "GBP-USD": 1.37,
        "GBP-EUR": 1.16,
        // Add more mock rates as needed
      };

      const rateKey = `${from}-${to}`;
      const reverseRateKey = `${to}-${from}`;
      
      let rate = mockRates[rateKey];
      if (!rate && mockRates[reverseRateKey]) {
        rate = 1 / mockRates[reverseRateKey];
      }
      if (!rate) {
        // Generate a reasonable mock rate based on USD
        const fromToUsd = mockRates[`${from}-USD`] || 1;
        const usdToTarget = mockRates[`USD-${to}`] || 1;
        rate = fromToUsd * usdToTarget;
      }

      const change24h = (Math.random() - 0.5) * 0.1; // Random change between -5% and +5%

      setExchangeRate({
        base: from,
        target: to,
        rate: rate || 1,
        lastUpdated: new Date().toISOString(),
        change24h
      });

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate && onConversionChange) {
      const numAmount = parseFloat(amount) || 0;
      const convertedAmount = numAmount * exchangeRate.rate;
      onConversionChange(fromCurrency, toCurrency, numAmount, convertedAmount);
    }
  }, [amount, exchangeRate, fromCurrency, toCurrency, onConversionChange]);

  const convertedAmount = exchangeRate ? (parseFloat(amount) || 0) * exchangeRate.rate : 0;

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return `${currency?.symbol || ''}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getCurrencyDisplay = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency ? `${currency.flag} ${currency.code}` : currencyCode;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Real-Time Currency Converter
          </CardTitle>
          <CardDescription>
            Get live exchange rates for international shipping calculations
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
              className="text-lg"
            />
          </div>

          {/* Currency Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger>
                  <SelectValue>
                    {getCurrencyDisplay(fromCurrency)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code}</span>
                        <span className="text-muted-foreground text-sm">
                          {currency.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger>
                  <SelectValue>
                    {getCurrencyDisplay(toCurrency)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.flag}</span>
                        <span>{currency.code}</span>
                        <span className="text-muted-foreground text-sm">
                          {currency.name}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button variant="outline" size="sm" onClick={swapCurrencies}>
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Conversion Result */}
          <Card className="bg-muted/50">
            <CardContent className="p-6">
              {isLoading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Getting latest rates...</p>
                </div>
              ) : exchangeRate ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(convertedAmount, toCurrency)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatCurrency(parseFloat(amount) || 0, fromCurrency)} = {formatCurrency(convertedAmount, toCurrency)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Rate:</span>
                      <span className="font-medium">
                        1 {fromCurrency} = {exchangeRate.rate.toFixed(4)} {toCurrency}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {exchangeRate.change24h > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs ${
                        exchangeRate.change24h > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {Math.abs(exchangeRate.change24h * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last updated: {lastUpdated}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fetchExchangeRate(fromCurrency, toCurrency)}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  Select currencies to see conversion rate
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Quick Conversion Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Amounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {[10, 25, 50, 100, 250, 500, 1000, 5000].map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                size="sm"
                onClick={() => setAmount(quickAmount.toString())}
                className="text-xs"
              >
                {quickAmount}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exchange Rate Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popular Exchange Rates</CardTitle>
          <CardDescription>
            Most commonly used currency pairs for international shipping
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { from: "USD", to: "EUR", rate: 0.85, change: 0.012 },
              { from: "USD", to: "GBP", rate: 0.73, change: -0.008 },
              { from: "USD", to: "JPY", rate: 110.0, change: 0.045 },
              { from: "EUR", to: "GBP", rate: 0.86, change: -0.003 }
            ].map((pair, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => {
                  setFromCurrency(pair.from);
                  setToCurrency(pair.to);
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{pair.from}/{pair.to}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{pair.rate}</span>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      pair.change > 0 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    {pair.change > 0 ? '+' : ''}{(pair.change * 100).toFixed(2)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}