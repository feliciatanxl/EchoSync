'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import StepIndicator from '@/app/myResponder/components/StepIndicator';
import { useApp } from '@/app/myResponder/context/AppContext';

const topics = ['Cardiac arrest', 'Fire fighting', 'First aid'];

export default function SetupStep3Page() {
  const router = useRouter();
  const { state, updateOnboarding } = useApp();
  const [selected, setSelected] = useState<string[]>(state.onboarding.learningTopics);

  const toggle = (topic: string) => {
    setSelected((current) => current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic]);
  };

  return (
    <main className="mr-page-onboarding bg-[#F4F6F9]">
      <header className="mr-header">
        <div>
          <h1 className="mr-header-title">Learning topics</h1>
          <p className="text-[12px] font-semibold text-slate-400">Step 3 of 4</p>
        </div>
      </header>
      <StepIndicator currentStep={3} />
      <section className="mr-page-content space-y-3">
        {topics.map((topic) => {
          const active = selected.includes(topic);
          return (
            <button
              type="button"
              key={topic}
              onClick={() => toggle(topic)}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left shadow-xs ${active ? 'border-[#003B73]' : 'border-slate-100'}`}
            >
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 ${active ? 'border-[#003B73] bg-[#003B73] text-white' : 'border-slate-200 text-transparent'}`}>
                <Check size={17} />
              </span>
              <span className="text-[16px] font-black text-slate-900">{topic}</span>
            </button>
          );
        })}
      </section>
      <footer className="shrink-0 border-t border-slate-100 bg-white p-4">
        <button
          className="mr-btn mr-btn-primary"
          type="button"
          onClick={() => {
            updateOnboarding({ currentStep: 8, learningTopics: selected });
            router.push('/myResponder/setup-step4');
          }}
        >
          Next
        </button>
      </footer>
    </main>
  );
}
