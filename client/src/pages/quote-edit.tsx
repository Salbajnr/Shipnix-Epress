import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  FileText, 
  DollarSign, 
  Save, 
  ArrowLeft,
  User,
  MapPin,
  Package
} from "lucide-react";
import Header from "@/components/Header";
import { Link } from "wouter";

interface Quote {
  id: number;
  quoteNumber: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  senderAddress: string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientAddress: string;
  packageDescription?: string;
  weight: number;
  dimensions?: string;
  deliveryTimeSlot?: string;
  baseCost: number;
  deliveryFee: number;
  totalCost: number;
  status: string;
  validUntil: string;
  createdAt: string;
}

const DELIVERY_TIME_SLOTS = {
  morning: { label: "Morning (8AM - 12PM)", fee: 0 },
  afternoon: { label: "Afternoon (12PM - 5PM)", fee: 5 },
  evening: { label: "Evening (5PM - 8PM)", fee: 15 },
  express: { label: "Express (Same Day)", fee: 25 },
  weekend: { label: "Weekend Delivery", fee: 20 },
};

export default function QuoteEdit() {
  const [match, params] = useRoute("/quotes/:id/edit");
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [editData, setEditData] = useState<Partial<Quote>>({});
  
  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
    return null;
  }

  const quoteId = params?.id ? parseInt(params.id) : null;

  const { data: quote, isLoading: quoteLoading } = useQuery({
    queryKey: ["/api/quotes", quoteId],
    enabled: !!quoteId,
    retry: false,
  });

  useEffect(() => {
    if (quote) {
      setEditData(quote);
    }
  }, [quote]);

  const updateQuoteMutation = useMutation({
    mutationFn: async (updateData: Partial<Quote>) => {
      return apiRequest("PATCH", `/api/quotes/${quoteId}`, updateData);
    },
    onSuccess: () => {
      toast({
        title: "Quote Updated",
        description: "Quote has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes", quoteId] });
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
        description: "Failed to update quote",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof Quote, value: any) => {
    setEditData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalculate costs if weight or delivery slot changes
      if (field === 'weight' || field === 'deliveryTimeSlot') {
        const weight = field === 'weight' ? parseFloat(value) || 0 : parseFloat(String(prev.weight)) || 0;
        const timeSlot = field === 'deliveryTimeSlot' ? value : prev.deliveryTimeSlot || 'morning';
        
        const baseCost = Math.max(15, weight * 2.5);
        const deliveryFee = DELIVERY_TIME_SLOTS[timeSlot as keyof typeof DELIVERY_TIME_SLOTS]?.fee || 0;
        const totalCost = baseCost + deliveryFee;
        
        updated.baseCost = baseCost;
        updated.deliveryFee = deliveryFee;
        updated.totalCost = totalCost;
      }
      
      return updated;
    });
  };

  const handleSave = () => {
    if (!editData.senderName || !editData.senderEmail || !editData.recipientName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    updateQuoteMutation.mutate(editData);
  };

  if (isLoading || quoteLoading) {
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

  if (!quote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Quote not found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The requested quote could not be found.
              </p>
              <Link href="/quotes">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Quotes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/quotes">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Edit Quote #{quote.quoteNumber}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Modify quote details and pricing
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Edit Form */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Quote Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sender Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Sender Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="senderName">Full Name *</Label>
                        <Input
                          id="senderName"
                          value={editData.senderName || ""}
                          onChange={(e) => handleInputChange('senderName', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="senderEmail">Email *</Label>
                        <Input
                          id="senderEmail"
                          type="email"
                          value={editData.senderEmail || ""}
                          onChange={(e) => handleInputChange('senderEmail', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="senderPhone">Phone</Label>
                        <Input
                          id="senderPhone"
                          value={editData.senderPhone || ""}
                          onChange={(e) => handleInputChange('senderPhone', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="senderAddress">Pickup Address *</Label>
                      <Textarea
                        id="senderAddress"
                        value={editData.senderAddress || ""}
                        onChange={(e) => handleInputChange('senderAddress', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Recipient Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Recipient Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="recipientName">Full Name *</Label>
                        <Input
                          id="recipientName"
                          value={editData.recipientName || ""}
                          onChange={(e) => handleInputChange('recipientName', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="recipientEmail">Email</Label>
                        <Input
                          id="recipientEmail"
                          type="email"
                          value={editData.recipientEmail || ""}
                          onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="recipientPhone">Phone</Label>
                        <Input
                          id="recipientPhone"
                          value={editData.recipientPhone || ""}
                          onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="recipientAddress">Delivery Address *</Label>
                      <Textarea
                        id="recipientAddress"
                        value={editData.recipientAddress || ""}
                        onChange={(e) => handleInputChange('recipientAddress', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Package Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Package Information
                    </h3>
                    <div>
                      <Label htmlFor="packageDescription">Package Description</Label>
                      <Textarea
                        id="packageDescription"
                        value={editData.packageDescription || ""}
                        onChange={(e) => handleInputChange('packageDescription', e.target.value)}
                        rows={2}
                        placeholder="Documents, clothing, electronics, etc."
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="weight">Weight (kg) *</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.1"
                          value={editData.weight || ""}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dimensions">Dimensions</Label>
                        <Input
                          id="dimensions"
                          value={editData.dimensions || ""}
                          onChange={(e) => handleInputChange('dimensions', e.target.value)}
                          placeholder="L x W x H (cm)"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="deliveryTimeSlot">Delivery Time Slot</Label>
                      <Select 
                        value={editData.deliveryTimeSlot || ""} 
                        onValueChange={(value) => handleInputChange('deliveryTimeSlot', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select delivery time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(DELIVERY_TIME_SLOTS).map(([value, { label, fee }]) => (
                            <SelectItem key={value} value={value}>
                              {label} {fee > 0 && `(+$${fee})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button 
                      onClick={handleSave}
                      disabled={updateQuoteMutation.isPending}
                      className="flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateQuoteMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                    <Link href="/quotes">
                      <Button variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pricing Summary */}
            <div className="md:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Updated Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Base Shipping:</span>
                    <span>${(editData.baseCost || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>${(editData.deliveryFee || 0).toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${(editData.totalCost || 0).toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Valid until: {new Date(editData.validUntil || quote.validUntil).toLocaleDateString()}</p>
                    <p>Status: <span className="capitalize">{editData.status || quote.status}</span></p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}