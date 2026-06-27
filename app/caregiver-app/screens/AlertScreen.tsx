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

type SensorData = {
  soundLevel?: number;
  micDigital?: number;
  pirMotion?: number;
  distanceCm?: number;
  soundDetected?: number;
  nearDetected?: number;
  loadReady?: number;
  loadRaw?: number;
  loadNet?: number;
  loadDetected?: number;
  possibleFall?: number;
  alert?: number;
};

type VoiceCheckIn = {
  preferredLanguage?: string;
  responded?: boolean;
  voiceLevel?: number;
  transcript?: string;
  intent?: string;
};

type ExtendedCaregiverLiveAlert = CaregiverLiveAlert & {
  source?: string;
  timestamp?: string;
  receivedAt?: string;
};

function normaliseRisk(value?: string, fallback?: "medium" | "high") {
  const risk = String(value || fallback || "medium").toLowerCase();

  if (risk === "critical") return "critical";
  if (risk === "high") return "high";
  if (risk === "medium") return "medium";
  if (risk === "low") return "low";

  return "medium";
}

function riskLabel(risk: string) {
  if (risk === "critical") return "Critical";
  if (risk === "high") return "High";
  if (risk === "medium") return "Medium";
  if (risk === "low") return "Low";
  return "Medium";
}

function getTone(risk: string) {
  if (risk === "critical" || risk === "high") return "red";
  if (risk === "medium") return "amber";
  if (risk === "low") return "green";
  return "amber";
}

function getConfidence(liveAlert: CaregiverLiveAlert | null, risk: string) {
  if (typeof liveAlert?.confidence === "number") {
    return Math.round(liveAlert.confidence);
  }

  if (risk === "critical") return 95;
  if (risk === "high") return 91;
  if (risk === "medium") return 78;
  return 40;
}

function parseAlertDate(value?: string) {
  if (!value) return null;

  const normalised =
    value.includes(" ") && !value.includes("T")
      ? value.replace(" ", "T")
      : value;

  const date = new Date(normalised);

  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function formatAlertDateTime(value?: string) {
  const date = parseAlertDate(value);

  if (!date) return value || "Not available";

  return date.toLocaleString("en-SG", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getAlertAge(value?: string) {
  const date = parseAlertDate(value);

  if (!date) return "Live alert";

  const diffMs = Date.now() - date.getTime();
  const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));

  if (diffSeconds < 60) return "Just now";

  const diffMinutes = Math.floor(diffSeconds / 60);

  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

function parseAiSummary(text?: string) {
  if (!text) return [];

  const clean = text
    .replace(/\*\*/g, "")
    .replace(/\r/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const headingRegex =
    /(Alert Summary|Recommendation|Additional Note|Operator Note|Caregiver Note|Safety Note|Risk Assessment)\s*:?\s*/gi;

  const matches = [...clean.matchAll(headingRegex)];

  if (matches.length === 0) {
    return [{ title: "Summary", body: clean }];
  }

  return matches
    .map((match, index) => {
      const title = match[1];
      const start = (match.index || 0) + match[0].length;
      const end =
        index + 1 < matches.length
          ? matches[index + 1].index || clean.length
          : clean.length;

      return {
        title,
        body: clean.slice(start, end).trim(),
      };
    })
    .filter((section) => section.body.length > 0);
}

function splitSummarySentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function getEvidenceItems(liveAlert: CaregiverLiveAlert | null) {
  const sensor = liveAlert?.sensorData as SensorData | undefined;
  const voice = liveAlert?.voiceCheckIn as VoiceCheckIn | undefined;

  const items: string[] = [];

  if (sensor && typeof sensor === "object") {
    Object.entries(sensor).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        items.push(`${key}: ${String(value)}`);
      }
    });
  }

  if (voice?.intent === "ok") {
    items.push("Resident responded okay");
  } else if (voice?.intent === "help") {
    items.push("Resident requested help");
  } else if (voice?.intent === "unclear") {
    items.push("Unclear voice response");
  } else if (voice?.intent === "no_response") {
    items.push("No response to voice check-in");
  }

  if (voice?.transcript) {
    items.push(`Transcript: ${voice.transcript}`);
  }

  return items;
}

