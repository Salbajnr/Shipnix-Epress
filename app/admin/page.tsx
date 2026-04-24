import { createClient } from '@/lib/supabase/server';
import AdminDashboardClient from '@/components/admin-dashboard-client';

export const metadata = { title: 'Admin Dashboard - Shipnix-Express' };

export default async function AdminPage() {
  const supabase = await createClient();
  const [
    { count: packagesCount },
    { count: quotesCount },
    { count: invoicesCount },
  ] = await Promise.all([
    supabase.from('packages').select('*', { count: 'exact', head: true }),
    supabase.from('quotes').select('*', { count: 'exact', head: true }),
    supabase.from('invoices').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <AdminDashboardClient
      stats={{
        packages: packagesCount ?? 0,
        quotes: quotesCount ?? 0,
        invoices: invoicesCount ?? 0,
      }}
    />
  );
}
