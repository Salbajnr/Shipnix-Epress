'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from './header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import {
  Search,
  Clock,
  MapPin,
  Zap,
  Truck,
  Box,
  ShieldCheck,
  Globe,
  Timer,
  MessageCircle,
  Plane,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
} from 'lucide-react';

const SERVICES = [
  {
    icon: Zap,
    title: 'Shipnix Express',
    desc: 'Fast, reliable express delivery worldwide',
    bullets: ['Next business day', 'International express', 'Time-definite delivery'],
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
    iconColor: 'text-purple-700 dark:text-purple-300',
  },
  {
    icon: Truck,
    title: 'Shipnix Ground',
    desc: 'Cost-effective ground shipping solutions',
    bullets: ['1-5 business days', 'Residential delivery', 'Commercial delivery'],
    iconBg: 'bg-orange-100 dark:bg-orange-900/40',
    iconColor: 'text-orange-500',
  },
  {
    icon: Box,
    title: 'Shipnix Freight',
    desc: 'Less-than-truckload freight services',
    bullets: ['LTL shipping', 'Freight management', 'Supply chain solutions'],
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
];

const WHY_CHOOSE = [
  { icon: ShieldCheck, title: 'Secure & Reliable', desc: 'Your packages are protected with advanced security measures' },
  { icon: Globe, title: 'Global Network', desc: 'Reach over 220 countries and territories worldwide' },
  { icon: Timer, title: 'Time-Definite', desc: 'Guaranteed delivery times you can count on' },
];

export default function LandingPage() {
  const [trackingInput, setTrackingInput] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const first = trackingInput.split('\n').map(s => s.trim()).find(Boolean);
    if (!first) return;
    setIsTracking(true);
    router.push(`/track/${first.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden text-white py-20 px-4 bg-gradient-to-br from-purple-700 to-purple-900">
        {/* Decorative background icons */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <Plane className="absolute top-12 right-[10%] w-40 h-40 -rotate-12" />
          <Truck className="absolute bottom-16 left-[8%] w-32 h-32" />
          <Box className="absolute top-1/2 right-[25%] w-24 h-24" />
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
                Track Your Package
              </h1>
              <p className="text-lg md:text-xl mb-8 text-purple-100">
                Get real-time updates on your shipments with our advanced tracking system. Fast, reliable, and secure delivery worldwide.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-9 h-9 text-orange-400 shrink-0" />
                  <div>
                    <div className="font-semibold">Next Day</div>
                    <div className="text-sm text-purple-200">Delivery Available</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-9 h-9 text-orange-400 shrink-0" />
                  <div>
                    <div className="font-semibold">220+ Countries</div>
                    <div className="text-sm text-purple-200">Worldwide Coverage</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-semibold mb-4">Professional Package Tracking</h3>
                <p className="text-purple-100">
                  Track multiple packages with detailed information and real-time updates. Use our comprehensive tracking system below for complete package details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tracking Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Track Your Shipments
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get real-time updates on your packages with our advanced tracking system
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Tracking Form */}
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6 border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Enter Tracking Information
              </h3>
              <form onSubmit={handleTrack} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Textarea
                    value={trackingInput}
                    onChange={e => setTrackingInput(e.target.value)}
                    placeholder="Enter your tracking number(s) (one per line)"
                    className="w-full pl-10 min-h-32 resize-none focus-visible:ring-purple-700"
                    data-testid="input-tracking"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isTracking || !trackingInput.trim()}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-base font-semibold"
                  data-testid="button-track"
                >
                  {isTracking ? 'Tracking…' : 'Track Packages'}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
                  Other Tracking Options:
                </h4>
                <div className="space-y-2">
                  <Link href="/track">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-track-reference">
                      Track by Reference
                    </Button>
                  </Link>
                  <Link href="/track">
                    <Button variant="outline" className="w-full justify-start mt-2" data-testid="button-track-doortag">
                      Track by Door Tag Number
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Tracking Info Card */}
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6 border border-gray-100 dark:border-gray-800 flex flex-col justify-center text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-purple-700 dark:text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Instant Tracking Results
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Enter your tracking number on the left and see live status, location updates, and full delivery history right here.
              </p>
              <Link href="/track" className="mx-auto">
                <Button variant="outline" className="gap-2" data-testid="button-go-tracking">
                  Open Full Tracking Page <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Our Services
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              Choose from our comprehensive range of shipping and logistics solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {SERVICES.map(({ icon: Icon, title, desc, bullets, iconBg, iconColor }) => (
              <div
                key={title}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-800"
                data-testid={`card-service-${title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-7 h-7 ${iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{desc}</p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-6 text-left">
                  {bullets.map(b => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
                <Link href="/quote">
                  <Button variant="outline" className="w-full">Learn More</Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Why Choose Us */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 md:p-12 text-center border border-gray-100 dark:border-gray-800">
            <h3 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white">Why Choose Us</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {WHY_CHOOSE.map(({ icon: Icon, title, desc }) => (
                <div key={title}>
                  <Icon className="w-12 h-12 text-purple-700 dark:text-purple-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{title}</h4>
                  <p className="text-gray-600 dark:text-gray-300">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-purple-400">Shipnix</span>{' '}
                <span className="text-orange-400">Express</span>{' '}
                <span className="text-white">Shipment</span>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting people and possibilities around the world.
              </p>
              <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4" /> support@shipnix-express.com
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Our Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white">About Shipnix</Link></li>
                <li><Link href="/" className="hover:text-white">Investor Relations</Link></li>
                <li><Link href="/" className="hover:text-white">Careers</Link></li>
                <li><Link href="/" className="hover:text-white">Shipnix Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/quote" className="hover:text-white">Shipnix Express</Link></li>
                <li><Link href="/quote" className="hover:text-white">Shipnix Ground</Link></li>
                <li><Link href="/quote" className="hover:text-white">Shipnix Freight</Link></li>
                <li><Link href="/quote" className="hover:text-white">Shipnix Office</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/faq" className="hover:text-white">Customer Support</Link></li>
                <li><Link href="/quote" className="hover:text-white">Shipping Tools</Link></li>
                <li><Link href="/" className="hover:text-white">Developer Resources</Link></li>
                <li><Link href="/" className="hover:text-white">Service Updates</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <Link href="/" className="hover:text-white">Site Map</Link>
              <Link href="/" className="hover:text-white">Terms of Use</Link>
              <Link href="/" className="hover:text-white">Privacy Policy</Link>
              <Link href="/" className="hover:text-white">Security</Link>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Shipnix Express Shipment. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/14093823874"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-14 h-14 bg-green-500 hover:bg-green-600 hover:scale-110 transition-all rounded-full flex items-center justify-center text-white shadow-lg z-50"
        aria-label="Chat on WhatsApp"
        data-testid="link-whatsapp-float"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </div>
  );
}
