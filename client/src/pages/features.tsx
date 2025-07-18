import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import NotificationCenter from "@/components/NotificationCenter";
import InsuranceCalculator from "@/components/InsuranceCalculator";
import CurrencyConverter from "@/components/CurrencyConverter";
import ReferralProgram from "@/components/ReferralProgram";
import MobilePaymentIntegration from "@/components/MobilePaymentIntegration";
import MultiLanguageSupport from "@/components/MultiLanguageSupport";
import SecureDocumentUpload from "@/components/SecureDocumentUpload";
import TwoFactorAuth from "@/components/TwoFactorAuth";
import { 
  Bell, 
  Shield, 
  Globe, 
  Gift, 
  Smartphone, 
  Upload, 
  Lock,
  Calculator,
  ArrowRightLeft
} from "lucide-react";

export default function Features() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [selectedPaymentAmount, setSelectedPaymentAmount] = useState(125.99);

  const features = [
    {
      id: "notifications",
      name: "Smart Notifications",
      description: "Customizable push notifications for delivery updates",
      icon: <Bell className="h-5 w-5" />,
      component: <NotificationCenter />,
      badge: "Real-time"
    },
    {
      id: "insurance",
      name: "Insurance Calculator",
      description: "Real-time insurance quotes based on package value",
      icon: <Shield className="h-5 w-5" />,
      component: <InsuranceCalculator />,
      badge: "Instant Quotes"
    },
    {
      id: "currency",
      name: "Currency Converter",
      description: "Real-time exchange rates for international shipping",
      icon: <ArrowRightLeft className="h-5 w-5" />,
      component: <CurrencyConverter />,
      badge: "Live Rates"
    },
    {
      id: "referral",
      name: "Referral Program",
      description: "Earn rewards by referring friends and family",
      icon: <Gift className="h-5 w-5" />,
      component: <ReferralProgram />,
      badge: "Earn $25"
    },
    {
      id: "payments",
      name: "Mobile Payments",
      description: "Apple Pay, Google Pay, and secure payment integration",
      icon: <Smartphone className="h-5 w-5" />,
      component: <MobilePaymentIntegration amount={selectedPaymentAmount} />,
      badge: "Secure"
    },
    {
      id: "language",
      name: "Multi-Language Support",
      description: "Support for 20+ languages worldwide",
      icon: <Globe className="h-5 w-5" />,
      component: <MultiLanguageSupport />,
      badge: "20+ Languages"
    },
    {
      id: "documents",
      name: "Secure Document Upload",
      description: "Encrypted document storage with military-grade security",
      icon: <Upload className="h-5 w-5" />,
      component: <SecureDocumentUpload />,
      badge: "Encrypted"
    },
    {
      id: "2fa",
      name: "Two-Factor Authentication",
      description: "Enhanced account security with 2FA",
      icon: <Lock className="h-5 w-5" />,
      component: <TwoFactorAuth />,
      badge: "Security"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Advanced Features</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover powerful tools designed to enhance your shipping experience with 
            smart notifications, secure payments, and advanced logistics features.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8">
            {features.map((feature) => (
              <TabsTrigger 
                key={feature.id} 
                value={feature.id}
                className="flex flex-col items-center space-y-1 h-auto py-3"
              >
                {feature.icon}
                <span className="text-xs hidden sm:block">{feature.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {features.map((feature) => (
            <TabsContent key={feature.id} value={feature.id} className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{feature.name}</CardTitle>
                        <CardDescription className="text-lg">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {feature.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {feature.component}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Feature Grid Overview */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">All Features at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card 
                key={feature.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setActiveTab(feature.id)}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge variant="outline">{feature.badge}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Why Choose Shipnix-Express?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg">Enterprise Security</h3>
              <p className="text-muted-foreground">
                Military-grade encryption, two-factor authentication, and secure document handling
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">Global Reach</h3>
              <p className="text-muted-foreground">
                220+ countries, 20+ languages, and local currency support worldwide
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto">
                <Smartphone className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg">Mobile-First</h3>
              <p className="text-muted-foreground">
                Seamless mobile payments, push notifications, and optimized mobile experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}