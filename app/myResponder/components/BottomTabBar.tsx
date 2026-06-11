'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AlertTriangle, BookOpen, Home, MoreHorizontal, Phone, X } from 'lucide-react';

const tabs = [
  { label: 'Home', href: '/myResponder/dashboard', icon: Home, match: (path: string) => path === '/myResponder/dashboard' || path.includes('/dashboard') },
  { label: 'Learn', href: '/myResponder/learn', icon: BookOpen, match: (path: string) => path.startsWith('/myResponder/learn') },
  { label: 'Fire Hazard', href: '/myResponder/hazard', icon: AlertTriangle, match: (path: string) => path.startsWith('/myResponder/hazard') },
  { label: 'More', href: '/myResponder/more', icon: MoreHorizontal, match: (path: string) => path.startsWith('/myResponder/more') || path.startsWith('/myResponder/profile') || path.startsWith('/myResponder/settings') || path.startsWith('/myResponder/hall-of-fame') || path.startsWith('/myResponder/feedback') || path.startsWith('/myResponder/find-aeds') },
];

export default function BottomTabBar() {
  const pathname = usePathname();
  const [dialOpen, setDialOpen] = useState(false);

  return (
    <>
      <nav className="mr-tab-bar" aria-label="Primary navigation">
        <Link className={`mr-tab-item ${tabs[0].match(pathname) ? 'active' : ''}`} href={tabs[0].href}>
          <Home className="mr-tab-icon" size={23} />
          <span>Home</span>
        </Link>
        <Link className={`mr-tab-item ${tabs[1].match(pathname) ? 'active' : ''}`} href={tabs[1].href}>
          <BookOpen className="mr-tab-icon" size={23} />
          <span>Learn</span>
        </Link>
        <button className="mr-tab-item call-btn" type="button" onClick={() => setDialOpen(true)} aria-label="Call 995">
          <Phone size={20} fill="currentColor" />
          <span>Call 995</span>
        </button>
        <Link className={`mr-tab-item ${tabs[2].match(pathname) ? 'active' : ''}`} href={tabs[2].href}>
          <AlertTriangle className="mr-tab-icon" size={23} />
          <span>Fire Hazard</span>
        </Link>
        <Link className={`mr-tab-item ${tabs[3].match(pathname) ? 'active' : ''}`} href={tabs[3].href}>
          <MoreHorizontal className="mr-tab-icon" size={23} />
          <span>More</span>
        </Link>
      </nav>

      {dialOpen ? (
        <div className="mr-modal-backdrop">
          <div className="mr-modal">
            <button
              type="button"
              aria-label="Close dial modal"
              onClick={() => setDialOpen(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500"
            >
              <X size={16} />
            </button>
            <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-full bg-[#E53935] text-white">
              <Phone size={30} fill="currentColor" />
            </div>
            <h2 className="mr-modal-title">Call 995?</h2>
            <p className="mr-modal-body">This demo simulates dialing SCDF emergency services.</p>
            <div className="mr-modal-actions">
              <button type="button" className="mr-modal-btn-secondary" onClick={() => setDialOpen(false)}>Cancel</button>
              <button type="button" className="mr-modal-btn-primary" style={{ background: '#E53935' }} onClick={() => setDialOpen(false)}>Call</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
