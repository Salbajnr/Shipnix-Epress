import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Building2, Smartphone, Bitcoin } from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  enabled: boolean;
  logos?: string[];
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: <CreditCard className="h-6 w-6" />,
    description: "Visa, Mastercard, American Express",
    enabled: true,
    logos: ["visa", "mastercard", "amex"]
  },
  {
    id: "bank_transfer",
    name: "Bank Transfer",
    icon: <Building2 className="h-6 w-6" />,
    description: "Direct bank transfer",
    enabled: true
  },
  {
    id: "iban",
    name: "IBAN Transfer",
    icon: <Building2 className="h-6 w-6" />,
    description: "International bank transfer",
    enabled: true
  },
  {
    id: "local_bank",
    name: "Local Bank",
    icon: <Building2 className="h-6 w-6" />,
    description: "Local banking systems",
    enabled: true
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">P</div>,
    description: "Pay with PayPal account",
    enabled: false
  },
  {
    id: "apple_pay",
    name: "Apple Pay",
    icon: <Smartphone className="h-6 w-6" />,
    description: "Pay with Apple devices",
    enabled: true
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    icon: <Bitcoin className="h-6 w-6" />,
    description: "BTC cryptocurrency",
    enabled: true
  },
  {
    id: "ethereum",
    name: "Ethereum",
    icon: <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-white text-xs font-bold">Ξ</div>,
    description: "ETH cryptocurrency",
    enabled: true
  },
  {
    id: "usdc",
    name: "USDC",
    icon: <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">$</div>,
    description: "USD Coin stablecoin",
    enabled: true
  }
];

// SVG logos for major payment providers
const VisaLogo = () => (
  <svg viewBox="0 0 256 83" className="h-6 w-auto">
    <defs>
      <linearGradient id="visa-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1A1F71" />
        <stop offset="100%" stopColor="#0E4B99" />
      </linearGradient>
    </defs>
    <path fill="url(#visa-gradient)" d="M132.397 56.24c-.146-11.516 10.263-17.942 18.104-21.763 8.056-3.92 10.762-6.434 10.73-9.94-.06-5.365-6.426-7.733-12.383-7.825-10.393-.161-16.436 2.806-21.24 5.05l-3.744-17.519c4.82-2.221 13.745-4.158 23-4.243 21.725 0 35.938 10.724 36.015 27.351.085 21.102-29.188 22.27-28.988 31.702.069 2.86 2.798 5.912 8.778 6.688 2.96.392 11.131.692 20.395-3.574l3.636 16.95c-4.982 1.814-11.385 3.551-19.357 3.551-20.448 0-34.83-10.87-34.946-26.428m89.241 24.968c-3.967 0-7.31-2.314-8.802-5.865L181.803 1.245h21.709l4.32 11.939h26.528l2.506-11.939H256l-16.697 79.963h-17.665M213.075 51.06l17.111-46.632-6.88 46.632h-10.231m-118.087 0L88.276 4.801c-2.034-7.672-7.57-9.419-14.56-9.657H25.475l-.133.828c33.339 7.073 55.377 24.109 66.75 45.025l-11.166 58.958h21.84l32.474-79.95H113.424l-18.436 79.95"/>
  </svg>
);

const MastercardLogo = () => (
  <svg viewBox="0 0 256 199" className="h-6 w-auto">
    <path fill="#EB001B" d="M46.54 198.84c-25.617 0-46.54-20.923-46.54-46.54V46.54C0 20.923 20.923 0 46.54 0h73.92v198.84H46.54z"/>
    <path fill="#FF5F00" d="M93.27 37.377c-12.083-9.536-27.35-15.288-43.73-15.288s-31.647 5.752-43.73 15.288h87.46z"/>
    <path fill="#FF5F00" d="M93.27 161.463c-12.083 9.536-27.35 15.288-43.73 15.288s-31.647-5.752-43.73-15.288h87.46z"/>
    <path fill="#0099DF" d="M162.46 37.377c12.083-9.536 27.35-15.288 43.73-15.288s31.647 5.752 43.73 15.288h-87.46z"/>
    <path fill="#0099DF" d="M162.46 161.463c12.083 9.536 27.35 15.288 43.73 15.288s31.647-5.752 43.73-15.288h-87.46z"/>
    <path fill="#0099DF" d="M209.46 198.84c25.617 0 46.54-20.923 46.54-46.54V46.54c0-25.617-20.923-46.54-46.54-46.54h-73.92v198.84h73.92z"/>
  </svg>
);

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodSelect: (method: string) => void;
  showDisabled?: boolean;
}

export function PaymentMethods({ selectedMethod, onMethodSelect, showDisabled = false }: PaymentMethodsProps) {
  const visibleMethods = showDisabled ? paymentMethods : paymentMethods.filter(method => method.enabled);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {visibleMethods.map((method) => (
        <Card
          key={method.id}
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            selectedMethod === method.id
              ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "hover:shadow-md"
          } ${!method.enabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => method.enabled && onMethodSelect(method.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {method.icon}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium text-sm text-gray-900 dark:text-white">
                    {method.name}
                  </h3>
                  {!method.enabled && (
                    <Badge variant="secondary" className="text-xs">
                      Soon
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {method.description}
                </p>
                
                {/* Payment logos */}
                {method.logos && (
                  <div className="flex items-center space-x-2">
                    {method.logos.includes("visa") && <VisaLogo />}
                    {method.logos.includes("mastercard") && <MastercardLogo />}
                    {method.logos.includes("amex") && (
                      <div className="h-6 w-8 bg-blue-600 rounded text-white text-xs font-bold flex items-center justify-center">
                        AE
                      </div>
                    )}
                  </div>
                )}
                
                {/* Crypto address placeholder */}
                {(method.id === "bitcoin" || method.id === "ethereum" || method.id === "usdc") && selectedMethod === method.id && (
                  <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                    <p className="text-gray-600 dark:text-gray-400">
                      Payment address will be generated after order confirmation
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default PaymentMethods;