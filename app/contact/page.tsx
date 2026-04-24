import Link from 'next/link';
import Header from '@/components/header';
import ContactForm from '@/components/contact-form';
import { Mail, MessageCircle, Phone, MapPin, Clock, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Contact Us — Shipnix Express Shipment',
  description: 'Get in touch with Shipnix Express Shipment — email, WhatsApp, phone, or send us a message.',
};

const CHANNELS = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'support@shipnix-express.com',
    href: 'mailto:support@shipnix-express.com',
    gradient: 'from-indigo-500 to-violet-600',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: '+1 (409) 382-3874',
    href: 'https://wa.me/14093823874',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Phone,
    title: 'Call Us',
    value: '+1 (800) SHIPNIX',
    href: 'tel:+18007447649',
    gradient: 'from-cyan-500 to-sky-600',
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />

      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-cyan-600 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl animate-float-slow" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 px-4 py-1.5 rounded-full text-sm mb-5">
            <Sparkles className="w-4 h-4 text-amber-300" /> Get in Touch
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-5 tracking-tight">
            We're here to{' '}
            <span className="bg-gradient-to-r from-amber-300 to-cyan-200 bg-clip-text text-transparent">help</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto">
            Whether you have a question about a shipment, need a custom quote, or want to partner — we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Channels */}
      <section className="py-16 px-4 -mt-12 relative z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {CHANNELS.map(({ icon: Icon, title, value, href, gradient }, i) => (
            <a
              key={title}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all animate-fade-in-up"
              style={{ animationDelay: `${i * 120}ms` }}
              data-testid={`link-channel-${title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">{title}</h3>
              <p className="text-gray-600 dark:text-gray-300 break-words">{value}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-indigo-500/5 animate-fade-in-up">
            <h2 className="text-2xl font-extrabold mb-2 text-gray-900 dark:text-white">Send us a message</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">We typically reply within a few hours.</p>
            <ContactForm />
          </div>

          <div className="space-y-6 animate-fade-in-up delay-200">
            <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Headquarters</h3>
                <p className="text-indigo-100 leading-relaxed">
                  100 Logistics Way<br />
                  Suite 4200<br />
                  London, UK EC1A 1BB
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Business Hours</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex justify-between"><span>Monday – Friday</span><span className="font-medium">8:00 – 20:00</span></li>
                <li className="flex justify-between"><span>Saturday</span><span className="font-medium">9:00 – 17:00</span></li>
                <li className="flex justify-between"><span>Sunday</span><span className="font-medium">Closed</span></li>
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
                Tracking and online support available 24/7.
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-100 dark:border-emerald-900/50">
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Need urgent help?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Reach us instantly on WhatsApp.</p>
              <Link
                href="https://wa.me/14093823874"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full font-medium transition-colors hover:scale-105 transform duration-200"
                data-testid="link-contact-whatsapp"
              >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
