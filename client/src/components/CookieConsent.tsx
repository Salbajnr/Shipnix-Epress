import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Cookie, Settings, Shield, BarChart3, Target, MapPin, Clock, ExternalLink, CheckCircle, X } from "lucide-react";
// Using an SVG logo inline to avoid asset loading issues
const shipnixLogo = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzI1NjNFQiIvPgo8cGF0aCBkPSJNMTIgMTJIMjhWMTZIMTJWMTJaTTEyIDIwSDI0VjI0SDEyVjIwWk0xMiAyOEgyOFYzMkgxMlYyOFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

interface CookieCategory {
  id: keyof CookiePreferences;
  name: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
  cookies: Array<{
    name: string;
    purpose: string;
    duration: string;
    provider: string;
  }>;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false,
  });

  const cookieCategories: CookieCategory[] = [
    {
      id: "necessary",
      name: "Necessary Cookies",
      description: "These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility.",
      icon: <Shield className="h-5 w-5" />,
      required: true,
      cookies: [
        {
          name: "session_token",
          purpose: "User authentication and session management",
          duration: "7 days",
          provider: "Shipnix-Express"
        },
        {
          name: "csrf_token",
          purpose: "Cross-site request forgery protection",
          duration: "Session",
          provider: "Shipnix-Express"
        },
        {
          name: "consent_preferences",
          purpose: "Stores your cookie consent preferences",
          duration: "1 year",
          provider: "Shipnix-Express"
        }
      ]
    },
    {
      id: "analytics",
      name: "Analytics Cookies",
      description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
      icon: <BarChart3 className="h-5 w-5" />,
      required: false,
      cookies: [
        {
          name: "_ga",
          purpose: "Distinguishes unique users and sessions",
          duration: "2 years",
          provider: "Google Analytics"
        },
        {
          name: "_gid",
          purpose: "Distinguishes unique users",
          duration: "24 hours",
          provider: "Google Analytics"
        },
        {
          name: "shipnix_analytics",
          purpose: "Internal analytics for service optimization",
          duration: "30 days",
          provider: "Shipnix-Express"
        }
      ]
    },
    {
      id: "marketing",
      name: "Marketing Cookies",
      description: "These cookies are used to track visitors across websites to display relevant advertisements and measure campaign effectiveness.",
      icon: <Target className="h-5 w-5" />,
      required: false,
      cookies: [
        {
          name: "_fbp",
          purpose: "Facebook advertising and remarketing",
          duration: "3 months",
          provider: "Facebook"
        },
        {
          name: "google_ads",
          purpose: "Google Ads conversion tracking",
          duration: "90 days",
          provider: "Google"
        },
        {
          name: "shipnix_campaigns",
          purpose: "Track marketing campaign effectiveness",
          duration: "90 days",
          provider: "Shipnix-Express"
        }
      ]
    },
    {
      id: "personalization",
      name: "Personalization Cookies",
      description: "These cookies enable us to provide enhanced functionality and personalization based on your preferences and usage patterns.",
      icon: <MapPin className="h-5 w-5" />,
      required: false,
      cookies: [
        {
          name: "user_preferences",
          purpose: "Store user interface preferences and settings",
          duration: "1 year",
          provider: "Shipnix-Express"
        },
        {
          name: "location_data",
          purpose: "Remember preferred shipping locations",
          duration: "6 months",
          provider: "Shipnix-Express"
        },
        {
          name: "theme_preference",
          purpose: "Remember dark/light mode preference",
          duration: "1 year",
          provider: "Shipnix-Express"
        }
      ]
    }
  ];

  // Check if user has made a choice before
  useEffect(() => {
    const savedPreferences = localStorage.getItem("cookiePreferences");
    const consentTimestamp = localStorage.getItem("cookieConsentTimestamp");
    
    if (savedPreferences && consentTimestamp) {
      // Check if consent is still valid (1 year)
      const consentDate = new Date(parseInt(consentTimestamp));
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      if (consentDate > oneYearAgo) {
        setPreferences(JSON.parse(savedPreferences));
        return;
      }
    }
    
    // Show banner if no valid consent found
    setShowBanner(true);
  }, []);

  const handleAcceptAll = () => {
    const newPreferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    savePreferences(newPreferences);
  };

  const handleAcceptNecessary = () => {
    const newPreferences: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    savePreferences(newPreferences);
  };

  const handleSaveCustom = () => {
    savePreferences(preferences);
    setShowSettings(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("cookiePreferences", JSON.stringify(prefs));
    localStorage.setItem("cookieConsentTimestamp", Date.now().toString());
    setPreferences(prefs);
    setShowBanner(false);
    
    // Apply preferences by setting/removing cookies
    applyCookiePreferences(prefs);
  };

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // This would typically integrate with your analytics and marketing tools
    if (prefs.analytics) {
      // Enable Google Analytics
      console.log("Analytics cookies enabled");
    } else {
      // Disable analytics and clear existing cookies
      console.log("Analytics cookies disabled");
    }
    
    if (prefs.marketing) {
      // Enable marketing pixels
      console.log("Marketing cookies enabled");
    } else {
      // Disable marketing cookies
      console.log("Marketing cookies disabled");
    }
    
    if (prefs.personalization) {
      // Enable personalization features
      console.log("Personalization cookies enabled");
    } else {
      // Reset personalization settings
      console.log("Personalization cookies disabled");
    }
  };

  const handlePreferenceChange = (category: keyof CookiePreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }));
  };

  if (!showBanner) {
    return null;
  }

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
                    <Cookie className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      We Value Your Privacy
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      This website uses cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                      We also share information about your use of our site with our social media, advertising, and analytics partners. 
                      Your personal data is processed in accordance with our{" "}
                      <a href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Privacy Policy
                      </a>
                      {" "}and{" "}
                      <a href="/cookie-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Cookie Policy
                      </a>.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <Dialog open={showSettings} onOpenChange={setShowSettings}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="whitespace-nowrap">
                        <Settings className="h-4 w-4 mr-2" />
                        Customize
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Cookie className="h-5 w-5" />
                          Cookie Preferences
                        </DialogTitle>
                        <DialogDescription>
                          Manage your cookie preferences for Shipnix-Express. You can enable or disable different types of cookies below.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <ScrollArea className="max-h-[600px] pr-4">
                        <div className="space-y-6">
                          {cookieCategories.map((category, index) => (
                            <div key={category.id}>
                              <Card>
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                        {category.icon}
                                      </div>
                                      <div>
                                        <CardTitle className="text-lg">{category.name}</CardTitle>
                                        {category.required && (
                                          <Badge variant="secondary" className="mt-1">
                                            Required
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <Checkbox
                                      checked={preferences[category.id]}
                                      onCheckedChange={(checked) => 
                                        !category.required && handlePreferenceChange(category.id, checked as boolean)
                                      }
                                      disabled={category.required}
                                    />
                                  </div>
                                  <CardDescription className="mt-2">
                                    {category.description}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    {category.cookies.map((cookie, cookieIndex) => (
                                      <div key={cookieIndex} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <code className="text-sm font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                              {cookie.name}
                                            </code>
                                            <Badge variant="outline" className="text-xs">
                                              {cookie.provider}
                                            </Badge>
                                          </div>
                                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                            {cookie.purpose}
                                          </p>
                                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <Clock className="h-3 w-3" />
                                            <span>Duration: {cookie.duration}</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                              {index < cookieCategories.length - 1 && <Separator />}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      
                      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => setShowSettings(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAcceptNecessary} variant="outline">
                          Accept Necessary Only
                        </Button>
                        <Button onClick={handleSaveCustom} className="bg-blue-600 hover:bg-blue-700">
                          Save Preferences
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button onClick={handleAcceptNecessary} variant="outline" size="sm">
                    Necessary Only
                  </Button>
                  <Button onClick={handleAcceptAll} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Accept All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Privacy Notice Overlay for first-time visitors */}
      {showBanner && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
      )}
    </>
  );
}