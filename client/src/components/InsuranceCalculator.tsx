import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Shield, Calculator, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface InsuranceQuote {
  baseRate: number;
  categoryMultiplier: number;
  destinationMultiplier: number;
  totalPremium: number;
  coverage: number;
  deductible: number;
}

const packageCategories = [
  { value: "electronics", label: "Electronics", multiplier: 1.5, risk: "Medium" },
  { value: "jewelry", label: "Jewelry & Valuables", multiplier: 2.0, risk: "High" },
  { value: "documents", label: "Documents", multiplier: 0.8, risk: "Low" },
  { value: "artwork", label: "Artwork & Antiques", multiplier: 2.5, risk: "High" },
  { value: "fragile", label: "Fragile Items", multiplier: 1.8, risk: "Medium" },
  { value: "standard", label: "Standard Items", multiplier: 1.0, risk: "Low" },
  { value: "medical", label: "Medical Equipment", multiplier: 1.6, risk: "Medium" },
  { value: "automotive", label: "Automotive Parts", multiplier: 1.3, risk: "Medium" }
];

const destinations = [
  { region: "Domestic", multiplier: 1.0, risk: "Low" },
  { region: "North America", multiplier: 1.2, risk: "Low" },
  { region: "Europe", multiplier: 1.3, risk: "Low" },
  { region: "Asia Pacific", multiplier: 1.4, risk: "Medium" },
  { region: "Middle East", multiplier: 1.6, risk: "Medium" },
  { region: "Africa", multiplier: 1.8, risk: "High" },
  { region: "South America", multiplier: 1.5, risk: "Medium" },
  { region: "Remote Areas", multiplier: 2.0, risk: "High" }
];

export default function InsuranceCalculator() {
  const [packageValue, setPackageValue] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [quote, setQuote] = useState<InsuranceQuote | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateInsurance = async () => {
    if (!packageValue || !category || !destination) return;

    setIsCalculating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const value = parseFloat(packageValue);
    const selectedCategory = packageCategories.find(cat => cat.value === category);
    const selectedDestination = destinations.find(dest => dest.region === destination);

    if (!selectedCategory || !selectedDestination) return;

    // Insurance calculation logic
    const baseRate = 0.008; // 0.8% base rate
    const categoryMultiplier = selectedCategory.multiplier;
    const destinationMultiplier = selectedDestination.multiplier;
    
    const totalPremium = Math.round(value * baseRate * categoryMultiplier * destinationMultiplier * 100) / 100;
    const coverage = Math.min(value, 100000); // Max coverage $100k
    const deductible = Math.max(50, Math.round(value * 0.02)); // 2% deductible, min $50

    setQuote({
      baseRate,
      categoryMultiplier,
      destinationMultiplier,
      totalPremium,
      coverage,
      deductible
    });

    setIsCalculating(false);
  };

  useEffect(() => {
    if (packageValue && category && destination) {
      const timer = setTimeout(calculateInsurance, 500);
      return () => clearTimeout(timer);
    }
  }, [packageValue, category, destination]);

  const selectedCategory = packageCategories.find(cat => cat.value === category);
  const selectedDestination = destinations.find(dest => dest.region === destination);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Package Insurance Calculator
          </CardTitle>
          <CardDescription>
            Get instant insurance quotes based on your package value and destination
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="package-value">Package Value (USD)</Label>
              <Input
                id="package-value"
                type="number"
                placeholder="Enter package value"
                value={packageValue}
                onChange={(e) => setPackageValue(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Package Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {packageCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Destination Region</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest.region} value={dest.region}>
                      {dest.region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedCategory && selectedDestination && (
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Category Risk:</span>
                <span className={`text-sm font-medium ${
                  selectedCategory.risk === 'High' ? 'text-red-500' :
                  selectedCategory.risk === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {selectedCategory.risk}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Destination Risk:</span>
                <span className={`text-sm font-medium ${
                  selectedDestination.risk === 'High' ? 'text-red-500' :
                  selectedDestination.risk === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {selectedDestination.risk}
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
                <p className="text-muted-foreground">Calculating your quote...</p>
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
                        <span className="text-muted-foreground">Category Multiplier:</span>
                        <span>{quote.categoryMultiplier}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Destination Multiplier:</span>
                        <span>{quote.destinationMultiplier}x</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Insurance Premium:</span>
                        <span className="text-green-600 dark:text-green-400">${quote.totalPremium}</span>
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
                        <span className="text-sm">Deductible: ${quote.deductible}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Global coverage included</span>
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
                        This quote is {quote.totalPremium < parseFloat(packageValue) * 0.015 ? "competitive" : "standard"} 
                        compared to industry averages. Price includes theft, damage, and loss protection.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="btn-gradient flex-1">
                    Add Insurance to Shipment
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
            Insurance Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">What's Covered</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Physical damage during transit
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Theft and pilferage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Complete package loss
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Weather-related damage
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">What's Not Covered</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  Improper packaging
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  Prohibited items
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  War and terrorism
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  Undeclared value
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}