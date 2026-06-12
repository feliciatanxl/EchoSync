// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Flame, AlertTriangle, Smartphone, MessageCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const CATEGORIES = [
  { key: 'fire_hazard', label: 'Fire hazard', icon: <Flame className="w-5 h-5" /> },
  { key: 'aed_fault', label: 'AED fault', icon: <AlertTriangle className="w-5 h-5" /> },
  { key: 'app_issue', label: 'App issue', icon: <Smartphone className="w-5 h-5" /> },
  { key: 'general', label: 'General', icon: <MessageCircle className="w-5 h-5" /> },
];

export default function Feedback() {
  const [selected, setSelected] = useState(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!selected || !description) return;
    setSubmitting(true);
    await base44.entities.FeedbackReport.create({ category: selected, description, status: 'submitted' });
    setSubmitting(false);
    toast.success('Feedback submitted!');
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#eef2f8]">
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 text-[#1e3a8a]" />
        </button>
        <h1 className="text-base font-bold text-[#1e3a8a]">Feedback</h1>
      </div>

      {/* Blue banner */}
      <div className="bg-[#1e3a8a] px-6 py-6 flex items-end justify-between relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full" />
        <div>
          <p className="text-white/70 text-sm">Hey there!</p>
          <p className="text-white font-bold text-lg">We're here to help</p>
        </div>
        <span className="text-5xl relative z-10">🙋‍♀️</span>
      </div>

      <div className="px-4 py-5">
        <h2 className="font-bold text-gray-900 mb-4">What can we help you with?</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelected(cat.key)}
              className={`bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 border-2 transition-all ${
                selected === cat.key ? 'border-[#1e3a8a] bg-blue-50' : 'border-transparent'
              }`}
            >
              <span className={selected === cat.key ? 'text-[#1e3a8a]' : 'text-gray-500'}>{cat.icon}</span>
              <span className="text-sm font-semibold text-gray-800">{cat.label}</span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Tell us more</label>
              <textarea
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a8a] h-28 resize-none"
                placeholder="Describe your feedback..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting || !description}
              className="w-full bg-[#1e3a8a] text-white font-bold py-4 rounded-2xl text-base disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}