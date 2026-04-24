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
  PackageCheck,
  ShieldCheck,
  Globe2,
  Timer,
  MessageCircle,
  Plane,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Headphones,
  Award,
  CheckCircle2,
  Boxes,
  Warehouse,
} from 'lucide-react';

const SERVICES = [
  {
    icon: Zap,
    title: 'Express Delivery',
    desc: 'Lightning-fast shipping when every minute counts.',
    bullets: ['Next business day', 'International express', 'Time-definite delivery'],
    gradient: 'from-indigo-500 to-violet-600',
    bgGlow: 'bg-indigo-500/10',
  },
  {
    icon: Truck,
    title: 'Ground Shipping',
    desc: 'Cost-effective ground shipping at scale.',
    bullets: ['1-5 business days', 'Residential delivery', 'Commercial delivery'],
    gradient: 'from-cyan-500 to-sky-600',
    bgGlow: 'bg-cyan-500/10',
  },
  {
    icon: Warehouse,
    title: 'Freight & Logistics',
    desc: 'Less-than-truckload and full freight services.',
    bullets: ['LTL & FTL shipping', 'Freight management', 'Supply chain solutions'],
    gradient: 'from-amber-500 to-orange-500',
    bgGlow: 'bg-amber-500/10',
  },
];

const WHY_CHOOSE = [
  {
    icon: ShieldCheck,
    title: 'Secure & Insured',
    desc: 'End-to-end protection with full-value insurance on every shipment.',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-100 dark:bg-indigo-900/40',
  },
  {
    icon: Globe2,
    title: 'Worldwide Reach',
    desc: 'Connect to 220+ countries through our global partner network.',
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-100 dark:bg-cyan-900/40',
  },
  {
    icon: Timer,
    title: 'Time-Definite',
    desc: 'Guaranteed delivery windows you can plan your business around.',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/40',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'Real humans available around the clock to answer your questions.',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/40',
  },
];

const STATS = [
  { value: '220+', label: 'Countries' },
  { value: '99.9%', label: 'On-time Rate' },
  { value: '24/7', label: 'Support' },
  { value: '5M+', label: 'Shipments' },
];

