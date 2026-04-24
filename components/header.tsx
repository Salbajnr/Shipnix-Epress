'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, Search, ShoppingCart, User as UserIcon, Mail, MessageCircle, Globe, Package, MapPin, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="border-b bg-white dark:bg-gray-950">
      {/* Top Utility Bar */}
      <div className="bg-gray-50 dark:bg-gray-900 py-2 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Globe className="w-4 h-4" />
            <span>English</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/faq" className="hidden sm:inline text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400">
              Contact
            </Link>
            <Link href="/track" className="hidden sm:inline text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400">
              Find Locations
            </Link>
            <a
              href="mailto:support@shipnix-express.com"
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
              data-testid="link-email-support"
            >
              <Mail className="w-3 h-3" /> Email Support
            </a>
            <a
              href="https://wa.me/14093823874"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
              data-testid="link-whatsapp"
            >
              <MessageCircle className="w-3 h-3" /> WhatsApp
            </a>
            <Link
              href="/admin"
              className="bg-purple-700 text-white px-3 py-1 rounded text-xs hover:bg-purple-800 transition-colors"
              data-testid="link-management"
            >
              Management
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0" data-testid="link-home">
          <div className="w-9 h-9 bg-purple-700 rounded-md flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div className="text-xl sm:text-2xl font-bold leading-tight">
            <span className="text-purple-700 dark:text-purple-400">Shipnix</span>
            <span className="text-orange-500"> Express</span>
            <span className="hidden sm:inline text-gray-700 dark:text-gray-200"> Shipment</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <Link href="/track" className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200 hover:text-purple-700 dark:hover:text-purple-400 font-medium transition-colors" data-testid="link-track">
            <Package className="w-4 h-4" /> Track
          </Link>
          <Link href="/faq" className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200 hover:text-purple-700 dark:hover:text-purple-400 font-medium transition-colors" data-testid="link-support">
            <LifeBuoy className="w-4 h-4" /> Support
          </Link>
          <Link href="/quote" className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200 hover:text-purple-700 dark:hover:text-purple-400 font-medium transition-colors" data-testid="link-quote">
            <MapPin className="w-4 h-4" /> Get Quote
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search shipnix-express.com"
              className="pl-9 pr-3 py-2 w-56 h-9 text-sm focus-visible:ring-purple-700"
              data-testid="input-search"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            data-testid="button-theme-toggle"
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {user ? (
            <>
              <Link href="/admin">
                <Button variant="outline" size="sm" data-testid="button-dashboard">Dashboard</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} data-testid="button-logout">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="outline" size="sm" className="gap-2" data-testid="button-login">
                  <UserIcon className="w-4 h-4" /> Log In
                </Button>
              </Link>
              <Button variant="outline" size="icon" className="h-9 w-9 hidden md:inline-flex" data-testid="button-cart">
                <ShoppingCart className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
