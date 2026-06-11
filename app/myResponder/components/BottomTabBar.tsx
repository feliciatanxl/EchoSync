'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType } from 'react';
import { Flame, GraduationCap, Home, Menu, PhoneCall } from 'lucide-react';

type TabItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  match: (pathname: string) => boolean;
  isCall?: boolean;
};

const tabs: TabItem[] = [
  {
    label: 'Home',
    href: '/myResponder/dashboard',
    icon: Home,
    match: (pathname) => pathname === '/myResponder/dashboard',
  },
  {
    label: 'Learn',
    href: '/myResponder/dashboard',
    icon: GraduationCap,
    match: (pathname) => pathname.includes('/dashboard/article'),
  },
  {
    label: 'Call 995',
    href: 'tel:995',
    icon: PhoneCall,
    match: () => false,
    isCall: true,
  },
  {
    label: 'Fire Hazard',
    href: '/myResponder/dashboard/fire',
    icon: Flame,
    match: (pathname) => pathname.includes('/dashboard/fire'),
  },
  {
    label: 'More',
    href: '/myResponder/more',
    icon: Menu,
    match: (pathname) => pathname.includes('/more') || pathname.includes('/profile') || pathname.includes('/settings'),
  },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="mr-tab-bar" aria-label="Primary navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = tab.match(pathname);
        const className = `mr-tab-item${active ? ' active' : ''}${tab.isCall ? ' call-btn' : ''}`;

        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={className}
            aria-current={active ? 'page' : undefined}
            aria-label={tab.label}
          >
            <Icon className="mr-tab-icon" size={tab.isCall ? 20 : 24} strokeWidth={2.3} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
