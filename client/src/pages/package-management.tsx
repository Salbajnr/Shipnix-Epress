import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Package,
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User,
  Mail,
  Phone,
  QrCode,
  Edit,
  Plus,
  Calendar
} from "lucide-react";
import Header from "@/components/Header";

interface PackageType {
  id: number;
  trackingId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  recipientAddress: string;
  description: string;
  weight: number;
  dimensions: string;
  currentStatus: string;
  currentLocation: string;
  paymentStatus: string;
  shippingCost: number;
  estimatedDelivery: string;
  actualDelivery?: string;
  createdAt: string;
  qrCode: string;
}

const PACKAGE_STATUSES = {
  pending_payment: { label: "Pending Payment", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  created: { label: "Created", color: "bg-blue-100 text-blue-800", icon: Package },
  picked_up: { label: "Picked Up", color: "bg-orange-100 text-orange-800", icon: Truck },
  in_transit: { label: "In Transit", color: "bg-purple-100 text-purple-800", icon: Truck },
  out_for_delivery: { label: "Out for Delivery", color: "bg-indigo-100 text-indigo-800", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  failed_delivery: { label: "Failed Delivery", color: "bg-red-100 text-red-800", icon: AlertCircle },
  returned: { label: "Returned", color: "bg-gray-100 text-gray-800", icon: AlertCircle },
};

export default function PackageManagement() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    location: "",
    description: "",
  });
  const [newPackage, setNewPackage] = useState({
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    senderAddress: "",
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
    recipientAddress: "",
    description: "",
    weight: "",
    dimensions: "",
    shippingCost: "",
    estimatedDelivery: "",
  });
  
  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  const { data: packages, isLoading: packagesLoading } = useQuery({
    queryKey: ["/api/packages"],
    retry: false,
  });

  const createPackageMutation = useMutation({
    mutationFn: async (packageData: any) => {
      return apiRequest("POST", "/api/packages", packageData);
    },
    onSuccess: (data) => {
      toast({
        title: "Package Created Successfully",
        description: `Tracking ID: ${data.trackingId}. QR code generated for easy tracking.`,
      });
      console.log("Package created:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      setShowCreateDialog(false);
      setNewPackage({
        senderName: "",
        senderEmail: "",
        senderPhone: "",
        senderAddress: "",
        recipientName: "",
        recipientEmail: "",
        recipientPhone: "",
        recipientAddress: "",
        description: "",
        weight: "",
        dimensions: "",
        shippingCost: "",
        estimatedDelivery: "",
      });
      
      // Show detailed success message with tracking information
      setTimeout(() => {
        alert(`Package Created Successfully!\n\nTracking ID: ${data.trackingId}\n\nCustomers can track this package at:\n/public-tracking\n\nQR Code has been generated for easy tracking.`);
      }, 100);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create package",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ packageId, statusData }: { packageId: number; statusData: any }) => {
      return apiRequest("PATCH", `/api/packages/${packageId}/status`, statusData);
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Package status has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      setShowStatusDialog(false);
      setStatusUpdate({ status: "", location: "", description: "" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update package status",
        variant: "destructive",
      });
    },
  });

  const handleCreatePackage = () => {
    if (!newPackage.senderName || !newPackage.senderEmail || !newPackage.recipientName || !newPackage.recipientAddress) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createPackageMutation.mutate({
      ...newPackage,
      weight: parseFloat(newPackage.weight) || 0,
      shippingCost: parseFloat(newPackage.shippingCost) || 0,
      paymentStatus: "paid", // Admin-created packages are marked as paid
      currentStatus: "created",
    });
  };

  const handleStatusUpdate = () => {
    if (!selectedPackage || !statusUpdate.status) {
      toast({
        title: "Validation Error",
        description: "Please select a status",
        variant: "destructive",
      });
      return;
    }

    updateStatusMutation.mutate({
      packageId: selectedPackage.id,
      statusData: {
        status: statusUpdate.status,
        location: statusUpdate.location,
        description: statusUpdate.description,
      },
    });
  };

  const openStatusDialog = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setStatusUpdate({
      status: "",
      location: pkg.currentLocation || "",
      description: "",
    });
    setShowStatusDialog(true);
  };

  if (isLoading || packagesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Package Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Create packages, update delivery status, and manage tracking
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {packages?.length || 0} Total Packages
              </Badge>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Package
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Package</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Sender Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Sender Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="senderName">Name *</Label>
                          <Input
                            id="senderName"
                            value={newPackage.senderName}
                            onChange={(e) => setNewPackage(prev => ({ ...prev, senderName: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="senderEmail">Email *</Label>
                          <Input
                            id="senderEmail"
                            type="email"
                            value={newPackage.senderEmail}
                            onChange={(e) => setNewPackage(prev => ({ ...prev, senderEmail: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="senderPhone">Phone</Label>
                          <Input
                            id="senderPhone"
                            value={newPackage.senderPhone}
                            onChange={(e) => setNewPackage(prev => ({ ...prev, senderPhone: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="senderAddress">Address *</Label>
                        <Textarea
                          id="senderAddress"
                          value={newPackage.senderAddress}
                          onChange={(e) => setNewPackage(prev => ({ ...prev, senderAddress: e.target.value }))}
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* Recipient Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Recipient Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="recipientName">Name *</Label>
                          <Input
                            id="recipientName"
                            value={newPackage.recipientName}
                            onChange={(e) => setNewPackage(prev => ({ ...prev, recipientName: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="recipientEmail">Email</Label>
                          <Input
                            id="recipientEmail"
                            type="email"
                            value={newPackage.recipientEmail}
                            onChange={(e) => setNewPackage(prev => ({ ...prev, recipientEmail: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="recipientPhone">Phone</Label>
                          <Input
                            id="recipientPhone"
                            value={newPackage.recipientPhone}
                            onChange={(e) => setNewPackage(prev => ({ ...prev, recipientPhone: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="recipientAddress">Address *</Label>
                        <Textarea
                          id="recipientAddress"
                          value={newPackage.recipientAddress}
                          onChange={(e) => setNewPackage(prev => ({ ...prev, recipientAddress: e.target.value }))}
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Package Details</h3>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newPackage.description}
                          onChange={(e) => setNewPackage(prev => ({ ...prev, description: e.target.value }))}
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            value={newPackage.weight}
                            onChange={(e) => setNewPackage(prev => ({ ...prev, weight: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dimensions">Dimensions</Label>
                          <Input
                            id="dimensions"
                            value={newPackage.dimensions}
                            onChange={(e) => setNewPackage(prev => ({ ...prev, dimensions: e.target.value }))}
                            placeholder="L x W x H"
                          />
                        </div>
                        <div>
                          <Label htmlFor="shippingCost">Cost ($)</Label>
                          <Input
                            id="shippingCost"
                            type="number"
                            step="0.01"
                            value={newPackage.shippingCost}
                            onChange={(e) => setNewPackage(prev => ({ ...prev, shippingCost: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
                        <Input
                          id="estimatedDelivery"
                          type="date"
                          value={newPackage.estimatedDelivery}
                          onChange={(e) => setNewPackage(prev => ({ ...prev, estimatedDelivery: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={handleCreatePackage}
                        disabled={createPackageMutation.isPending}
                        className="flex-1"
                      >
                        {createPackageMutation.isPending ? "Creating..." : "Create Package"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowCreateDialog(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Status Update Dialog */}
          <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Package Status</DialogTitle>
              </DialogHeader>
              {selectedPackage && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Tracking ID: <span className="font-mono">{selectedPackage.trackingId}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Current Status: <span className="capitalize">{selectedPackage.currentStatus.replace('_', ' ')}</span>
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="newStatus">New Status *</Label>
                    <Select value={statusUpdate.status} onValueChange={(value) => setStatusUpdate(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PACKAGE_STATUSES).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={statusUpdate.location}
                      onChange={(e) => setStatusUpdate(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Current location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="statusDescription">Description</Label>
                    <Textarea
                      id="statusDescription"
                      value={statusUpdate.description}
                      onChange={(e) => setStatusUpdate(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Additional details about this status update"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleStatusUpdate}
                      disabled={updateStatusMutation.isPending}
                      className="flex-1"
                    >
                      {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowStatusDialog(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <div className="grid gap-6">
            {packages?.map((pkg: PackageType) => {
              const statusInfo = PACKAGE_STATUSES[pkg.currentStatus as keyof typeof PACKAGE_STATUSES];
              const StatusIcon = statusInfo?.icon || Package;
              
              return (
                <Card key={pkg.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Package className="h-6 w-6 text-blue-600" />
                        <div>
                          <CardTitle className="text-xl font-mono">{pkg.trackingId}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Created {new Date(pkg.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={statusInfo?.color || "bg-gray-100 text-gray-800"}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo?.label || pkg.currentStatus}
                        </Badge>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            ${pkg.shippingCost.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Sender & Recipient */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                          <User className="h-4 w-4" />
                          SENDER
                        </h4>
                        <p className="font-medium">{pkg.senderName}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {pkg.senderEmail}
                        </p>
                        {pkg.senderPhone && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {pkg.senderPhone}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 flex items-start gap-1 mt-1">
                          <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                          {pkg.senderAddress}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          RECIPIENT
                        </h4>
                        <p className="font-medium">{pkg.recipientName}</p>
                        {pkg.recipientEmail && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {pkg.recipientEmail}
                          </p>
                        )}
                        {pkg.recipientPhone && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {pkg.recipientPhone}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 flex items-start gap-1 mt-1">
                          <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                          {pkg.recipientAddress}
                        </p>
                      </div>
                    </div>

                    {/* Package Info */}
                    <div className="border-t pt-4">
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">DESCRIPTION</h4>
                          <p className="text-sm">{pkg.description || "Package"}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">WEIGHT</h4>
                          <p className="text-sm">{pkg.weight}kg</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">DIMENSIONS</h4>
                          <p className="text-sm">{pkg.dimensions || "N/A"}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">DELIVERY</h4>
                          <p className="text-sm">
                            {pkg.estimatedDelivery ? new Date(pkg.estimatedDelivery).toLocaleDateString() : "TBD"}
                          </p>
                          {pkg.actualDelivery && (
                            <p className="text-sm text-green-600">
                              Delivered: {new Date(pkg.actualDelivery).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Current Location */}
                    {pkg.currentLocation && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Current Location:</span>
                          <span className="text-sm">{pkg.currentLocation}</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="border-t pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {pkg.qrCode && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <QrCode className="h-3 w-3" />
                            QR Code Generated
                          </Badge>
                        )}
                        <Badge variant="outline" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {pkg.paymentStatus}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-mono">
                          Public Tracking: /public-tracking?track={pkg.trackingId}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Button 
                          onClick={() => window.open(`/public-tracking?track=${pkg.trackingId}`, '_blank')}
                          variant="secondary"
                          size="sm"
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Test Tracking
                        </Button>
                        <Button 
                          onClick={() => openStatusDialog(pkg)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Update Status
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {(!packages || packages.length === 0) && (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No packages found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create your first package to start tracking shipments.
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Package
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}