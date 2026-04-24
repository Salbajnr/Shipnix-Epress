import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const trackingId = params.id.toUpperCase();

  const { data: pkg, error } = await supabase
    .from('packages')
    .select('*')
    .eq('tracking_id', trackingId)
    .single();

  if (error || !pkg) {
    return NextResponse.json({ message: 'Package not found' }, { status: 404 });
  }

  const { data: events } = await supabase
    .from('tracking_events')
    .select('*')
    .eq('package_id', pkg.id)
    .order('timestamp', { ascending: false });

  return NextResponse.json({ ...pkg, trackingEvents: events ?? [] });
}
