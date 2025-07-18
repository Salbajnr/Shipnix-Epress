import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Gift, 
  Users, 
  Copy, 
  Check, 
  DollarSign, 
  Trophy, 
  Share2, 
  Mail, 
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  currentTier: string;
  nextTierRequirement: number;
}

interface ReferralActivity {
  id: string;
  name: string;
  email: string;
  status: "pending" | "completed" | "shipped";
  earnings: number;
  date: Date;
}

export default function ReferralProgram() {
  const [referralCode, setReferralCode] = useState("SHIPNIX-USER123");
  const [copiedCode, setCopiedCode] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const { toast } = useToast();

  const stats: ReferralStats = {
    totalReferrals: 12,
    successfulReferrals: 8,
    totalEarnings: 240.50,
    pendingEarnings: 75.00,
    currentTier: "Silver",
    nextTierRequirement: 15
  };

  const activities: ReferralActivity[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      status: "completed",
      earnings: 25.00,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: "2",
      name: "Mike Chen",
      email: "mike.chen@email.com",
      status: "shipped",
      earnings: 30.00,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: "3",
      name: "Emma Williams",
      email: "emma.w@email.com",
      status: "pending",
      earnings: 25.00,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];

  const tiers = [
    { name: "Bronze", requirement: 0, bonus: 5, color: "bg-orange-500" },
    { name: "Silver", requirement: 5, bonus: 10, color: "bg-gray-500" },
    { name: "Gold", requirement: 15, bonus: 15, color: "bg-yellow-500" },
    { name: "Platinum", requirement: 30, bonus: 20, color: "bg-purple-500" }
  ];

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyReferralLink = () => {
    const link = `https://shipnix.com/register?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  const shareViaEmail = () => {
    const subject = "Join Shipnix-Express and Save on Shipping!";
    const body = `Hi there!\n\nI've been using Shipnix-Express for all my shipping needs and thought you might be interested. They offer fast, reliable shipping to over 220 countries with great rates.\n\nUse my referral code: ${referralCode}\nOr click this link: https://shipnix.com/register?ref=${referralCode}\n\nYou'll get 20% off your first shipment, and I'll earn some rewards too!\n\nBest regards`;
    
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const shareViaSocial = (platform: string) => {
    const url = `https://shipnix.com/register?ref=${referralCode}`;
    const text = `Join me on Shipnix-Express! Fast, reliable shipping worldwide. Use my code ${referralCode} for 20% off your first shipment!`;
    
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "shipped": return "bg-blue-500";
      case "pending": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "Completed";
      case "shipped": return "First Order Shipped";
      case "pending": return "Pending";
      default: return "Unknown";
    }
  };

  const currentTierIndex = tiers.findIndex(tier => tier.name === stats.currentTier);
  const nextTier = tiers[currentTierIndex + 1];
  const progress = nextTier ? (stats.successfulReferrals / nextTier.requirement) * 100 : 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="h-5 w-5 text-blue-600" />
            <span>Referral Program</span>
          </CardTitle>
          <CardDescription>
            Earn rewards by referring friends and family to Shipnix-Express
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="share">Share & Earn</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalReferrals}</div>
                    <div className="text-sm text-muted-foreground">Total Referrals</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.successfulReferrals}</div>
                    <div className="text-sm text-muted-foreground">Successful</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">${stats.totalEarnings}</div>
                    <div className="text-sm text-muted-foreground">Total Earnings</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">${stats.pendingEarnings}</div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </CardContent>
                </Card>
              </div>

              {/* Tier Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span>Your Tier: {stats.currentTier}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {nextTier && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Progress to {nextTier.name}</span>
                        <span>{stats.successfulReferrals}/{nextTier.requirement}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="text-sm text-muted-foreground">
                        {nextTier.requirement - stats.successfulReferrals} more successful referrals to reach {nextTier.name}
                      </div>
                    </>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {tiers.map((tier, index) => (
                      <div
                        key={tier.name}
                        className={`p-3 rounded-lg border-2 ${
                          index <= currentTierIndex ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200"
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${tier.color} mb-2`}></div>
                        <div className="font-medium">{tier.name}</div>
                        <div className="text-sm text-muted-foreground">{tier.requirement}+ referrals</div>
                        <div className="text-sm font-medium">${tier.bonus} bonus</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="share" className="space-y-6">
              {/* Referral Code */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Referral Code</CardTitle>
                  <CardDescription>
                    Share this code with friends to earn $25 for each successful referral
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={referralCode}
                      readOnly
                      className="font-mono text-center text-lg"
                    />
                    <Button onClick={copyReferralCode} className="flex-shrink-0">
                      {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={copyReferralLink} variant="outline" className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button onClick={shareViaEmail} variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Social Sharing */}
              <Card>
                <CardHeader>
                  <CardTitle>Share on Social Media</CardTitle>
                  <CardDescription>
                    Spread the word and earn more rewards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <Button 
                      onClick={() => shareViaSocial("facebook")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                    <Button 
                      onClick={() => shareViaSocial("twitter")}
                      className="bg-sky-500 hover:bg-sky-600"
                    >
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Button>
                    <Button 
                      onClick={() => shareViaSocial("linkedin")}
                      className="bg-blue-700 hover:bg-blue-800"
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* How It Works */}
              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <div className="font-medium">Share your code</div>
                        <div className="text-sm text-muted-foreground">Send your referral code to friends and family</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <div className="font-medium">They sign up</div>
                        <div className="text-sm text-muted-foreground">Your friend creates an account and gets 20% off their first shipment</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <div className="font-medium">You earn rewards</div>
                        <div className="text-sm text-muted-foreground">Get $25 credit after their first successful shipment</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Referral Activity</CardTitle>
                  <CardDescription>
                    Track your referrals and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{activity.name}</div>
                            <div className="text-sm text-muted-foreground">{activity.email}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${activity.earnings}</div>
                          <Badge variant="outline" className={`text-white ${getStatusColor(activity.status)}`}>
                            {getStatusText(activity.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}