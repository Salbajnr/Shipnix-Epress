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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Receipt, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  User,
  Mail,
  CreditCard,
  Plus,
  Package
} from "lucide-react";
import Header from "@/components/Header";

interface Invoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentStatus: string;
  dueDate: string;
  description: string;
  quoteId?: number;
  createdAt: string;
  paidAt?: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800", 
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const statusIcons = {
  pending: Clock,
  paid: CheckCircle,
  overdue: AlertCircle,
  cancelled: AlertCircle,
};

export default function InvoiceManagement() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    customerName: "",
    customerEmail: "",
    amount: "",
    description: "",
    dueDate: "",
  });
  
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

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ["/api/invoices"],
    retry: false,
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: any) => {
      return apiRequest("POST", "/api/invoices", invoiceData);
    },
    onSuccess: () => {
      toast({
        title: "Invoice Created",
        description: "New invoice has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      setShowCreateDialog(false);
      setNewInvoice({
        customerName: "",
        customerEmail: "",
        amount: "",
        description: "",
        dueDate: "",
      });
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
        description: "Failed to create invoice",
        variant: "destructive",
      });
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: async (invoiceId: number) => {
      return apiRequest("PATCH", `/api/invoices/${invoiceId}/mark-paid`);
    },
    onSuccess: (data) => {
      toast({
        title: "Payment Confirmed",
        description: data.trackingId 
          ? `Payment confirmed! Package created with tracking ID: ${data.trackingId}` 
          : "Payment has been marked as received",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
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
        description: "Failed to mark invoice as paid",
        variant: "destructive",
      });
    },
  });

  const handleCreateInvoice = () => {
    if (!newInvoice.customerName || !newInvoice.customerEmail || !newInvoice.amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createInvoiceMutation.mutate({
      ...newInvoice,
      amount: parseFloat(newInvoice.amount),
      dueDate: newInvoice.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  const handleMarkPaid = (invoiceId: number) => {
    markPaidMutation.mutate(invoiceId);
  };

  if (isLoading || invoicesLoading) {
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
                Invoice Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Create, manage, and track customer invoices and payments
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {invoices?.length || 0} Total Invoices
              </Badge>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input
                        id="customerName"
                        value={newInvoice.customerName}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, customerName: e.target.value }))}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Customer Email *</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={newInvoice.customerEmail}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, customerEmail: e.target.value }))}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount ($) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        value={newInvoice.amount}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="100.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newInvoice.description}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Shipping services for package delivery"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newInvoice.dueDate}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={handleCreateInvoice}
                        disabled={createInvoiceMutation.isPending}
                        className="flex-1"
                      >
                        {createInvoiceMutation.isPending ? "Creating..." : "Create Invoice"}
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

          <div className="grid gap-6">
            {invoices?.map((invoice: Invoice) => {
              const StatusIcon = statusIcons[invoice.paymentStatus as keyof typeof statusIcons] || Clock;
              const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.paymentStatus === "pending";
              const statusToShow = isOverdue ? "overdue" : invoice.paymentStatus;
              
              return (
                <Card key={invoice.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Receipt className="h-6 w-6 text-blue-600" />
                        <div>
                          <CardTitle className="text-xl">Invoice #{invoice.invoiceNumber}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Created {new Date(invoice.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          className={statusColors[statusToShow as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusToShow.toUpperCase()}
                        </Badge>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            ${invoice.amount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Customer Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                          <User className="h-4 w-4" />
                          CUSTOMER
                        </h4>
                        <p className="font-medium">{invoice.customerName}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {invoice.customerEmail}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          PAYMENT DETAILS
                        </h4>
                        <p className="text-sm">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                        {invoice.paidAt && (
                          <p className="text-sm text-green-600">
                            Paid: {new Date(invoice.paidAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {invoice.description && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">DESCRIPTION</h4>
                        <p className="text-sm">{invoice.description}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="border-t pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {invoice.quoteId && (
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            From Quote #{invoice.quoteId}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {invoice.paymentStatus === "pending" && (
                          <Button 
                            onClick={() => handleMarkPaid(invoice.id)}
                            disabled={markPaidMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            {markPaidMutation.isPending ? "Processing..." : "Mark as Paid"}
                          </Button>
                        )}
                        
                        {invoice.paymentStatus === "paid" && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Payment Received
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {(!invoices || invoices.length === 0) && (
              <Card>
                <CardContent className="text-center py-12">
                  <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No invoices found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create your first invoice to start tracking payments.
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Invoice
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