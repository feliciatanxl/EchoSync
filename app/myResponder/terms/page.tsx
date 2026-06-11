'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';
import StepIndicator from '@/app/myResponder/components/StepIndicator';
import { useApp } from '@/app/myResponder/context/AppContext';
import { termsText } from '@/app/myResponder/data/termsText';

const sections = [
  { key: 'advisory', title: 'Advisory' },
  { key: 'general', title: 'General terms and conditions' },
  { key: 'cardiacArrest', title: 'For cardiac arrest cases' },
  { key: 'fireCases', title: 'For fire cases' },
] as const;

export default function TermsPage() {
  const router = useRouter();
  const { updateOnboarding } = useApp();
  const [agreed, setAgreed] = useState(false);
  const markedStep = useRef(false);

  useEffect(() => {
    if (!markedStep.current) {
      markedStep.current = true;
      updateOnboarding({ currentStep: 3 });
    }
  }, [updateOnboarding]);

  return (
    <main className="mr-page-onboarding mr-animate-fade-in" style={{ background: 'var(--gray-50)' }}>
      <header className="mr-header">
        <button
          onClick={() => router.push('/myResponder/intro')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--gray-700)' }}
          aria-label="Go back"
          type="button"
        >
          <ArrowLeft size={22} />
        </button>
        <span className="mr-header-title">Terms</span>
        <FileText size={22} color="var(--scdf-blue)" />
      </header>

      <StepIndicator currentStep={3} />

      <section className="mr-page-content" style={{ overflowY: 'auto', flex: 1, paddingTop: 0 }}>
        {sections.map((section) => (
          <article className="mr-card" key={section.key} style={{ marginBottom: 14 }}>
            <h2
              className="mr-title-md"
              style={{ marginBottom: 12, paddingLeft: 12, borderLeft: '4px solid var(--scdf-blue)' }}
            >
              {section.title}
            </h2>
            <p className="mr-body-sm" style={{ whiteSpace: 'pre-line', color: 'var(--gray-700)', lineHeight: 1.65 }}>
              {termsText[section.key]}
            </p>
          </article>
        ))}
      </section>

      <footer className="mr-sticky-footer">
        <label className="mr-checkbox">
          <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
          <span className="mr-body-sm">
            I have read and agree to the terms and conditions for using myResponder.
          </span>
        </label>
        <button
          className="mr-btn mr-btn-primary mr-mt-16"
          disabled={!agreed}
          type="button"
          onClick={() => router.push('/myResponder/auth-input')}
        >
          Agree and continue
        </button>
      </footer>
    </main>
  );
}
