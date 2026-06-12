// @ts-nocheck
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, BellOff, ChevronRight, Eye, Heart, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_STATS, MOCK_NEWS, MOCK_COURSES } from '@/lib/mockData';

export default function Home() {
  const [alertOn, setAlertOn] = useState(false);

  return (
    <div className="min-h-screen bg-[#eef2f8]">
      {/* Blue header */}
      <div className="bg-gradient-to-b from-[#1a3a8f] to-[#2b5ce6] px-4 pt-10 pb-6 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute top-4 -right-4 w-24 h-24 rounded-full bg-white/5" />

        {/* Top bar */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-1">
            <span className="text-white font-light text-lg">my</span>
            <span className="text-white font-black text-lg">RESP</span>
            <Heart className="w-5 h-5 text-white" fill="white" strokeWidth={0} />
            <span className="text-white font-black text-lg">NDER</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAlertOn(!alertOn)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${
                alertOn
                  ? 'border-green-400 text-green-400 bg-green-400/10'
                  : 'border-white/50 text-white/80 bg-white/10'
              }`}
            >
              {alertOn ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
              {alertOn ? 'Alert on' : 'Alert off'}
            </button>
            <Bell className="w-5 h-5 text-white/80" />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-3.5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#1e3a8a] text-xs font-semibold mb-1">
                  Cardiac arrest <ChevronRight className="w-3 h-3" />
                </div>
                <div className="text-3xl font-black text-gray-900">{MOCK_STATS.cardiacArrest}</div>
              </div>
              <span className="text-2xl">❤️‍🔥</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-3.5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1 text-red-600 text-xs font-semibold mb-1">
                  Fire <ChevronRight className="w-3 h-3" />
                </div>
                <div className="text-3xl font-black text-gray-900">{MOCK_STATS.fire}</div>
              </div>
              <span className="text-2xl">🔥</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-3.5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-gray-500 text-[11px] mb-1">Registered CFRs</div>
                <div className="text-2xl font-black text-gray-900">
                  {MOCK_STATS.registeredCFRs.toLocaleString()}
                </div>
              </div>
              <span className="text-2xl">🧑‍🤝‍🧑</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-3.5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1 text-gray-500 text-[11px] mb-1">
                  Cases today <ChevronRight className="w-3 h-3" />
                </div>
                <div className="text-3xl font-black text-gray-900">{MOCK_STATS.casesToday}</div>
              </div>
              <span className="text-2xl">📍</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-5">
        {/* Guidelines banner */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-gray-700 flex-1 font-medium">
            Guidelines for Continued Assistance from Community First Responders
          </p>
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </div>

        {/* CFR Journey */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Start your CFR journey here</h2>
            <Link to="/learn" className="text-[#1e3a8a] text-sm font-semibold">View more</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {MOCK_COURSES.slice(0, 3).map((course) => (
              <div key={course.id} className="min-w-[160px] bg-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
                <div className="absolute -top-3 -right-3 w-20 h-20 bg-blue-50 rounded-full opacity-60" />
                <div className="text-3xl mb-3 relative z-10">{course.icon}</div>
                <div className="text-sm font-bold text-gray-900 leading-tight mb-1 relative z-10">{course.title}</div>
                <div className="text-[11px] text-gray-500 line-clamp-2 relative z-10">{course.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest news */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Latest community news</h2>
            <Link to="/news" className="text-[#1e3a8a] text-sm font-semibold">View all</Link>
          </div>
          <div className="space-y-4">
            {MOCK_NEWS.slice(0, 2).map((article) => (
              <div key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-3.5">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2">{article.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{new Date(article.date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.views}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {article.likes}</span>
                  </div>
                  {article.category && (
                    <span className="inline-block mt-2 bg-blue-50 text-[#1e3a8a] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {article.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ScamShield banner */}
        <div className="bg-[#1e3a8a] rounded-2xl p-4 text-white">
          <p className="font-bold text-sm leading-snug mb-2">
            Government officials will NEVER ask you to transfer money or disclose bank log-in details over a phone call.
          </p>
          <p className="text-xs text-white/75">
            Call the 24/7 ScamShield Helpline at 1799 if you are unsure if something is a scam.
          </p>
        </div>
      </div>
    </div>
  );
}