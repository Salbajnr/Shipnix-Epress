import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Shield, Calculator, TrendingUp, AlertTriangle, CheckCircle, Bitcoin, DollarSign } from "lucide-react";

interface InsuranceQuote {
  baseRate: number;
  volatilityMultiplier: number;
  portfolioMultiplier: number;
  totalPremium: number;
  coverage: number;
  deductible: number;
}

const cryptoAssets = [
  { value: "bitcoin", label: "Bitcoin (BTC)", volatility: 1.2, risk: "Medium", icon: "₿" },
  { value: "ethereum", label: "Ethereum (ETH)", volatility: 1.5, risk: "Medium", icon: "Ξ" },
  { value: "cardano", label: "Cardano (ADA)", volatility: 2.0, risk: "High", icon: "₳" },
  { value: "polkadot", label: "Polkadot (DOT)", volatility: 1.8, risk: "High", icon: "⬤" },
  { value: "chainlink", label: "Chainlink (LINK)", volatility: 1.7, risk: "High", icon: "🔗" },
  { value: "litecoin", label: "Litecoin (LTC)", volatility: 1.3, risk: "Medium", icon: "Ł" },
  { value: "binancecoin", label: "Binance Coin (BNB)", volatility: 1.6, risk: "Medium", icon: "⬡" },
  { value: "solana", label: "Solana (SOL)", volatility: 2.2, risk: "High", icon: "◎" },
  { value: "polygon", label: "Polygon (MATIC)", volatility: 1.9, risk: "High", icon: "⬟" },
  { value: "avalanche", label: "Avalanche (AVAX)", volatility: 2.1, risk: "High", icon: "🔺" }
];

const portfolioSizes = [
  { range: "small", label: "Small Portfolio ($1K - $10K)", multiplier: 1.0, risk: "Low" },
  { range: "medium", label: "Medium Portfolio ($10K - $100K)", multiplier: 1.2, risk: "Medium" },
  { range: "large", label: "Large Portfolio ($100K - $1M)", multiplier: 1.4, risk: "Medium" },
  { range: "whale", label: "Whale Portfolio ($1M+)", multiplier: 1.8, risk: "High" }
];

export default function CryptoInsuranceCalculator() {
  const [portfolioValue, setPortfolioValue] = useState<string>("");
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [portfolioSize, setPortfolioSize] = useState<string>("");
  const [quote, setQuote] = useState<InsuranceQuote | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateInsurance = async () => {
    if (!portfolioValue || !selectedAsset || !portfolioSize) return;

    setIsCalculating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const value = parseFloat(portfolioValue);
    const asset = cryptoAssets.find(asset => asset.value === selectedAsset);
    const portfolio = portfolioSizes.find(p => p.range === portfolioSize);

    if (!asset || !portfolio) return;

    // Crypto insurance calculation logic
    const baseRate = 0.015; // 1.5% base rate for crypto insurance
    const volatilityMultiplier = asset.volatility;
    const portfolioMultiplier = portfolio.multiplier;
    
    const totalPremium = Math.round(value * baseRate * volatilityMultiplier * portfolioMultiplier * 100) / 100;
    const coverage = Math.min(value, 10000000); // Max coverage $10M
    const deductible = Math.max(100, Math.round(value * 0.05)); // 5% deductible, min $100

    setQuote({
      baseRate,
      volatilityMultiplier,
      portfolioMultiplier,
      totalPremium,
      coverage,
      deductible
    });

    setIsCalculating(false);
  };

  useEffect(() => {
    if (portfolioValue && selectedAsset && portfolioSize) {
      const timer = setTimeout(calculateInsurance, 500);
      return () => clearTimeout(timer);
    }
  }, [portfolioValue, selectedAsset, portfolioSize]);

  const selectedCrypto = cryptoAssets.find(asset => asset.value === selectedAsset);
  const selectedPortfolio = portfolioSizes.find(p => p.range === portfolioSize);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Crypto Portfolio Insurance Calculator
          </CardTitle>
          <CardDescription>
            Protect your cryptocurrency investments with smart insurance coverage calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="portfolio-value">Portfolio Value (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="portfolio-value"
                  type="number"
                  placeholder="Enter portfolio value"
                  value={portfolioValue}
                  onChange={(e) => setPortfolioValue(e.target.value)}
                  className="pl-10 text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Primary Asset</Label>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {cryptoAssets.map((asset) => (
                    <SelectItem key={asset.value} value={asset.value}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{asset.icon}</span>
                        {asset.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Portfolio Size</Label>
              <Select value={portfolioSize} onValueChange={setPortfolioSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select portfolio size" />
                </SelectTrigger>
                <SelectContent>
                  {portfolioSizes.map((size) => (
                    <SelectItem key={size.range} value={size.range}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedCrypto && selectedPortfolio && (
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Asset Volatility Risk:</span>
                <span className={`text-sm font-medium ${
                  selectedCrypto.risk === 'High' ? 'text-red-500' :
                  selectedCrypto.risk === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {selectedCrypto.risk} ({selectedCrypto.volatility}x)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Portfolio Risk:</span>
                <span className={`text-sm font-medium ${
                  selectedPortfolio.risk === 'High' ? 'text-red-500' :
                  selectedPortfolio.risk === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {selectedPortfolio.risk} ({selectedPortfolio.multiplier}x)
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {quote && (
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Calculator className="h-5 w-5" />
              Insurance Quote
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isCalculating ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Calculating your crypto insurance quote...</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Quote Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Rate:</span>
                        <span>{(quote.baseRate * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Volatility Multiplier:</span>
                        <span>{quote.volatilityMultiplier}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Portfolio Multiplier:</span>
                        <span>{quote.portfolioMultiplier}x</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Annual Premium:</span>
                        <span className="text-green-600 dark:text-green-400">${quote.totalPremium.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Coverage Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Coverage up to ${quote.coverage.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Deductible: ${quote.deductible.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Exchange hack protection</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Private key theft coverage</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">24/7 claims support</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-blue-900 dark:text-blue-100">Smart Pricing</h5>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        This quote is based on real-time market volatility and your portfolio risk profile. 
                        Includes coverage for exchange hacks, private key theft, and smart contract exploits.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="btn-gradient flex-1">
                    <Bitcoin className="h-4 w-4 mr-2" />
                    Insure Portfolio
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Get Detailed Quote
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Crypto Insurance Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">What's Covered</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Exchange hacks and breaches
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Private key theft and loss
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Smart contract exploits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Wallet security breaches
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Phishing and social engineering
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">What's Not Covered</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  Market volatility losses
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  Trading losses and bad decisions
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  Regulatory shutdowns
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  Self-inflicted wallet loss
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  Ponzi schemes and scams
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}