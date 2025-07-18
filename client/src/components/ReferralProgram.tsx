import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Gift, Users, Share2, DollarSign, Trophy, Copy, Check, Mail, MessageSquare, Facebook, Twitter } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  currentTier: string;
  nextTierProgress: number;
}

const referralTiers = [
  { name: "Bronze", minReferrals: 0, bonus: 5, color: "text-orange-600" },
  { name: "Silver", minReferrals: 5, bonus: 10, color: "text-gray-500" },
  { name: "Gold", minReferrals: 15, bonus: 15, color: "text-yellow-500" },
  { name: "Platinum", minReferrals: 30, bonus: 20, color: "text-purple-500" },
  { name: "Diamond", minReferrals: 50, bonus: 25, color: "text-blue-500" }
];

export default function ReferralProgram() {
  const [referralCode] = useState("SHIP-REF-ABC123");
  const [emailInput, setEmailInput] = useState("");
  const [copied, setCopied] = useState(false);
  // const { toast } = useToast();
  const toast = (options: any) => console.log('Toast:', options);

  const [stats] = useState<ReferralStats>({
    totalReferrals: 12,
    successfulReferrals: 8,
    totalEarnings: 240,
    pendingEarnings: 45,
    currentTier: "Silver",
    nextTierProgress: 60
  });

  const referralLink = `https://shipnix.com/register?ref=${referralCode}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const sendEmailInvite = () => {
    if (!emailInput) return;
    
    // Simulate sending email invite
    toast({
      title: "Invitation Sent!",
      description: `Referral invitation sent to ${emailInput}`,
    });
    setEmailInput("");
  };

  const shareOnSocial = (platform: string) => {
    const message = "Join me on Shipnix-Express - the world's best logistics platform! Get $10 off your first shipment.";
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(message)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  const currentTier = referralTiers.find(tier => tier.name === stats.currentTier);
  const nextTier = referralTiers[referralTiers.findIndex(tier => tier.name === stats.currentTier) + 1];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <div className="text-sm text-muted-foreground">Total Referrals</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.successfulReferrals}</div>
            <div className="text-sm text-muted-foreground">Successful</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">${stats.totalEarnings}</div>
            <div className="text-sm text-muted-foreground">Total Earned</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Gift className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">${stats.pendingEarnings}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Referral Link & Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share & Earn
            </CardTitle>
            <CardDescription>
              Share your referral link and earn $10 for each successful referral
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Referral Link</label>
              <div className="flex gap-2">
                <Input value={referralLink} readOnly className="font-mono text-sm" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(referralLink)}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Invite by Email</label>
              <div className="flex gap-2">
                <Input
                  placeholder="friend@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
                <Button onClick={sendEmailInvite} disabled={!emailInput}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <label className="text-sm font-medium">Share on Social Media</label>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => shareOnSocial('facebook')}>
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button variant="outline" onClick={() => shareOnSocial('twitter')}>
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" onClick={() => shareOnSocial('linkedin')}>
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tier System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Referral Tiers
            </CardTitle>
            <CardDescription>
              Unlock higher bonuses as you refer more friends
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Current Tier</div>
                  <div className={`text-lg font-bold ${currentTier?.color}`}>
                    {stats.currentTier}
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  ${currentTier?.bonus}/referral
                </Badge>
              </div>

              {nextTier && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to {nextTier.name}</span>
                    <span>{stats.successfulReferrals}/{nextTier.minReferrals}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${(stats.successfulReferrals / nextTier.minReferrals) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="text-sm font-medium">All Tiers</div>
              {referralTiers.map((tier, index) => (
                <div
                  key={tier.name}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    tier.name === stats.currentTier 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      tier.name === stats.currentTier ? 'bg-blue-500' : 
                      stats.successfulReferrals >= tier.minReferrals ? 'bg-green-500' : 'bg-muted'
                    }`} />
                    <div>
                      <div className={`font-medium ${tier.color}`}>{tier.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {tier.minReferrals}+ referrals
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">${tier.bonus}/ref</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How the Referral Program Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto">
                <Share2 className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold">1. Share Your Link</h3>
              <p className="text-sm text-muted-foreground">
                Share your unique referral link with friends via email, social media, or any other way
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold">2. Friends Sign Up</h3>
              <p className="text-sm text-muted-foreground">
                When someone uses your link to register and makes their first shipment, they get $10 off
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mx-auto">
                <DollarSign className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="font-semibold">3. Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">
                You earn money for each successful referral, with higher bonuses as you reach new tiers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Program Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Referral bonuses are paid within 30 days of successful referral completion</li>
            <li>• A successful referral requires the new user to complete their first paid shipment</li>
            <li>• Self-referrals and fraudulent activity will result in account suspension</li>
            <li>• Minimum payout threshold is $25, paid via PayPal or account credit</li>
            <li>• Tier bonuses apply to all future referrals once achieved</li>
            <li>• Program terms may change with 30 days notice</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}