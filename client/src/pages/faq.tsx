import Header from "@/components/Header";
import FAQ from "@/components/FAQ";
import LiveChat from "@/components/LiveChat";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <Header showUserMenu={false} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FAQ />
      </div>

      <LiveChat />
    </div>
  );
}