import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, Shield, Calculator, Users, Smartphone, Globe, DollarSign, TrendingUp, Lock } from "lucide-react";

import NotificationSettings from "@/components/NotificationSettings";
import CurrencyConverter from "@/components/CurrencyConverter";
import LanguageSelector from "@/components/LanguageSelector";
import MobilePayments from "@/components/MobilePayments";
import SecureDocumentUpload from "@/components/SecureDocumentUpload";
import TwoFactorAuth from "@/components/TwoFactorAuth";

// Crypto-specific components
import CryptoInsuranceCalculator from "@/components/CryptoInsuranceCalculator";
import CryptoReferralProgram from "@/components/CryptoReferralProgram";

const cryptoFeatures = [
  {
    id: "notifications",
    title: "Smart Price Alerts",
    description: "Customizable cryptocurrency price notifications and market alerts",
    icon: Bell,
    component: NotificationSettings,
    category: "Trading"
  },
  {
    id: "insurance",
    title: "Portfolio Insurance",
    description: "Protect your crypto investments with smart insurance calculations",
    icon: Calculator,
    component: CryptoInsuranceCalculator,
    category: "Protection"
  },
  {
    id: "referral",
    title: "Trading Rewards",
    description: "Earn cryptocurrency rewards for bringing new traders",
    icon: Users,
    component: CryptoReferralProgram,
    category: "Rewards"
  },
  {
    id: "payments",
    title: "Instant Payments",
    description: "Buy crypto with Apple Pay, Google Pay integration",
    icon: Smartphone,
    component: MobilePayments,
    category: "Payments"
  },
  {
    id: "language",
    title: "Global Trading",
    description: "Multi-language support for international crypto traders",
    icon: Globe,
    component: LanguageSelector,
    category: "Accessibility"
  },
  {
    id: "currency",
    title: "Fiat Converter",
    description: "Real-time crypto to fiat currency conversion",
    icon: DollarSign,
    component: CurrencyConverter,
    category: "Tools"
  },
  {
    id: "documents",
    title: "Secure KYC Upload",
    description: "Encrypted document storage for verification",
    icon: Shield,
    component: SecureDocumentUpload,
    category: "Security"
  },
  {
    id: "2fa",
    title: "Account Security",
    description: "Two-factor authentication for crypto trading",
    icon: Lock,
    component: TwoFactorAuth,
    category: "Security"
  }
];

const categories = ["All", "Trading", "Protection", "Rewards", "Payments", "Accessibility", "Tools", "Security"];

export default function CryptoFeatures() {
  const [activeFeature, setActiveFeature] = useState("notifications");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFeatures = selectedCategory === "All" 
    ? cryptoFeatures 
    : cryptoFeatures.filter(feature => feature.category === selectedCategory);

  const ActiveComponent = cryptoFeatures.find(f => f.id === activeFeature)?.component || NotificationSettings;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Advanced Trading Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Enhance your cryptocurrency trading experience with smart notifications, portfolio protection, 
            mobile payments, and advanced security features.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Feature Overview</TabsTrigger>
            <TabsTrigger value="interactive">Interactive Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatures.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <Card 
                    key={feature.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                    onClick={() => {
                      setActiveFeature(feature.id);
                      // Switch to interactive tab
                      const tabsTrigger = document.querySelector('[value="interactive"]') as HTMLElement;
                      tabsTrigger?.click();
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {feature.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Feature Categories */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Trading Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Smart price alerts, market analysis, and advanced trading features for crypto enthusiasts.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-green-500" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication, secure document upload, and portfolio protection features.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Smartphone className="h-5 w-5 text-purple-500" />
                    Mobile Trading
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Mobile payment integration with Apple Pay, Google Pay for instant crypto purchases.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-yellow-500" />
                    Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Currency converter, portfolio analytics, and market insights for informed trading.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interactive" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Feature Navigation */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Trading Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {cryptoFeatures.map((feature) => {
                      const IconComponent = feature.icon;
                      return (
                        <button
                          key={feature.id}
                          onClick={() => setActiveFeature(feature.id)}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            activeFeature === feature.id
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none'
                              : 'hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span className="text-sm font-medium">{feature.title}</span>
                          </div>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Active Feature Component */}
              <div className="lg:col-span-3">
                <ActiveComponent />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}