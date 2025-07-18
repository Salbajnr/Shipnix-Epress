import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Truck, MapPin, Clock, Bell, CreditCard, User, Settings, BarChart3, AlertCircle, CheckCircle, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import CreatePackageForm from "@/components/CreatePackageForm";
// Using an SVG logo inline to avoid asset loading issues  
const shipnixLogo = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzI1NjNFQiIvPgo8cGF0aCBkPSJNMTIgMTJIMjhWMTZIMTJWMTJaTTEyIDIwSDI0VjI0SDEyVjIwWk0xMiAyOEgyOFYzMkgxMlYyOFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=";
import type { Package as PackageType, Notification, SupportTicket } from "@shared/schema";
import { PACKAGE_STATUSES, NOTIFICATION_TYPES } from "@shared/schema";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user's packages
  const { data: packages = [] } = useQuery<PackageType[]>({
    queryKey: ["/api/user/packages"],
    enabled: !!user,
  });

  // Fetch user's notifications
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/user/notifications"],
    enabled: !!user,
  });

  // Fetch user's support tickets
  const { data: supportTickets = [] } = useQuery<SupportTicket[]>({
    queryKey: ["/api/user/support-tickets"],
    enabled: !!user,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case PACKAGE_STATUSES.DELIVERED:
        return "text-green-600 dark:text-green-400";
      case PACKAGE_STATUSES.IN_TRANSIT:
      case PACKAGE_STATUSES.OUT_FOR_DELIVERY:
        return "text-blue-600 dark:text-blue-400";
      case PACKAGE_STATUSES.FAILED_DELIVERY:
        return "text-red-600 dark:text-red-400";
      default:
        return "text-yellow-600 dark:text-yellow-400";
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case NOTIFICATION_TYPES.PACKAGE_UPDATE:
        return <Package className="h-4 w-4" />;
      case NOTIFICATION_TYPES.DELIVERY_NOTIFICATION:
        return <Truck className="h-4 w-4" />;
      case NOTIFICATION_TYPES.PAYMENT_CONFIRMATION:
        return <CreditCard className="h-4 w-4" />;
      case NOTIFICATION_TYPES.SUPPORT_UPDATE:
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  // Calculate dashboard stats
  const activePackages = packages.filter(pkg => 
    pkg.currentStatus !== PACKAGE_STATUSES.DELIVERED && 
    pkg.currentStatus !== PACKAGE_STATUSES.RETURNED
  );
  const deliveredPackages = packages.filter(pkg => pkg.currentStatus === PACKAGE_STATUSES.DELIVERED);
  const unreadNotifications = notifications.filter(notif => !notif.isRead);
  const openTickets = supportTickets.filter(ticket => ticket.status === "open" || ticket.status === "in_progress");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src={shipnixLogo} 
                alt="Shipnix-Express" 
                className="h-10 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Customer Portal</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications.length}
                    </span>
                  )}
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <img 
                  src={user?.profileImageUrl || "/api/placeholder/32/32"} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full"
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <a href="/api/logout">Sign Out</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your shipments and track packages worldwide
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{activePackages.length}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Active Shipments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{deliveredPackages.length}</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Delivered</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{unreadNotifications.length}</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">New Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{openTickets.length}</p>
                  <p className="text-sm text-orange-600 dark:text-orange-400">Open Tickets</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="packages">My Packages</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Packages */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Recent Shipments
                  </CardTitle>
                  <CreatePackageForm 
                    triggerButton={
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Shipment
                      </Button>
                    }
                  />
                </div>
              </CardHeader>
              <CardContent>
                {packages.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No shipments yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Start shipping with Shipnix-Express today
                    </p>
                    <CreatePackageForm 
                      triggerButton={
                        <Button>Create Your First Shipment</Button>
                      }
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {packages.slice(0, 5).map((pkg) => (
                      <div key={pkg.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{pkg.trackingId}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              To: {pkg.recipientName} • {pkg.recipientAddress.substring(0, 50)}...
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusColor(pkg.currentStatus)}>
                            {formatStatus(pkg.currentStatus)}
                          </Badge>
                          <Button variant="ghost" size="sm">View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No notifications yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {notifications.slice(0, 5).map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{notification.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Packages</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Shipment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Package list implementation */}
                <p className="text-gray-500 dark:text-gray-400">Package management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>All Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Notifications implementation */}
                <p className="text-gray-500 dark:text-gray-400">Notifications management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle>Support Center</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Support implementation */}
                <p className="text-gray-500 dark:text-gray-400">Support center interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Profile implementation */}
                <p className="text-gray-500 dark:text-gray-400">Profile management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}