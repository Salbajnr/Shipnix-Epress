import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { generateTrackingId } from '@/lib/utils';
import QRCode from 'qrcode';

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { data: invoice, error } = await supabase
    .from('invoices')
    .update({ payment_status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', parseInt(params.id))
    .select()
    .single();

  if (error || !invoice) return NextResponse.json({ message: 'Invoice not found' }, { status: 404 });

  if (invoice.quote_id) {
    const { data: quote } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', invoice.quote_id)
      .single();

    if (quote) {
      const trackingId = generateTrackingId();
      const qrCode = await QRCode.toDataURL(trackingId, {
        width: 200, margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' },
      });

      const { data: pkg } = await supabase
        .from('packages')
        .insert({
          tracking_id: trackingId,
          qr_code: qrCode,
          sender_name: quote.sender_name,
          sender_email: quote.sender_email,
          sender_phone: quote.sender_phone,
          sender_address: quote.sender_address,
          recipient_name: quote.recipient_name,
          recipient_email: quote.recipient_email,
          recipient_phone: quote.recipient_phone,
          recipient_address: quote.recipient_address,
          package_description: quote.package_description,
          weight: quote.weight,
          dimensions: quote.dimensions,
          shipping_cost: quote.total_cost,
          payment_status: 'paid',
          current_status: 'created',
          created_by: user.id,
        })
        .select()
        .single();

      if (pkg) {
        await supabase.from('tracking_events').insert({
          package_id: pkg.id,
          status: 'created',
          location: 'Package created after payment',
          description: 'Package registered after invoice payment',
          timestamp: new Date().toISOString(),
        });

        return NextResponse.json({
          invoice,
          package: pkg,
          trackingId,
          message: 'Payment confirmed! Package created with tracking ID.',
        });
      }
    }
  }

  return NextResponse.json({ invoice, message: 'Payment confirmed' });
}
