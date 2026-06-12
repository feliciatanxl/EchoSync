// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { AVATARS } from '@/lib/mockData';

const DEMO_ACCOUNT = {
  nric_name: 'TAN YU EN, CHARLISA',
  display_name: 'TAN',
  mobile: '12345678',
  email: 'charlisa@gmail.com',
  avatar_id: 'a8',
};

function getAvatar(id) {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
}

export default function Account() {
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [account, setAccount] = useState(DEMO_ACCOUNT);
  const [selectedAvatar, setSelectedAvatar] = useState(account.avatar_id);
  const navigate = useNavigate();
  const avatar = getAvatar(account.avatar_id);

  const handleSave = () => {
    setAccount({ ...account, avatar_id: selectedAvatar });
    setIsEditing(false);
  };

  if (showAvatarPicker) {
    const previewAvatar = getAvatar(selectedAvatar);
    return (
      <div className="min-h-screen bg-[#eef2f8]">
        <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-100">
          <h1 className="text-base font-bold text-[#1e3a8a]">Choose avatar</h1>
          <button onClick={() => setShowAvatarPicker(false)} className="text-gray-500 font-bold text-lg">✕</button>
        </div>
        <div className="px-4 py-6">
          <h2 className="text-xl font-black text-gray-900 mb-1">Pick an avatar</h2>
          <p className="text-sm text-gray-500 mb-6">This is how others will see you on the app.</p>
          <div className="flex justify-center mb-8">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center text-6xl border-4 border-[#1e3a8a]/30 shadow-lg"
              style={{ backgroundColor: previewAvatar.bg + '33' }}
            >
              {previewAvatar.emoji}
            </div>
          </div>
          <div className="grid grid-cols-5 gap-3 mb-8">
            {AVATARS.map((av) => (
              <button
                key={av.id}
                onClick={() => setSelectedAvatar(av.id)}
                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border-3 transition-all ${
                  selectedAvatar === av.id ? 'ring-3 ring-[#1e3a8a] scale-110' : ''
                }`}
                style={{ backgroundColor: av.bg + '44' }}
              >
                {av.emoji}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAvatarPicker(false)}
            className="w-full bg-[#1e3a8a] text-white font-bold py-4 rounded-2xl text-base"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-[#eef2f8]">
        <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100">
          <button onClick={() => setIsEditing(false)}>
            <ChevronLeft className="w-5 h-5 text-[#1e3a8a]" />
          </button>
          <h1 className="text-base font-bold text-[#1e3a8a]">Edit my account</h1>
        </div>
        <div className="px-4 py-6 space-y-5">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
              style={{ backgroundColor: avatar.bg + '44' }}
            >
              {avatar.emoji}
            </div>
            <button
              onClick={() => setShowAvatarPicker(true)}
              className="border-2 border-[#1e3a8a] text-[#1e3a8a] font-semibold text-sm px-6 py-2 rounded-full"
            >
              Choose avatar
            </button>
          </div>
          {[
            { label: 'Name in NRIC/FIN', key: 'nric_name', placeholder: 'Full name as in NRIC' },
            { label: 'Display name', key: 'display_name', placeholder: 'How others see you', hint: 'This is how others will see you on the app.' },
            { label: 'Email address', key: 'email', placeholder: 'Email address' },
          ].map(({ label, key, placeholder, hint }) => (
            <div key={key}>
              <label className="block text-sm font-bold text-gray-800 mb-2">{label}</label>
              <input
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a8a]"
                value={account[key]}
                onChange={(e) => setAccount({ ...account, [key]: e.target.value })}
                placeholder={placeholder}
              />
              {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
            </div>
          ))}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">Mobile number</label>
            <div className="flex gap-2">
              <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 font-medium w-20">+65</div>
              <input
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1e3a8a]"
                value={account.mobile}
                onChange={(e) => setAccount({ ...account, mobile: e.target.value })}
                placeholder="Mobile number"
              />
            </div>
          </div>
          <button onClick={handleSave} className="w-full bg-[#1e3a8a] text-white font-bold py-4 rounded-2xl text-base">
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef2f8]">
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 text-[#1e3a8a]" />
        </button>
        <h1 className="text-base font-bold text-[#1e3a8a]">My Account</h1>
      </div>
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-center mb-5">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-4 border-gray-100"
              style={{ backgroundColor: avatar.bg + '44' }}
            >
              {avatar.emoji}
            </div>
          </div>
          {[
            { label: 'Name in NRIC/FIN', value: account.nric_name },
            { label: 'Display name', value: account.display_name },
            { label: 'Mobile number', value: '+65 ' + account.mobile },
            { label: 'Email address', value: account.email },
          ].map(({ label, value }) => (
            <div key={label} className="mb-4">
              <div className="text-sm font-bold text-gray-900">{label}</div>
              <div className="text-sm text-gray-500 mt-0.5">{value}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="w-full bg-[#1e3a8a] text-white font-bold py-4 rounded-2xl text-base mt-6"
        >
          Edit
        </button>
      </div>
    </div>
  );
}