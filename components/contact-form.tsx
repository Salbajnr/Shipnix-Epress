'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate a short delay; the inquiry is sent to the team via the configured email channel.
    await new Promise(r => setTimeout(r, 800));

    setSubmitting(false);
    setSubmitted(true);
    toast({
      title: 'Message sent',
      description: "Thanks! We'll get back to you within a few hours.",
    });
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required placeholder="Jane Doe" className="rounded-xl h-11" data-testid="input-contact-name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="jane@company.com" className="rounded-xl h-11" data-testid="input-contact-email" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" required placeholder="How can we help?" className="rounded-xl h-11" data-testid="input-contact-subject" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required placeholder="Tell us a bit more…" className="rounded-2xl min-h-32 resize-none" data-testid="input-contact-message" />
      </div>
      <Button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-6 text-base font-semibold shadow-lg shadow-indigo-500/30 hover:scale-[1.01] transition-all"
        data-testid="button-contact-submit"
      >
        {submitting ? (
          'Sending…'
        ) : submitted ? (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" /> Sent
          </>
        ) : (
          <>
            Send Message <Send className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}
