// @ts-nocheck
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import ActiveResponseScreen from '@/components/ActiveResponseScreen';

export default function ActiveResponse() {
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAcceptedAlert = async () => {
      const liveAlertRaw = sessionStorage.getItem(
        'echosync-myresponder-active-alert'
      );

      if (liveAlertRaw) {
        try {
          const liveAlert = JSON.parse(liveAlertRaw);
          setAlert(liveAlert);
          return;
        } catch {
          sessionStorage.removeItem('echosync-myresponder-active-alert');
        }
      }

      const alerts = await base44.entities.EmergencyAlert.list();
      const acceptedAlert = alerts.find((item) => item.status === 'accepted');

      if (!acceptedAlert) {
        navigate('/home', { replace: true });
        return;
      }

      setAlert(acceptedAlert);
    };

    loadAcceptedAlert();
  }, [navigate]);

  if (!alert) {
    return (
      <div className="min-h-screen bg-[#eef2f8] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1e3a8a]/20 border-t-[#1e3a8a] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ActiveResponseScreen
      alert={alert}
      onCancel={() => {
        sessionStorage.removeItem('echosync-myresponder-active-alert');
        navigate('/home', { replace: true });
      }}
      onParamedicsArrived={() => {
        sessionStorage.removeItem('echosync-myresponder-active-alert');
        navigate('/home', { replace: true });
      }}
    />
  );
}