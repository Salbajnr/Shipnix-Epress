import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  CheckCircle, 
  Apple, 
  QrCode,
  Fingerprint,
  FaceIcon,
  Zap
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  supported: boolean;
  processingTime: string;
  fees: string;
  security: string[];
}

interface MobilePaymentIntegrationProps {
  amount?: number;
  currency?: string;
  onPaymentSelect?: (method: string) => void;
}

export default function MobilePaymentIntegration({ 
  amount = 0, 
  currency = "USD",
  onPaymentSelect 
}: MobilePaymentIntegrationProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: "apple_pay",
      name: "Apple Pay",
      icon: <Apple className="h-6 w-6" />,
      description: "Pay securely with Touch ID or Face ID",
      supported: true,
      processingTime: "Instant",
      fees: "No fees",
      security: ["Touch ID", "Face ID", "Secure Enclave"]
    },
    {
      id: "google_pay",
      name: "Google Pay",
      icon: <FcGoogle className="h-6 w-6" />,
      description: "Fast and secure payments with Google",
      supported: true,
      processingTime: "Instant",
      fees: "No fees",
      security: ["Fingerprint", "PIN", "Pattern"]
    },
    {
      id: "samsung_pay",
      name: "Samsung Pay",
      icon: <Smartphone className="h-6 w-6 text-blue-600" />,
      description: "Pay with Samsung devices anywhere",
      supported: true,
      processingTime: "Instant",
      fees: "No fees",
      security: ["Fingerprint", "Iris scan", "Knox security"]
    },
    {
      id: "digital_wallet",
      name: "Digital Wallet",
      icon: <CreditCard className="h-6 w-6 text-purple-600" />,
      description: "Use your saved payment methods",
      supported: true,
      processingTime: "1-2 minutes",
      fees: "2.9% + $0.30",
      security: ["256-bit encryption", "PCI DSS"]
    },
    {
      id: "qr_code",
      name: "QR Code Payment",
      icon: <QrCode className="h-6 w-6 text-green-600" />,
      description: "Scan to pay with your banking app",
      supported: true,
      processingTime: "2-3 minutes",
      fees: "1.5%",
      security: ["Bank-level encryption", "OTP verification"]
    }
  ];

  const handlePaymentSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    if (onPaymentSelect) {
      onPaymentSelect(methodId);
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Here you would integrate with actual payment processors
      alert(`Payment processed successfully with ${paymentMethods.find(m => m.id === selectedMethod)?.name}`);
    }, 2000);
  };

  const isApplePaySupported = () => {
    return 'ApplePaySession' in window && ApplePaySession.canMakePayments();
  };

  const isGooglePaySupported = () => {
    return 'PaymentRequest' in window;
  };

  const getPaymentMethodStatus = (methodId: string) => {
    switch (methodId) {
      case "apple_pay":
        return isApplePaySupported();
      case "google_pay":
        return isGooglePaySupported();
      default:
        return true;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            <span>Mobile Payment Options</span>
          </CardTitle>
          <CardDescription>
            Choose your preferred mobile payment method for secure and instant transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {amount > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {currency === "USD" ? "$" : currency + " "}{amount.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total amount to pay
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {paymentMethods.map((method) => {
              const isSupported = getPaymentMethodStatus(method.id);
              const isSelected = selectedMethod === method.id;
              
              return (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                      : "border-gray-200 hover:border-gray-300"
                  } ${!isSupported ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => isSupported && handlePaymentSelect(method.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {method.icon}
                      <div>
                        <div className="font-medium flex items-center space-x-2">
                          <span>{method.name}</span>
                          {!isSupported && (
                            <Badge variant="secondary" className="text-xs">
                              Not Available
                            </Badge>
                          )}
                          {isSupported && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              Available
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {method.description}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  
                  {isSelected && (
                    <div className="mt-4 space-y-3">
                      <Separator />
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Processing Time</div>
                          <div className="text-muted-foreground">{method.processingTime}</div>
                        </div>
                        <div>
                          <div className="font-medium">Fees</div>
                          <div className="text-muted-foreground">{method.fees}</div>
                        </div>
                        <div>
                          <div className="font-medium">Security</div>
                          <div className="text-muted-foreground">
                            {method.security.slice(0, 2).join(", ")}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                          <Shield className="h-4 w-4" />
                          <span className="text-sm font-medium">Secure Payment</span>
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300 mt-1">
                          Your payment information is encrypted and secured with industry-standard protocols
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedMethod && (
            <div className="mt-6 space-y-4">
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">Ready to pay?</div>
                  <div className="text-sm text-muted-foreground">
                    Click below to complete your payment securely
                  </div>
                </div>
                <Button
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Pay Now
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Security Features */}
          <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="font-medium">Security Features</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>256-bit SSL encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>PCI DSS compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Fraud protection</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Secure tokenization</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}