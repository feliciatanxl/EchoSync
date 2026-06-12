// @ts-nocheck
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Edit2, X } from 'lucide-react';
import { AVATARS } from '@/lib/mockData';
import { motion, AnimatePresence } from 'framer-motion';

const DEMO_USER = { display_name: 'TAN', avatar_id: 'a8', cardiac_cases: 0, fire_cases: 0 };

function getAvatar(id) {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
}

export default function Profile() {
  const [showCFRModal, setShowCFRModal] = useState(false);
  const navigate = useNavigate();
  const avatar = getAvatar(DEMO_USER.avatar_id);

  return (
    <div className="min-h-screen bg-[#eef2f8]">
      {/* Blue header */}
<div className="bg-gradient-to-b from-[#1a3a8f] to-[#2b5ce6] px-4 pt-7 pb-6 relative overflow-hidden">
  <div className="absolute -left-12 bottom-0 w-28 h-28 bg-white/10 rounded-full" />
  <div className="absolute -right-12 bottom-0 w-28 h-28 bg-white/10 rounded-full" />

  <div className="flex items-center gap-3 mb-2">
    <button onClick={() => navigate(-1)}>
      <ChevronLeft className="w-5 h-5 text-white" />
    </button>
    <h1 className="text-base font-bold text-white">Profile</h1>
  </div>

  <div className="flex flex-col items-center gap-1">
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center text-2xl border-4 border-white/30 shadow-lg"
      style={{ backgroundColor: `${avatar.bg}55` }}
    >
      {avatar.emoji}
    </div>

    <h2 className="text-lg font-black text-white truncate max-w-[220px]">
      {DEMO_USER.display_name}
    </h2>
  </div>
</div>

      {/* Content */}
      <div className="px-4 mt-3 -mb-6 space-y-4">
        {/* Tabs */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowCFRModal(true)}
            className="flex-1 bg-[#1e3a8a] text-white font-bold py-3 rounded-2xl text-sm flex items-center justify-center gap-2"
          >
            My CFR ID <span className="text-orange-400">⚠️</span>
          </button>
          <Link
            to="/account"
            className="flex-1 bg-white border-2 border-[#1e3a8a] text-[#1e3a8a] font-bold py-3 rounded-2xl text-sm text-center"
          >
            My Account
          </Link>
        </div>

        <p className="text-xs text-gray-500 text-center">Complete your profile by uploading your portrait to your CFR ID.</p>

        {/* Case stats */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-gray-100">
            <div className="p-4 flex items-center gap-3">
              <span className="text-2xl">❤️‍🔥</span>
              <div>
                <div className="text-xs text-gray-500">Cardiac arrest</div>
                <div className="text-2xl font-black text-gray-900">{DEMO_USER.cardiac_cases}</div>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="text-xs text-gray-500">Fire</div>
                <div className="text-2xl font-black text-gray-900">{DEMO_USER.fire_cases}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Occupation */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#1e3a8a]">My occupation</h3>
              <span className="text-orange-400">⚠️</span>
            </div>
            <Link to="/occupation">
              <Edit2 className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-1">Complete your profile by indicating your occupation.</p>
        </div>
      </div>

      {/* CFR ID Modal */}
      <AnimatePresence>
        {showCFRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-6"
            onClick={() => setShowCFRModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden w-full max-w-xs shadow-2xl"
            >
              {/* Card header */}
              <div className="bg-white px-6 pt-5 pb-3 flex items-center justify-center gap-3 border-b-4 border-orange-500">
                <span className="text-2xl">🛡️</span>
                <div>
                  <div className="font-black text-[#1e3a8a] text-xl">SCDF</div>
                  <div className="text-xs text-gray-500">The Life Saving Force</div>
                </div>
              </div>
              <div className="bg-[#1e3a8a] px-6 py-6 text-white text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center">
                  <span className="text-3xl">👤</span>
                </div>
                <button className="bg-white text-[#1e3a8a] font-bold text-sm px-5 py-2 rounded-full flex items-center gap-2 mx-auto">
                  + Upload photo <span className="text-orange-500">⚠️</span>
                </button>
                <div className="font-black text-lg">TAN XIU LI, FELICIA</div>
                <hr className="border-white/30" />
                <p className="text-sm text-white/80">
                  This is a sample of what you will see on your CFR ID during an emergency.
                </p>
                <hr className="border-white/30" />
                <p className="text-sm text-white/80">
                  Please cooperate with our volunteer to attend to the emergency quickly. Your immediate help is crucial.
                </p>
              </div>
              <div className="bg-orange-500 h-2" />
            </motion.div>
            <button
              onClick={() => setShowCFRModal(false)}
              className="absolute bottom-20 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}