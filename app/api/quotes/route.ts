import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

function generateQuoteNumber() {
  return `QT-${Date.now().toString().slice(-8)}`;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);

  const weight = parseFloat(body.weight || '0');
  const baseCost = Math.max(15, weight * 8.5);
  const deliveryFee = body.delivery_time_slot === 'afternoon' ? 5
    : body.delivery_time_slot === 'evening' ? 15
    : body.delivery_time_slot === 'express' ? 25
    : body.delivery_time_slot === 'weekend' ? 20 : 0;
  const totalCost = baseCost + deliveryFee;

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('quotes')
    .insert({
      ...body,
      quote_number: generateQuoteNumber(),
      base_cost: baseCost.toFixed(2),
      delivery_fee: deliveryFee.toFixed(2),
      total_cost: totalCost.toFixed(2),
      valid_until: validUntil.toISOString(),
      status: 'pending',
      created_by: user?.id ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json(data);
}
