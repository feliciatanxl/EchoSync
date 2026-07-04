'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Shield,
  Brain,
  Building,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Heart,
  Clock,
  Users,
  EyeOff,
  AlertTriangle,
  Activity,
  Phone,
  Timer,
  Menu,
  X,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Intersection Observer hook for scroll reveals
   ───────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/* ─────────────────────────────────────────────
   Animated counter for hero stats
   ───────────────────────────────────────────── */
function AnimatedStat({
  value,
  label,
  prefix = '',
  suffix = '',
  delay = 0,
}: {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useInView(0.3);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-1 px-4 py-2"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
        transition: `all 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
      }}
    >
      <span className="text-2xl sm:text-3xl font-bold text-primary">
        {prefix}
        {value}
        {suffix}
      </span>
      <span className="text-xs sm:text-sm text-text-muted font-medium tracking-wide text-center">
        {label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Feature card component
   ───────────────────────────────────────────── */
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) {
  const { ref, isVisible } = useInView(0.2);

  return (
    <div
      ref={ref}
      className="card-hover group relative flex flex-col items-start gap-5 rounded-2xl border border-border bg-white p-8 sm:p-10"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
        transition: `all 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
      }}
    >
      {/* Icon */}
      <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-soft to-primary-ghost transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-7 w-7 text-primary" strokeWidth={1.8} />
        {/* subtle glow on hover */}
        <div className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Text */}
      <div className="space-y-2.5">
        <h3 className="text-lg font-semibold text-text-heading">{title}</h3>
        <p className="text-[15px] leading-relaxed text-text-muted">
          {description}
        </p>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-8 right-8 h-[2px] scale-x-0 rounded-full bg-gradient-to-r from-primary to-secondary transition-transform duration-500 group-hover:scale-x-100" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Timeline step for "Silent Emergency" section
   ───────────────────────────────────────────── */
