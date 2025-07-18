import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, MapPin, Clock, Shield, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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

  const { data: trackingResult, isLoading, error } = useQuery<TrackingResult>({
    queryKey: ["/api/track", trackingId],
    enabled: searchTriggered && trackingId.length > 0,
    retry: false,
  });

  const handleTrack = () => {
    if (trackingId.trim()) {
      setSearchTriggered(true);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Shipnix-Express</span>
            </div>
            <Button asChild>
              <a href="/api/login">Admin Login</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Global Logistics Solutions
            <span className="block text-blue-600 dark:text-blue-400">Fast & Secure Delivery</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            Delivering to over 220 countries and territories worldwide. Track your shipment in real-time with our advanced logistics platform.
          </p>

          {/* Tracking Input */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Track Your Shipment
              </CardTitle>
              <CardDescription>
                Enter your Shipnix-Express tracking ID (format: ST-XXXXXXXXX)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="ST-ABC123DEF"
                  value={trackingId}
                  onChange={(e) => {
                    setTrackingId(e.target.value.toUpperCase());
                    setSearchTriggered(false);
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                  className="text-lg"
                />
                <Button onClick={handleTrack} disabled={isLoading || !trackingId.trim()}>
                  {isLoading ? "Tracking..." : "Track"}
                </Button>
              </div>
            </CardContent>
          </Card>

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

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose Shipnix-Express?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <Truck className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Global Network</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Delivering to over 220 countries and territories with our extensive logistics network
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Shield className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fast & Secure</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Advanced security measures with fast, dependable delivery solutions worldwide
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Clock className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Contract Logistics</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Comprehensive freight services and supply chain management solutions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Package className="h-6 w-6" />
            <span className="text-xl font-bold">Shipnix-Express</span>
          </div>
          <p className="text-gray-400">
            Global logistics solutions - connecting businesses to over 220 countries worldwide
          </p>
        </div>
      </footer>
    </div>
  );
}