import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Package, Plus, MapPin, Calendar as CalendarIcon, CreditCard, Mail, Phone, User, Building2, Truck, AlertCircle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertPackageSchema, PAYMENT_METHODS, PACKAGE_TYPES, SERVICE_LEVELS } from "@shared/schema";
import type { InsertPackage } from "@shared/schema";

interface CreatePackageFormProps {
  onSuccess?: () => void;
  triggerButton?: React.ReactNode;
}

export default function CreatePackageForm({ onSuccess, triggerButton }: CreatePackageFormProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertPackage>({
    resolver: zodResolver(insertPackageSchema),
    defaultValues: {
      packageType: PACKAGE_TYPES.STANDARD,
      serviceLevel: SERVICE_LEVELS.STANDARD,
      paymentMethod: PAYMENT_METHODS.CARD,
      requiresSignature: false,
      insuranceValue: "0",
      declaredValue: "0",
      shippingCost: "0",
      weight: "0",
      length: "0",
      width: "0",
      height: "0",
    },
  });

  const createPackageMutation = useMutation({
    mutationFn: async (data: InsertPackage) => {
      return apiRequest("/api/packages", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: (newPackage) => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/packages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/packages"] });
      
      toast({
        title: "Package Created Successfully!",
        description: `Package ${newPackage.trackingId} has been created. Email notification sent to recipient.`,
      });
      
      setOpen(false);
      form.reset();
      setStep(1);
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Package Creation Failed",
        description: error.message || "Failed to create package. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPackage) => {
    // Calculate estimated delivery (7 days from now for standard, 3 days for express)
    const daysToAdd = data.serviceLevel === SERVICE_LEVELS.EXPRESS ? 3 : 7;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + daysToAdd);
    
    createPackageMutation.mutate({
      ...data,
      estimatedDelivery,
    });
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Sender & Recipient Information";
      case 2: return "Package Details & Shipping";
      case 3: return "Review & Confirm";
      default: return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Package
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Create New Package
          </DialogTitle>
          <DialogDescription>
            {getStepTitle()}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                stepNum === step ? "bg-blue-600 text-white" :
                stepNum < step ? "bg-green-500 text-white" :
                "bg-gray-200 text-gray-600"
              )}>
                {stepNum < step ? <CheckCircle className="h-4 w-4" /> : stepNum}
              </div>
              {stepNum < 3 && (
                <div className={cn(
                  "w-16 h-1 mx-2",
                  stepNum < step ? "bg-green-500" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Step 1: Sender & Recipient */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sender Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-4 w-4" />
                        Sender Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="senderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="John Doe" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="senderPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="+1 (555) 123-4567" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="senderEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="john@example.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="senderAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} placeholder="123 Main St, City, State, ZIP Code" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Recipient Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin className="h-4 w-4" />
                        Recipient Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="recipientName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Jane Smith" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="recipientPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="+1 (555) 987-6543" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="recipientEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="jane@example.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="recipientAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Address</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} placeholder="456 Oak Ave, City, State, ZIP Code" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 2: Package Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Package Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Package className="h-4 w-4" />
                        Package Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="packageDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} placeholder="Electronics, documents, clothing, etc." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="packageType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Package Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.entries(PACKAGE_TYPES).map(([key, value]) => (
                                    <SelectItem key={value} value={value}>
                                      {key.charAt(0) + key.slice(1).toLowerCase()}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight (kg)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" step="0.1" placeholder="1.5" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="length"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Length (cm)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" placeholder="30" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="width"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Width (cm)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" placeholder="20" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height (cm)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" placeholder="15" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="declaredValue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Declared Value ($)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" step="0.01" placeholder="100.00" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="insuranceValue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Insurance Value ($)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" step="0.01" placeholder="0.00" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping Options */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Truck className="h-4 w-4" />
                        Shipping Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="serviceLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select service" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(SERVICE_LEVELS).map(([key, value]) => (
                                  <SelectItem key={value} value={value}>
                                    <div className="flex items-center justify-between w-full">
                                      <span>{key.charAt(0) + key.slice(1).toLowerCase()}</span>
                                      <Badge variant="outline" className="ml-2">
                                        {value === SERVICE_LEVELS.EXPRESS ? "3-5 days" : "7-10 days"}
                                      </Badge>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                                  <SelectItem key={value} value={value}>
                                    {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="shippingCost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shipping Cost ($)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" step="0.01" placeholder="25.99" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="requiresSignature"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Signature Required</FormLabel>
                              <p className="text-xs text-muted-foreground">
                                Recipient must sign for delivery
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="specialInstructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Instructions</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} placeholder="Handle with care, fragile contents..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Review Package Details
                    </CardTitle>
                    <CardDescription>
                      Please review all information before creating the package
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Sender</h4>
                        <p className="text-sm">{form.watch("senderName")}</p>
                        <p className="text-sm text-muted-foreground">{form.watch("senderEmail")}</p>
                        <p className="text-sm text-muted-foreground">{form.watch("senderPhone")}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Recipient</h4>
                        <p className="text-sm">{form.watch("recipientName")}</p>
                        <p className="text-sm text-muted-foreground">{form.watch("recipientEmail")}</p>
                        <p className="text-sm text-muted-foreground">{form.watch("recipientPhone")}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Package Details</h4>
                        <p className="text-sm">{form.watch("packageDescription")}</p>
                        <p className="text-sm text-muted-foreground">
                          {form.watch("weight")} kg • {form.watch("length")}×{form.watch("width")}×{form.watch("height")} cm
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Shipping</h4>
                        <p className="text-sm">{form.watch("serviceLevel")} Service</p>
                        <p className="text-sm text-muted-foreground">${form.watch("shippingCost")}</p>
                      </div>
                    </div>

                    {form.watch("recipientEmail") && (
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Email Notification
                          </span>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          An email will be sent to <strong>{form.watch("recipientEmail")}</strong> with package details and payment instructions.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={step === 1 ? () => setOpen(false) : prevStep}
              >
                {step === 1 ? "Cancel" : "Previous"}
              </Button>
              
              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={createPackageMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {createPackageMutation.isPending ? "Creating Package..." : "Create Package"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}