// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

const OCCUPATIONS = [
  'Employed/Self-Employed',
  'Student',
  'NSF',
  'Unemployed/Retired',
];

export default function Occupation() {
  const [selected, setSelected] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#eef2f8]">
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 text-[#1e3a8a]" />
        </button>
        <h1 className="text-base font-bold text-[#1e3a8a]">My Occupation</h1>
      </div>

      <div className="px-4 py-6">
        <h2 className="font-bold text-gray-900 mb-3">Employment status</h2>
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 flex items-center justify-between text-sm"
          >
            <span className={selected ? 'text-gray-900' : 'text-gray-400'}>{selected || 'Select one'}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <div className="absolute w-full bg-white border border-gray-100 rounded-xl shadow-lg mt-1 z-10 overflow-hidden">
              {OCCUPATIONS.map((occ) => (
                <button
                  key={occ}
                  onClick={() => { setSelected(occ); setOpen(false); }}
                  className="w-full text-left px-4 py-3.5 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                >
                  {occ}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => { if (selected) { toast.success('Occupation saved!'); navigate(-1); } }}
          disabled={!selected}
          className="w-full bg-[#1e3a8a] text-white font-bold py-4 rounded-2xl text-base mt-8 disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </div>
  );
}