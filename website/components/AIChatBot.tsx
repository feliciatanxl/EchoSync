'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Minus } from 'lucide-react';

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am EchoAI. How can I help you with EchoSync today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listener for external triggers
  useEffect(() => {
    const handleTrigger = () => setIsOpen(true);
    window.addEventListener('open-echo-ai', handleTrigger);
    return () => window.removeEventListener('open-echo-ai', handleTrigger);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulated AI Response
    setTimeout(() => {
      let response = "I'm processing your request. For technical issues, please contact our 24/7 hotline at 1800-ECHOSYNC.";
      if (input.toLowerCase().includes('password')) {
        response = "To reset your password, please use the Recover Account page. If you haven't received an email, check your junk folder or contact your agency admin.";
      } else if (input.toLowerCase().includes('rover') || input.toLowerCase().includes('robot')) {
        response = "The EchoRover v2.4 is our autonomous first-response unit. It is equipped with an AED and two-way intercom for corridor deployment.";
      }
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[360px] h-[500px] bg-white rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col animate-fade-up">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-primary to-cyan text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold">EchoAI Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] font-medium opacity-80 uppercase tracking-wider">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Minus className="w-5 h-5" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-light/30">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white border border-border text-text-body rounded-tl-none shadow-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-border flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask EchoAI..." 
              className="flex-1 px-4 py-2 rounded-xl bg-bg-light border border-border text-[13px] focus:outline-none focus:border-primary/50 transition-colors"
            />
            <button type="submit" className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group ${
          isOpen ? 'bg-white text-text-heading border border-border' : 'bg-primary text-white'
        }`}
        style={!isOpen ? { background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)' } : {}}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-primary animate-pulse" />
          </div>
        )}
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-full mr-4 px-3 py-2 rounded-xl bg-text-heading text-white text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-accent" />
            Need help? Ask EchoAI
          </div>
        )}
      </button>
    </div>
  );
}