const STEPS = [
  { num: '01', title: 'Request a Quote', desc: 'Tell us about your shipment in seconds.' },
  { num: '02', title: 'Drop or Pickup', desc: 'Drop at any partner location or schedule a pickup.' },
  { num: '03', title: 'Track Live', desc: 'Watch your shipment move in real time.' },
  { num: '04', title: 'Delivered', desc: 'Signed, sealed, and delivered worldwide.' },
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
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative text-white pt-20 pb-28 px-4">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-violet-700 to-cyan-600 animate-gradient-x" />

        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/3 -right-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-violet-400/30 rounded-full blur-3xl animate-float" />
        </div>

        {/* Floating icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Plane className="absolute top-20 right-[12%] w-20 h-20 text-white/10 animate-float -rotate-12" />
          <Truck className="absolute bottom-24 left-[8%] w-24 h-24 text-white/10 animate-float-slow" />
          <PackageCheck className="absolute top-1/2 right-[28%] w-16 h-16 text-white/10 animate-bounce-slow" />
          <Boxes className="absolute top-32 left-[20%] w-14 h-14 text-white/10 animate-float-slow" />
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-sm mb-6 shadow-lg">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Trusted by 5M+ shippers worldwide</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight" data-testid="text-hero-title">
                Ship Smarter.{' '}
                <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-cyan-200 bg-clip-text text-transparent">
                  Track Faster.
                </span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-indigo-100/90 max-w-xl">
                Real-time visibility, global reach, and reliable delivery — all in one beautifully simple platform built for modern logistics.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="/track">
                  <Button
                    size="lg"
                    className="rounded-full bg-white text-indigo-700 hover:bg-amber-300 hover:text-indigo-800 hover:scale-105 transition-all shadow-xl px-7 font-semibold"
                    data-testid="button-track-shipment"
                  >
                    Track a Shipment <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/quote">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white/40 bg-white/10 backdrop-blur text-white hover:bg-white/20 hover:scale-105 transition-all px-7"
                    data-testid="button-get-quote"
                  >
                    Get a Free Quote
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3 animate-fade-in-up delay-200">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 backdrop-blur border border-amber-300/30 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-semibold">Next-Day</div>
                    <div className="text-sm text-indigo-200">Delivery Available</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 animate-fade-in-up delay-300">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-400/20 backdrop-blur border border-cyan-300/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div>
                    <div className="font-semibold">220+ Countries</div>
                    <div className="text-sm text-indigo-200">Worldwide Coverage</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="animate-fade-in-up delay-200 hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-br from-amber-400/20 via-cyan-400/20 to-violet-400/20 rounded-3xl blur-2xl" />
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-xs text-indigo-200 uppercase tracking-wider mb-1">Live Tracking</div>
                      <div className="text-xl font-bold">SNX-2847391</div>
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 text-xs font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      In Transit
                    </div>
                  </div>

                  {/* Mini timeline */}
                  <div className="space-y-4">
                    {[
                      { label: 'Picked up', loc: 'London, UK', done: true },
                      { label: 'In transit', loc: 'Frankfurt Hub', done: true },
                      { label: 'Out for delivery', loc: 'Berlin, DE', done: false },
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          step.done ? 'bg-emerald-400/30 text-emerald-200' : 'bg-white/10 text-indigo-200'
                        }`}>
                          {step.done ? <CheckCircle2 className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{step.label}</div>
                          <div className="text-xs text-indigo-200">{step.loc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-sm">
                    <span className="text-indigo-200">ETA</span>
                    <span className="font-semibold">Tomorrow, 2:30 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <svg className="absolute -bottom-1 left-0 right-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C320,80 720,0 1440,40 L1440,80 L0,80 Z" fill="currentColor" className="text-white dark:text-gray-950" />
        </svg>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`text-center p-6 rounded-3xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all animate-fade-in-up`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Search className="w-4 h-4" /> Live Tracking
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
              Track Your Shipment
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Enter your tracking number for real-time status updates and complete delivery history.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-indigo-500/5 p-8 border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-shadow animate-fade-in-up">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-indigo-600" />
                Enter Tracking Information
              </h3>
              <form onSubmit={handleTrack} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                  <Textarea
                    value={trackingInput}
                    onChange={e => setTrackingInput(e.target.value)}
                    placeholder="Enter your tracking number(s) — one per line"
                    className="w-full pl-11 pt-3.5 min-h-32 resize-none rounded-2xl border-gray-200 dark:border-gray-700 focus-visible:ring-indigo-500"
                    data-testid="input-tracking"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isTracking || !trackingInput.trim()}
                  className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-6 text-base font-semibold shadow-lg shadow-indigo-500/30 hover:scale-[1.02] transition-all"
                  data-testid="button-track"
                >
                  {isTracking ? 'Tracking…' : 'Track Now'} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 grid grid-cols-2 gap-3">
                <Link href="/track">
                  <Button variant="outline" className="w-full rounded-full border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors" data-testid="button-track-reference">
                    By Reference
                  </Button>
                </Link>
                <Link href="/track">
                  <Button variant="outline" className="w-full rounded-full border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors" data-testid="button-track-doortag">
                    By Door Tag
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 flex flex-col justify-center relative overflow-hidden animate-fade-in-up delay-200">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-300/20 rounded-full blur-2xl" />

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-5 animate-float">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Real-Time Visibility</h3>
                <p className="text-indigo-100 mb-6 leading-relaxed">
                  Watch your packages move across cities, hubs, and continents — with instant push updates the moment something changes.
                </p>
                <ul className="space-y-2.5 mb-6 text-sm">
                  {['Live GPS-style status updates', 'Email & SMS notifications', 'Full delivery history & proof'].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/track">
                  <Button className="rounded-full bg-white text-indigo-700 hover:bg-amber-300 hover:scale-105 transition-all" data-testid="button-go-tracking">
                    Open Full Tracking <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" /> Simple Process
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From quote to delivery in four simple steps.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="relative p-6 rounded-3xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-700 hover:-translate-y-2 transition-all animate-fade-in-up group"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="text-5xl font-black bg-gradient-to-br from-indigo-200 to-cyan-200 dark:from-indigo-900 dark:to-cyan-900 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform inline-block">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Award className="w-4 h-4" /> Our Services
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
              Built for Every Shipment
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Whether it's a single envelope or a full container, we have you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {SERVICES.map(({ icon: Icon, title, desc, bullets, gradient, bgGlow }, i) => (
              <div
                key={title}
                className="group relative bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 120}ms` }}
                data-testid={`card-service-${title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={`absolute inset-0 ${bgGlow} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl`} />
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-5">{desc}</p>
                  <ul className="space-y-2 mb-6">
                    {bullets.map(b => (
                      <li key={b} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link href="/services">
                    <Button variant="outline" className="w-full rounded-full border-gray-200 dark:border-gray-700 group-hover:border-indigo-500 group-hover:text-indigo-600 transition-colors">
                      Learn More <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Why Choose Us */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">Why Choose Shipnix</h3>
            <p className="text-gray-600 dark:text-gray-300">Reasons businesses ship with us every day.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <div
                key={title}
                className="text-center p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:-translate-y-1 transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-7 h-7 ${color}`} strokeWidth={2} />
                </div>
                <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-violet-700 to-cyan-600 p-10 md:p-14 text-white shadow-2xl">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl animate-float" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl animate-float-slow" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                  Ready to ship with confidence?
                </h2>
                <p className="text-indigo-100 text-lg mb-6">
                  Get an instant quote in under 60 seconds — no signup required.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/quote">
                    <Button size="lg" className="rounded-full bg-amber-400 hover:bg-amber-300 text-indigo-900 hover:scale-105 transition-all shadow-xl px-7 font-semibold" data-testid="button-cta-quote">
                      Get Instant Quote
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 backdrop-blur text-white hover:bg-white/20 hover:scale-105 transition-all px-7" data-testid="button-cta-contact">
                      Talk to Sales
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:flex justify-center">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center animate-float">
                    <PackageCheck className="w-24 h-24 text-amber-300" strokeWidth={1.5} />
                  </div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-cyan-400/30 backdrop-blur border border-cyan-300/40 flex items-center justify-center animate-bounce-slow">
                    <Plane className="w-8 h-8 text-cyan-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-300 pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4 group">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <PackageCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-lg font-extrabold">
                  <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Shipnix</span>{' '}
                  <span className="text-white">Express</span>
                </div>
              </Link>
              <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                Connecting people and possibilities around the world with reliable, modern logistics.
              </p>
              <p className="text-gray-400 text-sm mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                support@shipnix-express.com
              </p>
              <div className="flex gap-2">
                {[
                  { Icon: Facebook, label: 'Facebook' },
                  { Icon: Twitter, label: 'Twitter' },
                  { Icon: Linkedin, label: 'LinkedIn' },
                  { Icon: Instagram, label: 'Instagram' },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-9 h-9 bg-gray-800 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-colors hover:scale-110 transform duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
                <li><Link href="/services" className="hover:text-indigo-400 transition-colors">Services</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-indigo-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Solutions</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/services" className="hover:text-indigo-400 transition-colors">Express Delivery</Link></li>
                <li><Link href="/services" className="hover:text-indigo-400 transition-colors">Ground Shipping</Link></li>
                <li><Link href="/services" className="hover:text-indigo-400 transition-colors">Freight & Logistics</Link></li>
                <li><Link href="/quote" className="hover:text-indigo-400 transition-colors">Get a Quote</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">Support</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/track" className="hover:text-indigo-400 transition-colors">Track Shipment</Link></li>
                <li><Link href="/faq" className="hover:text-indigo-400 transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Customer Care</Link></li>
                <li><a href="https://wa.me/14093823874" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition-colors">WhatsApp Us</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div>© {new Date().getFullYear()} Shipnix Express Shipment. All rights reserved.</div>
            <div className="flex flex-wrap gap-5">
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/14093823874"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Chat on WhatsApp"
        data-testid="link-whatsapp-float"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-pulse-ring" />
        <span className="relative w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
          <MessageCircle className="w-7 h-7" />
        </span>
      </a>
    </div>
  );
}
