import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  Key, 
  QrCode,
  CheckCircle,
  AlertTriangle,
  Copy,
  RefreshCw,
  Lock,
  Fingerprint,
  Eye,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TwoFactorAuthProps {
  userEmail?: string;
  userPhone?: string;
  onSetupComplete?: (method: string) => void;
  isEnabled?: boolean;
}

export default function TwoFactorAuth({
  userEmail = "user@example.com",
  userPhone = "+1 (555) 123-4567",
  onSetupComplete,
  isEnabled = false
}: TwoFactorAuthProps) {
  const [currentStep, setCurrentStep] = useState<"setup" | "verify" | "backup">("setup");
  const [selectedMethod, setSelectedMethod] = useState<"app" | "sms" | "email">("app");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Shipnix-Express:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Shipnix-Express");
  const [secretKey, setSecretKey] = useState("JBSWY3DPEHPK3PXP");
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const methods = [
    {
      id: "app",
      name: "Authenticator App",
      description: "Use apps like Google Authenticator, Authy, or Microsoft Authenticator",
      icon: <Smartphone className="h-5 w-5 text-green-600" />,
      recommended: true,
      security: "Highest"
    },
    {
      id: "sms",
      name: "SMS Text Message",
      description: "Receive codes via text message to your phone",
      icon: <MessageSquare className="h-5 w-5 text-blue-600" />,
      recommended: false,
      security: "Medium"
    },
    {
      id: "email",
      name: "Email",
      description: "Receive codes via email",
      icon: <Mail className="h-5 w-5 text-purple-600" />,
      recommended: false,
      security: "Low"
    }
  ];

  const generateBackupCodes = () => {
    setIsGeneratingCodes(true);
    
    // Simulate generating backup codes
    setTimeout(() => {
      const codes = Array.from({ length: 8 }, () => 
        Math.random().toString(36).substr(2, 4).toUpperCase() + "-" + 
        Math.random().toString(36).substr(2, 4).toUpperCase()
      );
      setBackupCodes(codes);
      setIsGeneratingCodes(false);
      setShowBackupCodes(true);
    }, 1000);
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secretKey);
    setCopiedSecret(true);
    toast({
      title: "Copied!",
      description: "Secret key copied to clipboard",
    });
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    toast({
      title: "Copied!",
      description: "Backup codes copied to clipboard",
    });
  };

  const handleSetupMethod = (method: "app" | "sms" | "email") => {
    setSelectedMethod(method);
    setCurrentStep("verify");
  };

  const handleVerifyCode = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      setCurrentStep("backup");
      generateBackupCodes();
      toast({
        title: "Success!",
        description: "Two-factor authentication has been enabled",
      });
    }, 1500);
  };

  const completeSetup = () => {
    if (onSetupComplete) {
      onSetupComplete(selectedMethod);
    }
    toast({
      title: "Setup Complete",
      description: "Two-factor authentication is now active on your account",
    });
  };

  const regenerateSecret = () => {
    const newSecret = Array.from({ length: 16 }, () => 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]
    ).join('');
    setSecretKey(newSecret);
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Shipnix-Express:${encodeURIComponent(userEmail)}?secret=${newSecret}&issuer=Shipnix-Express`);
  };

  if (isEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Two-Factor Authentication</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Enabled
            </Badge>
          </CardTitle>
          <CardDescription>
            Your account is protected with two-factor authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-medium">2FA is Active</div>
              <div className="text-sm text-muted-foreground">
                Last used: 2 hours ago
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={generateBackupCodes}>
              <Key className="h-4 w-4 mr-2" />
              Generate New Backup Codes
            </Button>
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
              <Shield className="h-4 w-4 mr-2" />
              Disable 2FA
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span>Two-Factor Authentication</span>
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={currentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup" disabled={currentStep !== "setup"}>
              1. Setup
            </TabsTrigger>
            <TabsTrigger value="verify" disabled={currentStep !== "verify"}>
              2. Verify
            </TabsTrigger>
            <TabsTrigger value="backup" disabled={currentStep !== "backup"}>
              3. Backup
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Choose a two-factor authentication method to secure your account. 
                We recommend using an authenticator app for the highest security.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <h3 className="font-medium">Choose Your Method</h3>
              {methods.map((method) => (
                <div
                  key={method.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:bg-muted/50 ${
                    selectedMethod === method.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                  onClick={() => setSelectedMethod(method.id as any)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {method.icon}
                      <div>
                        <div className="font-medium flex items-center space-x-2">
                          <span>{method.name}</span>
                          {method.recommended && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {method.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={
                        method.security === "Highest" ? "text-green-600" :
                        method.security === "Medium" ? "text-yellow-600" :
                        "text-red-600"
                      }>
                        {method.security} Security
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => handleSetupMethod(selectedMethod)}
              className="w-full"
              disabled={!selectedMethod}
            >
              Continue with {methods.find(m => m.id === selectedMethod)?.name}
            </Button>
          </TabsContent>
          
          <TabsContent value="verify" className="space-y-6">
            {selectedMethod === "app" && (
              <div className="space-y-4">
                <h3 className="font-medium">Set up Authenticator App</h3>
                
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    1. Download an authenticator app (Google Authenticator, Authy, etc.)
                  </div>
                  
                  <div className="flex flex-col items-center space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm font-medium">2. Scan this QR code</div>
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="w-48 h-48 border rounded-lg"
                    />
                    <div className="text-xs text-muted-foreground text-center">
                      Or manually enter this secret key:
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={secretKey}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button variant="outline" size="sm" onClick={copySecret}>
                        {copiedSecret ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={regenerateSecret}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {selectedMethod === "sms" && (
              <div className="space-y-4">
                <h3 className="font-medium">SMS Verification</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm">
                    We'll send verification codes to: <strong>{userPhone}</strong>
                  </div>
                </div>
              </div>
            )}
            
            {selectedMethod === "email" && (
              <div className="space-y-4">
                <h3 className="font-medium">Email Verification</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm">
                    We'll send verification codes to: <strong>{userEmail}</strong>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="text-sm font-medium">
                3. Enter the 6-digit code from your {selectedMethod === "app" ? "authenticator app" : selectedMethod}
              </div>
              <Input
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-lg font-mono"
                maxLength={6}
              />
              <Button 
                onClick={handleVerifyCode}
                disabled={isVerifying || verificationCode.length !== 6}
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="backup" className="space-y-6">
            <Alert>
              <Key className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Save these backup codes in a secure location. 
                You can use them to access your account if you lose your device.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Backup Codes</h3>
                <Button variant="outline" size="sm" onClick={copyBackupCodes}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {backupCodes.map((code, index) => (
                  <div key={index} className="font-mono text-sm text-center p-2 bg-white dark:bg-gray-700 rounded">
                    {showBackupCodes ? code : "****-****"}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowBackupCodes(!showBackupCodes)}
                >
                  {showBackupCodes ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Codes
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show Codes
                    </>
                  )}
                </Button>
                <Button onClick={generateBackupCodes} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
            
            <Button onClick={completeSetup} className="w-full">
              <Lock className="h-4 w-4 mr-2" />
              Complete Setup
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}