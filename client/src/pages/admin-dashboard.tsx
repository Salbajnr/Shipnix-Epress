import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Truck,
  MapPin,
  CheckCircle,
  Users,
  LogOut,
  FileText,
  BarChart3,
  Receipt
} from "lucide-react";
import Logo from "@/components/Logo";
import { useQuery } from "@tanstack/react-query";

interface PackageType {
  id: number;
  trackingId: string;
  currentStatus: string;
}

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const { data: packages = [], isLoading: packagesLoading } = useQuery<PackageType[]>({
    queryKey: ["/api/packages"],
    retry: false,
  });

  if (isLoading || packagesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Please log in to access the admin dashboard.
              </p>
              <Button asChild>
                <a href="/api/login">Login to Continue</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Logo className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Global Logistics Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {(user as any)?.firstName || (user as any)?.email || "Admin"}
                </span>
              </div>
              <Button variant="outline" asChild>
                <a href="/api/logout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Access Navigation */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link href="/packages">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow group">
              <CardContent className="p-6 text-center">
                <Package className="h-8 w-8 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Package Management
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Create and track packages
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/quotes">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow group">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Quote Management
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Review and approve quotes
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/invoices">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow group">
              <CardContent className="p-6 text-center">
                <Receipt className="h-8 w-8 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Invoice Management
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Track payments and billing
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow group">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                View reports and insights
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-100">Total Packages</p>
                  <p className="text-2xl font-bold">{packages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Truck className="h-8 w-8" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-yellow-100">In Transit</p>
                  <p className="text-2xl font-bold">
                    {packages.filter(p => p.currentStatus === "in_transit").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-100">Delivered</p>
                  <p className="text-2xl font-bold">
                    {packages.filter(p => p.currentStatus === "delivered").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-100">Out for Delivery</p>
                  <p className="text-2xl font-bold">
                    {packages.filter(p => p.currentStatus === "out_for_delivery").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Packages
              </h3>
              <div className="space-y-3">
                {packages.slice(0, 5).map((pkg) => (
                  <div key={pkg.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium font-mono text-sm">{pkg.trackingId}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Status: {pkg.currentStatus.replace('_', ' ')}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {pkg.currentStatus}
                    </Badge>
                  </div>
                ))}
                {packages.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No packages found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link href="/packages">
                  <Button className="w-full justify-start" variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    Create New Package
                  </Button>
                </Link>
                <Link href="/quotes">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Review Quotes
                  </Button>
                </Link>
                <Link href="/invoices">
                  <Button className="w-full justify-start" variant="outline">
                    <Receipt className="h-4 w-4 mr-2" />
                    Manage Invoices
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}