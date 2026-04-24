'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileText, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatStatus } from '@/lib/utils';
import type { Quote } from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  converted_to_invoice: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};

export default function QuoteManagementClient() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showStatus, setShowStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const { data: quotesRaw, isLoading } = useQuery<Quote[]>({ queryKey: ['/api/quotes'] });
  const quotes = Array.isArray(quotesRaw) ? quotesRaw : [];

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => apiRequest('PATCH', `/api/quotes/${id}`, data),
    onSuccess: () => {
      toast({ title: 'Quote Updated' });
      qc.invalidateQueries({ queryKey: ['/api/quotes'] });
      setShowStatus(false);
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const convertMutation = useMutation({
    mutationFn: (quoteId: number) => apiRequest('POST', `/api/invoices`, {
      customer_name: selectedQuote?.sender_name,
      customer_email: selectedQuote?.sender_email,
      total_amount: selectedQuote?.total_cost,
      tax_amount: '0',
      payment_method: 'card',
      payment_status: 'pending',
      due_date: new Date(Date.now() + 7 * 86400000).toISOString(),
      items: [{ description: selectedQuote?.package_description ?? 'Shipping', amount: selectedQuote?.total_cost }],
      quote_id: quoteId,
    }),
    onSuccess: (invoice) => {
      if (selectedQuote) {
        updateMutation.mutate({ id: selectedQuote.id, data: { status: 'converted_to_invoice' } });
      }
      toast({ title: 'Invoice Created', description: `Invoice ${invoice.invoice_number} created` });
      qc.invalidateQueries({ queryKey: ['/api/invoices'] });
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quote Management</h1>
          <p className="text-muted-foreground mt-1">Review and manage shipping quotes</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">{quotes.length} Quotes</Badge>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
      ) : quotes.length === 0 ? (
        <Card><CardContent className="text-center py-16">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold">No quotes yet</h3>
          <p className="text-muted-foreground text-sm mt-1">Quotes will appear here when customers request them</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <Card key={q.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="font-bold text-blue-700 dark:text-blue-400">{q.quote_number}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[q.status] ?? 'bg-gray-100 text-gray-800'}`}>
                        {formatStatus(q.status)}
                      </span>
                      {new Date(q.valid_until) < new Date() && q.status === 'pending' && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">Expired</span>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                      <div><span className="text-muted-foreground">From:</span> <span className="font-medium">{q.sender_name}</span></div>
                      <div><span className="text-muted-foreground">To:</span> <span className="font-medium">{q.recipient_name}</span></div>
                      <div><span className="text-muted-foreground">Base Cost:</span> {formatCurrency(q.base_cost)}</div>
                      <div><span className="text-muted-foreground">Total:</span> <span className="font-semibold text-green-600">{formatCurrency(q.total_cost)}</span></div>
                      {q.package_description && <div className="col-span-2 text-muted-foreground">{q.package_description}</div>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Valid until: {new Date(q.valid_until).toLocaleDateString()} · Created: {new Date(q.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {q.status === 'pending' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700"
                          onClick={() => updateMutation.mutate({ id: q.id, data: { status: 'approved' } })}>
                          <CheckCircle className="w-3 h-3 mr-1" />Approve
                        </Button>
                        <Button size="sm" variant="destructive"
                          onClick={() => updateMutation.mutate({ id: q.id, data: { status: 'expired' } })}>
                          <XCircle className="w-3 h-3 mr-1" />Decline
                        </Button>
                      </>
                    )}
                    {q.status === 'approved' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => { setSelectedQuote(q); convertMutation.mutate(q.id); }}>
                        <ArrowRight className="w-3 h-3 mr-1" />Convert to Invoice
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
