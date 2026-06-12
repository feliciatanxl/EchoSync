// @ts-nocheck
import { useState } from 'react';
import { ChevronLeft, MapPin, Upload } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function FireHazard() {
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.FeedbackReport.create({
      category: 'fire_hazard',
      description,
      location,
      status: 'submitted',
    });
    setSubmitting(false);
    toast.success('Fire hazard reported successfully!');
    setShowForm(false);
    setDescription('');
    setLocation('');
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-[#eef2f8]">
        <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100">
          <button onClick={() => setShowForm(false)}>
            <ChevronLeft className="w-5 h-5 text-[#1e3a8a]" />
          </button>
          <h1 className="text-base font-bold text-[#1e3a8a]">Report Fire Hazard</h1>
        </div>
        <form onSubmit={handleSubmit} className="px-4 py-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a8a]"
                placeholder="Enter location or address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Description</label>
            <textarea
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a8a] h-28 resize-none"
              placeholder="Describe the fire hazard..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Photo (optional)</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 bg-white">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400">Tap to upload photo</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#1e3a8a] text-white font-bold py-4 rounded-2xl text-base disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d8edf8] flex flex-col">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0">
          <div className="w-28 h-28 bg-[#b8d9f0] rounded-full -translate-y-4 translate-x-4 flex items-center justify-center">
            <span className="text-5xl">⚠️</span>
          </div>
        </div>
        <h1 className="text-3xl font-black text-[#1e3a8a]">Fire Hazard</h1>
        <p className="text-sm text-gray-600 mt-1">Report a fire hazard if you spot one!</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-5">
        <div className="w-52 h-52 flex items-center justify-center">
          <span className="text-9xl">📦</span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed">
          Keep an eye out for things that could endanger lives and property in the event of a fire outbreak — report here to keep everyone safe!
        </p>
      </div>

      <div className="px-4 pb-6">
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-[#1e3a8a] text-white font-bold py-4 rounded-2xl text-base"
        >
          Report fire hazard
        </button>
      </div>
    </div>
  );
}