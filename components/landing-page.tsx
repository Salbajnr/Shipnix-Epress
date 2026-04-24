'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from './header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Globe, Clock, Shield, Zap, Search, ArrowRight, CheckCircle, Truck, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

const FEATURES = [
  { icon: Globe, title: '220+ Countries', desc: 'Delivering worldwide with trusted partners' },
  { icon: Clock, title: 'Real-time Tracking', desc: 'Live updates at every stage of delivery' },
  { icon: Shield, title: 'Fully Insured', desc: 'All shipments covered up to full value' },
  { icon: Zap, title: 'Express Delivery', desc: 'Same-day and next-day options available' },
];

const STATS = [
  { value: '220+', label: 'Countries' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
  { value: '2M+', label: 'Shipments' },
];

export default function LandingPage() {
  const [trackingId, setTrackingId] = useState('');
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) router.push(`/track/${trackingId.trim().toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-24 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm px-4 py-2 rounded-full mb-8 font-medium">
            <Zap className="w-4 h-4" /> Lightning Fast Global Delivery
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            The Future of <span className="text-blue-600 dark:text-blue-400">Logistics</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Experience next-generation shipping technology. Connect your business to 220+ countries with AI-powered logistics, real-time tracking, and seamless integration.
          </p>

          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-10">
            <Input
              value={trackingId}
              onChange={e => setTrackingId(e.target.value.toUpperCase())}
              placeholder="Enter tracking ID (ST-XXXXXXXX)"
              className="flex-1 font-mono text-center sm:text-left py-6"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-8 py-6">
              <Search className="w-4 h-4 mr-2" /> Track
            </Button>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login"><Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">Admin Login</Button></Link>
            <Link href="/quote"><Button size="lg" variant="outline" className="px-8">Get a Quote <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y bg-white dark:bg-gray-800">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{s.value}</div>
                <div className="text-muted-foreground text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">Why Choose Shipnix-Express?</h2>
          <p className="text-center text-muted-foreground mb-12">Built for businesses that demand reliability</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-600 dark:bg-blue-800">
        <div className="container mx-auto max-w-3xl text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Ship Globally?</h2>
          <p className="text-blue-100 text-lg mb-8">Get started in minutes. No contracts, no hidden fees.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote"><Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8">Get Instant Quote</Button></Link>
            <Link href="/track"><Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700 px-8">Track a Package</Button></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} Shipnix-Express. All rights reserved.</p>
      </footer>
    </div>
  );
}