function TimelineStep({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) {
  const { ref, isVisible } = useInView(0.25);

  return (
    <div
      ref={ref}
      className="flex items-start gap-5"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-24px)',
        transition: `all 0.6s cubic-bezier(0.4,0,0.2,1) ${index * 150}ms`,
      }}
    >
      <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
        {/* connector line */}
        {index < 3 && (
          <div className="absolute -bottom-10 left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-primary/30 to-transparent" />
        )}
      </div>
      <div className="pt-1 space-y-1">
        <h4 className="text-base font-semibold text-text-heading">{title}</h4>
        <p className="text-sm leading-relaxed text-text-muted">{description}</p>
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═════════════════════════════════════════════ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* track scroll for navbar glassmorphism */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* close mobile menu on resize */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  /* ── Hero section observer ── */
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    setHeroVisible(true);
  }, []);

  return (
    <div className="min-h-screen font-sans">
      {/* ═══════════════════════════════════════
          NAVIGATION BAR
          ═══════════════════════════════════════ */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-border/60 bg-white/70 shadow-sm backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <a
            href="#"
            className="group flex items-center gap-2.5"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-primary/20 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <img
                src="/echosync-logo.png"
                alt="EchoSync logo"
                className="h-9 w-9 object-contain"
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-text-heading">
              Echo
              <span className="gradient-text">Sync</span>
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="nav-link text-sm font-medium text-text-body transition-colors hover:text-primary"
            >
              How it Works
            </a>
            <a
              href="#privacy"
              className="nav-link text-sm font-medium text-text-body transition-colors hover:text-primary"
            >
              Privacy
            </a>
            <a
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:brightness-110 active:scale-[0.97]"
            >
              SCDF Portal Login
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-body transition-colors hover:bg-bg-soft md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        <div
          className={`overflow-hidden border-b border-border/60 bg-white/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
            mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 border-b-0'
          }`}
        >
          <div className="flex flex-col gap-1 px-5 pb-5 pt-2">
            <a
              href="#how-it-works"
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-text-body transition-colors hover:bg-bg-soft hover:text-primary"
              onClick={closeMobileMenu}
            >
              How it Works
            </a>
            <a
              href="#privacy"
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-text-body transition-colors hover:bg-bg-soft hover:text-primary"
              onClick={closeMobileMenu}
            >
              Privacy
            </a>
            <a
              href="/login"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:brightness-110"
              onClick={closeMobileMenu}
            >
              SCDF Portal Login
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-28 pb-8 sm:pt-36 sm:pb-12">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Large soft gradient blob top-right */}
          <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary-soft/60 via-primary-ghost to-transparent blur-3xl" />
          {/* Smaller blob bottom-left */}
          <div className="absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-secondary-soft/40 to-transparent blur-3xl" />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #0d9488 1px, transparent 1px), linear-gradient(to bottom, #0d9488 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <div ref={heroRef} className="relative mx-auto max-w-5xl px-5 sm:px-8 text-center">
          {/* Badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/50 px-4 py-1.5"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.6s ease-out 100ms',
            }}
          >
            <Activity className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold tracking-wide text-primary-dark">
              PRIVACY-FIRST • PRE-ARRIVAL INTELLIGENCE
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight text-text-heading sm:text-5xl lg:text-6xl"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.7s ease-out 200ms',
            }}
          >
            AI-Assisted Home Safety for{' '}
            <span className="gradient-text">Seniors Living Alone.</span>
          </h1>

          {/* Sub-headline */}
          <p
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg sm:leading-relaxed"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 0.7s ease-out 400ms',
            }}
          >
            <strong className="text-text-body">
              Privacy-first pre-arrival intelligence
            </strong>{' '}
            that detects possible home emergencies earlier, verifies real distress, and supports faster caregiver, community, and SCDF response.
          </p>

          {/* CTA Buttons */}
          <div
            className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 0.7s ease-out 550ms',
            }}
          >
            <a
              href="#how-it-works"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110 active:scale-[0.97]"
            >
              View EchoSync Workflow
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#privacy"
              className="inline-flex items-center gap-2.5 rounded-xl border-2 border-primary/30 px-7 py-3.5 text-sm font-semibold text-primary transition-all duration-300 hover:border-primary/60 hover:bg-primary-ghost active:scale-[0.97]"
            >
              Privacy-First Design
              <ShieldCheck className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* ── Floating Stat Bar ── */}
        <div className="relative mx-auto mt-16 max-w-4xl px-5 sm:px-8">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-lg sm:p-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-border">
              <AnimatedStat value="1 in 4" label="Singaporeans aged 65+ by 2030" delay={0} />
              <AnimatedStat value="2,500+" label="OHCA cases annually" delay={100} />
              <AnimatedStat value="Top 5" label="SCDF x Dell finalist" delay={200} />
              <AnimatedStat value="No CCTV" label="Privacy-first sensing" delay={300} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Gradient section divider ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* ═══════════════════════════════════════
          FEATURES GRID — "Why EchoSync"
          ═══════════════════════════════════════ */}
      <section id="how-it-works" className="section-padding scroll-mt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Section header */}
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <SectionLabel text="Features" />
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text-heading sm:text-4xl">
              Why{' '}
              <span className="gradient-text">EchoSync</span>
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-secondary" />
            <p className="mt-5 text-base text-text-muted sm:text-lg">
              Purpose-built for Singapore's public housing ecosystem — where
              privacy, speed, and trust are non-negotiable.
            </p>
          </div>

          {/* Cards */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
           <FeatureCard
              icon={Brain}
              title="Multi-Signal Detection"
              description="Combines sound, motion, distance, and load sensor signals to detect possible distress without relying on CCTV."
              delay={0}
            />
            <FeatureCard
              icon={Activity}
              title="Edge AI Verification"
              description="Checks whether multiple sensor signals support the same emergency pattern before increasing the risk level."
              delay={150}
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Caregiver + SCDF Routing"
              description="Low and medium alerts go to caregivers first, while high and critical cases are routed to the SCDF-style dashboard for operator review."
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ── Gradient section divider ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* ═══════════════════════════════════════
          THE "SILENT EMERGENCY" PROBLEM
          ═══════════════════════════════════════ */}
      <section id="privacy" className="scroll-mt-20 bg-bg-light">
        <div className="section-padding mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left: content */}
            <div>
              <SectionLabel text="The Challenge" />
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text-heading sm:text-4xl">
                The Silent Emergency{' '}
                <span className="gradient-text">Problem</span>
              </h2>
              <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-secondary" />

              <p className="mt-6 text-base leading-relaxed text-text-muted sm:text-[17px]">
                In unwitnessed home emergencies, the biggest gap happens before the 995 call exists.
                For seniors living alone, a fall, collapse, or medical distress may go unnoticed when
                there is no caregiver nearby and no one able to call for help.
              </p>
              <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-[17px]">
                EchoSync helps close this first-alert gap by detecting possible distress earlier,
                verifying the situation through Edge AI and voice check-in, and routing the alert
                to caregivers, SCDF, or a myResponder-style flow based on severity.
              </p>

              {/* Stat callout cards */}
              <div className="mt-8 grid grid-cols-2 gap-4">
               <StatCallout
                  value="1 in 4"
                  label="Singaporeans aged 65+ by 2030"
                  icon={Users}
                  color="primary"
                />
                <StatCallout
                  value="2,500+"
                  label="OHCA cases annually"
                  icon={Heart}
                  color="danger"
                />
              </div>
            </div>

            {/* Right: timeline / process */}
            <div className="space-y-10">
              <TimelineStep
                icon={AlertTriangle}
                title="Possible Emergency Detected"
                description="Sound, motion, distance, and load sensors detect a possible fall or distress pattern in the home."
                index={0}
              />
              <TimelineStep
                icon={Activity}
                title="Edge AI Verifies Signals"
                description="EchoSync checks whether multiple signals support the same emergency pattern before raising the risk level."
                index={1}
              />
              <TimelineStep
                icon={Phone}
                title="Voice Check-In Triggered"
                description="The system asks if the resident is okay. An okay response lowers the alert, while help or no response increases severity."
                index={2}
              />
              <TimelineStep
                icon={Timer}
                title="Alert Routed by Severity"
                description="Low and medium alerts go to caregivers, while high and critical alerts appear on the SCDF-style dashboard for review."
                index={3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Gradient section divider ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* ═══════════════════════════════════════
          PRIVACY & COMPLIANCE SECTION
          ═══════════════════════════════════════ */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel text="Privacy First" />
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text-heading sm:text-4xl">
              PDPA-Compliant by{' '}
              <span className="gradient-text">Design</span>
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-secondary" />
            <p className="mt-5 text-base text-text-muted sm:text-lg">
              EchoSync was architected from day one around Singapore's Personal
              Data Protection Act. Privacy isn't a feature — it's the
              foundation.
            </p>
          </div>

          {/* Privacy cards */}
          <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
           <PrivacyCard
              icon={EyeOff}
              title="No CCTV or Facial Recognition"
              description="EchoSync avoids camera surveillance and facial recognition. The prototype relies on sensor signals and voice check-in instead of visual monitoring."
              delay={0}
            />
            <PrivacyCard
              icon={Shield}
              title="No Raw Audio Storage"
              description="Voice and sound signals are processed for check-in and distress detection. Raw audio is not stored as part of the prototype workflow."
              delay={150}
            />
            <PrivacyCard
              icon={ShieldCheck}
              title="Edge-First Processing"
              description="Sensor readings are processed locally first, and only structured alert summaries, risk levels, and node status are shared."
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════ */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Top section */}
          <div className="grid gap-10 py-14 sm:py-16 lg:grid-cols-3">
            {/* Left — Brand + About */}
            <div className="space-y-6 lg:col-span-1">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 border border-white/10">
                    <img
                      src="/echosync-logo.png"
                      alt="EchoSync logo"
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <span className="text-lg font-bold tracking-tight text-white">
                    EchoSync
                  </span>
                </div>

                <p className="max-w-sm text-sm leading-relaxed text-slate-400">
                  AI-assisted pre-arrival intelligence for detecting possible home emergencies earlier,
                  verifying real distress, and supporting faster caregiver, community, and SCDF-style response.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  About
                </h4>
                <p className="max-w-sm text-sm leading-relaxed text-slate-400">
                  EchoSync was developed as a hackathon prototype for the SCDF and Dell
                  Lifesavers’ Innovation Challenge 2026, focusing on privacy-first sensing,
                  Edge AI verification, caregiver support, and emergency response coordination.
                </p>
              </div>
            </div>

            {/* Middle intentionally left empty for cleaner footer spacing */}
            <div className="hidden lg:block" />

            {/* Right intentionally left empty */}
            <div className="hidden lg:block" />
          </div>
          
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

          {/* Bottom */}
          <div className="flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} EchoSync. 
              All rights reserved.
            </p>
            <p className="text-xs text-slate-500">
              SCDF x Dell Lifesavers’ Innovation Challenge 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Small helper components
   ───────────────────────────────────────────── */

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/40 px-3.5 py-1">
      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
      <span className="text-xs font-semibold tracking-wider text-primary-dark uppercase">
        {text}
      </span>
    </div>
  );
}

