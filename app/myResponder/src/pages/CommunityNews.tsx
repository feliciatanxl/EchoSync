// @ts-nocheck
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, Heart } from 'lucide-react';
import { MOCK_NEWS } from '@/lib/mockData';
import { motion } from 'framer-motion';

export default function CommunityNews() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#eef2f8]">
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 text-[#1e3a8a]" />
        </button>
        <h1 className="text-base font-bold text-[#1e3a8a]">Community news</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {MOCK_NEWS.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm"
          >
            <img src={article.image_url} alt={article.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2">{article.title}</h3>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{new Date(article.date).toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.views}</span>
                <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {article.likes}</span>
              </div>
              {article.category && (
                <span className="inline-block mt-2 bg-blue-50 text-[#1e3a8a] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {article.category}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}