import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Smartphone, Shield, Zap, Apple, CheckCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

interface PaymentMethod {
  id: string;
  type: "apple_pay" | "google_pay" | "samsung_pay" | "paypal" | "card";
  name: string;
  icon: React.ReactNode;
  description: string;
  isAvailable: boolean;
  processingFee: number;
  estimatedTime: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "apple_pay",
    type: "apple_pay",
    name: "Apple Pay",
    icon: <Apple className="h-6 w-6" />,
    description: "Pay securely with Touch ID or Face ID",
    isAvailable: typeof window !== 'undefined' && 'ApplePaySession' in window,
    processingFee: 0,
    estimatedTime: "Instant"
  },
  {
    id: "google_pay",
    type: "google_pay", 
    name: "Google Pay",
    icon: <FcGoogle className="h-6 w-6" />,
    description: "Quick checkout with your Google account",
    isAvailable: typeof window !== 'undefined' && 'PaymentRequest' in window,
    processingFee: 0,
    estimatedTime: "Instant"
  },
  {
    id: "samsung_pay",
    type: "samsung_pay",
    name: "Samsung Pay",
    icon: <Smartphone className="h-6 w-6 text-blue-600" />,
    description: "Samsung's secure mobile payment solution",
    isAvailable: typeof window !== 'undefined' && navigator.userAgent.includes('Samsung'),
    processingFee: 0,
    estimatedTime: "Instant"
  },
  {
    id: "paypal",
    type: "paypal",
    name: "PayPal",
    icon: <div className="h-6 w-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">P</div>,
    description: "Pay with your PayPal account or card",
    isAvailable: true,
    processingFee: 2.9,
    estimatedTime: "1-2 minutes"
  },
  {
    id: "card",
    type: "card",
    name: "Credit/Debit Card",
    icon: <CreditCard className="h-6 w-6 text-gray-600" />,
    description: "Visa, MasterCard, American Express",
    isAvailable: true,
    processingFee: 2.5,
    estimatedTime: "2-3 minutes"
  }
];

interface MobilePaymentsProps {
  amount: number;
  currency?: string;
  onPaymentSelect?: (method: PaymentMethod) => void;
  onPaymentComplete?: (result: any) => void;
}

export default function MobilePayments({ 
  amount, 
  currency = "USD", 
  onPaymentSelect,
  onPaymentComplete 
}: MobilePaymentsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    if (!method.isAvailable) return;
    
    setSelectedMethod(method.id);
    onPaymentSelect?.(method);
  };

  const processPayment = async (method: PaymentMethod) => {
    setIsProcessing(true);
    
    try {
      switch (method.type) {
        case "apple_pay":
          await processApplePay();
          break;
        case "google_pay":
          await processGooglePay();
          break;
        case "samsung_pay":
          await processSamsungPay();
          break;
        case "paypal":
          await processPayPal();
          break;
        case "card":
          await processCard();
          break;
      }
    } catch (error) {
      console.error("Payment processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const processApplePay = async () => {
    if (!window.ApplePaySession) {
      throw new Error("Apple Pay not supported");
    }

    const request = {
      countryCode: 'US',
      currencyCode: currency,
      supportedNetworks: ['visa', 'masterCard', 'amex'],
      merchantCapabilities: ['supports3DS'],
      total: {
        label: 'Shipnix-Express Shipping',
        amount: amount.toString()
      }
    };

    const session = new window.ApplePaySession(3, request);
    
    session.onvalidatemerchant = async (event) => {
      // Validate with your payment processor
      console.log("Validating Apple Pay merchant...");
    };

    session.onpaymentauthorized = (event) => {
      // Process payment with your backend
      console.log("Apple Pay authorized:", event.payment);
      session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
      onPaymentComplete?.({ method: 'apple_pay', success: true });
    };

    session.begin();
  };

  const processGooglePay = async () => {
    if (!window.PaymentRequest) {
      throw new Error("Payment Request API not supported");
    }

    const paymentRequest = new window.PaymentRequest(
      [
        {
          supportedMethods: 'https://google.com/pay',
          data: {
            apiVersion: 2,
            apiVersionMinor: 0,
            merchantInfo: {
              merchantName: 'Shipnix-Express'
            },
            allowedPaymentMethods: [{
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['VISA', 'MASTERCARD', 'AMEX']
              }
            }]
          }
        }
      ],
      {
        total: {
          label: 'Shipnix-Express Shipping',
          amount: { currency, value: amount.toString() }
        }
      }
    );

    const result = await paymentRequest.show();
    console.log("Google Pay result:", result);
    onPaymentComplete?.({ method: 'google_pay', success: true, result });
  };

  const processSamsungPay = async () => {
    // Samsung Pay integration would require their SDK
    console.log("Processing Samsung Pay...");
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    onPaymentComplete?.({ method: 'samsung_pay', success: true });
  };

  const processPayPal = async () => {
    // PayPal integration
    console.log("Redirecting to PayPal...");
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    onPaymentComplete?.({ method: 'paypal', success: true });
  };

  const processCard = async () => {
    // Credit card processing
    console.log("Processing card payment...");
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    onPaymentComplete?.({ method: 'card', success: true });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Mobile Payment Options
          </CardTitle>
          <CardDescription>
            Choose your preferred payment method for {formatAmount(amount)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedMethod === method.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : method.isAvailable 
                    ? 'hover:border-gray-300' 
                    : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => handlePaymentMethodSelect(method)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {method.icon}
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {method.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isAvailable ? (
                      <>
                        {method.processingFee > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {method.processingFee}% fee
                          </Badge>
                        )}
                        {method.processingFee === 0 && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            No fees
                          </Badge>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {method.estimatedTime}
                        </div>
                      </>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Not Available
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {selectedMethod && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Shipping Cost:</span>
              <span>{formatAmount(amount)}</span>
            </div>
            
            {paymentMethods.find(m => m.id === selectedMethod)?.processingFee! > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Processing Fee:</span>
                <span>
                  {formatAmount(amount * (paymentMethods.find(m => m.id === selectedMethod)?.processingFee! / 100))}
                </span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>
                {formatAmount(
                  amount + (amount * (paymentMethods.find(m => m.id === selectedMethod)?.processingFee! / 100))
                )}
              </span>
            </div>

            <Button 
              className="w-full btn-gradient"
              onClick={() => processPayment(paymentMethods.find(m => m.id === selectedMethod)!)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Pay Securely
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">256-bit SSL encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">PCI DSS compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">No card details stored</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Fraud protection</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}