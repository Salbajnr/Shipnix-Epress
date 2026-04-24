import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const STATUS_DESCRIPTIONS: Record<string, string> = {
  created: 'Package has been registered for shipping',
  picked_up: 'Package has been picked up by courier',
  in_transit: 'Package is on its way to destination',
  out_for_delivery: 'Package is out for delivery',
  delivered: 'Package has been successfully delivered',
  failed_delivery: 'Delivery attempt failed',
  returned: 'Package is being returned to sender',
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { status, location, description } = await req.json();

  const updates: any = {
    current_status: status,
    updated_at: new Date().toISOString(),
  };
  if (location) updates.current_location = location;
  if (status === 'delivered') updates.actual_delivery = new Date().toISOString();

  const { data, error } = await supabase
    .from('packages')
    .update(updates)
    .eq('id', parseInt(params.id))
    .select()
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  await supabase.from('tracking_events').insert({
    package_id: parseInt(params.id),
    status,
    location: location ?? '',
    description: description ?? STATUS_DESCRIPTIONS[status] ?? 'Status updated',
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json(data);
}
