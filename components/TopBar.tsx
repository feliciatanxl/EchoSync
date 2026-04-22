'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Search,
  ChevronRight,
  Radio,
  Shield,
  Users,
  Activity
} from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/': 'Command Center Overview',
  '/residents': 'Resident Management',
  '/incidents': 'Incident Reports Queue',
  '/settings': 'System Configuration',
};

export default function TopBar() {
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const title = pageTitles[pathname] || 'Dashboard';

  return (
    <header
      id="top-navigation-bar"
      className="fixed top-0 right-0 z-40 h-16 flex items-center justify-between px-6 transition-all duration-300"
      style={{
        left: '260px', // We can leave this fixed for now since layout handles the spacing
        background: 'rgba(6, 10, 20, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.06)',
      }}
    >
      {/* Left: Page Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-text-muted">
            <span>EchoSync</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-secondary">B2G Portal</span>
          </div>
          <h2 className="text-[15px] font-semibold text-text-primary tracking-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div
          className={`relative flex items-center transition-all duration-300 ${
            searchFocused || globalSearch.length > 0 ? 'w-64' : 'w-48'
          }`}
        >
          <Search className="absolute left-3 w-3.5 h-3.5 text-text-muted pointer-events-none" />
          <input
            id="global-search"
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search residents, incidents..."
            className="w-full pl-9 pr-3 py-2 text-[12px] rounded-lg bg-bg-secondary/60 border border-border text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent/30 focus:bg-bg-secondary transition-all duration-200"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => {
              // Delay hiding so clicks on the dropdown items can register
              setTimeout(() => setSearchFocused(false), 200);
            }}
          />

          {/* Search Results Dropdown */}
          {globalSearch.length > 0 && searchFocused && (
            <div className="absolute top-full left-0 mt-2 w-full glass-elevated rounded-xl border border-border/80 shadow-2xl overflow-hidden animate-fade-in z-50">
              <div className="px-3 py-2 border-b border-border bg-bg-surface/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Quick Results</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-2 border-b border-border/30 hover:bg-bg-surface/60 transition-colors cursor-pointer flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-text-primary">Tan Ah Lian</p>
                    <p className="text-[10px] text-text-muted">Resident • Blk 124 #04-12</p>
                  </div>
                </div>
                <div className="p-2 border-b border-border/30 hover:bg-bg-surface/60 transition-colors cursor-pointer flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-alert-high/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-3.5 h-3.5 text-alert-high" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-text-primary">INC-089: Heavy Fall Detected</p>
                    <p className="text-[10px] text-text-muted">Incident • Active</p>
                  </div>
                </div>
              </div>
              <div className="px-3 py-2 bg-bg-surface/30 border-t border-border text-center">
                <p className="text-[10px] font-medium text-text-secondary">
                  Press <span className="px-1 py-0.5 bg-bg-deep rounded text-text-primary border border-border">Enter</span> to see all results
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-border" />

        {/* System Status */}
        <div
          id="system-status-indicator"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-alert-low/8 border border-alert-low/15"
        >
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-alert-low" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-alert-low animate-pulse-glow" />
          </div>
          <span className="text-[11px] font-medium text-alert-low">
            All Systems Online
          </span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`relative p-2 rounded-lg transition-all duration-200 cursor-pointer ${
              notificationsOpen 
                ? 'text-text-primary bg-bg-hover' 
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
            }`}
          >
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-alert-high text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-bg-deep">
              5
            </span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 glass-elevated rounded-xl border border-border/80 shadow-2xl overflow-hidden animate-fade-in z-50">
              <div className="px-4 py-3 border-b border-border bg-bg-surface/50 flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-text-primary">Notifications</h3>
                <span className="text-[11px] text-accent font-medium cursor-pointer hover:underline">Mark all as read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                <div className="p-3 border-b border-border/50 hover:bg-bg-surface/40 transition-colors cursor-pointer">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-alert-high/10 text-alert-high flex flex-shrink-0 items-center justify-center">
                      <Radio className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-text-primary">New Critical Incident</p>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-snug">Thermal posture anomaly detected at Blk 124 #04-12.</p>
                      <p className="text-[10px] text-accent mt-1">2 mins ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-b border-border/50 hover:bg-bg-surface/40 transition-colors cursor-pointer">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-alert-medium/10 text-alert-medium flex flex-shrink-0 items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-text-primary">Node Offline Warning</p>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-snug">Sensor node at Blk 128 #02-44 has lost connection.</p>
                      <p className="text-[10px] text-text-muted mt-1">15 mins ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-bg-surface/40 transition-colors cursor-pointer">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan/10 text-cyan flex flex-shrink-0 items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-text-primary">System Update Complete</p>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-snug">AI filtering models updated to v2.4 seamlessly.</p>
                      <p className="text-[10px] text-text-muted mt-1">1 hr ago</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 bg-bg-surface/50 border-t border-border text-center">
                <button className="text-[11px] font-semibold text-text-secondary hover:text-text-primary transition-colors">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-border" />

        {/* User Role Badge */}
        <div
          id="user-role-badge"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg glass-elevated cursor-default"
        >
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-accent" />
            <Radio className="w-3 h-3 text-accent animate-pulse-glow" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-text-primary leading-none">
              Dispatcher Ops
            </p>
            <p className="text-[10px] text-text-muted leading-none mt-0.5">
              Clearance Level 3
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
