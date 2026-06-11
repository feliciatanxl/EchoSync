'use client';

import { useState } from 'react';
import { AlertTriangle, HeartPulse, MessageSquare, Smartphone, Send } from 'lucide-react';

const categories = [
  { label: 'Fire hazard', icon: AlertTriangle, color: '#FF9800' },
  { label: 'AED fault', icon: HeartPulse, color: '#43A047' },
  { label: 'App issue', icon: Smartphone, color: '#003B73' },
  { label: 'General', icon: MessageSquare, color: '#64748B' },
];

export default function FeedbackPage() {
  const [selected, setSelected] = useState(categories[0].label);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="mr-page mr-animate-fade-in bg-[#EEF2F6]">
      <header className="mr-header">
        <h1 className="mr-header-title">Feedback</h1>
      </header>
      <section className="mr-page-content">
        <div className="rounded-[28px] bg-[#003B73] p-5 text-white shadow-md">
          <p className="text-[12px] font-black uppercase tracking-wide text-white/55">Support</p>
          <h2 className="mt-2 text-[27px] font-black leading-tight">Hey there! We&apos;re here to help</h2>
          <p className="mt-2 text-[14px] font-semibold leading-relaxed text-white/75">
            Select a category and tell us what happened.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = selected === category.label;
            return (
              <button
                key={category.label}
                type="button"
                onClick={() => setSelected(category.label)}
                className={`rounded-2xl border-2 bg-white p-4 text-left shadow-xs ${active ? 'border-[#003B73]' : 'border-slate-100'}`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${category.color}14`, color: category.color }}>
                  <Icon size={22} />
                </span>
                <span className="mt-3 block text-[14px] font-black text-slate-950">{category.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4 shadow-xs">
          <label className="mr-input-label" htmlFor="feedback">Message</label>
          <textarea
            id="feedback"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Describe the issue or suggestion..."
            className="min-h-[120px] w-full resize-none rounded-xl border border-slate-200 p-3 text-[15px] outline-none focus:border-[#003B73]"
          />
        </div>

        {sent ? (
          <div className="mt-4 rounded-2xl bg-green-50 p-4 text-[14px] font-bold text-green-700">
            Thank you. Your {selected.toLowerCase()} feedback has been recorded.
          </div>
        ) : null}
      </section>
      <footer className="shrink-0 border-t border-slate-100 bg-white p-4">
        <button className="mr-btn mr-btn-primary" type="button" onClick={() => setSent(true)}>
          <Send size={18} />
          Submit feedback
        </button>
      </footer>
    </div>
  );
}