function StatCallout({
  value,
  label,
  icon: Icon,
  color,
}: {
  value: string;
  label: string;
  icon: React.ElementType;
  color: 'primary' | 'danger';
}) {
  const { ref, isVisible } = useInView(0.3);
  const bg = color === 'danger' ? 'bg-danger/10' : 'bg-primary/10';
  const iconColor = color === 'danger' ? 'text-danger' : 'text-primary';
  const valueColor = color === 'danger' ? 'text-danger' : 'text-primary';

  return (
    <div
      ref={ref}
      className="rounded-xl border border-border bg-white p-5 shadow-sm transition-all duration-500"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
      }}
    >
      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={2} />
      </div>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      <p className="mt-0.5 text-sm text-text-muted">{label}</p>
    </div>
  );
}

function PrivacyCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) {
  const { ref, isVisible } = useInView(0.2);

  return (
    <div
      ref={ref}
      className="card-hover group rounded-2xl border border-border bg-white p-8 text-center"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: `all 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
      }}
    >
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-7 w-7 text-primary" strokeWidth={1.8} />
      </div>
      <h3 className="text-base font-semibold text-text-heading">{title}</h3>
      <p className="mt-2.5 text-sm leading-relaxed text-text-muted">
        {description}
      </p>
    </div>
  );
}
