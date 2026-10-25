'use client';

import { Screen } from '@/components/ui/Screen';
import { Card } from '@/components/ui/Card';
import { PageTransition } from '@/components/layout/PageTransition';
import { ShieldCheck, PhoneCall, AlertTriangle, HelpCircle } from 'lucide-react';

export default function HelpPage() {
  const faqs = [
    {
      q: 'How does Start & End OTP protect me?',
      a: 'Start OTP ensures the job begins only when you authorize the worker at your door. End OTP guarantees that no job is closed until you are completely satisfied with the quality of the service.',
    },
    {
      q: 'What is the "No-Surprise Bill" guarantee?',
      a: 'Once the base price is agreed and locked, workers cannot charge higher rates without raising an in-app extra charge request that requires your explicit approval.',
    },
    {
      q: 'What is the difference between Vouched and Verified?',
      a: 'Vouched indicates peer references from fellow community households. Verified means our platform administrators have personally checked government IDs and skill credentials.',
    },
    {
      q: 'How do payments work?',
      a: 'Book My Service operates on a cash-on-completion model. You pay directly to the service provider after the job is done according to the digital receipt.',
    },
  ];

  return (
    <Screen title="Safety & Support" back hasNav className="bg-surface">
      <PageTransition className="space-y-5 max-w-sm mx-auto w-full py-2">
        {/* Emergency Alert */}
        <div className="p-4 rounded-3xl bg-red-50 border border-red-200 text-red-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Emergency Assistance</span>
          </div>
          <p className="text-xs text-red-800 leading-relaxed">
            If you ever feel unsafe, immediately call the police helpline at <strong>112</strong> or contact our safety desk.
          </p>
          <a
            href="tel:112"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-full text-xs font-bold hover:bg-red-700"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Call 112
          </a>
        </div>

        {/* Safety Principles */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-heading uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Platform Trust Rules
          </h3>

          <div className="space-y-2.5">
            {faqs.map((faq, i) => (
              <Card key={i} className="p-4 space-y-1.5">
                <h4 className="text-sm font-bold text-heading">{faq.q}</h4>
                <p className="text-xs text-muted leading-relaxed">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </PageTransition>
    </Screen>
  );
}
