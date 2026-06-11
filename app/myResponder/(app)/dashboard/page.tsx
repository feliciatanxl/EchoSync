'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Bell, CheckCircle2, ChevronRight, Eye, Flame, Heart, MapPin, Newspaper, Navigation, Users } from 'lucide-react';
import { carouselCards, mockNews } from '@/app/myResponder/data/mockNews';
import { incidentStats } from '@/app/myResponder/data/mockIncidents';

type ActiveEchoSyncAlert = {
  caseId: string;
  caseType: string;
  location: string;
  confidence: number;
  riskLevel: string;
  immobileTime: string;
};

type ResponderAlertStatus = 'new' | 'accepted' | 'declined' | 'en-route' | 'arrived' | 'cpr-started' | 'aed-used';

const metricCards = [
  {
    href: '/myResponder/dashboard/cardiac',
    label: 'Cardiac arrest',
    value: incidentStats.cardiacToday.toString(),
    icon: Heart,
    iconColor: '#E53935',
    iconBg: '#FFEBEE',
  },
  {
    href: '/myResponder/dashboard/fire',
    label: 'Fire',
    value: incidentStats.fireToday.toString(),
    icon: Flame,
    iconColor: '#FF9800',
    iconBg: '#FFF3E0',
  },
  {
    href: null,
    label: 'Registered CFRs',
    value: incidentStats.registeredCFRs.toLocaleString(),
    icon: Users,
    iconColor: '#003B73',
    iconBg: '#E8F0FE',
  },
  {
    href: '/myResponder/map',
    label: 'Cases today',
    value: incidentStats.casesToday.toString(),
    icon: MapPin,
    iconColor: '#43A047',
    iconBg: '#E8F5E9',
  },
] as const;

