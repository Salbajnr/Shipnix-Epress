'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, Search, Globe, Mail, MessageCircle, Menu, X, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/track', label: 'Track' },
  { href: '/services', label: 'Services' },
  { href: '/quote', label: 'Get Quote' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'Support' },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      {/* Top Utility Bar */}
      <div className="bg-gradient-to-r from-indigo-50 via-sky-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-2 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Globe className="w-4 h-4" />
            <span>English (US)</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/contact" className="hidden sm:inline text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Contact
            </Link>
            <Link href="/track" className="hidden md:inline text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Find Locations
            </Link>
            <a
              href="mailto:support@shipnix-express.com"
              className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-full text-xs hover:bg-indigo-700 hover:scale-105 transition-all shadow-sm"
              data-testid="link-email-support"
            >
              <Mail className="w-3 h-3" /> Email
            </a>
            <a
              href="https://wa.me/14093823874"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs hover:bg-emerald-600 hover:scale-105 transition-all shadow-sm"
              data-testid="link-whatsapp"
            >
              <MessageCircle className="w-3 h-3" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group" data-testid="link-home">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Rocket className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse-ring" />
          </div>
          <div className="text-lg sm:text-xl font-extrabold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Shipnix</span>{' '}
            <span className="bg-gradient-to-r from-cyan-500 to-sky-500 bg-clip-text text-transparent">Express</span>
            <span className="hidden sm:inline text-gray-700 dark:text-gray-200"> Shipment</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(link => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  active
                    ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden xl:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-3 py-2 w-44 h-10 text-sm rounded-full border-gray-200 focus-visible:ring-indigo-500"
              data-testid="input-search"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            data-testid="button-theme-toggle"
            className="rounded-full h-10 w-10"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Link href="/quote" className="hidden sm:block">
            <Button
              size="sm"
              className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/30 hover:shadow-lg hover:scale-105 transition-all px-5"
              data-testid="button-get-started"
            >
              Get a Quote
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full h-10 w-10"
            onClick={() => setMobileOpen(o => !o)}
            data-testid="button-mobile-menu"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-white dark:bg-gray-950 animate-fade-in">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-colors"
                data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
