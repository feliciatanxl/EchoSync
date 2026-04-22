'use client';

import { useState, useEffect } from 'react';
import { Shield, Menu, X, Lock, ChevronRight } from 'lucide-react';

const navLinks = [
  { label: 'Mission', href: '#mission' },
  { label: 'Technology', href: '#technology' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'Team', href: '#team' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-border-light'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group" id="logo-link">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
              }}
            >
              <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-lg font-bold text-text-heading tracking-tight">
                EchoSync
              </span>
              <span className="hidden sm:block text-[10px] font-medium tracking-[0.08em] uppercase text-text-muted leading-none">
                Smart Nation Healthcare
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-link text-[14px] font-medium text-text-muted hover:text-text-heading transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Client Portal Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              id="client-portal-button"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #0891b2 100%)',
              }}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Client Portal</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-heading hover:bg-bg-soft transition-all cursor-pointer"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border animate-fade-up">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-[14px] font-medium text-text-body hover:bg-bg-soft hover:text-primary transition-all"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-border mt-3">
              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold text-white"
                style={{
                  background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                }}
              >
                <Lock className="w-4 h-4" />
                Client Portal
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
