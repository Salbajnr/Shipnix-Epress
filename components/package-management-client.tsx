'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Plus, QrCode, MapPin, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Package as PackageType } from '@/lib/types';
import { formatCurrency, formatStatus } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  pending_payment: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  created: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  picked_up: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  in_transit: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  out_for_delivery: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  failed_delivery: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  returned: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
};

const STATUSES = ['created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed_delivery', 'returned'];

export default function PackageManagementClient() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<PackageType | null>(null);
  const [statusForm, setStatusForm] = useState({ status: '', location: '', description: '' });
  const [form, setForm] = useState({
    sender_name: '', sender_address: '', sender_email: '', sender_phone: '',
    recipient_name: '', recipient_address: '', recipient_email: '', recipient_phone: '',
    package_description: '', weight: '', dimensions: '', shipping_cost: '',
    estimated_delivery: '', payment_status: 'paid',
  });

  const { data: packagesRaw, isLoading } = useQuery<PackageType[]>({
    queryKey: ['/api/packages'],
  });
  const packages = Array.isArray(packagesRaw) ? packagesRaw : [];

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/packages', data),
    onSuccess: (pkg) => {
      toast({ title: 'Package Created', description: `Tracking ID: ${pkg.tracking_id}` });
      qc.invalidateQueries({ queryKey: ['/api/packages'] });
      setShowCreate(false);
      setForm({ sender_name: '', sender_address: '', sender_email: '', sender_phone: '',
        recipient_name: '', recipient_address: '', recipient_email: '', recipient_phone: '',
        package_description: '', weight: '', dimensions: '', shipping_cost: '',
        estimated_delivery: '', payment_status: 'paid' });
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, data }: any) => apiRequest('PATCH', `/api/packages/${id}/status`, data),
    onSuccess: () => {
      toast({ title: 'Status Updated' });
      qc.invalidateQueries({ queryKey: ['/api/packages'] });
      setShowStatus(false);
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const handleCreate = () => {
    if (!form.sender_name || !form.sender_address || !form.recipient_name || !form.recipient_address) {
      toast({ title: 'Validation Error', description: 'Sender and recipient name/address are required', variant: 'destructive' });
      return;
    }
    createMutation.mutate(form);
  };

  const handleStatusUpdate = () => {
    if (!selectedPkg || !statusForm.status) return;
    statusMutation.mutate({ id: selectedPkg.id, data: statusForm });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Package Management</h1>
          <p className="text-muted-foreground mt-1">Create packages, update status, manage tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm px-3 py-1">{packages.length} Packages</Badge>
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" />Create Package</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Create New Package</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="col-span-2 font-semibold text-sm text-blue-700 dark:text-blue-400 border-b pb-1">Sender Details</div>
                {[['sender_name','Sender Name*'],['sender_email','Sender Email'],['sender_phone','Sender Phone']].map(([k, l]) => (
                  <div key={k}>
                    <Label>{l}</Label>
                    <Input value={(form as any)[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))} />
                  </div>
                ))}
                <div className="col-span-2">
                  <Label>Sender Address*</Label>
                  <Textarea value={form.sender_address} onChange={e => setForm(f => ({...f,sender_address:e.target.value}))} rows={2} />
                </div>
                <div className="col-span-2 font-semibold text-sm text-blue-700 dark:text-blue-400 border-b pb-1 mt-2">Recipient Details</div>
                {[['recipient_name','Recipient Name*'],['recipient_email','Recipient Email'],['recipient_phone','Recipient Phone']].map(([k, l]) => (
                  <div key={k}>
                    <Label>{l}</Label>
                    <Input value={(form as any)[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))} />
                  </div>
                ))}
                <div className="col-span-2">
                  <Label>Recipient Address*</Label>
                  <Textarea value={form.recipient_address} onChange={e => setForm(f => ({...f,recipient_address:e.target.value}))} rows={2} />
                </div>
                <div className="col-span-2 font-semibold text-sm text-blue-700 dark:text-blue-400 border-b pb-1 mt-2">Package Details</div>
                <div className="col-span-2">
                  <Label>Package Description*</Label>
                  <Textarea value={form.package_description} onChange={e => setForm(f => ({...f,package_description:e.target.value}))} rows={2} />
                </div>
                {[['weight','Weight (kg)*'],['dimensions','Dimensions (LxWxH)'],['shipping_cost','Shipping Cost ($)*']].map(([k, l]) => (
                  <div key={k}>
                    <Label>{l}</Label>
                    <Input value={(form as any)[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))} type={k==='weight'||k==='shipping_cost'?'number':'text'} />
                  </div>
                ))}
                <div>
                  <Label>Estimated Delivery</Label>
                  <Input type="date" value={form.estimated_delivery} onChange={e => setForm(f => ({...f,estimated_delivery:e.target.value}))} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleCreate} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Package & Generate Tracking ID'}
                </Button>
                <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
      ) : packages.length === 0 ? (
        <Card><CardContent className="text-center py-16">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">No packages yet</h3>
          <p className="text-muted-foreground text-sm">Create your first package to get started</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-bold text-lg text-blue-700 dark:text-blue-400">{pkg.tracking_id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[pkg.current_status] ?? 'bg-gray-100 text-gray-800'}`}>
                        {formatStatus(pkg.current_status)}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                      <div><span className="text-muted-foreground">From:</span> <span className="font-medium">{pkg.sender_name}</span></div>
                      <div><span className="text-muted-foreground">To:</span> <span className="font-medium">{pkg.recipient_name}</span></div>
                      <div className="text-muted-foreground truncate">{pkg.sender_address}</div>
                      <div className="text-muted-foreground truncate">{pkg.recipient_address}</div>
                      {pkg.package_description && <div className="col-span-2 text-muted-foreground">📦 {pkg.package_description}</div>}
                      {pkg.shipping_cost && <div><span className="text-muted-foreground">Cost:</span> {formatCurrency(pkg.shipping_cost)}</div>}
                      {pkg.current_location && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-3 h-3" />{pkg.current_location}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {pkg.qr_code && (
                      <img src={pkg.qr_code} alt="QR Code" className="w-16 h-16 border rounded" />
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setSelectedPkg(pkg); setStatusForm({ status: pkg.current_status, location: pkg.current_location ?? '', description: '' }); setShowStatus(true); }}
                    >
                      <Truck className="w-3 h-3 mr-1" />Update Status
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showStatus} onOpenChange={setShowStatus}>
        <DialogContent>
          <DialogHeader><DialogTitle>Update Package Status</DialogTitle></DialogHeader>
          {selectedPkg && (
            <div className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">Package: <span className="font-medium">{selectedPkg.tracking_id}</span></p>
              <div>
                <Label>New Status</Label>
                <Select value={statusForm.status} onValueChange={v => setStatusForm(f => ({...f,status:v}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map(s => <SelectItem key={s} value={s}>{formatStatus(s)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Current Location</Label>
                <Input value={statusForm.location} onChange={e => setStatusForm(f => ({...f,location:e.target.value}))} placeholder="e.g. New York Distribution Center" />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={statusForm.description} onChange={e => setStatusForm(f => ({...f,description:e.target.value}))} rows={2} />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleStatusUpdate} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={statusMutation.isPending}>
                  {statusMutation.isPending ? 'Updating...' : 'Update Status'}
                </Button>
                <Button variant="outline" onClick={() => setShowStatus(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
