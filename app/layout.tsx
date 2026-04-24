import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import QueryProvider from '@/components/query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shipnix-Express - Global Logistics Solutions',
  description: 'Fast, dependable logistics solutions delivering to 220+ countries. Real-time tracking, automated notifications, and seamless shipment management.',
  openGraph: {
    title: 'Shipnix-Express - Global Logistics Solutions',
    description: 'Delivering shipments quickly and securely to over 220 countries and territories.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
