// @ts-nocheck
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Flame, MoreHorizontal, Phone } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route) => path === route;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 z-50">
      <div className="flex items-end justify-around px-2 pb-2 pt-1">
        <Link to="/" className="flex flex-col items-center gap-0.5 py-1 px-3">
          <Home className={`w-5 h-5 ${isActive('/') ? 'text-[#1e3a8a]' : 'text-gray-400'}`} strokeWidth={isActive('/') ? 2.5 : 1.8} />
          <span className={`text-[10px] font-medium ${isActive('/') ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>Home</span>
        </Link>

        <Link to="/learn" className="flex flex-col items-center gap-0.5 py-1 px-3">
          <BookOpen className={`w-5 h-5 ${isActive('/learn') ? 'text-[#1e3a8a]' : 'text-gray-400'}`} strokeWidth={isActive('/learn') ? 2.5 : 1.8} />
          <span className={`text-[10px] font-medium ${isActive('/learn') ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>Learn</span>
        </Link>

        {/* Call 995 - elevated center button */}
        <div className="flex flex-col items-center -mt-5">
          <a href="tel:88951434" className="w-14 h-14 bg-white rounded-full shadow-lg border-2 border-gray-100 flex items-center justify-center">
            <div className="w-11 h-11 bg-red-600 rounded-full flex items-center justify-center shadow-md">
              <Phone className="w-5 h-5 text-white fill-white" />
            </div>
          </a>
          <span className="text-[10px] font-medium text-red-600 mt-0.5">Call 995</span>
        </div>

        <Link to="/fire-hazard" className="flex flex-col items-center gap-0.5 py-1 px-3">
          <Flame className={`w-5 h-5 ${isActive('/fire-hazard') ? 'text-[#1e3a8a]' : 'text-gray-400'}`} strokeWidth={isActive('/fire-hazard') ? 2.5 : 1.8} />
          <span className={`text-[10px] font-medium ${isActive('/fire-hazard') ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>Fire Hazard</span>
        </Link>

        <Link to="/more" className="flex flex-col items-center gap-0.5 py-1 px-3">
          <MoreHorizontal className={`w-5 h-5 ${isActive('/more') ? 'text-[#1e3a8a]' : 'text-gray-400'}`} strokeWidth={isActive('/more') ? 2.5 : 1.8} />
          <span className={`text-[10px] font-medium ${isActive('/more') ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>More</span>
        </Link>
      </div>
    </div>
  );
}