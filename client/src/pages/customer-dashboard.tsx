import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  TruckIcon, 
  Calculator, 
  FileText, 
  User, 
  Bell,
  CreditCard,
  BarChart3,
  Search,
  Plus,
  MessageCircle,
  Settings,
  LogOut
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import LiveChat from "@/components/LiveChat";

interface CustomerPackage {
  id: number;
  trackingId: string;
  status: string;
  description: string;
  sender: string;
  recipient: string;
  createdAt: string;
  estimatedDelivery?: string;
}

interface CustomerData {
  name: string;
  email: string;
  totalShipments: number;
  activeShipments: number;
  completedShipments: number;
  recentPackages: CustomerPackage[];
}

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [trackingSearch, setTrackingSearch] = useState("");

  // Mock customer data - in real app this would come from API
  const customerData: CustomerData = {
    name: "John Doe",
    email: "john.doe@example.com",
    totalShipments: 47,
    activeShipments: 3,
    completedShipments: 44,
    recentPackages: [
      {
        id: 1,
        trackingId: "ST-CU001234",
        status: "IN_TRANSIT",
        description: "Electronics Package",
        sender: "TechMart USA",
        recipient: "John Doe",
        createdAt: "2025-07-15",
        estimatedDelivery: "2025-07-20"
      },
      {
        id: 2,
        trackingId: "ST-CU005678",
        status: "DELIVERED",
        description: "Documents",
        sender: "Legal Services Inc",
        recipient: "John Doe",
        createdAt: "2025-07-10"
      }
    ]
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'CREATED': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'PICKED_UP': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      'IN_TRANSIT': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'OUT_FOR_DELIVERY': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'DELIVERED': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'FAILED_DELIVERY': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      'CREATED': <Package className="h-4 w-4" />,
      'PICKED_UP': <Clock className="h-4 w-4" />,
      'IN_TRANSIT': <TruckIcon className="h-4 w-4" />,
      'OUT_FOR_DELIVERY': <TruckIcon className="h-4 w-4" />,
      'DELIVERED': <CheckCircle className="h-4 w-4" />,
      'FAILED_DELIVERY': <Package className="h-4 w-4" />
    };
    return icons[status as keyof typeof icons] || <Package className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {customerData.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your shipments and track packages from your dashboard
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Button className="btn-gradient">
                <Plus className="h-4 w-4 mr-2" />
                New Shipment
              </Button>
              <Button variant="outline">
                <Calculator className="h-4 w-4 mr-2" />
                Get Quote
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-hover bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Shipments</p>
                  <p className="text-3xl font-bold">{customerData.totalShipments}</p>
                </div>
                <Package className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Active Shipments</p>
                  <p className="text-3xl font-bold">{customerData.activeShipments}</p>
                </div>
                <TruckIcon className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold">{customerData.completedShipments}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="shipments" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Shipments</span>
            </TabsTrigger>
            <TabsTrigger value="tracking" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Track</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Shipments</CardTitle>
                  <CardDescription>Your latest package activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerData.recentPackages.map((pkg) => (
                      <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(pkg.status)}
                          <div>
                            <p className="font-medium">{pkg.trackingId}</p>
                            <p className="text-sm text-muted-foreground">{pkg.description}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(pkg.status)}>
                          {pkg.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and tools</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Calculator className="h-4 w-4 mr-3" />
                    Calculate Shipping Cost
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12">
                    <FileText className="h-4 w-4 mr-3" />
                    Request Quote
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12">
                    <MessageCircle className="h-4 w-4 mr-3" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-12">
                    <Bell className="h-4 w-4 mr-3" />
                    Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Shipments Tab */}
          <TabsContent value="shipments" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>All Shipments</CardTitle>
                <CardDescription>Complete history of your packages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerData.recentPackages.map((pkg) => (
                    <div key={pkg.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border rounded-lg hover:shadow-md transition-shadow">
                      <div>
                        <p className="font-medium text-primary">{pkg.trackingId}</p>
                        <p className="text-sm text-muted-foreground">{pkg.description}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">From: {pkg.sender}</p>
                        <p className="text-sm text-muted-foreground">Created: {pkg.createdAt}</p>
                      </div>
                      <div className="flex items-center">
                        <Badge className={getStatusColor(pkg.status)}>
                          {pkg.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm" className="btn-gradient">Track</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Track Package</CardTitle>
                <CardDescription>Enter tracking ID to get real-time updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Input
                    placeholder="Enter tracking ID (e.g., ST-ABC123456)"
                    value={trackingSearch}
                    onChange={(e) => setTrackingSearch(e.target.value)}
                    className="font-mono"
                  />
                  <Button className="btn-gradient">
                    <Search className="h-4 w-4 mr-2" />
                    Track
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Billing Summary</CardTitle>
                  <CardDescription>Your account and payment information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Current Balance:</span>
                    <span className="font-bold">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Spent (This Month):</span>
                    <span className="font-bold">$247.50</span>
                  </div>
                  <Button className="w-full btn-gradient">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage Payment Methods
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Invoices</CardTitle>
                  <CardDescription>Your latest billing history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">Invoice #INV-001</p>
                        <p className="text-sm text-muted-foreground">July 2025</p>
                      </div>
                      <span className="font-bold">$89.99</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">Invoice #INV-002</p>
                        <p className="text-sm text-muted-foreground">June 2025</p>
                      </div>
                      <span className="font-bold">$157.51</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <Input value={customerData.name} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email Address</label>
                      <Input value={customerData.email} className="mt-1" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input placeholder="+1 (555) 000-0000" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Company</label>
                      <Input placeholder="Your company name" className="mt-1" />
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button className="btn-gradient">Save Changes</Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Advanced Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <LiveChat />
    </div>
  );
}