// @ts-nocheck
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const OPTIONS = [
  { label: 'Stabilising myself', emoji: '💪' },
  { label: 'Understanding myself', emoji: '🧠' },
  { label: 'Caring for myself', emoji: '❤️' },
  { label: 'Support avenues', emoji: '📱' },
];

export default function Wellbeing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 text-[#1e3a8a]" />
        </button>
        <h1 className="text-base font-bold text-[#1e3a8a]">Wellbeing check-in</h1>
      </div>

      <div className="px-4 pt-6">
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Take a moment to check in with your wellbeing. Please select an option for us to help.
        </p>
        <div className="space-y-3">
          {OPTIONS.map((opt, i) => (
            <motion.button
              key={opt.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="w-full bg-[#eef2f8] rounded-2xl p-4 flex items-center gap-4 text-left"
            >
              <span className="text-3xl w-10 flex-shrink-0">{opt.emoji}</span>
              <span className="flex-1 font-semibold text-gray-900">{opt.label}</span>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}