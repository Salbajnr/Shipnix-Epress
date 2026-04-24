import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Logo } from "@/components/ui/logo";
import { Package, Truck, MapPin, Clock, Shield, Search, Globe, Zap, Users, Award, Phone, Mail, ArrowRight, CheckCircle, Star, BarChart3, LogIn, Calculator, FileText, CreditCard, Plane, Ship, Car } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
  const [activeTab, setActiveTab] = useState<"track" | "quote" | "about">("track");
  const { toast } = useToast();

  // Real tracking functionality - redirects to public tracking page
  // No query needed here as we redirect to the tracking page

  const handleTrack = () => {
    if (trackingId.trim()) {
      // Redirect to public tracking page which uses real API
      window.location.href = `/public-tracking?track=${trackingId.toUpperCase()}`;
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid tracking ID",
        variant: "destructive",
      });
    }
  };

  const handleAdminLogin = () => {
    window.location.href = "/admin";
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
      <Header />

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <section id="hero" className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8">
              {/* Hero Content */}
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Global Logistics
                  </span>
                  <br />
                  <span className="text-gray-900 dark:text-white">
                    Made Simple
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg">
                  Ship to 220+ countries with real-time tracking, smart pricing, and 24/7 support.
                  Experience the future of global shipping.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105" asChild>
                  <a href="/api/login">
                    <LogIn className="mr-2 h-5 w-5" />
                    Admin Login
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 px-8 py-4 text-lg hover:scale-105 transition-transform">
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
                <Link href="/track">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Search className="mr-2 h-5 w-5" />
                    Track Package
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Hero Image */}
          <div className="mt-16 relative overflow-hidden rounded-2xl shadow-2xl max-w-4xl mx-auto">
            <img
              src="/attached_assets/IMG_5473_1754582326179.jpeg"
              alt="Global shipping network"
              className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-semibold mb-2">Global Network</h3>
              <p className="text-white/90">Connecting 220+ countries worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Shipnix Express?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Advanced logistics technology meets exceptional service to deliver your packages faster, safer, and smarter.
            </p>

            {/* Features Header Image */}
            <div className="mt-12 mb-16 relative overflow-hidden rounded-2xl shadow-xl max-w-4xl mx-auto">
              <img
                src="/attached_assets/IMG_5474_1754582326180.jpeg"
                alt="Advanced logistics technology"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">Cutting-Edge Technology</h3>
                  <p className="text-white/90">Real-time tracking and smart logistics solutions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <Card className="group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Global Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Deliver to 220+ countries and territories with our extensive logistics network and local partnerships.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Real-time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Monitor your shipments with live GPS tracking, instant status updates, and predictive delivery times.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Secure & Insured</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Full insurance coverage, secure handling protocols, and guaranteed delivery with money-back assurance.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Express Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Same-day, next-day, and express options available with time-slot delivery and weekend service.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Flexible Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Pay with cards, bank transfers, PayPal, or cryptocurrencies. Smart pricing with volume discounts.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Quality Assurance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  ISO certified processes, continuous quality monitoring, and customer satisfaction guarantee.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}