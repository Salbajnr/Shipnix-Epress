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
                <Link href="/quote">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Calculator className="mr-2 h-5 w-5" />
                    Get Quote
                  </Button>
                </Link>
                <Link href="/track">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <Search className="mr-2 h-5 w-5" />
                    Track Package
                  </Button>
                </Link>
              </div>

              {/* Quick Track */}
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Quick Track
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter tracking ID (e.g., ST-12345678)"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                      className="flex-1"
                    />
                    <Button onClick={handleTrack} size="sm">
                      Track
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
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
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle>24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Round-the-clock customer support with live chat, phone assistance, and dedicated account managers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Complete Logistics Solutions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              From small packages to freight shipments, we handle all your logistics needs.
            </p>
          </div>

          {/* Services Hero Image */}
          <div className="mb-16 relative overflow-hidden rounded-2xl shadow-xl">
            <img 
              src="/attached_assets/IMG_5475_1754582326180.jpeg"
              alt="Package delivery services"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-bold mb-2">Professional Delivery</h3>
              <p className="text-white/90 text-lg">Secure, fast, and reliable package delivery worldwide</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Package className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Express Packages</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fast, reliable delivery for documents, packages, and urgent shipments with tracking and insurance.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Truck className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Freight & Cargo</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Heavy cargo, palletized goods, and oversized shipments with specialized handling and equipment.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Ship className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">International Trade</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Customs clearance, trade compliance, and international shipping solutions for global commerce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/attached_assets/IMG_5476_1754582326180.jpeg"
            alt="Express delivery background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-600/90" />
        </div>
        
        {/* Content */}
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Ship Smarter?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of businesses that trust Shipnix Express for their global logistics needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Calculator className="mr-2 h-5 w-5" />
                Get Instant Quote
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-gray-900">
                <Users className="mr-2 h-5 w-5" />
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Admin Access */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Admin Image */}
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img 
                src="/attached_assets/IMG_5286_1754582450192.jpeg"
                alt="Admin dashboard and management"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            
            {/* Admin Content */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Administrator Access
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Access the admin dashboard to manage shipments, quotes, and customer accounts.
              </p>
              <Button onClick={handleAdminLogin} className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800">
                <LogIn className="mr-2 h-4 w-4" />
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo size="sm" />
              <p className="text-gray-400 mt-4">
                Global logistics solutions with real-time tracking and 24/7 support.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Express Delivery</li>
                <li>International Shipping</li>
                <li>Freight Services</li>
                <li>Customs Clearance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Track Package</li>
                <li>Get Quote</li>
                <li>FAQ</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>support@shipnix.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Shipnix Express. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
