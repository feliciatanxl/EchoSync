// @ts-nocheck
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#eef2f8]">
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 text-[#1e3a8a]" />
        </button>
        <h1 className="text-base font-bold text-[#1e3a8a]">About app</h1>
      </div>

      <div className="px-4 py-4 space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">🛡️</div>
            <div>
              <div className="font-bold text-gray-900">myResponder</div>
              <div className="text-xs text-gray-400">Version 4.3.8</div>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            This application is produced by the Singapore Civil Defence Force (SCDF).
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            The SCDF 995 Ops Centre notifies you via myResponder app of any nearby cardiac arrest and minor fire cases. If you receive the notification, you may choose to respond to the incident and offer your assistance as a Good Samaritan. The app will highlight nearby AEDs that may be available.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            For more information on how to use this app, please refer to the{' '}
            <span className="text-[#1e3a8a] font-semibold">FAQ page</span>.
          </p>
        </div>

        {[
          { label: 'Terms & conditions', external: false },
          { label: 'Privacy policy', external: false },
          { label: 'Report vulnerability', external: true },
          { label: 'Contact information', external: true },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl px-4 py-4 shadow-sm flex items-center justify-between">
            <span className="text-sm text-gray-800">{item.label}</span>
            {item.external
              ? <ExternalLink className="w-4 h-4 text-gray-400" />
              : <ChevronRight className="w-4 h-4 text-gray-400" />
            }
          </div>
        ))}

        <p className="text-center text-xs text-gray-400 py-2">© 2024 Singapore Civil Defence Force (SCDF)</p>
      </div>
    </div>
  );
}