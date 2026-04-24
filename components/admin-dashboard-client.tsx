'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, FileText, CreditCard, TrendingUp, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

interface Props {
  stats: { packages: number; quotes: number; invoices: number };
}

export default function AdminDashboardClient({ stats }: Props) {
  const { data: packages } = useQuery<any[]>({ queryKey: ['/api/packages'] });
  const { data: quotes } = useQuery<any[]>({ queryKey: ['/api/quotes'] });

  const recentPackages = Array.isArray(packages) ? packages.slice(0, 5) : [];
  const pendingQuotes = Array.isArray(quotes) ? quotes.filter((q: any) => q.status === 'pending').length : 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Global Logistics Management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Packages</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.packages}</div>
            <p className="text-xs text-muted-foreground mt-1">Active shipments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quotes</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.quotes}</div>
            <p className="text-xs text-muted-foreground mt-1">{pendingQuotes} pending review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Invoices</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.invoices}</div>
            <p className="text-xs text-muted-foreground mt-1">Total invoices</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link href="/admin/packages">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                <Plus className="w-4 h-4 mr-2" /> New Package
              </Button>
            </Link>
            <Link href="/admin/quotes">
              <Button variant="outline" className="w-full" size="sm">
                <FileText className="w-4 h-4 mr-2" /> View Quotes
              </Button>
            </Link>
            <Link href="/admin/invoices">
              <Button variant="outline" className="w-full" size="sm">
                <CreditCard className="w-4 h-4 mr-2" /> Invoices
              </Button>
            </Link>
            <Link href="/track">
              <Button variant="outline" className="w-full" size="sm">
                <Search className="w-4 h-4 mr-2" /> Track Package
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Packages</CardTitle>
          </CardHeader>
          <CardContent>
            {recentPackages.length === 0 ? (
              <p className="text-muted-foreground text-sm">No packages yet</p>
            ) : (
              <div className="space-y-3">
                {recentPackages.map((pkg: any) => (
                  <div key={pkg.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{pkg.tracking_id}</p>
                      <p className="text-xs text-muted-foreground">{pkg.recipient_name}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 capitalize">
                      {pkg.current_status?.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
