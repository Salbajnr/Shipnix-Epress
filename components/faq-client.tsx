'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQS = [
  { q: 'How do I track my shipment?', a: 'Enter your tracking ID on the Track page or go to /track/[your-tracking-id]. You\'ll see real-time status updates and your full delivery timeline.' },
  { q: 'How long does delivery take?', a: 'Delivery times vary by destination. Domestic shipments typically take 2-5 business days. International shipments take 5-14 business days depending on the country.' },
  { q: 'What countries do you ship to?', a: 'We deliver to over 220 countries and territories worldwide. Use our quote calculator to get pricing for your specific destination.' },
  { q: 'How is shipping cost calculated?', a: 'Costs are based on package weight, dimensions, destination, and delivery speed. Use our instant quote tool to get an exact price before shipping.' },
  { q: 'What payment methods are accepted?', a: 'We accept credit/debit cards, bank transfers, PayPal, and cryptocurrencies including Bitcoin, Ethereum, and USDC.' },
  { q: 'Can I change delivery address after shipping?', a: 'Address changes may be possible before the package is dispatched. Contact our support team as soon as possible with your tracking ID.' },
  { q: 'What happens if my package is lost or damaged?', a: 'All shipments are insured. If your package is lost or damaged, contact our support team within 7 days with your tracking ID and photos of any damage.' },
  { q: 'Do you offer express delivery?', a: 'Yes! We offer same-day express delivery for an additional fee. Select the Express time slot when requesting a quote.' },
  { q: 'How do I request a refund?', a: 'Refunds are processed within 5-10 business days. Contact support@shipnix.com with your tracking ID and reason for the refund request.' },
  { q: 'What items are prohibited?', a: 'Prohibited items include hazardous materials, illegal substances, firearms, and certain perishables. Check our full prohibited items list on our website.' },
];

export default function FAQClient() {
  const [open, setOpen] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const filtered = FAQS.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Frequently Asked Questions</h1>
        <p className="text-muted-foreground text-lg">Find answers to common questions about our services</p>
      </div>

      <input
        type="text"
        placeholder="Search questions..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="space-y-3">
        {filtered.map((faq, i) => (
          <Card key={i} className="overflow-hidden">
            <button
              className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="font-medium text-gray-900 dark:text-white">{faq.q}</span>
              {open === i ? <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
            </button>
            {open === i && (
              <CardContent className="pt-0 px-5 pb-5">
                <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
              </CardContent>
            )}
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">No questions match your search</div>
        )}
      </div>
    </div>
  );
}
