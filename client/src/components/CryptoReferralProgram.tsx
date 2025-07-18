import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bitcoin, Users, Share2, DollarSign, Trophy, Copy, Check, Mail, MessageSquare, Facebook, Twitter, TrendingUp, Coins, Wallet } from "lucide-react";

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  thisMonthEarnings: number;
  pendingRewards: number;
  tier: string;
  nextTierRequirement: number;
}

interface Referral {
  id: string;
  email: string;
  status: 'pending' | 'verified' | 'trading';
  joinDate: string;
  tradingVolume: number;
  earnedCommission: number;
}

const tierBenefits = [
  {
    name: "Bronze",
    requirement: 0,
    commission: "10%",
    color: "bg-amber-600",
    benefits: ["10% trading commission", "Basic referral rewards", "Email support"]
  },
  {
    name: "Silver",
    requirement: 10,
    commission: "15%",
    color: "bg-gray-400",
    benefits: ["15% trading commission", "Bonus crypto rewards", "Priority support", "Monthly BTC bonus"]
  },
  {
    name: "Gold",
    requirement: 25,
    commission: "20%",
    color: "bg-yellow-500",
    benefits: ["20% trading commission", "Premium crypto rewards", "VIP support", "Weekly ETH bonus"]
  },
  {
    name: "Platinum",
    requirement: 50,
    commission: "25%",
    color: "bg-purple-600",
    benefits: ["25% trading commission", "Exclusive NFT rewards", "Dedicated account manager", "Daily crypto drops"]
  }
];

export default function CryptoReferralProgram() {
  const [referralCode] = useState("CRYPTO-REF-BTC123");
  const [emailInput, setEmailInput] = useState("");
  const [copied, setCopied] = useState(false);
  // const { toast } = useToast();
  const toast = (options: any) => console.log('Toast:', options);

  const [stats] = useState<ReferralStats>({
    totalReferrals: 23,
    activeReferrals: 18,
    totalEarnings: 2.45, // BTC
    thisMonthEarnings: 0.32, // BTC
    pendingRewards: 0.08, // BTC
    tier: "Silver",
    nextTierRequirement: 25
  });

  const [referrals] = useState<Referral[]>([
    {
      id: "1",
      email: "alice@email.com",
      status: "trading",
      joinDate: "2024-01-15",
      tradingVolume: 15000,
      earnedCommission: 0.15
    },
    {
      id: "2", 
      email: "bob@email.com",
      status: "verified",
      joinDate: "2024-01-20",
      tradingVolume: 8500,
      earnedCommission: 0.08
    },
    {
      id: "3",
      email: "charlie@email.com",
      status: "pending",
      joinDate: "2024-01-25",
      tradingVolume: 0,
      earnedCommission: 0
    }
  ]);

  const copyReferralLink = async () => {
    const referralLink = `https://cryptotrader.com/signup?ref=${referralCode}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const sendEmailInvite = () => {
    if (!emailInput.trim()) return;
    
    // Simulate sending email invite
    toast({
      title: "Invite Sent!",
      description: `Crypto trading invitation sent to ${emailInput}`,
    });
    setEmailInput("");
  };

  const shareOnSocial = (platform: string) => {
    const message = "Join me on the best crypto trading platform! Use my referral code to get exclusive bonuses: ";
    const referralLink = `https://cryptotrader.com/signup?ref=${referralCode}`;
    
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const currentTier = tierBenefits.find(tier => tier.name === stats.tier);
  const nextTier = tierBenefits.find(tier => tier.requirement > stats.totalReferrals);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-orange-50 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Bitcoin className="h-6 w-6 text-orange-500" />
            Crypto Trading Referral Program
          </CardTitle>
          <CardDescription>
            Earn Bitcoin and other crypto rewards by inviting friends to trade. Higher tiers unlock bigger commissions and exclusive bonuses.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Referrals</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalReferrals}</p>
            <p className="text-xs text-green-500">+3 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Active Traders</span>
            </div>
            <p className="text-2xl font-bold">{stats.activeReferrals}</p>
            <p className="text-xs text-green-500">78% conversion</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bitcoin className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Total Earned</span>
            </div>
            <p className="text-2xl font-bold">₿{stats.totalEarnings}</p>
            <p className="text-xs text-green-500">≈ ${(stats.totalEarnings * 45000).toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">This Month</span>
            </div>
            <p className="text-2xl font-bold">₿{stats.thisMonthEarnings}</p>
            <p className="text-xs text-green-500">+25% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Referral Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-500" />
              Refer & Earn Crypto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Referral Code</label>
              <div className="flex gap-2">
                <Input 
                  value={referralCode} 
                  readOnly 
                  className="font-mono text-center bg-muted"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={copyReferralLink}
                  className="shrink-0"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Send Email Invite</label>
              <div className="flex gap-2">
                <Input 
                  type="email"
                  placeholder="friend@email.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
                <Button onClick={sendEmailInvite} disabled={!emailInput.trim()}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium mb-3">Share on Social Media</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => shareOnSocial('twitter')}
                  className="flex-1"
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => shareOnSocial('facebook')}
                  className="flex-1"
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => shareOnSocial('telegram')}
                  className="flex-1"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Telegram
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tier Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Tier Status: {stats.tier}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentTier && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${currentTier.color}`}></div>
                  <span className="font-medium">{currentTier.name} Tier</span>
                  <Badge variant="secondary">{currentTier.commission} Commission</Badge>
                </div>
                <div className="space-y-1">
                  {currentTier.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-3 w-3 text-green-500" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {nextTier && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to {nextTier.name}</span>
                  <span>{stats.totalReferrals}/{nextTier.requirement}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((stats.totalReferrals / nextTier.requirement) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {nextTier.requirement - stats.totalReferrals} more referrals to unlock {nextTier.commission} commission
                </p>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending Rewards</span>
                <span className="font-medium">₿{stats.pendingRewards}</span>
              </div>
              <Button className="w-full mt-2 btn-gradient">
                <Coins className="h-4 w-4 mr-2" />
                Claim Rewards
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Tiers & Benefits</CardTitle>
          <CardDescription>
            Unlock higher commission rates and exclusive crypto rewards as you refer more traders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tierBenefits.map((tier, index) => (
              <Card 
                key={tier.name} 
                className={`relative ${stats.tier === tier.name ? 'ring-2 ring-blue-500' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-4 h-4 rounded-full ${tier.color}`}></div>
                    <h3 className="font-semibold">{tier.name}</h3>
                    {stats.tier === tier.name && (
                      <Badge variant="default" className="text-xs">Current</Badge>
                    )}
                  </div>
                  
                  <div className="text-center mb-3">
                    <p className="text-2xl font-bold text-green-600">{tier.commission}</p>
                    <p className="text-xs text-muted-foreground">Commission Rate</p>
                  </div>

                  <div className="space-y-1">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-2 text-xs">
                        <Check className="h-3 w-3 text-green-500" />
                        {benefit}
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t text-center">
                    <p className="text-xs text-muted-foreground">
                      {tier.requirement === 0 ? 'No requirements' : `${tier.requirement}+ referrals`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {referrals.map((referral) => (
              <div key={referral.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {referral.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{referral.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Joined {new Date(referral.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={
                      referral.status === 'trading' ? 'default' :
                      referral.status === 'verified' ? 'secondary' : 'outline'
                    }
                    className="mb-1"
                  >
                    {referral.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    ₿{referral.earnedCommission} earned
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}