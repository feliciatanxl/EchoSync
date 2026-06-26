import {
  useState,
  Shield,
  Lock,
  Activity,
  Wifi,
  Battery,
  Stethoscope,
  Pause,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
  Card,
  CardContent,
  type ScreenId,
  type Role,
  can,
  TopBar,
  ScreenScroll,
  ToneBadge,
  PauseBanner,
  type ReactNode
} from "../shared";

export function NodeScreen({
  go,
  role,
  online,
  setOnline,
  pause,
  clearPause,
  sensorMonitoringEnabled,
  setSensorMonitoringEnabled,
}: {
  go: (s: ScreenId) => void;
  role: Role;
  online: boolean;
  setOnline: (v: boolean) => void;
  pause: { reasonLabel: string; resumeAt: string } | null;
  clearPause: () => void;
  sensorMonitoringEnabled: boolean;
  setSensorMonitoringEnabled: (enabled: boolean) => void;
}) {
  const [nodeLog, setNodeLog] = useState<{ title: string; sub: string } | null>(null);
  const canPause = can(role, "pause");
  const canSelfTest = can(role, "selftest");

  return (
    <>
      <TopBar title="EchoSync device" />
      <ScreenScroll>
        {pause && <PauseBanner pause={pause} onResume={clearPause} />}

        {nodeLog && (
          <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <div className="text-sm font-semibold text-emerald-900">{nodeLog.title}</div>
              <div className="mt-0.5 text-xs leading-relaxed text-emerald-700">{nodeLog.sub}</div>
            </div>
          </div>
        )}

        <Card className={online ? "border-emerald-100 bg-white" : "border-slate-200 bg-white"}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${online ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                  <Wifi className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-base font-semibold text-slate-900">
                    {online ? "Node online" : "Node offline"}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5" />
                    Living room ceiling hub
                  </div>
                </div>
              </div>
              <ToneBadge tone={online ? "green" : "grey"}>{online ? "Healthy" : "Offline"}</ToneBadge>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <NodeMetric icon={<Battery className="h-4 w-4" />} label="Power" value={online ? "Connected" : "Unknown"} />
              <NodeMetric icon={<Activity className="h-4 w-4" />} label="Wi-Fi" value={online ? "Good" : "Disconnected"} />
              <NodeMetric icon={<Clock className="h-4 w-4" />} label="Check-in" value={online ? "30s ago" : "18 min ago"} />
              <NodeMetric icon={<Pause className="h-4 w-4" />} label="Monitoring" value={sensorMonitoringEnabled ? "Active" : "Away Mode"} />
            </div>
          </CardContent>
        </Card>

        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-2">
          <div className="mb-2 text-[11px] text-slate-500">Demo controls for prototype walkthrough only</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Device state:</span>
            <StateChip label="Online" active={online} onClick={() => setOnline(true)} />
            <StateChip label="Offline" active={!online} onClick={() => setOnline(false)} />
          </div>
        </div>

        {!online && (
          <Card className="border-red-100 bg-red-50">
            <CardContent className="p-4">
              <div className="text-sm font-semibold text-red-900">Recommended action</div>
              <div className="mt-2 space-y-2 text-sm text-red-800">
                <ActionHint n={1} text="Check home Wi-Fi" />
                <ActionHint n={2} text="Run self-test when device reconnects" />
                <ActionHint n={3} text="Contact secondary caregiver if unresolved" />
              </div>
            </CardContent>
          </Card>
        )}

        <Card className={sensorMonitoringEnabled ? "border-emerald-100 bg-emerald-50" : "border-amber-100 bg-amber-50"}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Pause className={`mt-0.5 h-5 w-5 shrink-0 ${sensorMonitoringEnabled ? "text-emerald-700" : "text-amber-700"}`} />
              <div>
                <div className={`text-sm font-semibold ${sensorMonitoringEnabled ? "text-emerald-900" : "text-amber-900"}`}>
                  {sensorMonitoringEnabled ? "Monitoring active" : "Away Mode active"}
                </div>
                <p className={`mt-1 text-xs leading-relaxed ${sensorMonitoringEnabled ? "text-emerald-700" : "text-amber-700"}`}>
                  {sensorMonitoringEnabled
                    ? "Sensor alerts, voice check-in and escalation are enabled."
                    : "Sensor alerts and voice recording are paused while the resident is away."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Safe controls
          </div>
          <div className="space-y-2">
            <NodeControl
              icon={<Stethoscope className="w-5 h-5" />}
              title="Run self-test"
              sub="Check speaker, Wi-Fi and sensor heartbeat"
              onClick={() => canSelfTest && go("selftest")}
              locked={!canSelfTest}
              lockHint="Primary caregiver only"
            />
            <NodeControl
              icon={<Pause className="w-5 h-5" />}
              title={sensorMonitoringEnabled ? "Enable Away Mode" : "Resume monitoring"}
              sub={sensorMonitoringEnabled ? "Pause sensor alerts while resident is away" : "Turn alerts and check-ins back on"}
              onClick={() => {
                if (!canPause) return;

                const nextState = !sensorMonitoringEnabled;
                setSensorMonitoringEnabled(nextState);
                setNodeLog({
                  title: nextState ? "Node monitoring resumed" : "Away Mode enabled",
                  sub: nextState
                    ? "Sensor alerts, voice check-in and escalation are active again."
                    : "Sensor alerts and voice recording are paused while the resident is away.",
                });
              }}
              locked={!canPause}
              lockHint="Primary caregiver only"
            />
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-slate-100 p-3">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
          <p className="text-xs leading-relaxed text-slate-700">
            Critical and high-risk alerts remain active even when low-risk monitoring is paused.
          </p>
        </div>
      </ScreenScroll>
    </>
  );
}

function NodeMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <span className="text-indigo-500">{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function StateChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium ${
        active ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-200 bg-white text-slate-600"
      }`}
    >
      {label}
    </button>
  );
}

function ActionHint({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-red-700">
        {n}
      </span>
      <span>{text}</span>
    </div>
  );
}

function NodeControl({
  icon,
  title,
  sub,
  onClick,
  locked,
  lockHint,
}: {
  icon: ReactNode;
  title: string;
  sub?: string;
  onClick?: () => void;
  locked?: boolean;
  lockHint?: string;
}) {
  return (
    <button
      onClick={locked ? undefined : onClick}
      disabled={locked}
      className={`w-full flex items-center gap-3 rounded-2xl border p-4 text-left ${
        locked
          ? "bg-slate-100 border-slate-200 cursor-not-allowed"
          : "bg-white border-slate-100 hover:border-slate-200"
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${locked ? "bg-slate-200 text-slate-400" : "bg-indigo-50 text-indigo-600"}`}>
        {locked ? <Lock className="w-5 h-5" /> : icon}
      </div>

      <div className="flex-1">
        <div className={`text-sm font-semibold ${locked ? "text-slate-500" : "text-slate-800"}`}>{title}</div>
        <div className="mt-0.5 text-xs text-slate-500">{locked && lockHint ? lockHint : sub}</div>
      </div>

      {locked ? <ToneBadge tone="grey">Locked</ToneBadge> : <ChevronRight className="w-5 h-5 text-slate-400" />}
    </button>
  );
}
