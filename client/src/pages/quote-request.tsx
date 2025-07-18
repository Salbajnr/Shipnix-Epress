import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Calculator, Package, Truck, Clock, DollarSign } from "lucide-react";
import Header from "@/components/Header";

const quoteRequestSchema = z.object({
  senderName: z.string().min(1, "Sender name is required"),
  senderEmail: z.string().email("Valid email required"),
  senderPhone: z.string().optional(),
  senderAddress: z.string().min(1, "Sender address is required"),
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientEmail: z.string().email().optional(),
  recipientPhone: z.string().optional(),
  recipientAddress: z.string().min(1, "Recipient address is required"),
  packageDescription: z.string().optional(),
  weight: z.string().min(1, "Weight is required"),
  dimensions: z.string().optional(),
  deliveryTimeSlot: z.string().optional(),
});

type QuoteRequestForm = z.infer<typeof quoteRequestSchema>;

const DELIVERY_TIME_SLOTS = {
  morning: { label: "Morning (8AM - 12PM)", fee: 0 },
  afternoon: { label: "Afternoon (12PM - 5PM)", fee: 5 },
  evening: { label: "Evening (5PM - 8PM)", fee: 15 },
  express: { label: "Express (Same Day)", fee: 25 },
  weekend: { label: "Weekend Delivery", fee: 20 },
};

export default function QuoteRequest() {
  const { toast } = useToast();
  const [quoteResult, setQuoteResult] = useState<any>(null);

  const form = useForm<QuoteRequestForm>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: {
      senderName: "",
      senderEmail: "",
      senderPhone: "",
      senderAddress: "",
      recipientName: "",
      recipientEmail: "",
      recipientPhone: "",
      recipientAddress: "",
      packageDescription: "",
      weight: "",
      dimensions: "",
      deliveryTimeSlot: "morning",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: QuoteRequestForm) => {
      // Calculate costs
      const weight = parseFloat(data.weight);
      const baseCost = Math.max(15, weight * 2.5); // $15 minimum or $2.50 per kg
      const deliveryFee = DELIVERY_TIME_SLOTS[data.deliveryTimeSlot as keyof typeof DELIVERY_TIME_SLOTS]?.fee || 0;
      const totalCost = baseCost + deliveryFee;

      const quoteData = {
        ...data,
        weight: weight,
        baseCost,
        deliveryFee,
        totalCost,
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      };

      return apiRequest("POST", "/api/quotes", quoteData);
    },
    onSuccess: (data) => {
      setQuoteResult(data);
      toast({
        title: "Quote Generated Successfully!",
        description: `Quote ${data.quoteNumber} created. Valid until ${new Date(data.validUntil).toLocaleDateString()}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate quote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: QuoteRequestForm) => {
    mutation.mutate(data);
  };

  const calculateEstimate = () => {
    const weight = parseFloat(form.watch("weight") || "0");
    const timeSlot = form.watch("deliveryTimeSlot") || "morning";
    const baseCost = Math.max(15, weight * 2.5);
    const deliveryFee = DELIVERY_TIME_SLOTS[timeSlot as keyof typeof DELIVERY_TIME_SLOTS]?.fee || 0;
    return { baseCost, deliveryFee, total: baseCost + deliveryFee };
  };

  const estimate = calculateEstimate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              <Calculator className="inline-block mr-3 h-10 w-10 text-blue-600" />
              Request a Quote
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Get an instant shipping quote for your package
            </p>
          </div>

          {!quoteResult ? (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Quote Form */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Shipping Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Sender Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            Sender Information
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="senderName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="senderEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="senderPhone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone (Optional)</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="senderAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pickup Address</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={3} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Recipient Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Recipient Information</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="recipientName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="recipientEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email (Optional)</FormLabel>
                                  <FormControl>
                                    <Input type="email" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="recipientPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone (Optional)</FormLabel>
                                <FormControl>
                                  <Input {...field} />
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
                                  <Textarea {...field} rows={3} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Package Information */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Package Information</h3>
                          <FormField
                            control={form.control}
                            name="packageDescription"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Package Description (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea {...field} rows={2} placeholder="Documents, clothing, electronics, etc." />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="weight"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Weight (kg)</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.1" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="dimensions"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Dimensions (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="L x W x H (cm)" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="deliveryTimeSlot"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Delivery Time</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select delivery time" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Object.entries(DELIVERY_TIME_SLOTS).map(([value, { label, fee }]) => (
                                      <SelectItem key={value} value={value}>
                                        {label} {fee > 0 && `(+$${fee})`}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={mutation.isPending}
                        >
                          {mutation.isPending ? "Generating Quote..." : "Get Quote"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>

              {/* Quote Estimate */}
              <div className="md:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Estimate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Base Shipping:</span>
                      <span>${estimate.baseCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>${estimate.deliveryFee.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>${estimate.total.toFixed(2)}</span>
                    </div>
                    <Badge variant="secondary" className="w-full justify-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Valid for 7 days
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Quote Result */
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center text-green-600">
                  Quote Generated Successfully!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Quote #{quoteResult.quoteNumber}</h3>
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Total: ${parseFloat(quoteResult.totalCost).toFixed(2)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">From:</h4>
                    <p>{quoteResult.senderName}</p>
                    <p className="text-sm text-gray-600">{quoteResult.senderAddress}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">To:</h4>
                    <p>{quoteResult.recipientName}</p>
                    <p className="text-sm text-gray-600">{quoteResult.recipientAddress}</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Valid until: {new Date(quoteResult.validUntil).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-blue-600">
                    An admin will review your quote and contact you soon with next steps.
                  </p>
                  <Button 
                    onClick={() => {
                      setQuoteResult(null);
                      form.reset();
                    }}
                    variant="outline"
                    className="mt-4"
                  >
                    Request Another Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}