import Header from '@/components/header';
import PublicTrackingClient from '@/components/public-tracking-client';

export const metadata = { title: 'Track Package - Shipnix-Express' };

export default function TrackByIdPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <PublicTrackingClient initialId={params.id} />
    </div>
  );
}
