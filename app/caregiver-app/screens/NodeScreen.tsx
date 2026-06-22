import {
  useState,
  Shield,
  Lock,
  AlertTriangle,
  Activity,
  Wifi,
  Battery,
  RotateCw,
  Stethoscope,
  Pause,
  ChevronRight,
  Clock,
  MapPin,
  Card,
  CardContent,
  type ScreenId,
  type Role,
  can,
  TopBar,
  ScreenScroll,
  StatusDot,
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
  const canRestart = can(role, "restart");
  const canPause = can(role, "pause");
  const canSelfTest = can(role, "selftest");

  return (
    <>
      <TopBar title="EchoSync device" />
      <ScreenScroll>
        {pause && <PauseBanner pause={pause} onResume={clearPause} />}

        {nodeLog && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-3">
              <div className="text-sm text-emerald-900">{nodeLog.title}</div>
              <div className="text-xs text-emerald-800 mt-0.5">{nodeLog.sub}</div>
              <div className="text-[11px] text-emerald-700 mt-1">
                Action logged to audit trail.
              </div>
            </CardContent>
          </Card>
        )}

        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 space-y-1.5">
          <div className="text-[11px] text-slate-500">
            Demo controls — for prototype walkthrough only
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Device state:</span>

            <button
              onClick={() => setOnline(true)}
              className={`text-xs px-2.5 py-1 rounded-full border ${
                online
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              Online
            </button>

            <button
              onClick={() => setOnline(false)}
              className={`text-xs px-2.5 py-1 rounded-full border ${
                !online
                  ? "bg-slate-700 text-white border-slate-700"
                  : "bg-white text-slate-600 border-slate-200"
              }`}
            >
              Offline
            </button>
          </div>
        </div>

        {online ? (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-4 grid grid-cols-2 gap-3">
              <NodeStat icon={<Wifi className="w-4 h-4" />} label="Status" value="Online" />
              <NodeStat icon={<Battery className="w-4 h-4" />} label="Power" value="Connected" />
              <NodeStat icon={<Activity className="w-4 h-4" />} label="Wi-Fi" value="Good" />
              <NodeStat
                icon={<Clock className="w-4 h-4" />}
                label="Last device check-in"
                value="30s ago"
              />
              <NodeStat
                icon={<Pause className="w-4 h-4" />}
                label="Monitoring"
                value={sensorMonitoringEnabled ? "Active" : "Away Mode"}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-slate-400 bg-slate-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <StatusDot tone="grey" />
                <span className="text-slate-800">Device offline</span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-slate-500">Last check-in</div>
                  <div className="text-slate-800">18 minutes ago</div>
                </div>

                <div>
                  <div className="text-xs text-slate-500">Possible issue</div>
                  <div className="text-slate-800">Wi-Fi disconnected</div>
                </div>
              </div>

              <div className="mt-3 text-xs uppercase tracking-wide text-slate-500">
                Recommended action
              </div>

              <ol className="text-sm text-slate-800 list-decimal pl-5 mt-1 space-y-0.5">
                <li>Check home Wi-Fi</li>
                <li>Restart node</li>
                <li>Contact secondary caregiver</li>
                <li>Report device issue</li>
              </ol>

              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-800">
                If no check-in is restored within 30 minutes, EchoSync will flag this device for
                follow-up.
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-slate-200">
          <CardContent className="p-4 text-sm text-slate-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-500" /> Living room ceiling hub
          </CardContent>
        </Card>

        <Card
          className={
            sensorMonitoringEnabled
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }
        >
          <CardContent className="p-3 flex gap-2 items-start">
            <Pause
              className={`w-4 h-4 mt-0.5 shrink-0 ${
                sensorMonitoringEnabled ? "text-emerald-700" : "text-amber-700"
              }`}
            />
            <p
              className={`text-xs ${
                sensorMonitoringEnabled ? "text-emerald-800" : "text-amber-800"
              }`}
            >
              {sensorMonitoringEnabled
                ? "Monitoring is active. Sensor alerts, voice check-in and escalation are enabled."
                : "Away Mode is active. Sensor alerts and voice recording are paused while the resident is away. The node remains online for heartbeat and status."}
            </p>
          </CardContent>
        </Card>

        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
            Safe caregiver controls
          </div>
        </div>

        <div className="space-y-2">
          <NodeControl
            icon={<RotateCw className="w-5 h-5" />}
            title="Restart device"
            onClick={() =>
              canRestart &&
              setNodeLog({
                title: "Restart requested",
                sub: "Device will reconnect in about 30 seconds.",
              })
            }
            locked={!canRestart}
            lockHint="Primary caregiver only"
          />

          <NodeControl
            icon={<Stethoscope className="w-5 h-5" />}
            title="Run self-test"
            onClick={() => canSelfTest && go("selftest")}
            locked={!canSelfTest}
            lockHint="Primary caregiver only"
          />

          <NodeControl
            icon={<Clock className="w-5 h-5" />}
            title="Update check-in schedule"
            onClick={() =>
              canRestart &&
              setNodeLog({
                title: "Check-in schedule updated",
                sub: "The resident's next routine voice check-in has been scheduled.",
              })
            }
            locked={!canRestart}
            lockHint="Primary caregiver only"
          />

          <NodeControl
            icon={<Pause className="w-5 h-5" />}
            title={sensorMonitoringEnabled ? "Enable Away Mode / Pause Node" : "Resume Node Monitoring"}
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

          <NodeControl
            icon={<Pause className="w-5 h-5" />}
            title="Pause low-risk monitoring"
            onClick={() => canPause && go("pause")}
            locked={!canPause}
            lockHint="Primary caregiver only"
          />

          <NodeControl
            icon={<AlertTriangle className="w-5 h-5" />}
            title="Report device issue"
            onClick={() =>
              setNodeLog({
                title: "Device issue reported",
                sub: "EchoSync support has been notified.",
              })
            }
          />
        </div>

        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Restricted</div>

          <div className="space-y-2">
            <LockedControl title="Turn off emergency escalation" />
            <LockedControl title="Disable critical alerts" />
            <LockedControl title="Delete audit logs" />
          </div>
        </div>

        <Card className="border-slate-200 bg-slate-100">
          <CardContent className="p-3 flex gap-2 items-start">
            <Shield className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-700">
              Caregiver controls are limited to prevent accidental delay during emergencies.
              Critical alerts, no-response alerts, and high-risk events remain active even when low-risk monitoring is
              paused.
            </p>
          </CardContent>
        </Card>
      </ScreenScroll>
    </>
  );
}

function NodeStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-xs text-emerald-700">
        {icon} {label}
      </div>
      <div className="text-emerald-900 mt-0.5">{value}</div>
    </div>
  );
}

function NodeControl({
  icon,
  title,
  onClick,
  locked,
  lockHint,
}: {
  icon: ReactNode;
  title: string;
  onClick?: () => void;
  locked?: boolean;
  lockHint?: string;
}) {
  return (
    <button
      onClick={locked ? undefined : onClick}
      disabled={locked}
      className={`w-full flex items-center gap-3 rounded-xl border p-4 text-left ${
        locked
          ? "bg-slate-100 border-slate-200 cursor-not-allowed"
          : "bg-white border-slate-200 hover:border-slate-300"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          locked ? "bg-slate-200 text-slate-400" : "bg-slate-100 text-slate-700"
        }`}
      >
        {locked ? <Lock className="w-5 h-5" /> : icon}
      </div>

      <div className="flex-1">
        <div className={`text-sm ${locked ? "text-slate-500" : "text-slate-800"}`}>{title}</div>
        {locked && lockHint && (
          <div className="text-[11px] text-slate-500 mt-0.5">{lockHint}</div>
        )}
      </div>

      {locked ? (
        <ToneBadge tone="grey">Locked</ToneBadge>
      ) : (
        <ChevronRight className="w-5 h-5 text-slate-400" />
      )}
    </button>
  );
}

function LockedControl({ title }: { title: string }) {
  return (
    <div className="w-full flex items-center gap-3 rounded-xl bg-slate-100 border border-slate-200 p-4 opacity-80">
      <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500">
        <Lock className="w-5 h-5" />
      </div>

      <div className="flex-1 text-sm text-slate-600">{title}</div>
      <ToneBadge tone="grey">Locked</ToneBadge>
    </div>
  );
}