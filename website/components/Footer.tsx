'use client';

import { useState } from 'react';
import { Shield, Mail, MapPin, Phone, ArrowRight, X, Building, User } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'How It Works', href: '#technology' },
    { label: 'Privacy', href: '#privacy' },
    { label: 'For Government', href: '#mission' },
    { label: 'EchoRover', href: '#technology' },
  ],
  company: [
    { label: 'Our Mission', href: '#mission' },
    { label: 'Team', href: '#team' },
    { label: 'Careers', href: '#' },
    { label: 'Press Kit', href: '#' },
  ],
  compliance: [
    { label: 'PDPA Policy', href: '#privacy' },
    { label: 'Data Governance', href: '#privacy' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Security', href: '#privacy' },
  ],
};

export default function Footer() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <footer id="footer" className="bg-text-heading text-white">
      {/* CTA Band */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Ready to Protect Your Community?
              </h2>
              <p className="text-white/60 text-[15px]">
                Schedule a demo to see EchoSync in action for your estate.
              </p>
            </div>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              id="footer-request-demo"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl text-[15px] font-semibold bg-white text-text-heading hover:bg-primary hover:text-white transition-all duration-300 hover:shadow-xl cursor-pointer"
            >
              Request a Demo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Links Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-cyan flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-[16px] font-bold">EchoSync</span>
            </div>
            <p className="text-[13px] text-white/50 leading-relaxed mb-5">
              AI-powered community wellbeing and safety for Singapore&apos;s Smart Nation.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[12px] text-white/40">
                <MapPin className="w-3.5 h-3.5" />
                <span>Singapore</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-white/40">
                <Mail className="w-3.5 h-3.5" />
                <span>contact@echosync.sg</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-white/40">
                <Phone className="w-3.5 h-3.5" />
                <span>+65 XXXX XXXX</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-white/30 mb-5">
                {title}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-[13px] text-white/50 hover:text-white transition-colors duration-200">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/30">
            © {new Date().getFullYear()} EchoSync. All rights reserved. A Singapore Smart Nation Initiative.
          </p>
          <div className="flex items-center gap-4 text-[12px] text-white/30">
            <span>PDPA Compliant</span>
            <span>•</span>
            <span>End-to-End Encrypted</span>
            <span>•</span>
            <span>Made in 🇸🇬</span>
          </div>
        </div>
      </div>
      {/* Demo Request Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-white/40 backdrop-blur-md transition-opacity"
            onClick={() => {
              setIsDemoModalOpen(false);
              setIsSubmitted(false);
            }}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-[480px] bg-white border border-border/80 shadow-2xl rounded-3xl overflow-hidden animate-fade-in flex flex-col text-left">
            {isSubmitted ? (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-2">
                  <Shield className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-text-heading">Request Received</h3>
                <p className="text-[15px] text-text-muted leading-relaxed">
                  Thank you. An EchoSync deployment specialist will contact your agency within 24 hours to schedule the live walkthrough.
                </p>
                <button 
                  onClick={() => setIsDemoModalOpen(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-bg-light border border-border font-semibold text-text-heading hover:bg-white hover:border-primary/30 transition-colors"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="px-8 py-6 border-b border-border/50 flex items-center justify-between bg-bg-light text-text-heading">
                  <h2 className="text-xl font-bold text-text-heading tracking-tight">Request Live Demo</h2>
                  <button 
                    onClick={() => setIsDemoModalOpen(false)}
                    className="p-2 rounded-xl text-text-muted hover:text-text-heading hover:bg-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Form */}
                <div className="p-8 space-y-6 text-text-heading">
                  <div className="space-y-4">
                    {/* Agency Name */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-text-heading">Agency / Ministry Name</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                        <input type="text" placeholder="e.g., Housing & Development Board" className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-light border border-border text-[14px] text-text-heading placeholder:text-text-light focus:outline-none focus:border-primary/50 focus:bg-white transition-colors" />
                      </div>
                    </div>
                    
                    {/* Official Email */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-text-heading">Official Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                        <input type="email" placeholder="e.g., john_doe@hdb.gov.sg" className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-light border border-border text-[14px] text-text-heading placeholder:text-text-light focus:outline-none focus:border-primary/50 focus:bg-white transition-colors" />
                      </div>
                    </div>
                    
                    {/* Area of Interest */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-text-heading">Primary Area of Interest</label>
                      <select className="w-full px-4 py-3 rounded-xl bg-bg-light border border-border text-[14px] text-text-heading focus:outline-none focus:border-primary/50 focus:bg-white transition-colors appearance-none">
                        <option>Smart Nation IoT Integration</option>
                        <option>Elderly Care Monitoring System</option>
                        <option>Automated Emergency Dispatch (SCDF)</option>
                        <option>Other Enterprise Solutions</option>
                      </select>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsSubmitted(true)}
                    className="w-full py-3.5 rounded-xl text-[15px] font-bold text-white transition-all duration-300 hover:shadow-lg active:scale-[0.98] cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #0891b2 100%)',
                    }}
                  >
                    Submit Request
                  </button>
                  <p className="text-[11px] text-center text-text-light mt-4">
                    Your data is secure. View our <a href="#privacy" onClick={() => setIsDemoModalOpen(false)} className="text-primary hover:underline">PDPA Privacy Policy</a>.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </footer>
  );
}
