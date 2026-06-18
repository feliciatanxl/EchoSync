import {
  useState,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Wifi,
  ClipboardList,
  Cpu,
  Volume2,
  Footprints,
  Users,
  Button,
  Card,
  CardContent,
  type ScreenId,
  type Role,
  can,
  ScreenScroll,
  StatusDot,
  ToneBadge,
  ResidentCard,
  PauseBanner,
  type ReactNode
} from "../shared";
import type { CaregiverLiveAlert } from "../CaregiverApp";

export function HomeScreen({
  go,
  role,
  pause,
  clearPause,
  contactsSaved,
  clearContactsSaved,
  liveAlert,
}: {
  go: (s: ScreenId) => void;
  role: Role;
  pause: { reasonLabel: string; resumeAt: string } | null;
  clearPause: () => void;
  contactsSaved: boolean;
  clearContactsSaved: () => void;
  liveAlert: CaregiverLiveAlert | null;
}) {
  const canContacts = can(role, "contacts");
  const [showAlert, setShowAlert] = useState(false);
  const visibleAlert = liveAlert || (showAlert ? {
    eventType: 'Possible fall',
    riskLevel: 'Medium',
    confidence: 78,
  } : null);
  const lastUpdated = new Date().toLocaleTimeString("en-SG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <>
      <div className="px-4 pt-10 pb-4 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-slate-900">EchoSync Caregiver</div>
            <div className="text-xs text-slate-500">Good morning, Mei Ling</div>
          </div>
          <ToneBadge tone="green">
            <ShieldCheck className="w-3 h-3" /> Singpass-style verified
          </ToneBadge>
        </div>
        <div className="mt-2 rounded-md bg-slate-100 border border-slate-200 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-600 text-center">
          Secure demo service · Hackathon prototype
        </div>
      </div>
      <ScreenScroll>
        {pause && <PauseBanner pause={pause} onResume={clearPause} />}
        {contactsSaved && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-3 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="text-sm text-emerald-900">Contacts updated</div>
                <div className="text-xs text-emerald-800">
                  Emergency contact changes have been saved. Action logged to audit trail.
                </div>
              </div>
              <button
                onClick={clearContactsSaved}
                className="text-[11px] text-emerald-800 underline"
              >
                Dismiss
              </button>
            </CardContent>
          </Card>
        )}
        <ResidentCard />

        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusDot tone="green" />
                <span className="text-emerald-800">Normal — monitoring</span>
              </div>
              <span className="text-xs text-emerald-700">Node online</span>
            </div>
            <div className="text-xs text-emerald-700 mt-1">Last normal activity: 9:42 AM</div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Stat icon={<Wifi className="w-4 h-4" />} label="Node" value="Online" />
          <Stat icon={<Volume2 className="w-4 h-4" />} label="Voice check-in" value="9:30 AM" />
          <Stat icon={<Footprints className="w-4 h-4" />} label="Movement" value="Normal" />
          <Stat icon={<Phone className="w-4 h-4" />} label="Contacts" value="Updated" />
        </div>

        {visibleAlert ? (
          <Card className="border-amber-300 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Verification needed</span>
                </div>
                <ToneBadge tone="amber">{visibleAlert.riskLevel || 'Medium'}</ToneBadge>
              </div>
              <div className="text-xs text-amber-800 mt-1">
                {visibleAlert.eventType || 'Sensor anomaly'} detected · Confidence {Math.round(visibleAlert.confidence || 0)}%
              </div>
              <Button
                size="sm"
                className="mt-3 bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => go("alert")}
              >
                Review alert
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-emerald-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-slate-900">No active alerts</span>
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Mdm Tan’s EchoSync device is monitoring normally.
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Last device check-in: 30 seconds ago · Updated {lastUpdated}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2">
          <div className="text-[11px] text-slate-500">
            Demo controls — for prototype walkthrough only
          </div>
          <button
            onClick={() => setShowAlert((v) => !v)}
            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-white whitespace-nowrap"
          >
            {showAlert ? "Hide" : "Show"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <QuickAction icon={<Cpu className="w-5 h-5" />} label="View node" onClick={() => go("node")} />
          <QuickAction
            icon={<Users className="w-5 h-5" />}
            label={canContacts ? "Emergency contacts" : "Emergency contacts (view)"}
            onClick={() => go("contacts")}
          />
          <QuickAction
            icon={<ClipboardList className="w-5 h-5" />}
            label="Alert history"
            onClick={() => go("history")}
          />
          <QuickAction
            icon={<Shield className="w-5 h-5" />}
            label="Privacy & consent"
            onClick={() => go("privacy")}
          />
        </div>

        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-3 flex gap-2 items-start">
            <Phone className="w-4 h-4 text-red-700 mt-0.5 shrink-0" />
            <p className="text-xs text-red-800">
              For immediate life-threatening emergencies, call <span className="text-red-900">995</span>.
            </p>
          </CardContent>
        </Card>
      </ScreenScroll>
    </>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          {icon} {label}
        </div>
        <div className="text-slate-900 mt-1">{value}</div>
      </CardContent>
    </Card>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col items-start gap-2 hover:border-slate-300 text-left"
    >
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
        {icon}
      </div>
      <div className="text-sm text-slate-800">{label}</div>
    </button>
  );
}
