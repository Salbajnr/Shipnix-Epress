'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Package, MapPin, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { formatStatus } from '@/lib/utils';

interface TrackingResult {
  tracking_id: string;
  current_status: string;
  current_location?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  recipient_name: string;
  recipient_address: string;
  sender_name: string;
  package_description?: string;
  shipping_cost?: string;
  created_at: string;
  trackingEvents: Array<{
    id: number;
    status: string;
    location?: string;
    description?: string;
    timestamp: string;
  }>;
}

const STATUS_ICONS: Record<string, any> = {
  created: Package,
  picked_up: Package,
  in_transit: Truck,
  out_for_delivery: Truck,
  delivered: CheckCircle,
  failed_delivery: AlertCircle,
  returned: AlertCircle,
};

const STATUS_COLORS: Record<string, string> = {
  delivered: 'bg-green-100 text-green-800 border-green-200',
  in_transit: 'bg-blue-100 text-blue-800 border-blue-200',
  out_for_delivery: 'bg-purple-100 text-purple-800 border-purple-200',
  failed_delivery: 'bg-red-100 text-red-800 border-red-200',
  created: 'bg-gray-100 text-gray-800 border-gray-200',
};

export default function PublicTrackingClient({ initialId }: { initialId?: string }) {
  const [trackingId, setTrackingId] = useState(initialId ?? '');
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (initialId) handleTrack(initialId);
  }, [initialId]);

  const handleTrack = async (id?: string) => {
    const searchId = (id ?? trackingId).trim().toUpperCase();
    if (!searchId) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`/api/track/${searchId}`);
      if (!res.ok) { setError('Package not found. Please check the tracking ID and try again.'); return; }
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Failed to fetch tracking info. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Track Your Shipment</h1>
        <p className="text-muted-foreground text-lg">Enter your tracking ID to see real-time delivery updates</p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <Input
              value={trackingId}
              onChange={e => setTrackingId(e.target.value.toUpperCase())}
              placeholder="Enter tracking ID (e.g. ST-ABC123456)"
              className="flex-1 font-mono"
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
            />
            <Button onClick={() => handleTrack()} className="bg-blue-600 hover:bg-blue-700 px-6" disabled={loading}>
              <Search className="w-4 h-4 mr-2" />{loading ? 'Searching...' : 'Track'}
            </Button>
          </div>
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Tracking ID</p>
                  <p className="text-xl font-bold font-mono text-blue-700 dark:text-blue-400">{result.tracking_id}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${STATUS_COLORS[result.current_status] ?? 'bg-gray-100 text-gray-800'}`}>
                  {formatStatus(result.current_status)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Sender</p>
                  <p className="font-medium">{result.sender_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Recipient</p>
                  <p className="font-medium">{result.recipient_name}</p>
                  <p className="text-muted-foreground text-xs">{result.recipient_address}</p>
                </div>
                {result.current_location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground mb-0.5">Current Location</p>
                      <p className="font-medium">{result.current_location}</p>
                    </div>
                  </div>
                )}
                {result.estimated_delivery && (
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground mb-0.5">Estimated Delivery</p>
                      <p className="font-medium">{new Date(result.estimated_delivery).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Tracking History</CardTitle></CardHeader>
            <CardContent>
              {result.trackingEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm">No tracking events yet</p>
              ) : (
                <div className="relative space-y-4">
                  {result.trackingEvents.map((event, i) => {
                    const Icon = STATUS_ICONS[event.status] ?? Package;
                    return (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {i < result.trackingEvents.length - 1 && <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 mt-2" />}
                        </div>
                        <div className="pb-4">
                          <p className="font-medium text-sm">{formatStatus(event.status)}</p>
                          {event.description && <p className="text-muted-foreground text-sm">{event.description}</p>}
                          {event.location && (
                            <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />{event.location}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
