import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Calculator, DollarSign, Package, AlertTriangle, CheckCircle } from "lucide-react";

interface InsuranceQuote {
  basicCoverage: number;
  premiumCoverage: number;
  comprehensiveCoverage: number;
}

interface InsuranceCalculatorProps {
  className?: string;
}

export default function InsuranceCalculator({ className }: InsuranceCalculatorProps) {
  const [packageValue, setPackageValue] = useState("");
  const [packageType, setPackageType] = useState("");
  const [destination, setDestination] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [quote, setQuote] = useState<InsuranceQuote | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const packageTypes = [
    { value: "electronics", label: "Electronics", riskMultiplier: 1.5 },
    { value: "jewelry", label: "Jewelry & Valuables", riskMultiplier: 2.0 },
    { value: "artwork", label: "Artwork & Antiques", riskMultiplier: 1.8 },
    { value: "documents", label: "Important Documents", riskMultiplier: 1.2 },
    { value: "fragile", label: "Fragile Items", riskMultiplier: 1.4 },
    { value: "standard", label: "Standard Items", riskMultiplier: 1.0 }
  ];

  const destinations = [
    { value: "domestic", label: "Domestic", riskMultiplier: 1.0 },
    { value: "international-low", label: "International (Low Risk)", riskMultiplier: 1.3 },
    { value: "international-medium", label: "International (Medium Risk)", riskMultiplier: 1.6 },
    { value: "international-high", label: "International (High Risk)", riskMultiplier: 2.0 }
  ];

  const shippingMethods = [
    { value: "standard", label: "Standard Shipping", riskMultiplier: 1.0 },
    { value: "express", label: "Express Shipping", riskMultiplier: 0.8 },
    { value: "overnight", label: "Overnight Shipping", riskMultiplier: 0.6 }
  ];

  const calculateInsurance = () => {
    if (!packageValue || !packageType || !destination || !shippingMethod) {
      return;
    }

    setIsCalculating(true);

    // Simulate API call
    setTimeout(() => {
      const value = parseFloat(packageValue);
      const typeMultiplier = packageTypes.find(t => t.value === packageType)?.riskMultiplier || 1.0;
      const destMultiplier = destinations.find(d => d.value === destination)?.riskMultiplier || 1.0;
      const shippingMultiplier = shippingMethods.find(s => s.value === shippingMethod)?.riskMultiplier || 1.0;

      const baseRate = 0.02; // 2% of package value
      const totalMultiplier = typeMultiplier * destMultiplier * shippingMultiplier;

      const basicCoverage = value * baseRate * totalMultiplier;
      const premiumCoverage = basicCoverage * 1.5;
      const comprehensiveCoverage = basicCoverage * 2.2;

      setQuote({
        basicCoverage: Math.round(basicCoverage * 100) / 100,
        premiumCoverage: Math.round(premiumCoverage * 100) / 100,
        comprehensiveCoverage: Math.round(comprehensiveCoverage * 100) / 100
      });

      setIsCalculating(false);
    }, 1500);
  };

  const getCoverageDetails = (type: "basic" | "premium" | "comprehensive") => {
    const coverage = {
      basic: {
        title: "Basic Coverage",
        description: "Standard protection for your package",
        features: ["Loss & Damage Coverage", "Up to $1,000 coverage", "Email Support"],
        recommended: false
      },
      premium: {
        title: "Premium Coverage",
        description: "Enhanced protection with faster claims",
        features: ["All Basic Features", "Up to $10,000 coverage", "Priority Support", "24/7 Claims Processing"],
        recommended: true
      },
      comprehensive: {
        title: "Comprehensive Coverage",
        description: "Maximum protection for high-value items",
        features: ["All Premium Features", "Up to $50,000 coverage", "Dedicated Claims Manager", "Replacement Guarantee", "Expedited Replacement"],
        recommended: false
      }
    };

    return coverage[type];
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <CardTitle>Package Insurance Calculator</CardTitle>
          </div>
          <CardDescription>
            Get instant quotes for package insurance based on value and risk factors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="packageValue">Package Value ($)</Label>
              <Input
                id="packageValue"
                type="number"
                placeholder="Enter package value"
                value={packageValue}
                onChange={(e) => setPackageValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Package Type</Label>
              <Select value={packageType} onValueChange={setPackageType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select package type" />
                </SelectTrigger>
                <SelectContent>
                  {packageTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Destination</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((dest) => (
                    <SelectItem key={dest.value} value={dest.value}>
                      {dest.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Shipping Method</Label>
              <Select value={shippingMethod} onValueChange={setShippingMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  {shippingMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={calculateInsurance}
            disabled={isCalculating || !packageValue || !packageType || !destination || !shippingMethod}
            className="w-full"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {isCalculating ? "Calculating..." : "Calculate Insurance"}
          </Button>

          {/* Results */}
          {quote && (
            <div className="space-y-4">
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4">Insurance Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(["basic", "premium", "comprehensive"] as const).map((type) => {
                    const details = getCoverageDetails(type);
                    const price = quote[`${type}Coverage`];
                    
                    return (
                      <Card key={type} className={`relative ${details.recommended ? "border-blue-500 shadow-lg" : ""}`}>
                        {details.recommended && (
                          <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
                            Recommended
                          </Badge>
                        )}
                        <CardHeader className="text-center">
                          <CardTitle className="text-lg">{details.title}</CardTitle>
                          <CardDescription>{details.description}</CardDescription>
                          <div className="text-2xl font-bold text-blue-600">
                            ${price}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {details.features.map((feature, index) => (
                              <li key={index} className="flex items-center space-x-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <Button 
                            className="w-full mt-4"
                            variant={details.recommended ? "default" : "outline"}
                          >
                            Select {details.title}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Risk Factors */}
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <h4 className="font-medium text-amber-800 dark:text-amber-200">Risk Factors Considered</h4>
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                  <p>• Package type: {packageTypes.find(t => t.value === packageType)?.label}</p>
                  <p>• Destination: {destinations.find(d => d.value === destination)?.label}</p>
                  <p>• Shipping method: {shippingMethods.find(s => s.value === shippingMethod)?.label}</p>
                  <p>• Package value: ${packageValue}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}