'use client';

import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import ContactModal from './ContactModal';

const faqs = [
  {
    question: "How does EchoSync ensure the privacy of seniors?",
    answer: "EchoSync uses zero-optical sensors, meaning no cameras or microphones that record conversation are ever used. We use acoustic event detection and motion patterns to detect falls or distress without capturing identifying visual or audio data. All data is processed locally at the edge before being sent over encrypted channels."
  },
  {
    question: "Is the system PDPA compliant?",
    answer: "Yes, EchoSync is fully compliant with Singapore's Personal Data Protection Act (PDPA). We implement strict data minimization, end-to-end encryption, and role-based access controls. Our data is stored in secure, locally-hosted sovereign cloud environments."
  },
  {
    question: "How accurate is the AI in detecting falls?",
    answer: "Our AI models are trained on extensive datasets of geriatric movement patterns and acoustic event simulations. With multi-sensor fusion (motion + acoustic), we achieve over 98% accuracy in detecting heavy falls while minimizing false alarms from daily activities like sitting down or dropping objects."
  },
  {
    question: "Can it integrate with SCDF emergency services?",
    answer: "Absolutely. EchoSync is designed for B2G integration. High-confidence alerts can be automatically routed to SCDF dispatch systems via secure APIs, providing responders with precise location data and fused sensor context before they even arrive on site."
  },
  {
    question: "What happens if the internet goes down?",
    answer: "EchoSync nodes are designed with 'Edge Resilience'. Core fall detection logic runs locally on the device. In the event of a network outage, local alerts (visual/audio) can still trigger, and the system caches critical event data to be synced immediately once connectivity is restored."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <section id="faq" className="section-padding bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-soft/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-soft/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-ghost border border-primary/10 mb-4">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">Common Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-heading tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about Singapore&apos;s most advanced community safety platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'border-primary/20 bg-primary-ghost/30 shadow-lg shadow-primary/5' 
                    : 'border-border/60 bg-white hover:border-primary/20 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left group transition-all"
                >
                  <span className={`text-[15px] font-bold transition-colors ${
                    isOpen ? 'text-primary' : 'text-text-heading group-hover:text-primary'
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 ml-4 p-1 rounded-lg transition-all duration-300 ${
                    isOpen ? 'bg-primary text-white rotate-180' : 'bg-bg-soft text-text-muted group-hover:bg-primary-ghost group-hover:text-primary'
                  }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 pt-1">
                    <p className="text-[14px] text-text-body leading-relaxed border-l-2 border-primary/20 pl-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 p-8 rounded-3xl bg-bg-light border border-border/60 text-center animate-fade-up">
          <p className="text-[15px] text-text-heading font-bold mb-2">Still have questions?</p>
          <p className="text-[13px] text-text-muted mb-6">Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-[13px] font-bold hover:bg-primary-dark transition-all hover:shadow-lg active:scale-[0.98] cursor-pointer"
          >
            Get in touch
          </button>
        </div>
      </div>

      <ContactModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isSubmitted={isSubmitted}
        setIsSubmitted={setIsSubmitted}
        title="Contact EchoSync Support"
        subtitle="Have questions? Send us a message and we'll get back to you shortly."
      />
    </section>
  );
}
