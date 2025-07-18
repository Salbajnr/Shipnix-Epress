import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Truck, MapPin, Clock, Shield, Star, CheckCircle, Phone, Mail, MessageCircle, QrCode } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import TrackingTimeline from "@/components/TrackingTimeline";
import LiveChat from "@/components/LiveChat";
import Header from "@/components/Header";
import Logo from "@/components/Logo";

interface TrackingResult {
  trackingId: string;
  currentStatus: string;
  currentLocation?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  packageDescription?: string;
  weight?: number;
  dimensions?: string;
  shippingCost?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt: string;
  trackingEvents: Array<{
    id: number;
    status: string;
    location?: string;
    description: string;
    timestamp: string;
  }>;
}

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    comment: "Incredibly fast delivery! My package from London arrived in just 2 days. The tracking was accurate every step of the way.",
    trackingId: "ST-N00012345",
    date: "2 days ago"
  },
  {
    name: "Ahmed Hassan",
    location: "Dubai, UAE",
    rating: 5,
    comment: "Best logistics service I've used. Real-time updates and excellent customer support. Highly recommended!",
    trackingId: "ST-D00067890",
    date: "1 week ago"
  },
  {
    name: "Maria Santos",
    location: "São Paulo, Brazil",
    rating: 5,
    comment: "Shipnix-Express made international shipping so easy. Professional handling and great communication throughout.",
    trackingId: "ST-B00098765",
    date: "3 days ago"
  },
  {
    name: "James Wilson",
    location: "Sydney, Australia",
    rating: 4,
    comment: "Reliable service with competitive pricing. The QR code tracking feature is really convenient!",
    trackingId: "ST-A00045678",
    date: "5 days ago"
  }
];

export default function PublicTracking() {
  const params = useParams();
  const [trackingId, setTrackingId] = useState(params.id || "");
  const [searchTriggered, setSearchTriggered] = useState(!!params.id);

  useEffect(() => {
    if (params.id) {
      setTrackingId(params.id);
      setSearchTriggered(true);
    }
  }, [params.id]);

  const { data: trackingResult, isLoading, error } = useQuery<TrackingResult>({
    queryKey: ["/api/public/track", trackingId],
    queryFn: async () => {
      const response = await fetch(`/api/public/track/${trackingId}`);
      if (!response.ok) {
        throw new Error('Package not found');
      }
      return response.json();
    },
    enabled: searchTriggered && trackingId.length > 0,
    retry: false,
  });

  const handleTrack = () => {
    if (trackingId.trim() && trackingId.startsWith("ST-")) {
      setSearchTriggered(true);
    } else {
      alert("Please enter a valid tracking ID (starting with ST-)");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTrack();
    }
  };

  const formatPaymentMethod = (method?: string) => {
    const methods = {
      card: "Credit/Debit Card",
      bank_transfer: "Bank Transfer",
      paypal: "PayPal",
      bitcoin: "Bitcoin (BTC)",
      ethereum: "Ethereum (ETH)",
      usdc: "USD Coin (USDC)",
      apple_pay: "Apple Pay"
    };
    return methods[method as keyof typeof methods] || method || "N/A";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <Header showUserMenu={false} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Track Your
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Shipment
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Enter your tracking ID to get real-time updates on your package delivery. 
            We deliver to 220+ countries with full transparency and security.
          </p>
        </div>

        {/* Tracking Search */}
        <Card className="max-w-2xl mx-auto mb-12 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Enter Tracking ID</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">Format: ST-XXXXXXXXX</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="ST-000123456"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  className="text-lg font-mono"
                />
                <Button onClick={handleTrack} className="px-8" disabled={isLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  {isLoading ? "Searching..." : "Track"}
                </Button>
              </div>
              
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => alert("QR Code scanning feature coming soon! For now, please enter your tracking ID manually.")}
                  className="flex items-center gap-2"
                >
                  <QrCode className="h-4 w-4" />
                  Scan QR Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {searchTriggered && (
          <div className="mb-12">
            {isLoading && (
              <Card className="max-w-4xl mx-auto">
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Searching for your package...</p>
                </CardContent>
              </Card>
            )}

            {error && (
              <Card className="max-w-4xl mx-auto border-red-200 dark:border-red-800">
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                    Package Not Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    We couldn't find a package with tracking ID: <strong>{trackingId}</strong>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Please double-check your tracking ID or contact our support team.
                  </p>
                </CardContent>
              </Card>
            )}

            {trackingResult && (
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Package Summary */}
                <Card className="shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold text-blue-600">
                          {trackingResult.trackingId}
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-400">
                          {trackingResult.packageDescription || "Standard Package"}
                        </p>
                      </div>
                      <Badge className="text-lg px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verified
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Sender</h4>
                          <p className="text-gray-600 dark:text-gray-400">{trackingResult.senderName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">{trackingResult.senderAddress}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Package Details</h4>
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            {trackingResult.weight && <p>Weight: {trackingResult.weight} kg</p>}
                            {trackingResult.dimensions && <p>Dimensions: {trackingResult.dimensions}</p>}
                            <p>Payment: {formatPaymentMethod(trackingResult.paymentMethod)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Recipient</h4>
                          <p className="text-gray-600 dark:text-gray-400">{trackingResult.recipientName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500">{trackingResult.recipientAddress}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Delivery Info</h4>
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <p>Shipped: {new Date(trackingResult.createdAt).toLocaleDateString()}</p>
                            {trackingResult.estimatedDelivery && (
                              <p>Est. Delivery: {new Date(trackingResult.estimatedDelivery).toLocaleDateString()}</p>
                            )}
                            {trackingResult.shippingCost && <p>Cost: ${trackingResult.shippingCost}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tracking Timeline */}
                <TrackingTimeline
                  trackingId={trackingResult.trackingId}
                  currentStatus={trackingResult.currentStatus}
                  currentLocation={trackingResult.currentLocation}
                  estimatedDelivery={trackingResult.estimatedDelivery}
                  actualDelivery={trackingResult.actualDelivery}
                  events={trackingResult.trackingEvents}
                  showQR={true}
                />
              </div>
            )}
          </div>
        )}

        {/* Stats & Trust Indicators */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">220+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Countries Served</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">99.8%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Delivery Success</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Live Support</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">4.9/5</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Customer Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Testimonials */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.rating}/5
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
                    "{testimonial.comment}"
                  </p>
                  <div className="border-t pt-3">
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{testimonial.location}</p>
                    <p className="text-xs text-blue-600 font-mono mt-1">{testimonial.trackingId}</p>
                    <p className="text-xs text-gray-400 mt-1">{testimonial.date}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Secure & Insured</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All packages are fully insured and tracked with military-grade security protocols.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Real-Time Updates</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get instant notifications and live tracking updates throughout the delivery journey.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our expert support team is available around the clock to assist you.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help with Your Shipment?</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Our support team is here to help you track and manage your packages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>support@shipnix-express.com</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Chat */}
      <LiveChat />
    </div>
  );
}