import Link from 'next/link';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe2, Users, Target, Sparkles, ShieldCheck, Zap, Heart, Award } from 'lucide-react';

export const metadata = {
  title: 'About Us — Shipnix Express Shipment',
  description: 'Learn about Shipnix Express Shipment — our story, mission, and the people behind global logistics done right.',
};

const VALUES = [
  { icon: ShieldCheck, title: 'Reliability', desc: 'We deliver on time, every time. Our promise is your peace of mind.' },
  { icon: Zap, title: 'Speed', desc: 'Modern logistics powered by smart routing and real-time visibility.' },
  { icon: Heart, title: 'Care', desc: 'Every package matters. We treat shipments like our own.' },
  { icon: Award, title: 'Excellence', desc: 'World-class service standards that set the bar in the industry.' },
];

const MILESTONES = [
  { year: '2018', title: 'Founded', desc: 'Started with a single warehouse and a bold vision.' },
  { year: '2020', title: 'Global Reach', desc: 'Expanded to 50+ countries through key partnerships.' },
  { year: '2023', title: '5M Shipments', desc: 'Crossed 5 million successful deliveries worldwide.' },
  { year: '2025', title: 'AI-Powered', desc: 'Launched smart tracking & predictive routing.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />

      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-cyan-600 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-float-slow" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 px-4 py-1.5 rounded-full text-sm mb-5">
            <Sparkles className="w-4 h-4 text-amber-300" /> Our Story
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-5 tracking-tight">
            Logistics built for{' '}
            <span className="bg-gradient-to-r from-amber-300 to-cyan-200 bg-clip-text text-transparent">
              the modern world
            </span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto">
            We're on a mission to make global shipping fast, transparent, and accessible to every business — large or small.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Target className="w-4 h-4" /> Our Mission
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-5 text-gray-900 dark:text-white tracking-tight">
              Connecting people and possibilities, one shipment at a time.
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-4">
              Shipnix Express Shipment was founded on a simple idea: shipping should be effortless. From first-mile pickup to final delivery, we combine global infrastructure with simple software so businesses can ship anything, anywhere, with confidence.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Today, we move millions of shipments across 220+ countries, supported by a team that genuinely cares about getting your package where it needs to go.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 animate-fade-in-up delay-200">
            {[
              { icon: Globe2, label: 'Countries', value: '220+' },
              { icon: Users, label: 'Customers', value: '500K+' },
              { icon: Award, label: 'On-time', value: '99.9%' },
              { icon: ShieldCheck, label: 'Insured', value: '100%' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="p-6 rounded-3xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 border border-gray-100 dark:border-gray-800 text-center hover:-translate-y-1 hover:shadow-lg transition-all">
                <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                <div className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">{value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">Our Values</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">The principles that guide every decision we make.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-2 transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">Our Journey</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Key moments that shaped who we are today.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MILESTONES.map((m, i) => (
              <div
                key={m.year}
                className="relative p-6 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-indigo-900/30 dark:via-gray-900 dark:to-cyan-900/30 border border-indigo-100 dark:border-indigo-900/50 hover:-translate-y-2 transition-all animate-fade-in-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                  {m.year}
                </div>
                <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">{m.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-700 via-violet-700 to-cyan-600 p-10 md:p-14 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Let's get your shipment moving</h2>
              <p className="text-indigo-100 text-lg mb-6">Get a free quote in under 60 seconds.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/quote">
                  <Button size="lg" className="rounded-full bg-amber-400 hover:bg-amber-300 text-indigo-900 hover:scale-105 transition-all shadow-xl px-7 font-semibold">
                    Get Quote <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 backdrop-blur text-white hover:bg-white/20 px-7">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
