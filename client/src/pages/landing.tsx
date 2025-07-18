import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, MapPin, Clock, Shield, Search, Globe, Zap, Users, Award, Phone, Mail, ArrowRight, CheckCircle, Star, BarChart3, Menu, X, LogIn, Calculator, FileText, CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import PaymentMethods from "@/components/PaymentMethods";
import LiveChat from "@/components/LiveChat";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface QuoteRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  senderAddress: string;
  recipientAddress: string;
  packageDescription: string;
  weight: string;
  dimensions: string;
}

interface TrackingResult {
  trackingId: string;
  currentStatus: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  recipientName: string;
  recipientAddress: string;
  packageDescription?: string;
  shippingCost?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  trackingEvents: Array<{
    status: string;
    location?: string;
    description: string;
    timestamp: string;
  }>;
}

export default function Landing() {
  const [trackingId, setTrackingId] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<"track" | "quote" | "about">("track");
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [quoteForm, setQuoteForm] = useState<QuoteRequest>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    senderAddress: "",
    recipientAddress: "",
    packageDescription: "",
    weight: "",
    dimensions: "",
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: trackingResult, isLoading, error } = useQuery<TrackingResult>({
    queryKey: ["/api/track", trackingId],
    enabled: false, // Disabled for public access
    retry: false,
  });

  const handleTrack = () => {
    if (trackingId.trim()) {
      // Redirect to public tracking page
      window.location.href = `/track/${trackingId.toUpperCase()}`;
    } else {
      alert("Please enter a valid tracking ID");
    }
  };

  const handleQuoteSubmit = async () => {
    // Basic validation
    if (!quoteForm.customerName || !quoteForm.customerEmail || !quoteForm.senderAddress || !quoteForm.recipientAddress) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // In a real implementation, this would create a quote via API
      alert(`Quote request submitted! We'll send a detailed quote to ${quoteForm.customerEmail} within 24 hours.`);
      
      // Reset form
      setQuoteForm({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        senderAddress: "",
        recipientAddress: "",
        packageDescription: "",
        weight: "",
        dimensions: "",
      });
    } catch (error) {
      console.error("Error submitting quote:", error);
      alert("Error submitting quote. Please try again.");
    }
  };

  const handleAdminLogin = () => {
    window.location.href = "/api/auth/login";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-green-600 dark:text-green-400";
      case "out_for_delivery": return "text-blue-600 dark:text-blue-400";
      case "in_transit": return "text-yellow-600 dark:text-yellow-400";
      case "failed_delivery": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const formatStatus = (status: string) => {
    return status.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const formatPaymentMethod = (method: string) => {
    const methods = {
      card: "Credit/Debit Card",
      bank_transfer: "Bank Transfer",
      paypal: "PayPal",
      bitcoin: "Bitcoin (BTC)",
      ethereum: "Ethereum (ETH)",
      usdc: "USD Coin (USDC)"
    };
    return methods[method as keyof typeof methods] || method;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-x-hidden">
      <Header showUserMenu={false} />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Modern Header */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Logo className="h-12 w-12 transition-transform hover:scale-105" />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Services</a>
              <a href="#tracking" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Track</a>
              <a href="#solutions" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Solutions</a>
              <a href="#about" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">About</a>
              <a href="#contact" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Contact</a>
              <Button variant="outline" className="border-2 hover:scale-105 transition-transform" asChild>
                <a href="/api/login">Admin Portal</a>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Get Quote
              </Button>
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="px-4 py-6 space-y-4">
              <a href="#services" className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2">Services</a>
              <a href="#tracking" className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2">Track</a>
              <a href="#solutions" className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2">Solutions</a>
              <a href="#about" className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2">About</a>
              <a href="#contact" className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2">Contact</a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" asChild>
                  <a href="/api/login">Admin Portal</a>
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">Get Quote</Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-800 dark:text-blue-200 text-sm font-medium animate-pulse">
                  <Zap className="h-4 w-4 mr-2" />
                  Lightning Fast Global Delivery
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                  The Future of
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Logistics
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                  Experience next-generation shipping technology. Connect your business to 220+ countries with AI-powered logistics, real-time tracking, and seamless integration.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  Start Shipping Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-2 px-8 py-4 text-lg hover:scale-105 transition-transform">
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">220+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">99.9%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4 animate-pulse delay-200"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Truck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-2/3 animate-pulse delay-400"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Tracking Section */}
      <section id="tracking" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-6 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Track Your Shipment
              <span className="block text-blue-600 dark:text-blue-400">In Real-Time</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Advanced AI-powered tracking with live updates and predictive analytics
            </p>
          </div>

          {/* Advanced Tracking Input */}
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Search className="h-5 w-5 text-white" />
                  </div>
                  Smart Tracking Portal
                </CardTitle>
                <CardDescription className="text-lg">
                  Enter your tracking ID or scan QR code for instant updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter tracking ID (e.g., ST-DEMO12345)"
                    value={trackingId}
                    onChange={(e) => {
                      setTrackingId(e.target.value.toUpperCase());
                      setSearchTriggered(false);
                    }}
                    onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                    className="text-lg h-14 pl-6 pr-32 bg-gray-50 dark:bg-gray-900/50 border-2 focus:border-blue-500 rounded-xl font-mono"
                  />
                  <Button 
                    onClick={handleTrack} 
                    disabled={!trackingId.trim()}
                    className="absolute right-2 top-2 h-10 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg"
                  >
                    Track<ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                
                {/* Sample Tracking IDs for Demo */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-3 font-medium">
                    🚀 Try these demo tracking IDs:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["ST-DEMO12345", "ST-DEMO67890", "ST-DEMO24680"].map((demoId) => (
                      <button
                        key={demoId}
                        onClick={() => {
                          setTrackingId(demoId);
                          window.location.href = `/track/${demoId}`;
                        }}
                        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-mono transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform"
                      >
                        {demoId}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Or use:</span>
                  <Button variant="outline" size="sm" className="h-8">📱 QR Scanner</Button>
                  <Button variant="outline" size="sm" className="h-8">📧 Email Lookup</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tracking Results */}
          {searchTriggered && trackingId && (
            <div className="mt-8 max-w-4xl mx-auto">
              {isLoading && (
                <Card>
                  <CardContent className="py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Searching for your package...</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {error && (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Package Not Found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      No package found with tracking ID: {trackingId}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Please check your tracking ID and try again
                    </p>
                  </CardContent>
                </Card>
              )}

              {trackingResult && (
                <div className="space-y-6">
                  {/* Package Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Package Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Tracking Information</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-500">Tracking ID:</span>
                              <span className="ml-2 font-mono">{trackingResult.trackingId}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Status:</span>
                              <span className={`ml-2 font-semibold ${getStatusColor(trackingResult.currentStatus)}`}>
                                {formatStatus(trackingResult.currentStatus)}
                              </span>
                            </div>
                            {trackingResult.currentLocation && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                                <span className="text-gray-500">Location:</span>
                                <span className="ml-2">{trackingResult.currentLocation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Delivery Information</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-500">Recipient:</span>
                              <span className="ml-2">{trackingResult.recipientName}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Address:</span>
                              <span className="ml-2">{trackingResult.recipientAddress}</span>
                            </div>
                            {trackingResult.shippingCost && (
                              <div>
                                <span className="text-gray-500">Shipping Cost:</span>
                                <span className="ml-2">${trackingResult.shippingCost}</span>
                              </div>
                            )}
                            {trackingResult.paymentMethod && (
                              <div>
                                <span className="text-gray-500">Payment Method:</span>
                                <span className="ml-2">{formatPaymentMethod(trackingResult.paymentMethod)}</span>
                              </div>
                            )}
                            {trackingResult.estimatedDelivery && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                                <span className="text-gray-500">Est. Delivery:</span>
                                <span className="ml-2">
                                  {new Date(trackingResult.estimatedDelivery).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tracking Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Tracking History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {trackingResult.trackingEvents.map((event, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                              <div className={`w-3 h-3 rounded-full ${
                                index === 0 ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                              }`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <p className={`font-semibold ${getStatusColor(event.status)}`}>
                                    {formatStatus(event.status)}
                                  </p>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    {event.description}
                                  </p>
                                  {event.location && (
                                    <p className="text-sm text-gray-500 flex items-center mt-1">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {event.location}
                                    </p>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 mt-2 sm:mt-0">
                                  {new Date(event.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </section>



      {/* Advanced Features Section */}
      <section id="solutions" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Next-Generation
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Logistics Solutions
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Powered by AI and built for the future of global commerce
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Global Reach</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Connect to 220+ countries with our extensive network of logistics partners and AI-optimized routing.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Same-day delivery in 50+ cities
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Express international shipping
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Customs clearance automation
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Smart Analytics</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  AI-powered insights and predictive analytics to optimize your supply chain and reduce costs.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Real-time performance dashboards
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Predictive delivery estimates
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Cost optimization recommendations
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-0">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Enterprise Security</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Bank-grade security with blockchain tracking and insurance coverage for all shipments.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    End-to-end encryption
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Blockchain transparency
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Full insurance coverage
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Flexible Payment Options</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  💳
                </div>
                <span className="text-gray-600 dark:text-gray-400">Credit Cards</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  ₿
                </div>
                <span className="text-gray-600 dark:text-gray-400">Bitcoin</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  Ξ
                </div>
                <span className="text-gray-600 dark:text-gray-400">Ethereum</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  $
                </div>
                <span className="text-gray-600 dark:text-gray-400">USDC</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  📱
                </div>
                <span className="text-gray-600 dark:text-gray-400">PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Ship Smarter?
          </h2>
          <p className="text-xl mb-12 opacity-90">
            Join thousands of businesses already using Shipnix-Express for their global logistics needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-12 py-4 text-lg font-semibold transition-all hover:scale-105">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer */}
          <div className="py-16 grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Logo className="h-10 w-10" />
              <p className="text-gray-400 leading-relaxed">
                The world's most advanced logistics platform. Connecting businesses to 220+ countries with AI-powered shipping solutions.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">ig</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Services</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Express Delivery</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">International Shipping</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Freight Solutions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Supply Chain Management</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Warehousing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Last Mile Delivery</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Solutions</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Enterprise</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Small Business</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">E-commerce</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API Integration</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">White Label</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Developer Tools</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Track Package</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Calculator</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Service Updates</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              </ul>
              
              <div className="mt-8">
                <h4 className="text-sm font-semibold mb-4 text-gray-300">Contact Info</h4>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-400">
                    <Phone className="h-4 w-4 mr-3" />
                    <span className="text-sm">+1-800-SHIPNIX</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Mail className="h-4 w-4 mr-3" />
                    <span className="text-sm">support@shipnix-express.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="py-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">
                © 2024 Shipnix-Express. All rights reserved.
              </div>
              <div className="flex space-x-8 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Security</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}