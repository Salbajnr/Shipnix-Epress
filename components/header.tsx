'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, Package, LogIn, MessageCircle, FileText, Calculator, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <span className="text-blue-700 dark:text-blue-400">Shipnix</span>
          <span className="text-gray-800 dark:text-gray-200">-Express</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/track" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <Package className="w-4 h-4" /> Track Package
          </Link>
          <Link href="/quote" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <Calculator className="w-4 h-4" /> Get Quote
          </Link>
          <Link href="/faq" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <HelpCircle className="w-4 h-4" /> Support
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {user ? (
            <>
              {user.email?.includes('admin') || true ? (
                <Link href="/admin">
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
              ) : null}
              <Button variant="ghost" size="sm" onClick={handleLogout}>Sign Out</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <LogIn className="w-4 h-4 mr-2" /> Admin Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
