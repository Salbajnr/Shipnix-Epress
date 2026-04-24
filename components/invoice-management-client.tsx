'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatStatus } from '@/lib/utils';
import type { Invoice } from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

export default function InvoiceManagementClient() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: invoicesRaw, isLoading } = useQuery<Invoice[]>({ queryKey: ['/api/invoices'] });
  const invoices = Array.isArray(invoicesRaw) ? invoicesRaw : [];

  const markPaidMutation = useMutation({
    mutationFn: (id: number) => apiRequest('PATCH', `/api/invoices/${id}/mark-paid`),
    onSuccess: (data) => {
      toast({
        title: 'Payment Confirmed',
        description: data.trackingId ? `Package created: ${data.trackingId}` : 'Payment marked as received',
      });
      qc.invalidateQueries({ queryKey: ['/api/invoices'] });
      qc.invalidateQueries({ queryKey: ['/api/packages'] });
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoice Management</h1>
          <p className="text-muted-foreground mt-1">Track payments and billing</p>
        </div>
        <span className="text-sm text-muted-foreground border rounded-full px-3 py-1">{invoices.length} Invoices</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
      ) : invoices.length === 0 ? (
        <Card><CardContent className="text-center py-16">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold">No invoices yet</h3>
          <p className="text-muted-foreground text-sm mt-1">Invoices will appear here when created from quotes</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <Card key={inv.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="font-bold text-blue-700 dark:text-blue-400">{inv.invoice_number}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[inv.payment_status ?? 'pending'] ?? 'bg-gray-100 text-gray-800'}`}>
                        {formatStatus(inv.payment_status ?? 'pending')}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                      <div><span className="text-muted-foreground">Customer:</span> <span className="font-medium">{inv.customer_name}</span></div>
                      <div><span className="text-muted-foreground">Email:</span> {inv.customer_email}</div>
                      <div><span className="text-muted-foreground">Amount:</span> <span className="font-semibold text-green-600 text-base">{formatCurrency(inv.total_amount)}</span></div>
                      <div><span className="text-muted-foreground">Due:</span> {new Date(inv.due_date).toLocaleDateString()}</div>
                      {inv.paid_at && <div className="col-span-2 text-green-600 text-xs">Paid: {new Date(inv.paid_at).toLocaleDateString()}</div>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {inv.payment_status === 'pending' && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => markPaidMutation.mutate(inv.id)}
                        disabled={markPaidMutation.isPending}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />Mark as Paid
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
