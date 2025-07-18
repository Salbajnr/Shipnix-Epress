import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Smartphone, 
  QrCode, 
  Key, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle,
  Copy,
  RefreshCw,
  Download,
  Eye,
  EyeOff
} from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

interface BackupCode {
  code: string;
  used: boolean;
}

interface TwoFactorSettings {
  enabled: boolean;
  method: "app" | "sms" | "email";
  backupCodesGenerated: boolean;
  lastUsed?: string;
}

export default function TwoFactorAuth() {
  const [settings, setSettings] = useState<TwoFactorSettings>({
    enabled: false,
    method: "app",
    backupCodesGenerated: false
  });
  
  const [setupStep, setSetupStep] = useState<"select" | "qr" | "verify" | "backup" | "complete">("select");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<BackupCode[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [qrSecret, setQrSecret] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // const { toast } = useToast();
  const toast = (options: any) => console.log('Toast:', options);

  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const generateQRSecret = () => {
    // Generate a random base32 secret for QR code
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let secret = "";
    for (let i = 0; i < 32; i++) {
      secret += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return secret;
  };

  const generateBackupCodes = (): BackupCode[] => {
    const codes: BackupCode[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push({ code, used: false });
    }
    return codes;
  };

  const startSetup = (method: "app" | "sms" | "email") => {
    setSettings(prev => ({ ...prev, method }));
    
    if (method === "app") {
      const secret = generateQRSecret();
      setQrSecret(secret);
      setSetupStep("qr");
    } else {
      setSetupStep("verify");
    }
  };

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate verification API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any 6-digit code
    if (verificationCode.match(/^\d{6}$/)) {
      const codes = generateBackupCodes();
      setBackupCodes(codes);
      setSetupStep("backup");
      toast({
        title: "2FA Enabled Successfully",
        description: "Two-factor authentication has been enabled for your account"
      });
    } else {
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const completeSetup = () => {
    setSettings(prev => ({
      ...prev,
      enabled: true,
      backupCodesGenerated: true,
      lastUsed: new Date().toISOString()
    }));
    setSetupStep("complete");
  };

  const disable2FA = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setSettings({
      enabled: false,
      method: "app",
      backupCodesGenerated: false
    });
    
    setSetupStep("select");
    setBackupCodes([]);
    setVerificationCode("");
    setQrSecret("");
    setIsLoading(false);
    
    toast({
      title: "2FA Disabled",
      description: "Two-factor authentication has been disabled"
    });
  };

  const downloadBackupCodes = () => {
    const codesText = backupCodes.map((backup, index) => 
      `${index + 1}. ${backup.code}`
    ).join('\n');
    
    const blob = new Blob([`Shipnix-Express Backup Codes\n\n${codesText}\n\nKeep these codes safe and secure.`], 
      { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shipnix-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.map(backup => backup.code).join(' ');
    navigator.clipboard.writeText(codesText);
    toast({
      title: "Codes Copied",
      description: "Backup codes copied to clipboard"
    });
  };

  const regenerateBackupCodes = () => {
    const newCodes = generateBackupCodes();
    setBackupCodes(newCodes);
    toast({
      title: "New Backup Codes Generated",
      description: "Previous backup codes are now invalid"
    });
  };

  const handleCodeInput = (index: number, value: string) => {
    if (value.length === 1 && index < 5) {
      codeInputRefs.current[index + 1]?.focus();
    }
    
    const newCode = verificationCode.split('');
    newCode[index] = value;
    setVerificationCode(newCode.join(''));
  };

  const qrCodeUrl = `otpauth://totp/Shipnix-Express?secret=${qrSecret}&issuer=Shipnix-Express`;

  if (settings.enabled) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Shield className="h-5 w-5" />
              Two-Factor Authentication Enabled
            </CardTitle>
            <CardDescription>
              Your account is protected with {settings.method === "app" ? "authenticator app" : settings.method} 2FA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Authentication Method</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {settings.method === "app" ? "Authenticator App" : settings.method.toUpperCase()}
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>

            {settings.lastUsed && (
              <div className="text-sm text-muted-foreground">
                Last used: {new Date(settings.lastUsed).toLocaleString()}
              </div>
            )}

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Backup Codes</h4>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowBackupCodes(!showBackupCodes)}>
                  <Eye className="h-4 w-4 mr-2" />
                  {showBackupCodes ? "Hide" : "Show"} Codes
                </Button>
                <Button variant="outline" onClick={regenerateBackupCodes}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>

              {showBackupCodes && backupCodes.length > 0 && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {backupCodes.map((backup, index) => (
                        <div
                          key={index}
                          className={`font-mono text-sm p-2 rounded ${
                            backup.used 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 line-through' 
                              : 'bg-white dark:bg-gray-800'
                          }`}
                        >
                          {backup.code}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={copyBackupCodes}>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" onClick={downloadBackupCodes}>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button 
                variant="destructive" 
                onClick={disable2FA}
                disabled={isLoading}
              >
                {isLoading ? "Disabling..." : "Disable 2FA"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication Setup
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your Shipnix-Express account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {setupStep === "select" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Choose Authentication Method</h4>
                
                <Card 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => startSetup("app")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-6 w-6 text-blue-500" />
                      <div>
                        <div className="font-medium">Authenticator App</div>
                        <div className="text-sm text-muted-foreground">
                          Use Google Authenticator, Authy, or similar apps
                        </div>
                      </div>
                      <Badge className="ml-auto">Recommended</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => startSetup("sms")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-6 w-6 text-green-500" />
                      <div>
                        <div className="font-medium">SMS Text Message</div>
                        <div className="text-sm text-muted-foreground">
                          Receive codes via text message
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => startSetup("email")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-6 w-6 text-purple-500" />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-sm text-muted-foreground">
                          Receive codes via email
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {setupStep === "qr" && (
            <div className="space-y-6 text-center">
              <div>
                <h4 className="font-medium mb-2">Scan QR Code</h4>
                <p className="text-sm text-muted-foreground">
                  Use your authenticator app to scan this QR code
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="bg-white p-6 rounded-lg border">
                  <QrCode className="h-32 w-32 text-gray-800" />
                  <div className="text-xs text-gray-500 mt-2">QR Code</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Or enter this code manually:</Label>
                <div className="font-mono text-sm bg-muted p-2 rounded">
                  {qrSecret}
                </div>
              </div>

              <Button onClick={() => setSetupStep("verify")} className="w-full">
                I've Added the Account
              </Button>
            </div>
          )}

          {setupStep === "verify" && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="font-medium mb-2">Enter Verification Code</h4>
                <p className="text-sm text-muted-foreground">
                  {settings.method === "app" 
                    ? "Enter the 6-digit code from your authenticator app"
                    : `Enter the code sent to your ${settings.method}`
                  }
                </p>
              </div>

              {settings.method === "sms" && (
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <Input
                      key={index}
                      ref={(el) => codeInputRefs.current[index] = el}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center text-lg font-mono"
                      value={verificationCode[index] || ''}
                      onChange={(e) => handleCodeInput(index, e.target.value)}
                    />
                  ))}
                </div>

                <Button 
                  onClick={verifyCode} 
                  disabled={verificationCode.length !== 6 || isLoading}
                  className="w-full"
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </div>
            </div>
          )}

          {setupStep === "backup" && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="font-medium mb-2">Save Your Backup Codes</h4>
                <p className="text-sm text-muted-foreground">
                  Store these codes in a safe place. You can use them to access your account if you lose your device.
                </p>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {backupCodes.map((backup, index) => (
                      <div
                        key={index}
                        className="font-mono text-sm p-2 bg-white dark:bg-gray-800 rounded"
                      >
                        {backup.code}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={copyBackupCodes}>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy All
                    </Button>
                    <Button size="sm" onClick={downloadBackupCodes}>
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                  <div className="text-sm">
                    <strong>Important:</strong> Each backup code can only be used once. 
                    Store them securely and don't share them with anyone.
                  </div>
                </div>
              </div>

              <Button onClick={completeSetup} className="w-full">
                I've Saved My Backup Codes
              </Button>
            </div>
          )}

          {setupStep === "complete" && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">2FA Setup Complete!</h4>
                <p className="text-sm text-muted-foreground">
                  Your account is now protected with two-factor authentication.
                </p>
              </div>

              <Button onClick={() => window.location.reload()} className="w-full">
                Continue to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Why Enable 2FA?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <div className="font-medium text-sm">Enhanced Security</div>
                <div className="text-xs text-muted-foreground">
                  Protect against unauthorized access even if your password is compromised
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Key className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium text-sm">Account Protection</div>
                <div className="text-xs text-muted-foreground">
                  Secure your shipping data, billing information, and personal details
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <div className="font-medium text-sm">Compliance</div>
                <div className="text-xs text-muted-foreground">
                  Meet security requirements for business and enterprise accounts
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <div className="font-medium text-sm">Breach Protection</div>
                <div className="text-xs text-muted-foreground">
                  Additional layer of defense against data breaches and cyber attacks
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}