'use client';

import { Shield, X, Building, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubmitted: boolean;
  setIsSubmitted: (val: boolean) => void;
  title?: string;
  subtitle?: string;
}

export default function ContactModal({ 
  isOpen, 
  onClose, 
  isSubmitted, 
  setIsSubmitted,
  title = "Request Live Demo",
  subtitle = "Schedule a live walkthrough with our deployment team."
}: ContactModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-text-heading/40 backdrop-blur-md transition-opacity"
        onClick={() => {
          onClose();
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
            <h3 className="text-2xl font-bold text-text-heading">Message Received</h3>
            <p className="text-[15px] text-text-muted leading-relaxed">
              Thank you. Your inquiry has been sent to our deployment specialists. We will contact your agency within 24 hours.
            </p>
            <button 
              onClick={() => {
                onClose();
                setIsSubmitted(false);
              }}
              className="mt-6 px-6 py-2.5 rounded-xl bg-bg-light border border-border font-semibold text-text-heading hover:bg-white hover:border-primary/30 transition-colors"
            >
              Close Window
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-8 py-6 border-b border-border/50 flex items-center justify-between bg-bg-light text-text-heading">
              <div>
                <h2 className="text-xl font-bold text-text-heading tracking-tight">{title}</h2>
                <p className="text-[12px] text-text-muted mt-0.5">{subtitle}</p>
              </div>
              <button 
                onClick={onClose}
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
                
                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-text-heading">How can we help?</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-4 w-4 h-4 text-text-light" />
                    <textarea 
                      placeholder="Enter your message or specific requirements..." 
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-light border border-border text-[14px] text-text-heading placeholder:text-text-light focus:outline-none focus:border-primary/50 focus:bg-white transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setIsSubmitted(true)}
                className="w-full py-3.5 rounded-xl text-[15px] font-bold text-white transition-all duration-300 hover:shadow-lg active:scale-[0.98] cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #0891b2 100%)',
                }}
              >
                Send Message
              </button>
              <p className="text-[11px] text-center text-text-light mt-4">
                Your data is secure. View our <a href="#privacy" onClick={onClose} className="text-primary hover:underline">PDPA Privacy Policy</a>.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
