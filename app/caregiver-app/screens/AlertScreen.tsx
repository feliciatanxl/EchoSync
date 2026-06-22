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

  if (!date) return value || "—";

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
    return [
      {
        title: "Summary",
        body: clean,
      },
    ];
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
      "Resident responded okay.",
      "Caregiver should confirm resident is safe.",
      "Alert remains logged for audit trail.",
      "If caregiver cannot verify, escalate for review.",
    ];
  }

  if (voiceIntent === "help") {
    return [
      "Help request detected.",
      "Alert is sent for emergency operator review.",
      "Caregiver can still add context.",
      "Caregiver cannot cancel this emergency escalation.",
    ];
  }

  if (risk === "critical" || risk === "high") {
    return [
      "Strong emergency signal detected.",
      "EchoSync sends alert for emergency operator review.",
      "Caregiver is notified for context.",
      "Caregiver cannot cancel high or critical escalation.",
    ];
  }

  if (risk === "medium") {
    return [
      "You have 60 seconds to verify.",
      "If resident is okay, submit verification.",
      "If no one responds, EchoSync escalates for review.",
      "Medium alerts can be verified by caregiver.",
    ];
  }

  return [
    "Low-risk alert sent to caregiver.",
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
  const isMedium = currentRisk === "medium";
  const isLow = currentRisk === "low";
  const tone = getTone(currentRisk);
  const confidence = getConfidence(liveAlert, currentRisk);

  const voice = liveAlert?.voiceCheckIn as VoiceCheckIn | undefined;
  const voiceIntent = voice?.intent;

  const liveEvidence = getEvidenceItems(liveAlert);
  const timedOut = seconds === 0;
  const canVerify = can(role, "verify");
  const canCancelOrVerify = canVerify && !isHigh && !timedOut;

  const [callLog, setCallLog] = useState<{ time: string; text: string }[]>([]);

  const log = (text: string) => {
    const time = new Date().toLocaleTimeString("en-SG", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setCallLog((l) => [...l, { time, text }]);
  };

  const nextSteps = getNextStepText(currentRisk, voiceIntent);
  const aiSummarySections = parseAiSummary(liveAlert?.aiSummary);

  return (
    <>
      <TopBar title="Active alert" onBack={() => go("home")} />

      <ScreenScroll>
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 space-y-1.5">
          {liveAlert ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] text-emerald-700 uppercase tracking-wide">
                  Live Pi alert connected
                </div>

                <div className="text-[11px] text-emerald-700 font-medium">
                  {alertAgeText}
                </div>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed">
                Triggered:{" "}
                <span className="text-slate-900">{alertTimeText}</span>
                {receivedTimeText ? (
                  <>
                    {" "}
                    · Received:{" "}
                    <span className="text-slate-900">{receivedTimeText}</span>
                  </>
                ) : null}
              </div>

              <div className="text-[11px] text-slate-500">
                Showing latest alert from Raspberry Pi / Arduino JSON.
              </div>
            </>
          ) : (
            <>
              <div className="text-[11px] text-slate-500">
                Demo controls — for prototype walkthrough only
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Risk level:</span>

                <button
                  onClick={() => setRisk("medium")}
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    risk === "medium"
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  Medium
                </button>

                <button
                  onClick={() => setRisk("high")}
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    risk === "high"
                      ? "bg-red-700 text-white border-red-700"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  High
                </button>
              </div>
            </>
          )}
        </div>

        <Card
          className={`${
            tone === "red"
              ? "border-red-400 from-red-50"
              : tone === "green"
              ? "border-emerald-300 from-emerald-50"
              : "border-amber-300 from-amber-50"
          } bg-gradient-to-b to-white`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <ToneBadge
                tone={
                  tone === "green" ? "green" : tone === "red" ? "red" : "amber"
                }
              >
                <AlertTriangle className="w-3 h-3" /> {riskLabel(currentRisk)}{" "}
                risk
              </ToneBadge>

              <span className="text-xs text-slate-500">
                Confidence {confidence}%
              </span>
            </div>

            <div className="mt-3 text-slate-900 text-lg">
              {liveAlert?.eventType || "Possible Fall / No Response"}
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              Registered HDB unit: {liveAlert?.location || RESIDENT.address}
            </div>

            {liveAlert && (
              <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                Alert triggered:{" "}
                <span className="text-slate-800">{alertTimeText}</span>
                <span className="text-emerald-700">({alertAgeText})</span>
              </div>
            )}

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
              <Evidence
                key={item}
                icon={<AlertTriangle className="w-3 h-3" />}
                text={item}
              />
            ))}

            {liveEvidence.length === 0 && (
              <>
                <Evidence
                  icon={<Volume2 className="w-3 h-3" />}
                  text="Loud impact detected"
                />
                <Evidence
                  icon={<Footprints className="w-3 h-3" />}
                  text="No movement for 45s"
                />
                <Evidence
                  icon={<PhoneCall className="w-3 h-3" />}
                  text="Resident did not reply to voice check-in"
                />
                <Evidence
                  icon={<DoorClosed className="w-3 h-3" />}
                  text="No door exit detected"
                />
                <Evidence
                  icon={<Wifi className="w-3 h-3" />}
                  text="Device online"
                />
              </>
            )}
          </div>
        </div>

        {aiSummarySections.length > 0 && (
          <Card className="border-indigo-200 bg-indigo-50">
            <CardContent className="p-4">
              {/* <div className="text-xs uppercase tracking-wide text-indigo-700 mb-3">
                GB10 AI summary
              </div> */}

              <div className="space-y-3">
                {aiSummarySections.map((section, sectionIndex) => (
                  <div
                    key={`${section.title}-${sectionIndex}`}
                    className="rounded-xl bg-white border border-indigo-100 p-3"
                  >
                    <div className="text-xs font-semibold text-indigo-800 uppercase tracking-wide mb-1.5">
                      {section.title}
                    </div>

                    <div className="space-y-1.5">
                      {splitSummarySentences(section.body).map(
                        (sentence, index) => (
                          <p
                            key={`${section.title}-${index}`}
                            className="text-sm text-slate-800 leading-relaxed"
                          >
                            {sentence}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="text-xs uppercase tracking-wide text-blue-700 mb-2">
              What happens next?
            </div>

            <ol className="space-y-1.5 text-sm text-blue-900 list-decimal pl-5">
              {nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
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
              <EscStep n={2} text="Caregiver notified" done />

              {isLow && (
                <>
                  <EscStep
                    n={3}
                    text="Low-risk alert remains with caregiver"
                    active
                  />
                  <EscStep
                    n={4}
                    text="No emergency escalation unless risk increases"
                  />
                </>
              )}

              {isMedium && (
                <>
                  <EscStep
                    n={3}
                    text="myResponder verification queue notified"
                    active
                  />
                  <EscStep
                    n={4}
                    text="Escalate if unable to verify or risk increases"
                  />
                </>
              )}

              {isHigh && (
                <>
                  <EscStep
                    n={3}
                    text="Emergency operator review started"
                    active={!timedOut}
                    done={timedOut}
                  />
                  <EscStep
                    n={4}
                    text="Caregiver can add context but cannot cancel escalation"
                    active
                  />
                </>
              )}
            </ol>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="p-3 text-xs text-slate-700 space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-slate-600" />
              <span>
                Caregiver cancellation available:{" "}
                <span className="text-slate-900">
                  {isLow || isMedium
                    ? "Low / Medium risk only"
                    : "Not available for high-risk alerts"}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              <span>
                Emergency operator review required if no response or strong
                signal
              </span>
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
                <li>
                  Caregiver can still add context, but cannot cancel this alert.
                </li>
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
                  You may still add context, call the resident, or request a
                  callback. Emergency operator review cannot be cancelled.
                </div>
              </div>
            </div>
          ) : canCancelOrVerify ? (
            <Button
              className="w-full h-12 bg-slate-950 hover:bg-slate-900 text-white"
              onClick={() => go("verify")}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm resident is
              okay
            </Button>
          ) : (
            <div className="w-full rounded-xl border border-slate-200 bg-slate-100 p-4 flex items-start gap-2">
              <Lock className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />

              <div className="text-xs text-slate-700">
                Verification is restricted for your role ({ROLE_LABEL[role]}).
                You may add context or acknowledge the check request below.
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
            onClick={() =>
              log("Callback requested — EchoSync operator will attempt callback")
            }
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
              For strong emergency signals or no-response alerts, EchoSync
              continues to emergency operator review even if caregiver
              verification is pending.
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-3 flex gap-2 items-start">
            <Phone className="w-4 h-4 text-red-700 mt-0.5 shrink-0" />

            <p className="text-xs text-red-800">
              For immediate life-threatening emergencies, call{" "}
              <span className="text-red-900">995</span>.
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
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${tone}`}
      >
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