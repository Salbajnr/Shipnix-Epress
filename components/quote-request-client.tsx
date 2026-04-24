'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const TIME_SLOTS = [
  { value: 'morning', label: 'Morning (8AM - 12PM)', fee: 0 },
  { value: 'afternoon', label: 'Afternoon (12PM - 5PM)', fee: 5 },
  { value: 'evening', label: 'Evening (5PM - 8PM)', fee: 15 },
  { value: 'express', label: 'Express (Same Day)', fee: 25 },
  { value: 'weekend', label: 'Weekend', fee: 20 },
];

export default function QuoteRequestClient() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [form, setForm] = useState({
    sender_name: '', sender_email: '', sender_phone: '', sender_address: '',
    recipient_name: '', recipient_email: '', recipient_phone: '', recipient_address: '',
    package_description: '', weight: '', dimensions: '', delivery_time_slot: 'morning',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sender_name || !form.sender_address || !form.recipient_name || !form.recipient_address) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest('POST', '/api/quotes', form);
      setResult(data);
      toast({ title: 'Quote Generated!', description: `Quote ${data.quote_number} created successfully` });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="border-green-200">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-700">Quote Generated!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 text-center">
              <p className="text-sm text-muted-foreground">Quote Number</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400 font-mono">{result.quote_number}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">Base Cost</p>
                <p className="font-bold text-lg">{formatCurrency(result.base_cost)}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">Delivery Fee</p>
                <p className="font-bold text-lg">{formatCurrency(result.delivery_fee)}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-bold text-xl text-blue-700 dark:text-blue-400">{formatCurrency(result.total_cost)}</p>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Valid until {new Date(result.valid_until).toLocaleDateString()}. Our team will contact you to confirm.
            </p>
            <Button onClick={() => setResult(null)} variant="outline" className="w-full">Request Another Quote</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <Calculator className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Get a Shipping Quote</h1>
        <p className="text-muted-foreground text-lg">Instant pricing for global shipments</p>
      </div>
      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-3 pb-1 border-b">Sender Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[['sender_name','Full Name*'],['sender_email','Email'],['sender_phone','Phone']].map(([k,l]) => (
                  <div key={k}><Label>{l}</Label><Input value={(form as any)[k]} onChange={e => set(k,e.target.value)} /></div>
                ))}
                <div className="sm:col-span-2"><Label>Address*</Label><Textarea value={form.sender_address} onChange={e => set('sender_address',e.target.value)} rows={2} /></div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-3 pb-1 border-b">Recipient Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[['recipient_name','Full Name*'],['recipient_email','Email'],['recipient_phone','Phone']].map(([k,l]) => (
                  <div key={k}><Label>{l}</Label><Input value={(form as any)[k]} onChange={e => set(k,e.target.value)} /></div>
                ))}
                <div className="sm:col-span-2"><Label>Address*</Label><Textarea value={form.recipient_address} onChange={e => set('recipient_address',e.target.value)} rows={2} /></div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-3 pb-1 border-b">Package Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><Label>Description</Label><Textarea value={form.package_description} onChange={e => set('package_description',e.target.value)} rows={2} /></div>
                <div><Label>Weight (kg)</Label><Input type="number" value={form.weight} onChange={e => set('weight',e.target.value)} /></div>
                <div><Label>Dimensions (LxWxH cm)</Label><Input value={form.dimensions} onChange={e => set('dimensions',e.target.value)} /></div>
                <div className="sm:col-span-2">
                  <Label>Delivery Time Slot</Label>
                  <Select value={form.delivery_time_slot} onValueChange={v => set('delivery_time_slot',v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label} {s.fee > 0 ? `(+$${s.fee})` : '(free)'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-base" disabled={loading}>
              {loading ? 'Calculating...' : 'Get Instant Quote'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
