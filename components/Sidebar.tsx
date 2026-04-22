'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Shield,
} from 'lucide-react';

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'dashboard', href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'residents', href: '/residents', label: 'Residents', icon: Users, badge: 1247 },
  { id: 'incidents', href: '/incidents', label: 'Incident Reports', icon: FileText, badge: 3 },
  { id: 'settings', href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      id="sidebar-navigation"
      className={`fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
      style={{
        background: 'linear-gradient(180deg, rgba(10, 14, 26, 0.95) 0%, rgba(6, 10, 20, 0.98) 100%)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(148, 163, 184, 0.06)',
      }}
    >
      {/* Logo & Brand */}
      <div className="flex items-center gap-3 px-5 py-6 relative">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center relative"
          style={{
            background: 'linear-gradient(135deg, #00d4aa 0%, #06b6d4 100%)',
            boxShadow: '0 0 24px rgba(0, 212, 170, 0.25), 0 0 48px rgba(0, 212, 170, 0.1)',
          }}
        >
          <Shield className="w-5 h-5 text-[#060a14]" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="text-[15px] font-bold tracking-tight text-text-primary">
              EchoSync
            </h1>
            <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-accent-dim">
              Command Center
            </p>
          </div>
        )}

        {/* Collapse Toggle */}
        <button
          id="sidebar-collapse-toggle"
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-bg-elevated border border-border flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-200 hover:bg-bg-hover hover:border-accent/30 cursor-pointer ${
            collapsed ? '!opacity-100' : 'group-hover:opacity-100'
          }`}
          style={{ opacity: collapsed ? 1 : undefined }}
          onMouseEnter={(e) => {
            if (!collapsed) (e.currentTarget as HTMLElement).style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            if (!collapsed) (e.currentTarget as HTMLElement).style.opacity = '0';
          }}
        >
          <ChevronLeft
            className={`w-3 h-3 text-text-secondary transition-transform duration-300 ${
              collapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Separator */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border-accent to-transparent" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-3 text-[10px] font-semibold tracking-[0.15em] uppercase text-text-muted">
            Navigation
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.id}
              id={`nav-${item.id}`}
              href={item.href}
              className={`relative w-full flex items-center gap-3 rounded-lg transition-all duration-200 cursor-pointer group ${
                collapsed ? 'px-0 py-3 justify-center' : 'px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-accent-glow text-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
              }`}
            >
              {/* Active indicator bar */}
              {isActive && <div className="nav-active-indicator" />}

              <Icon
                className={`flex-shrink-0 w-[18px] h-[18px] transition-all duration-200 ${
                  isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'
                }`}
              />

              {!collapsed && (
                <>
                  <span
                    className={`text-[13px] font-medium transition-colors duration-200 ${
                      isActive ? 'text-accent' : ''
                    }`}
                  >
                    {item.label}
                  </span>

                  {item.badge !== undefined && (
                    <span
                      className={`ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        item.id === 'incidents'
                          ? 'bg-alert-high/15 text-alert-high'
                          : 'bg-bg-surface text-text-muted'
                      }`}
                    >
                      {item.badge.toLocaleString()}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Separator */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* User Section */}
      <div className={`p-4 ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-cyan flex items-center justify-center">
            <span className="text-[11px] font-bold text-bg-deep">VO</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-cyan flex items-center justify-center flex-shrink-0 ring-2 ring-accent/20">
              <span className="text-[11px] font-bold text-bg-deep">VO</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-text-primary truncate">
                Vivion Oh
              </p>
              <p className="text-[11px] text-text-muted truncate">
                System Administrator
              </p>
            </div>
            <button
              id="sign-out-button"
              className="p-1.5 rounded-lg text-text-muted hover:text-alert-high hover:bg-alert-high/10 transition-all duration-200 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
