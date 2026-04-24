import AdminSidebar from '@/components/admin-sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabaseConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (!supabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔧</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Setup Required</h1>
          <p className="text-gray-600 mb-4">Please add your Supabase credentials to enable authentication:</p>
          <div className="text-left bg-gray-50 rounded-lg p-4 text-sm font-mono space-y-1">
            <p className="text-blue-700">NEXT_PUBLIC_SUPABASE_URL</p>
            <p className="text-blue-700">NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
          </div>
          <p className="text-gray-500 text-sm mt-4">Add these in the Secrets/Environment panel, then reload.</p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
