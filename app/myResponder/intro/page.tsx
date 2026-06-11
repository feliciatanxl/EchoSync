'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Flame, HeartPulse, Shield, Smartphone } from 'lucide-react';
import StepIndicator from '@/app/myResponder/components/StepIndicator';
import { useApp } from '@/app/myResponder/context/AppContext';

const slides = [
  {
    title: 'Join forces with SCDF to help save lives',
    body: 'Receive nearby cardiac arrest and minor fire alerts as a Community First Responder.',
    gradient: 'linear-gradient(135deg, var(--scdf-blue), #0868ad)',
    icon: HeartPulse,
  },
  {
    title: 'Get guidance when every second counts',
    body: 'Use in-app instructions, AED locations, and incident details to respond with confidence.',
    gradient: 'linear-gradient(135deg, #1b5e20, #43a047)',
    icon: Smartphone,
  },
  {
    title: 'Fight small fires safely',
    body: 'Support your community while keeping scene safety and SCDF guidance front and centre.',
    gradient: 'linear-gradient(135deg, #bf360c, var(--scdf-orange))',
    icon: Flame,
  },
] as const;

export default function IntroPage() {
  const router = useRouter();
  const { updateOnboarding } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const touchStartX = useRef(0);
  const markedStep = useRef(false);

  useEffect(() => {
    if (!markedStep.current) {
      markedStep.current = true;
      updateOnboarding({ currentStep: 2 });
    }
  }, [updateOnboarding]);

  const moveSlide = (direction: 1 | -1) => {
    setCurrentSlide((current) => Math.max(0, Math.min(slides.length - 1, current + direction)));
  };

  return (
    <main className="mr-page-onboarding mr-animate-fade-in">
      <StepIndicator currentStep={2} />

      <section
        style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          const diff = touchStartX.current - event.changedTouches[0].clientX;
          if (Math.abs(diff) > 48) {
            moveSlide(diff > 0 ? 1 : -1);
          }
        }}
      >
        <div
          style={{
            display: 'flex',
            height: '100%',
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: 'transform 0.38s var(--ease-out)',
          }}
        >
          {slides.map((slide) => {
            const Icon = slide.icon;
            return (
              <article
                key={slide.title}
                style={{
                  minWidth: '100%',
                  background: slide.gradient,
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '36px 30px',
                }}
              >
                <div
                  style={{
                    width: 118,
                    height: 118,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 30,
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
                  }}
                >
                  <Icon size={58} strokeWidth={1.9} />
                </div>
                <h1 className="mr-title-xl" style={{ maxWidth: 330 }}>
                  {slide.title}
                </h1>
                <p className="mr-body" style={{ maxWidth: 310, marginTop: 12, color: 'rgba(255,255,255,0.82)' }}>
                  {slide.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="mr-carousel-dots">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            className={`mr-carousel-dot${index === currentSlide ? ' active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            style={{ border: 0 }}
          />
        ))}
      </div>

      <section style={{ padding: '12px 24px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {!showAuth ? (
          <button className="mr-btn mr-btn-primary" type="button" onClick={() => setShowAuth(true)}>
            Continue
            <ChevronRight size={18} />
          </button>
        ) : (
          <>
            <button
              className="mr-btn mr-btn-singpass"
              type="button"
              onClick={() => alert('Singpass is currently unavailable in this demo. Please continue with mobile number.')}
            >
              <Shield size={20} />
              Continue with Singpass
            </button>
            <button className="mr-btn mr-btn-outline" type="button" onClick={() => router.push('/myResponder/auth-input')}>
              Continue with mobile number
            </button>
          </>
        )}
      </section>
    </main>
  );
}
