'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Award } from 'lucide-react';
import { useApp } from '@/app/myResponder/context/AppContext';

export default function SuccessPage() {
  const router = useRouter();
  const { updateOnboarding } = useApp();

  useEffect(() => {
    updateOnboarding({ completed: true, currentStep: 9 });
  }, [updateOnboarding]);

  return (
    <main className="relative flex h-full flex-col overflow-hidden bg-[#003B73] px-7 py-10 text-white">
      <div className="mr-confetti-container">
        {Array.from({ length: 34 }, (_, index) => (
          <span
            key={index}
            className="mr-confetti-piece"
            style={{
              left: `${(index * 29) % 100}%`,
              background: index % 3 === 0 ? '#FFD700' : index % 3 === 1 ? '#E53935' : '#ffffff',
              animationDuration: `${2.8 + (index % 5) * 0.4}s`,
              animationDelay: `${(index % 7) * 0.18}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <div className="grid h-28 w-28 place-items-center rounded-full border-4 border-[#FFD700] bg-white/10 shadow-[0_0_42px_rgba(255,215,0,0.3)]">
          <Award size={58} color="#FFD700" />
        </div>
        <h1 className="mt-8 text-[30px] font-black leading-tight">You&apos;re now a Community First Responder!</h1>
        <p className="mt-3 text-[15px] font-semibold leading-relaxed text-white/75">Thank you for standing ready with SCDF to help save lives.</p>
      </div>
      <button className="mr-btn mr-btn-primary relative z-10" type="button" onClick={() => router.replace('/myResponder/dashboard')}>
        Go to Home
      </button>
    </main>
  );
}
