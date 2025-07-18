import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, Shield, Calculator, Users, Smartphone, Globe, DollarSign, FileText, Lock } from "lucide-react";

import NotificationSettings from "@/components/NotificationSettings";
import InsuranceCalculator from "@/components/InsuranceCalculator";
import ReferralProgram from "@/components/ReferralProgram";
import MobilePayments from "@/components/MobilePayments";
import LanguageSelector from "@/components/LanguageSelector";
import CurrencyConverter from "@/components/CurrencyConverter";
import SecureDocumentUpload from "@/components/SecureDocumentUpload";
import TwoFactorAuth from "@/components/TwoFactorAuth";

const features = [
  {
    id: "notifications",
    title: "Smart Notifications",
    description: "Customizable delivery updates and preferences",
    icon: Bell,
    component: NotificationSettings,
    category: "Communication"
  },
  {
    id: "insurance",
    title: "Insurance Calculator",
    description: "Real-time insurance quotes based on package value",
    icon: Calculator,
    component: InsuranceCalculator,
    category: "Protection"
  },
  {
    id: "referral",
    title: "Referral Program",
    description: "Earn rewards for bringing new customers",
    icon: Users,
    component: ReferralProgram,
    category: "Rewards"
  },
  {
    id: "payments",
    title: "Mobile Payments",
    description: "Apple Pay, Google Pay integration",
    icon: Smartphone,
    component: MobilePayments,
    category: "Payments"
  },
  {
    id: "language",
    title: "Multi-Language Support",
    description: "Support for 20+ languages worldwide",
    icon: Globe,
    component: LanguageSelector,
    category: "Accessibility"
  },
  {
    id: "currency",
    title: "Currency Converter",
    description: "Real-time exchange rates for international shipping",
    icon: DollarSign,
    component: CurrencyConverter,
    category: "Tools"
  },
  {
    id: "documents",
    title: "Secure Document Upload",
    description: "Encrypted document storage with security",
    icon: FileText,
    component: SecureDocumentUpload,
    category: "Security"
  },
  {
    id: "2fa",
    title: "Two-Factor Authentication",
    description: "Enhanced account security protection",
    icon: Lock,
    component: TwoFactorAuth,
    category: "Security"
  }
];

const categories = ["All", "Communication", "Protection", "Rewards", "Payments", "Accessibility", "Tools", "Security"];

export default function Features() {
  const [activeFeature, setActiveFeature] = useState("notifications");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFeatures = selectedCategory === "All" 
    ? features 
    : features.filter(feature => feature.category === selectedCategory);

  const ActiveComponent = features.find(f => f.id === activeFeature)?.component || NotificationSettings;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Advanced Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore Shipnix-Express's comprehensive suite of features designed to make international shipping 
            more interactive, secure, and user-friendly.
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
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                    onClick={() => {
                      setActiveFeature(feature.id);
                      // Switch to interactive tab
                      const tabsTrigger = document.querySelector('[value="interactive"]') as HTMLElement;
                      tabsTrigger?.click();
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <IconComponent className="h-6 w-6 text-blue-600" />
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bell className="h-5 w-5 text-blue-500" />
                    Communication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Smart notifications, language support, and multi-channel communication features.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-green-500" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication, secure document upload, and encrypted storage.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Smartphone className="h-5 w-5 text-purple-500" />
                    Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Mobile payment integration with Apple Pay, Google Pay, and secure processing.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-yellow-500" />
                    Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Currency converter, insurance calculator, and other utility tools.
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
                    <CardTitle className="text-lg">Select Feature</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {features.map((feature) => {
                      const IconComponent = feature.icon;
                      return (
                        <button
                          key={feature.id}
                          onClick={() => setActiveFeature(feature.id)}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            activeFeature === feature.id
                              ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-500 border'
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