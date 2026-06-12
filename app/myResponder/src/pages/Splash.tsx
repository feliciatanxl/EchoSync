// @ts-nocheck
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate('/home'), 2500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1a3a8f] to-[#0d2260]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-8"
      >
        {/* SCDF Logo placeholder */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center bg-white/10">
            <span className="text-2xl">🛡️</span>
          </div>
          <div className="text-white">
            <div className="text-4xl font-black tracking-wider">SCDF</div>
            <div className="text-xs text-white/70 font-light">The Life Saving Force</div>
            <div className="text-[10px] text-white/50 italic">...for a safer Singapore</div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <span className="text-white font-light text-2xl tracking-wide">my</span>
          <span className="text-white font-black text-2xl tracking-wide">RESP</span>
          <Heart className="w-7 h-7 text-white" fill="white" strokeWidth={0} />
          <span className="text-white font-black text-2xl tracking-wide">NDER</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-16 flex gap-1"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-white/40"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  );
}