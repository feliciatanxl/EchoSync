// @ts-nocheck
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${checked ? 'bg-[#1e3a8a]' : 'bg-gray-200'}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
}

function SectionHeader({ children }) {
  return <h2 className="text-base font-bold text-[#1e3a8a] px-4 pt-5 pb-2">{children}</h2>;
}

function SettingRow({ label, sublabel, control }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-50 last:border-0">
      <div className="flex-1 pr-4">
        <div className="text-sm font-semibold text-gray-900">{label}</div>
        {sublabel && <div className="text-xs text-gray-400 mt-0.5">{sublabel}</div>}
      </div>
      {control}
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const [s, setS] = useState({
    bypass_silent: false,
    alert_cardiac: false,
    alert_fire: false,
    silent_hours: false,
    sms_alerts: false,
    transport_mode: 'walk',
    push_scdf: true,
    push_courses: true,
    push_community: true,
    push_feedback: true,
    email_surveys: false,
  });

  const set = (key) => (val) => setS((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="min-h-screen bg-[#eef2f8]">
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 text-[#1e3a8a]" />
        </button>
        <h1 className="text-base font-bold text-[#1e3a8a]">Settings</h1>
      </div>

      <SectionHeader>Case notifications</SectionHeader>
      <div className="mx-4 bg-white rounded-2xl overflow-hidden shadow-sm">
        {/* Bypass silent mode */}
        <div className="px-4 py-3 border-b border-gray-50">
          <div className="text-sm font-bold text-gray-900 mb-1">Bypass silent mode</div>
          <div className="text-xs text-gray-400 mb-3">Receive case alerts even if your phone is on silent</div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <div
                onClick={() => setS({ ...s, bypass_silent: true })}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${s.bypass_silent ? 'border-[#1e3a8a]' : 'border-gray-300'}`}
              >
                {s.bypass_silent && <div className="w-3 h-3 rounded-full bg-[#1e3a8a]" />}
              </div>
              <span className="text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <div
                onClick={() => setS({ ...s, bypass_silent: false })}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${!s.bypass_silent ? 'border-[#1e3a8a]' : 'border-gray-300'}`}
              >
                {!s.bypass_silent && <div className="w-3 h-3 rounded-full bg-[#1e3a8a]" />}
              </div>
              <span className="text-sm text-gray-700">No</span>
            </label>
          </div>
          <button className="text-[#1e3a8a] font-semibold text-sm mt-3 flex items-center gap-1">
            🔊 Preview sound
          </button>
        </div>

        <div className="text-sm font-bold text-gray-900 px-4 pt-3 pb-1">I want to be alerted for</div>
        <SettingRow label="Cardiac arrest cases" control={<Toggle checked={s.alert_cardiac} onChange={set('alert_cardiac')} />} />
        <SettingRow label="Fire cases" control={<Toggle checked={s.alert_fire} onChange={set('alert_fire')} />} />
        <SettingRow
          label="Silent hours"
          sublabel="You will not receive any case alert notifications during the set time"
          control={<Toggle checked={s.silent_hours} onChange={set('silent_hours')} />}
        />
      </div>

      <div className="mx-4 bg-white rounded-2xl overflow-hidden shadow-sm mt-3">
        <SettingRow label="Receive SMS for case alerts" control={<Toggle checked={s.sms_alerts} onChange={set('sms_alerts')} />} />
      </div>

      {/* Transport mode */}
      <div className="mx-4 bg-white rounded-2xl overflow-hidden shadow-sm mt-3">
        <div className="px-4 py-3">
          <div className="text-sm font-bold text-gray-900 mb-1">Preferred mode of transport</div>
          <div className="text-xs text-gray-400 mb-3">Control the distance within which you will receive case alerts</div>
          {[
            { val: 'walk', label: 'Walk: 400m alert radius' },
            { val: 'cycle', label: 'Cycle: 800m alert radius' },
            { val: 'vehicle', label: 'Vehicle: 1500m alert radius' },
          ].map(({ val, label }) => (
            <label key={val} className="flex items-center gap-3 py-2 cursor-pointer">
              <div
                onClick={() => setS({ ...s, transport_mode: val })}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${s.transport_mode === val ? 'border-[#1e3a8a]' : 'border-gray-300'}`}
              >
                {s.transport_mode === val && <div className="w-3 h-3 rounded-full bg-[#1e3a8a]" />}
              </div>
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <SectionHeader>Push notifications</SectionHeader>
      <div className="mx-4 bg-white rounded-2xl overflow-hidden shadow-sm">
        <SettingRow label="SCDF announcements" control={<Toggle checked={s.push_scdf} onChange={set('push_scdf')} />} />
        <SettingRow label="Courses and guides" control={<Toggle checked={s.push_courses} onChange={set('push_courses')} />} />
        <SettingRow label="Community news" control={<Toggle checked={s.push_community} onChange={set('push_community')} />} />
        <SettingRow label="My submitted feedback" control={<Toggle checked={s.push_feedback} onChange={set('push_feedback')} />} />
      </div>

      <SectionHeader>Email notifications</SectionHeader>
      <div className="mx-4 bg-white rounded-2xl overflow-hidden shadow-sm mb-8">
        <SettingRow label="SCDF surveys" control={<Toggle checked={s.email_surveys} onChange={set('email_surveys')} />} />
      </div>
    </div>
  );
}