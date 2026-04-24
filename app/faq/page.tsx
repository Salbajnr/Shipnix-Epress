import Header from '@/components/header';
import FAQClient from '@/components/faq-client';

export const metadata = { title: 'FAQ & Support - Shipnix-Express' };

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <FAQClient />
    </div>
  );
}
