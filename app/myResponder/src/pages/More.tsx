// @ts-nocheck
import { Link } from 'react-router-dom';
import { ChevronRight, Settings, HelpCircle, Heart, Trophy, MessageSquare } from 'lucide-react';
import { AVATARS } from '@/lib/mockData';

const DEMO_USER = {
  display_name: 'TAN',
  avatar_id: 'a8',
};

function getAvatar(id) {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
}

export default function More() {
  const avatar = getAvatar(DEMO_USER.avatar_id);

  const otherServices = [
    { label: 'Find AEDs', icon: '🔍', to: '/aeds', emoji: true },
    { label: 'Feedback', icon: <MessageSquare className="w-5 h-5 text-[#1e3a8a]" />, to: '/feedback' },
    { label: 'Wellbeing check-in', icon: <Heart className="w-5 h-5 text-red-500" />, to: '/wellbeing' },
    { label: 'Hall of Fame', icon: <Trophy className="w-5 h-5 text-yellow-500" />, to: '/hall-of-fame' },
    { label: 'FAQ', icon: <HelpCircle className="w-5 h-5 text-[#1e3a8a]" />, to: '/faq' },
  ];

  const general = [
    { label: 'Settings', icon: <Settings className="w-5 h-5 text-gray-500" />, to: '/settings' },
    { label: 'About app', icon: '📱', to: '/about', emoji: true },
  ];

  return (
    <div className="min-h-screen bg-[#eef2f8]">
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-2xl font-black text-[#1e3a8a] mb-5">More</h1>

        {/* User row */}
        <Link to="/profile" className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm mb-5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
            style={{ backgroundColor: avatar.bg + '33' }}
          >
            {avatar.emoji}
          </div>
          <div>
            <div className="font-black text-gray-900 text-lg">{DEMO_USER.display_name}</div>
            <div className="text-[#1e3a8a] text-sm font-semibold flex items-center gap-1">
              Go to profile <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </Link>

        {/* Other services */}
        <div className="mb-4">
          <h2 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider mb-2 px-1">Other services</h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
            {otherServices.map((item) => (
              <Link key={item.label} to={item.to} className="flex items-center gap-4 px-4 py-3.5">
                <div className="w-8 flex items-center justify-center">
                  {item.emoji ? <span className="text-xl">{item.icon}</span> : item.icon}
                </div>
                <span className="flex-1 text-sm font-medium text-gray-800">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </Link>
            ))}
          </div>
        </div>

        {/* General */}
        <div>
          <h2 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wider mb-2 px-1">General</h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
            {general.map((item) => (
              <Link key={item.label} to={item.to} className="flex items-center gap-4 px-4 py-3.5">
                <div className="w-8 flex items-center justify-center">
                  {item.emoji ? <span className="text-xl">{item.icon}</span> : item.icon}
                </div>
                <span className="flex-1 text-sm font-medium text-gray-800">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}