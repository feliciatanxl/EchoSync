// @ts-nocheck
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_COURSES } from '@/lib/mockData';

export default function Learn() {
  return (
    <div className="min-h-screen bg-[#eef2f8]">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#d4e8f8] to-[#eef2f8] px-4 pt-12 pb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#2b5ce6]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <h1 className="text-3xl font-black text-[#1e3a8a]">Learn</h1>
        <p className="text-sm text-gray-500 mt-1">Explore our courses, emergency guides and learning portal.</p>
      </div>

      <div className="px-4 py-4 space-y-5">
        {/* My Badges */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">My badges</h2>
            <button className="text-[#1e3a8a] text-sm font-semibold">View more</button>
          </div>
          <p className="text-gray-400 text-sm text-center py-4">Complete a course to earn your first badge!</p>
        </div>

        {/* Essential Courses */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3">Essential life-saving courses</h2>
          <div className="space-y-3">
            {MOCK_COURSES.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl">
                  {course.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm">{course.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{course.description}</p>
                  {course.tags && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {course.tags.map((tag) => (
                        <span key={tag} className="bg-blue-50 text-[#1e3a8a] text-[10px] font-medium px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Emergency Guides section */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3">Emergency guides</h2>
          {[
            { title: 'What to do during a cardiac arrest', icon: '🫀' },
            { title: 'Fire escape plan checklist', icon: '🚒' },
            { title: 'How to use an AED', icon: '⚡' },
          ].map((guide) => (
            <div key={guide.title} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 mb-3">
              <span className="text-2xl">{guide.icon}</span>
              <span className="flex-1 font-medium text-sm text-gray-800">{guide.title}</span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}