export default function DashboardPage() {
  const [activeAlert, setActiveAlert] = useState<ActiveEchoSyncAlert | null>(null);
  const [alertStatus, setAlertStatus] = useState<ResponderAlertStatus>('new');

  useEffect(() => {
    const storedAlert = localStorage.getItem('echosync_active_alert');
    if (!storedAlert) return;

    try {
      const parsed = JSON.parse(storedAlert) as ActiveEchoSyncAlert;
      setActiveAlert(parsed);
    } catch {
      localStorage.removeItem('echosync_active_alert');
    }
  }, []);

  return (
    <div className="mr-page mr-animate-fade-in bg-[#EEF2F6]">
      <header className="mr-header shrink-0">
        <div className="flex min-w-0 items-center gap-2">
          <h1 className="truncate text-[20px] font-black tracking-[-0.02em] text-[#003B73]">myRESPONDER</h1>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#FFEBEE] px-2.5 py-1 text-[12px] font-bold text-[#E53935]">
            <span className="text-[14px] leading-none">•</span>
            Alert off
          </span>
        </div>
        <button
          type="button"
          aria-label="Notifications"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-slate-700"
        >
          <Bell size={23} strokeWidth={2.1} />
        </button>
      </header>

      {activeAlert && (
        <section className="px-4 pt-4">
          <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-xs">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="mb-1 inline-flex rounded-full bg-[#FFEBEE] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#E53935]">
                  EchoSync CFR Alert
                </span>
                <h2 className="text-[16px] font-black leading-tight text-slate-950">{activeAlert.caseType}</h2>
                <p className="mt-1 flex items-start gap-1.5 text-[12px] font-semibold leading-snug text-slate-500">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-[#E53935]" />
                  <span>{activeAlert.location}</span>
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-black text-[#E53935]">
                {activeAlert.riskLevel}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Confidence</p>
                <p className="mt-1 font-black text-slate-950">{activeAlert.confidence}%</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Immobile</p>
                <p className="mt-1 font-black text-slate-950">{activeAlert.immobileTime}</p>
              </div>
              <div className="col-span-2 rounded-xl bg-slate-50 p-3">
                <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">Nearest AED</p>
                <p className="mt-1 font-bold text-slate-950">Void deck lift lobby AED placeholder</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setAlertStatus('accepted')}
                className="rounded-full bg-[#E53935] px-3 py-1.5 text-[12px] font-black text-white"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => setAlertStatus('declined')}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-[12px] font-black text-slate-600"
              >
                Decline
              </button>
              {[
                ['en-route', 'En Route', Navigation],
                ['arrived', 'Arrived', CheckCircle2],
                ['cpr-started', 'CPR Started', Heart],
                ['aed-used', 'AED Used', CheckCircle2],
              ].map(([status, label, Icon]) => {
                const ActionIcon = Icon as typeof CheckCircle2;
                return (
                  <button
                    key={status as string}
                    type="button"
                    onClick={() => setAlertStatus(status as ResponderAlertStatus)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-black ${
                      alertStatus === status ? 'bg-[#003B73] text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <ActionIcon size={13} />
                    {label as string}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-[11px] font-bold text-slate-500">
              Status: {alertStatus.replace('-', ' ')}
            </p>
          </div>
        </section>
      )}

      <section className="grid grid-cols-2 gap-3 px-4 pt-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          const content = (
            <>
              <div
                className="mb-3 grid h-10 w-10 place-items-center rounded-xl"
                style={{ background: card.iconBg, color: card.iconColor }}
              >
                <Icon size={22} fill="currentColor" strokeWidth={card.icon === Users || card.icon === MapPin ? 2 : 0} />
              </div>
              <span className="text-[13px] font-semibold leading-snug text-slate-500">{card.label}</span>
              <strong className="mt-1 text-[25px] font-black leading-none tracking-[-0.03em] text-slate-950">
                {card.value}
              </strong>
            </>
          );

          if (card.href) {
            return (
              <Link
                key={card.label}
                href={card.href}
                className="flex min-h-[132px] flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 text-inherit shadow-xs"
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={card.label}
              className="flex min-h-[132px] flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-xs"
            >
              {content}
            </div>
          );
        })}
      </section>

      <section className="px-4 pt-4">
        <Link
          href="/myResponder/learn"
          className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-slate-900 shadow-xs"
        >
          <span className="text-[14px] font-bold leading-snug">
            Guidelines for Continued Assistance from Community First Responder
          </span>
          <ChevronRight className="shrink-0 text-slate-400" size={20} />
        </Link>
      </section>

      <section className="mr-hscroll no-scrollbar pt-4">
        {carouselCards.slice(0, 2).map((card) => (
          <Link
            key={card.id}
            href={card.id === 'extinguishing-fires' ? '/myResponder/dashboard/fire' : '/myResponder/learn'}
            className="mr-hscroll-card border border-slate-100"
          >
            <div
              className="flex h-[134px] items-end bg-[#003B73] p-4"
              style={{ background: `linear-gradient(135deg, ${card.color}, ${card.color}cc)` }}
            >
              <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-white">
                {card.category}
              </span>
            </div>
            <div className="p-3">
              <p className="text-[15px] font-extrabold leading-snug text-slate-900">{card.title}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="pb-4">
        <h2 className="mr-section-header">Latest community news</h2>
        <div className="space-y-3 px-4">
          {mockNews.slice(0, 4).map((article, index) => (
            <Link
              key={article.id}
              href={`/myResponder/dashboard/article/${article.id}`}
              className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-inherit shadow-xs"
            >
              <div
                className="grid h-[86px] w-[92px] shrink-0 place-items-center rounded-xl text-white"
                style={{ background: `linear-gradient(135deg, ${article.color}, ${article.color}aa)` }}
              >
                <Newspaper size={28} strokeWidth={1.9} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] font-black uppercase tracking-wide" style={{ color: article.color }}>
                    {article.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                    <Eye size={13} />
                    {(1240 + index * 380).toLocaleString()}
                  </span>
                </div>
                <p className="line-clamp-2 text-[14px] font-bold leading-snug text-slate-950">{article.title}</p>
                <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-slate-500">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
