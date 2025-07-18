import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Truck, MapPin, Clock, Edit, LogOut, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import shipnixLogo from "@/assets/shipnix-logo.png";
import { PACKAGE_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES } from "@shared/schema";
import type { Package as PackageType } from "@shared/schema";

interface PackageFormData {
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  senderEmail: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;
  recipientEmail: string;
  packageDescription: string;
  weight: string;
  dimensions: string;
  shippingCost: string;
  paymentMethod: string;
  estimatedDelivery: string;
}

export default function Home() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [formData, setFormData] = useState<PackageFormData>({
    senderName: "",
    senderAddress: "",
    senderPhone: "",
    senderEmail: "",
    recipientName: "",
    recipientAddress: "",
    recipientPhone: "",
    recipientEmail: "",
    packageDescription: "",
    weight: "",
    dimensions: "",
    shippingCost: "",
    paymentMethod: "card",
    estimatedDelivery: "",
  });

  const { data: packages = [], isLoading } = useQuery<PackageType[]>({
    queryKey: ["/api/packages"],
  });

  const createPackageMutation = useMutation({
    mutationFn: async (data: PackageFormData) => {
      const payload = {
        ...data,
        weight: data.weight ? parseFloat(data.weight) : null,
        shippingCost: data.shippingCost ? parseFloat(data.shippingCost) : null,
        estimatedDelivery: data.estimatedDelivery ? new Date(data.estimatedDelivery).toISOString() : null,
      };
      return await apiRequest("/api/packages", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      setShowCreateForm(false);
      resetForm();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, location }: { id: number; status: string; location?: string }) => {
      return await apiRequest(`/api/packages/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, location }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      setSelectedPackage(null);
    },
  });

  const resetForm = () => {
    setFormData({
      senderName: "",
      senderAddress: "",
      senderPhone: "",
      senderEmail: "",
      recipientName: "",
      recipientAddress: "",
      recipientPhone: "",
      recipientEmail: "",
      packageDescription: "",
      weight: "",
      dimensions: "",
      shippingCost: "",
      paymentMethod: "card",
      estimatedDelivery: "",
    });
  };

  const handleInputChange = (field: keyof PackageFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreatePackage = () => {
    createPackageMutation.mutate(formData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "out_for_delivery": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "in_transit": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "failed_delivery": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "picked_up": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src={shipnixLogo} 
                alt="Shipnix-Express" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Global Logistics Management Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user?.firstName || user?.email || "Admin"}
                </span>
              </div>
              <Button variant="outline" asChild>
                <a href="/api/logout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Packages</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{packages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Truck className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Transit</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {packages.filter(p => p.currentStatus === "in_transit").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivered</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {packages.filter(p => p.currentStatus === "delivered").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {packages.filter(p => ["created", "picked_up"].includes(p.currentStatus)).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Package Management</h2>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Package
          </Button>
        </div>

        {/* Create Package Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Package</CardTitle>
              <CardDescription>Generate a new tracking ID and package entry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sender Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Sender Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="senderName">Name *</Label>
                      <Input
                        id="senderName"
                        value={formData.senderName}
                        onChange={(e) => handleInputChange("senderName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="senderAddress">Address *</Label>
                      <Textarea
                        id="senderAddress"
                        value={formData.senderAddress}
                        onChange={(e) => handleInputChange("senderAddress", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="senderPhone">Phone</Label>
                      <Input
                        id="senderPhone"
                        value={formData.senderPhone}
                        onChange={(e) => handleInputChange("senderPhone", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="senderEmail">Email</Label>
                      <Input
                        id="senderEmail"
                        type="email"
                        value={formData.senderEmail}
                        onChange={(e) => handleInputChange("senderEmail", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Recipient Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Recipient Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="recipientName">Name *</Label>
                      <Input
                        id="recipientName"
                        value={formData.recipientName}
                        onChange={(e) => handleInputChange("recipientName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipientAddress">Address *</Label>
                      <Textarea
                        id="recipientAddress"
                        value={formData.recipientAddress}
                        onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipientPhone">Phone</Label>
                      <Input
                        id="recipientPhone"
                        value={formData.recipientPhone}
                        onChange={(e) => handleInputChange("recipientPhone", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipientEmail">Email</Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        value={formData.recipientEmail}
                        onChange={(e) => handleInputChange("recipientEmail", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Package Details */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-semibold">Package Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="packageDescription">Description</Label>
                      <Input
                        id="packageDescription"
                        value={formData.packageDescription}
                        onChange={(e) => handleInputChange("packageDescription", e.target.value)}
                        placeholder="e.g., Electronics, Books"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dimensions">Dimensions (LxWxH cm)</Label>
                      <Input
                        id="dimensions"
                        value={formData.dimensions}
                        onChange={(e) => handleInputChange("dimensions", e.target.value)}
                        placeholder="e.g., 30x20x10"
                      />
                    </div>
                  </div>

                  {/* Shipping & Payment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shippingCost">Shipping Cost ($)</Label>
                      <Input
                        id="shippingCost"
                        type="number"
                        step="0.01"
                        value={formData.shippingCost}
                        onChange={(e) => handleInputChange("shippingCost", e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleInputChange("paymentMethod", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                          <SelectItem value="usdc">USD Coin (USDC)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="estimatedDelivery">Estimated Delivery Date</Label>
                    <Input
                      id="estimatedDelivery"
                      type="datetime-local"
                      value={formData.estimatedDelivery}
                      onChange={(e) => handleInputChange("estimatedDelivery", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreatePackage}
                  disabled={createPackageMutation.isPending || !formData.senderName || !formData.recipientName}
                >
                  {createPackageMutation.isPending ? "Creating..." : "Create Package"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Packages List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Packages</CardTitle>
            <CardDescription>Manage and track all packages in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No packages found. Create your first package to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-mono text-lg font-semibold">{pkg.trackingId}</span>
                          <Badge className={getStatusColor(pkg.currentStatus)}>
                            {formatStatus(pkg.currentStatus)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <div>
                            <span className="font-medium">From:</span> {pkg.senderName}
                          </div>
                          <div>
                            <span className="font-medium">To:</span> {pkg.recipientName}
                          </div>
                          <div>
                            <span className="font-medium">Description:</span> {pkg.packageDescription || "N/A"}
                          </div>
                          <div>
                            <span className="font-medium">Cost:</span> {pkg.shippingCost ? `$${pkg.shippingCost}` : "N/A"}
                          </div>
                          <div>
                            <span className="font-medium">Payment:</span> {formatPaymentMethod(pkg.paymentMethod)}
                          </div>
                          <div>
                            <span className="font-medium">Created:</span> {new Date(pkg.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        {pkg.currentLocation && (
                          <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
                            <MapPin className="h-3 w-3 mr-1" />
                            Current Location: {pkg.currentLocation}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 mt-4 sm:mt-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Update Status
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Update Status Modal */}
        {selectedPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Update Package Status</CardTitle>
                <CardDescription>
                  Update status for {selectedPackage.trackingId}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">New Status</Label>
                    <Select defaultValue={selectedPackage.currentStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PACKAGE_STATUSES).map((status) => (
                          <SelectItem key={status} value={status}>
                            {formatStatus(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location">Current Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Distribution Center, New York"
                      defaultValue={selectedPackage.currentLocation || ""}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <Button variant="outline" onClick={() => setSelectedPackage(null)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      const statusSelect = document.querySelector('[role="combobox"]') as HTMLElement;
                      const locationInput = document.getElementById('location') as HTMLInputElement;
                      const status = statusSelect?.getAttribute('aria-labelledby')?.includes(selectedPackage.currentStatus) 
                        ? selectedPackage.currentStatus 
                        : PACKAGE_STATUSES.IN_TRANSIT;
                      
                      updateStatusMutation.mutate({
                        id: selectedPackage.id,
                        status,
                        location: locationInput?.value || undefined,
                      });
                    }}
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}