import {
  useState,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Phone,
  ClipboardList,
  Cpu,
  Users,
  ChevronRight,
  type ScreenId,
  type Role,
  can,
  ScreenScroll,
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
    eventType: "Possible fall",
    riskLevel: "Medium",
    confidence: 78,
  } : null);
  const homeAlertTone = getHomeAlertTone(visibleAlert?.riskLevel);
  const homeAlertClass = getHomeAlertClass(homeAlertTone);
  const lastUpdated = new Date().toLocaleTimeString("en-SG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <>
      <header className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 px-5 pb-8 pt-12 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-white" />
          <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/4 translate-y-1/2 rounded-full bg-white" />
        </div>
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-indigo-200">EchoSync Caregiver</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">Hi Mei Ling</h1>
              <p className="mt-1 text-sm text-indigo-100">Here&apos;s how Mdm Tan is doing today.</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium">Verified</span>
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-200" />
            <span className="text-[11px] font-medium uppercase tracking-wide text-indigo-100">
              Secure demo service &middot; Hackathon prototype
            </span>
          </div>
        </div>
      </header>

      <ScreenScroll>
        <div>
          <ResidentCard peekable />
        </div>

        {pause && <PauseBanner pause={pause} onResume={clearPause} />}

        {contactsSaved && (
          <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-emerald-900">Contacts updated</div>
              <div className="mt-1 text-xs leading-relaxed text-emerald-700">
                Emergency contact changes have been saved. Action logged to audit trail.
              </div>
            </div>
            <button onClick={clearContactsSaved} className="text-[11px] font-medium text-emerald-700 underline">
              Dismiss
            </button>
          </div>
        )}

        {visibleAlert ? (
          <button
            onClick={() => go("alert")}
            className={`flex w-full items-start gap-3 rounded-2xl p-4 text-left transition-transform active:scale-[0.99] ${homeAlertClass.card}`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${homeAlertClass.iconBg}`}>
              <AlertTriangle className={`h-5 w-5 ${homeAlertClass.iconText}`} />
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex items-center justify-between gap-3">
                <h3 className={`text-sm font-semibold ${homeAlertClass.title}`}>
                  {homeAlertTone === "green" ? "Low-risk event logged" : "Verification needed"}
                </h3>
                <ToneBadge tone={homeAlertTone}>{visibleAlert.riskLevel || "Medium"}</ToneBadge>
              </div>
              <p className={`mt-1 text-xs leading-relaxed ${homeAlertClass.body}`}>
                {visibleAlert.eventType || "Sensor anomaly"} detected. Confidence {Math.round(visibleAlert.confidence || 0)}%.
              </p>
              <p className={`mt-1.5 text-[11px] font-medium ${homeAlertClass.link}`}>Review alert</p>
            </div>
          </button>
        ) : (
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-sm font-semibold text-slate-900">No active alerts</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Mdm Tan&apos;s EchoSync device is monitoring normally.
              </p>
              <p className="mt-1.5 text-[11px] text-slate-400">
                Last check-in 30 seconds ago &middot; Updated {lastUpdated}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between rounded-xl border border-dashed border-slate-200 bg-white/70 px-3 py-2">
          <div className="text-[11px] text-slate-500">
            Demo controls for prototype walkthrough only
          </div>
          <button
            onClick={() => setShowAlert((v) => !v)}
            className="whitespace-nowrap rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-medium text-white"
          >
            {showAlert ? "Hide" : "Show"}
          </button>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Quick actions</p>
          <div className="divide-y divide-slate-100">
            <QuickAction
              icon={<Cpu className="h-5 w-5" />}
              label="View node"
              description="Device settings and status"
              iconClassName="bg-slate-100 text-slate-600"
              onClick={() => go("node")}
            />
            <QuickAction
              icon={<Users className="h-5 w-5" />}
              label={canContacts ? "Emergency contacts" : "Emergency contacts (view)"}
              description="Manage who to reach"
              iconClassName="bg-blue-100 text-blue-600"
              onClick={() => go("contacts")}
            />
            <QuickAction
              icon={<ClipboardList className="h-5 w-5" />}
              label="Alert history"
              description="Past notifications"
              iconClassName="bg-violet-100 text-violet-600"
              onClick={() => go("history")}
            />
            <QuickAction
              icon={<Shield className="h-5 w-5" />}
              label="Privacy & consent"
              description="Data preferences"
              iconClassName="bg-emerald-100 text-emerald-600"
              onClick={() => go("privacy")}
            />
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-3">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <p className="text-xs leading-relaxed text-red-800">
            For immediate life-threatening emergencies, call <span className="font-bold text-red-900">995</span>.
          </p>
        </div>
      </ScreenScroll>
    </>
  );
}

function QuickAction({
  icon,
  label,
  description,
  iconClassName,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  iconClassName: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3.5 py-3.5 text-left transition-transform active:scale-[0.99]"
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${iconClassName}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-slate-500" />
    </button>
  );
}

function getHomeAlertTone(riskLevel?: string): "green" | "amber" | "red" {
  const risk = String(riskLevel || "medium").toLowerCase();

  if (risk === "low") return "green";
  if (risk === "high" || risk === "critical") return "red";

  return "amber";
}

function getHomeAlertClass(tone: "green" | "amber" | "red") {
  if (tone === "green") {
    return {
      card: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconText: "text-emerald-600",
      title: "text-emerald-900",
      body: "text-emerald-700",
      link: "text-emerald-800",
    };
  }

  if (tone === "red") {
    return {
      card: "bg-red-50",
      iconBg: "bg-red-100",
      iconText: "text-red-600",
      title: "text-red-900",
      body: "text-red-700",
      link: "text-red-800",
    };
  }

  return {
    card: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    title: "text-amber-900",
    body: "text-amber-700",
    link: "text-amber-800",
  };
}