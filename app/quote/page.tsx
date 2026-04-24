import Header from '@/components/header';
import QuoteRequestClient from '@/components/quote-request-client';

export const metadata = { title: 'Get a Quote - Shipnix-Express' };

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <QuoteRequestClient />
    </div>
  );
}
