'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/myResponder/dashboard') {
      return pathname === '/myResponder/dashboard' || pathname.startsWith('/myResponder/dashboard/');
    }

    return pathname.startsWith(path);
  };

  const handleCall995 = () => {
    if (typeof window !== 'undefined') {
      window.location.href = 'tel:995';
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#EEF2F6]">
      <main className="min-h-0 flex-1 overflow-hidden">{children}</main>

      <nav className="mr-tab-bar" aria-label="Primary navigation">
        <Link
          href="/myResponder/dashboard"
          className={`mr-tab-item ${isActive('/myResponder/dashboard') ? 'active' : ''}`}
        >
          <svg className="mr-tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12L12 3l9 9" />
            <path d="M5 10v9a1 1 0 001 1h3v-5a1 1 0 011-1h4a1 1 0 011 1v5h3a1 1 0 001-1v-9" />
          </svg>
          <span>Home</span>
        </Link>

        <Link
          href="/myResponder/dashboard"
          className={`mr-tab-item ${pathname.includes('/dashboard/article') ? 'active' : ''}`}
        >
          <svg className="mr-tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path d="M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" />
            <path d="M8 7h8M8 11h6" />
          </svg>
          <span>Learn</span>
        </Link>

        <button className="mr-tab-item call-btn" onClick={handleCall995} type="button" aria-label="Call 995">
          <svg className="mr-tab-icon" viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z" />
          </svg>
          <span>995</span>
        </button>

        <Link
          href="/myResponder/dashboard/fire"
          className={`mr-tab-item ${isActive('/myResponder/dashboard/fire') ? 'active' : ''}`}
        >
          <svg className="mr-tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>Fire Hazard</span>
        </Link>

        <Link
          href="/myResponder/more"
          className={`mr-tab-item ${isActive('/myResponder/more') || isActive('/myResponder/profile') || isActive('/myResponder/settings') ? 'active' : ''}`}
        >
          <svg className="mr-tab-icon" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
          <span>More</span>
        </Link>
      </nav>
    </div>
  );
}