function getNextStepText(risk: string, voiceIntent?: string) {
  if (voiceIntent === "ok") {
    return [
      "Confirm the resident is safe.",
      "Submit verification if everything is okay.",
      "Alert remains logged for audit trail.",
    ];
  }

  if (voiceIntent === "help") {
    return [
      "Help request detected.",
      "Emergency operator review is started.",
      "Add context if you have helpful information.",
    ];
  }

  if (risk === "critical" || risk === "high") {
    return [
      "Emergency operator review is started.",
      "Caregiver can add context but cannot cancel escalation.",
      "Call the resident if it is safe to do so.",
    ];
  }

  if (risk === "medium") {
    return [
      "Verify within the countdown window.",
      "If resident is okay, submit verification.",
      "If no one responds, EchoSync escalates for review.",
    ];
  }

  return [
    "Check on the resident if needed.",
    "Submit verification if resident is okay.",
    "Alert is logged for history.",
  ];
}

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
  const [callLog, setCallLog] = useState<{ time: string; text: string }[]>([]);

  useEffect(() => {
    setSeconds(58);
  }, [liveAlert?.receivedAt]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const currentLiveAlert = liveAlert as ExtendedCaregiverLiveAlert | null;
  const alertTriggeredAt =
    currentLiveAlert?.timestamp || currentLiveAlert?.receivedAt;
  const alertReceivedAt = currentLiveAlert?.receivedAt;
  const alertTimeText = formatAlertDateTime(alertTriggeredAt);
  const alertAgeText = getAlertAge(alertTriggeredAt);
  const receivedTimeText = alertReceivedAt
    ? formatAlertDateTime(alertReceivedAt)
    : null;

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const currentRisk = normaliseRisk(liveAlert?.riskLevel, risk);
  const isHigh = currentRisk === "high" || currentRisk === "critical";
  const tone = getTone(currentRisk);
  const confidence = getConfidence(liveAlert, currentRisk);
  const voice = liveAlert?.voiceCheckIn as VoiceCheckIn | undefined;
  const liveEvidence = getEvidenceItems(liveAlert);
  const evidenceItems =
    liveEvidence.length > 0
      ? liveEvidence
      : [
          "Loud impact detected",
          "No movement for 45s",
          "Resident did not reply",
          "Device online",
        ];
  const timedOut = seconds === 0;
  const canVerify = can(role, "verify");
  const canCancelOrVerify = canVerify && !isHigh && !timedOut;
  const nextSteps = getNextStepText(currentRisk, voice?.intent);
  const aiSummarySections = parseAiSummary(liveAlert?.aiSummary).slice(0, 2);

  const log = (text: string) => {
    const time = new Date().toLocaleTimeString("en-SG", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setCallLog((l) => [...l, { time, text }]);
  };

  return (
    <>
      <TopBar title="Active alert" onBack={() => go("home")} />

      <ScreenScroll>
        <AlertSourceBar
          liveAlert={liveAlert}
          alertAgeText={alertAgeText}
          alertTimeText={alertTimeText}
          receivedTimeText={receivedTimeText}
          risk={risk}
          setRisk={setRisk}
        />

        <Card className={`${getHeroClass(tone)} overflow-hidden`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${getIconClass(tone)}`}>
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <ToneBadge tone={tone === "red" ? "red" : tone === "green" ? "green" : "amber"}>
                    {riskLabel(currentRisk)} risk
                  </ToneBadge>
                  <h2 className="mt-2 text-lg font-semibold text-slate-950">
                    {liveAlert?.eventType || "Possible Fall / No Response"}
                  </h2>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-600">
                    <MapPin className="h-3.5 w-3.5" />
                    {liveAlert?.location || RESIDENT.address}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold tabular-nums text-slate-950">
                  {confidence}%
                </div>
                <div className="text-[11px] text-slate-500">confidence</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <AlertMetric icon={<Clock className="h-4 w-4" />} label="Triggered" value={alertAgeText} />
              <AlertMetric icon={<Shield className="h-4 w-4" />} label="Role" value={ROLE_LABEL[role]} />
            </div>

            <div className="mt-4 rounded-2xl border border-white/70 bg-white/80 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                  <Clock className="h-4 w-4" />
                  Verify by
                </div>
                <div className="font-semibold tabular-nums text-red-700">{mm}:{ss}</div>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-red-100">
                <div
                  className="h-full rounded-full bg-red-500 transition-all"
                  style={{ width: `${(seconds / 60) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {aiSummarySections.length > 0 && (
          <Card className="border-indigo-100 bg-white">
            <CardContent className="p-4">
              <SectionTitle icon={<FileText className="h-4 w-4" />} label="AI summary" />
              <div className="mt-3 space-y-3">
                {aiSummarySections.map((section, sectionIndex) => (
                  <div key={`${section.title}-${sectionIndex}`}>
                    <div className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                      {section.title}
                    </div>
                    <div className="mt-1 space-y-1">
                      {splitSummarySentences(section.body).slice(0, 2).map((sentence, index) => (
                        <p key={`${section.title}-${index}`} className="text-sm leading-relaxed text-slate-700">
                          {sentence}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-slate-100 bg-white">
          <CardContent className="p-4">
            <SectionTitle icon={<AlertTriangle className="h-4 w-4" />} label="Key evidence" />
            <div className="mt-3 grid gap-2">
              {evidenceItems.slice(0, 5).map((item) => (
                <Evidence key={item} icon={getEvidenceIcon(item)} text={item} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-blue-50">
          <CardContent className="p-4">
            <SectionTitle icon={<CheckCircle2 className="h-4 w-4" />} label="What to do now" />
            <div className="mt-3 space-y-2">
              {nextSteps.map((step, index) => (
                <div key={step} className="flex gap-3 text-sm text-blue-950">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-blue-700">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {timedOut && (
          <NoticeCard
            tone="red"
            icon={<Clock className="h-5 w-5" />}
            title="Verification window ended"
            text="Alert moved to emergency operator review. You can still add context, but cannot cancel this alert."
          />
        )}

        <Card className="border-slate-100 bg-white">
          <CardContent className="space-y-3 p-4">
            <SectionTitle icon={<PhoneCall className="h-4 w-4" />} label="Actions" />

            {isHigh || timedOut ? (
              <NoticeCard
                tone="red"
                icon={<Lock className="h-5 w-5" />}
                title={timedOut ? "Cancellation no longer available" : "Cancellation restricted"}
                text="Emergency operator review cannot be cancelled for this alert."
              />
            ) : canCancelOrVerify ? (
              <Button
                className="w-full h-12"
                onClick={() => go("verify")}
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm resident is okay
              </Button>
            ) : (
              <NoticeCard
                tone="grey"
                icon={<Lock className="h-5 w-5" />}
                title="Verification restricted"
                text={`Your role (${ROLE_LABEL[role]}) can add context or acknowledge the check request.`}
              />
            )}

            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                className="w-full h-12 border-slate-200"
                onClick={() => log("Tan Mei Ling started verification call")}
              >
                <PhoneCall className="w-4 h-4" />
                Calling resident
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 border-slate-200"
                onClick={() => log("Callback requested - EchoSync operator will attempt callback")}
              >
                <Phone className="w-4 h-4" />
                Request callback
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 border-slate-200"
                onClick={() => go("context")}
              >
                <FileText className="w-4 h-4" />
                {isHigh || timedOut ? "Add context for operator" : "Unable to verify"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {callLog.length > 0 && (
          <Card className="border-emerald-100 bg-emerald-50">
            <CardContent className="p-4">
              <SectionTitle icon={<CheckCircle2 className="h-4 w-4" />} label="Status updated" />
              <div className="mt-2 space-y-1">
                {callLog.map((e, i) => (
                  <div key={i} className="text-xs text-emerald-900">
                    <span className="tabular-nums">{e.time}</span> - {e.text}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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

function AlertSourceBar({
  liveAlert,
  alertAgeText,
  alertTimeText,
  receivedTimeText,
  risk,
  setRisk,
}: {
  liveAlert: CaregiverLiveAlert | null;
  alertAgeText: string;
  alertTimeText: string;
  receivedTimeText: string | null;
  risk: "medium" | "high";
  setRisk: (r: "medium" | "high") => void;
}) {
  if (liveAlert) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            <Wifi className="h-4 w-4" />
            Live Pi alert
          </div>
          <span className="text-xs font-medium text-emerald-700">{alertAgeText}</span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-emerald-900">
          Triggered {alertTimeText}
          {receivedTimeText ? `, received ${receivedTimeText}` : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-2">
      <div className="mb-2 text-[11px] text-slate-500">Demo controls for prototype walkthrough only</div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Risk:</span>
        {(["medium", "high"] as const).map((level) => (
          <button
            key={level}
            onClick={() => setRisk(level)}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              risk === level
                ? level === "high"
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-amber-500 bg-amber-500 text-white"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            {riskLabel(level)}
          </button>
        ))}
      </div>
    </div>
  );
}

function AlertMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/80 p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-slate-900">{value}</div>
    </div>
  );
}

function SectionTitle({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
      <span className="text-indigo-500">{icon}</span>
      {label}
    </div>
  );
}

function Evidence({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-indigo-600">
        {icon}
      </span>
      <span className="min-w-0 flex-1 break-words leading-snug">{text}</span>
    </div>
  );
}

function NoticeCard({
  tone,
  icon,
  title,
  text,
}: {
  tone: "red" | "grey";
  icon: ReactNode;
  title: string;
  text: string;
}) {
  const toneClass =
    tone === "red"
      ? "border-red-100 bg-red-50 text-red-800"
      : "border-slate-100 bg-slate-50 text-slate-700";

  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-3 ${toneClass}`}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-0.5 text-xs leading-relaxed">{text}</div>
      </div>
    </div>
  );
}

function getHeroClass(tone: string) {
  if (tone === "red") return "border-red-200 bg-gradient-to-b from-red-50 to-white";
  if (tone === "green") return "border-emerald-200 bg-gradient-to-b from-emerald-50 to-white";
  return "border-amber-200 bg-gradient-to-b from-amber-50 to-white";
}

function getIconClass(tone: string) {
  if (tone === "red") return "bg-red-100 text-red-600";
  if (tone === "green") return "bg-emerald-100 text-emerald-600";
  return "bg-amber-100 text-amber-600";
}

function getEvidenceIcon(text: string) {
  const lower = text.toLowerCase();

  if (lower.includes("voice") || lower.includes("reply") || lower.includes("transcript")) {
    return <Volume2 className="h-4 w-4" />;
  }
  if (lower.includes("movement") || lower.includes("motion")) {
    return <Footprints className="h-4 w-4" />;
  }
  if (lower.includes("door")) {
    return <DoorClosed className="h-4 w-4" />;
  }
  if (lower.includes("device") || lower.includes("wifi") || lower.includes("online")) {
    return <Wifi className="h-4 w-4" />;
  }

  return <AlertTriangle className="h-4 w-4" />;
}
