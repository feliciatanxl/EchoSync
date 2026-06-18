import {
  useEffect,
  useState,
  Shield,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Phone,
  PhoneCall,
  Wifi,
  Volume2,
  DoorClosed,
  Footprints,
  Clock,
  MapPin,
  FileText,
  Button,
  Card,
  CardContent,
  type ScreenId,
  type Role,
  ROLE_LABEL,
  RESIDENT,
  can,
  TopBar,
  ScreenScroll,
  ToneBadge,
  type ReactNode
} from "../shared";
import type { CaregiverLiveAlert } from "../CaregiverApp";

export function AlertScreen({
  go,
  risk,
  setRisk,
  role,
  liveAlert,
}: {
  go: (s: ScreenId) => void;
  risk: "medium" | "high";
  setRisk: (r: "medium" | "high") => void;
  role: Role;
  liveAlert: CaregiverLiveAlert | null;
}) {
  const [seconds, setSeconds] = useState(58);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const isHigh = risk === "high";
  const confidence = Math.round(liveAlert?.confidence ?? (isHigh ? 91 : 78));
  const alertRisk = liveAlert?.riskLevel?.toLowerCase();
  const displayedRisk = alertRisk === 'low' ? 'Low' : alertRisk === 'medium' ? 'Medium' : isHigh ? 'High' : 'Medium';
  const liveEvidence = Array.isArray(liveAlert?.sensorData)
    ? liveAlert.sensorData.map(String)
    : liveAlert?.sensorData && typeof liveAlert.sensorData === 'object'
      ? Object.entries(liveAlert.sensorData as Record<string, unknown>).map(([key, value]) => `${key}: ${String(value)}`)
      : [];
  const timedOut = seconds === 0;
  const canVerify = can(role, "verify");
  const [callLog, setCallLog] = useState<{ time: string; text: string }[]>([]);
  const log = (text: string) => {
    const time = new Date().toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" });
    setCallLog((l) => [...l, { time, text }]);
  };

  return (
    <>
      <TopBar title="Active alert" onBack={() => go("home")} />
      <ScreenScroll>
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 space-y-1.5">
          <div className="text-[11px] text-slate-500">
            Demo controls — for prototype walkthrough only
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Risk level:</span>
          <button
            onClick={() => setRisk("medium")}
            className={`text-xs px-2.5 py-1 rounded-full border ${
              !isHigh
                ? "bg-amber-600 text-white border-amber-600"
                : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setRisk("high")}
            className={`text-xs px-2.5 py-1 rounded-full border ${
              isHigh
                ? "bg-red-700 text-white border-red-700"
                : "bg-white text-slate-600 border-slate-200"
            }`}
          >
            High
          </button>
          </div>
        </div>

        <Card className={`${isHigh ? "border-red-400" : "border-amber-300"} bg-gradient-to-b ${isHigh ? "from-red-50" : "from-amber-50"} to-white`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <ToneBadge tone={isHigh ? "red" : "amber"}>
                <AlertTriangle className="w-3 h-3" /> {displayedRisk} risk
              </ToneBadge>
              <span className="text-xs text-slate-500">Confidence {confidence}%</span>
            </div>
            <div className="mt-3 text-slate-900 text-lg">{liveAlert?.eventType || 'Possible Fall / No Response'}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" /> Registered HDB unit: {liveAlert?.location || RESIDENT.address}
            </div>

            <div className="mt-4 rounded-xl bg-white border border-red-200 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-700">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Verification window</span>
                </div>
                <div className="text-red-700 tabular-nums">
                  {mm}:{ss}
                </div>
              </div>
              <div className="h-1.5 mt-2 bg-red-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all"
                  style={{ width: `${(seconds / 60) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
            Why this alert was raised
          </div>
          <div className="flex flex-wrap gap-2">
            {liveEvidence.map((item) => (
              <Evidence key={item} icon={<AlertTriangle className="w-3 h-3" />} text={item} />
            ))}
            <Evidence icon={<Volume2 className="w-3 h-3" />} text="Loud impact detected" />
            <Evidence icon={<Footprints className="w-3 h-3" />} text="No movement for 45s" />
            <Evidence
              icon={<PhoneCall className="w-3 h-3" />}
              text="Resident did not reply to voice check-in"
            />
            <Evidence icon={<DoorClosed className="w-3 h-3" />} text="No door exit detected" />
            <Evidence icon={<Wifi className="w-3 h-3" />} text="Device online" />
          </div>
        </div>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-blue-700 mb-2">
              What happens next?
            </div>
            <ol className="space-y-1.5 text-sm text-blue-900 list-decimal pl-5">
              <li>You have 60 seconds to verify.</li>
              <li>If resident is okay, submit verification.</li>
              <li>If no one responds, EchoSync sends the alert for emergency operator review.</li>
              <li>Critical alerts cannot be cancelled by caregivers.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-3">
              Escalation path
            </div>
            <ol className="space-y-3">
              <EscStep n={1} text="EchoSync detected anomaly" done />
              <EscStep n={2} text="Caregiver verification window started" done />
              <EscStep
                n={3}
                text="If no response in 60s → Emergency operator review"
                active={isHigh || timedOut}
                done={timedOut}
              />
              <EscStep
                n={4}
                text="If verified high-risk → myResponder / CFR coordination"
                active={isHigh}
              />
            </ol>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="p-3 text-xs text-slate-700 space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-slate-600" />
              <span>Caregiver cancellation available: <span className="text-slate-900">Medium risk only</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              <span>Emergency operator review required if no response or strong signal</span>
            </div>
          </CardContent>
        </Card>

        {timedOut && (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Verification window ended</span>
              </div>
              <ul className="text-xs text-red-800 mt-2 space-y-1 list-disc pl-5">
                <li>No caregiver verification received.</li>
                <li>Alert moved to emergency operator review.</li>
                <li>Caregiver can still add context, but cannot cancel this alert.</li>
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          {isHigh || timedOut ? (
            <div className="w-full rounded-xl border border-red-300 bg-red-50 p-4 flex items-start gap-2">
              <Lock className="w-5 h-5 text-red-700 mt-0.5 shrink-0" />
              <div>
                <div className="text-red-800 text-sm">
                  {timedOut
                    ? "Cancellation no longer available"
                    : "High-risk alert — cancellation restricted"}
                </div>
                <div className="text-xs text-red-700 mt-0.5">
                  You may still add context, call the resident, or request a callback. Emergency
                  operator review cannot be cancelled.
                </div>
              </div>
            </div>
          ) : canVerify ? (
            <Button
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => go("verify")}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm resident is okay
            </Button>
          ) : (
            <div className="w-full rounded-xl border border-slate-200 bg-slate-100 p-4 flex items-start gap-2">
              <Lock className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-700">
                Verification is restricted for your role ({ROLE_LABEL[role]}). You may add context
                or acknowledge the check request below.
              </div>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full h-12 border-slate-300"
            onClick={() => log("Tan Mei Ling started verification call")}
          >
            <PhoneCall className="w-4 h-4 mr-2" /> I am calling resident now
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 border-slate-300"
            onClick={() => log("Callback requested — EchoSync operator will attempt callback")}
          >
            <Phone className="w-4 h-4 mr-2" /> Request callback
          </Button>
          {isHigh || timedOut ? (
            <Button
              variant="outline"
              className="w-full h-12 border-slate-300"
              onClick={() => go("context")}
            >
              <FileText className="w-4 h-4 mr-2" /> Add context for operator
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full h-12 border-slate-300"
              onClick={() => go("context")}
            >
              <AlertTriangle className="w-4 h-4 mr-2" /> Unable to verify
            </Button>
          )}
        </div>

        {callLog.length > 0 && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-4 space-y-1.5">
              <div className="text-xs uppercase tracking-wide text-emerald-700">
                Status updated
              </div>
              {callLog.map((e, i) => (
                <div key={i} className="text-xs text-emerald-900">
                  <span className="tabular-nums">{e.time}</span> — {e.text}
                </div>
              ))}
              <div className="text-[11px] text-emerald-700 pt-1">
                Action logged to audit trail.
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-slate-200 bg-slate-100">
          <CardContent className="p-3 flex gap-2 items-start">
            <Lock className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-700">
              For strong emergency signals or no-response alerts, EchoSync continues to emergency
              operator review even if caregiver verification is pending.
            </p>
          </CardContent>
        </Card>

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

function EscStep({
  n,
  text,
  done,
  active,
}: {
  n: number;
  text: string;
  done?: boolean;
  active?: boolean;
}) {
  const tone = done
    ? "bg-emerald-600 text-white"
    : active
    ? "bg-red-600 text-white"
    : "bg-slate-200 text-slate-600";
  return (
    <li className="flex items-start gap-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${tone}`}>
        {n}
      </div>
      <div className="text-sm text-slate-800 pt-0.5">{text}</div>
    </li>
  );
}

function Evidence({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2.5 py-1 text-xs text-slate-700">
      {icon} {text}
    </span>
  );
}
