import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  FileText, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  User,
  MapPin
} from "lucide-react";
import Header from "@/components/Header";
import { Link } from "wouter";

interface Quote {
  id: number;
  quoteNumber: string;
  senderName: string;
  senderEmail: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  packageDescription: string;
  weight: number;
  totalCost: number;
  baseCost: number;
  deliveryFee: number;
  deliveryTimeSlot: string;
  status: string;
  validUntil: string;
  createdAt: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800", 
  expired: "bg-red-100 text-red-800",
  converted_to_invoice: "bg-blue-100 text-blue-800",
};

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  expired: AlertCircle,
  converted_to_invoice: FileText,
};

export default function QuoteManagement() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  
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

  const { data: quotes, isLoading: quotesLoading } = useQuery({
    queryKey: ["/api/quotes"],
    retry: false,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/quotes/${id}/status`, { status });
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Quote Updated",
        description: `Quote status changed to ${variables.status}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
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
        description: "Failed to update quote status",
        variant: "destructive",
      });
    },
  });

  const convertToInvoiceMutation = useMutation({
    mutationFn: async (quoteId: number) => {
      return apiRequest("POST", `/api/quotes/${quoteId}/convert-to-invoice`);
    },
    onSuccess: (data) => {
      toast({
        title: "Invoice Created",
        description: `Invoice ${data.invoice.invoiceNumber} has been sent to the customer`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
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
        description: "Failed to convert quote to invoice",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (quoteId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: quoteId, status: newStatus });
  };

  const handleConvertToInvoice = (quoteId: number) => {
    convertToInvoiceMutation.mutate(quoteId);
  };

  if (isLoading || quotesLoading) {
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
                Quote Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage shipping quotes and convert approved quotes to invoices
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {quotes?.length || 0} Total Quotes
            </Badge>
          </div>

          <div className="grid gap-6">
            {quotes?.map((quote: Quote) => {
              const StatusIcon = statusIcons[quote.status as keyof typeof statusIcons] || Clock;
              const isExpired = new Date(quote.validUntil) < new Date();
              
              return (
                <Card key={quote.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <FileText className="h-6 w-6 text-blue-600" />
                        <div>
                          <CardTitle className="text-xl">Quote #{quote.quoteNumber}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Created {new Date(quote.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          className={statusColors[quote.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {quote.status.replace("_", " ").toUpperCase()}
                        </Badge>
                        {isExpired && quote.status === "pending" && (
                          <Badge variant="destructive">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            EXPIRED
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Quote Details */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                            <User className="h-4 w-4" />
                            SENDER
                          </h4>
                          <p className="font-medium">{quote.senderName}</p>
                          <p className="text-sm text-gray-600">{quote.senderEmail}</p>
                          <p className="text-sm text-gray-600 flex items-start gap-1">
                            <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                            {quote.senderAddress}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            RECIPIENT
                          </h4>
                          <p className="font-medium">{quote.recipientName}</p>
                          <p className="text-sm text-gray-600 flex items-start gap-1">
                            <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                            {quote.recipientAddress}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Package & Pricing */}
                    <div className="border-t pt-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">PACKAGE</h4>
                          <p className="text-sm">{quote.packageDescription || "Standard package"}</p>
                          <p className="text-sm text-gray-600">{quote.weight}kg</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1">DELIVERY</h4>
                          <p className="text-sm capitalize">{quote.deliveryTimeSlot?.replace("_", " ")}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            PRICING
                          </h4>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Base cost:</span>
                              <span>${quote.baseCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Delivery fee:</span>
                              <span>${quote.deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                              <span>Total:</span>
                              <span>${quote.totalCost.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        Valid until: {new Date(quote.validUntil).toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {quote.status === "pending" && !isExpired && (
                          <>
                            <Link href={`/quotes/${quote.id}/edit`}>
                              <Button variant="outline" size="sm">
                                Edit Quote
                              </Button>
                            </Link>
                            <Select onValueChange={(value) => handleStatusChange(quote.id, value)}>
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Change status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="approved">Approve</SelectItem>
                                <SelectItem value="expired">Mark Expired</SelectItem>
                              </SelectContent>
                            </Select>
                          </>
                        )}
                        
                        {quote.status === "approved" && (
                          <Button 
                            onClick={() => handleConvertToInvoice(quote.id)}
                            disabled={convertToInvoiceMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {convertToInvoiceMutation.isPending ? "Converting..." : "Convert to Invoice"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {(!quotes || quotes.length === 0) && (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No quotes found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    New quote requests will appear here for review and approval.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}