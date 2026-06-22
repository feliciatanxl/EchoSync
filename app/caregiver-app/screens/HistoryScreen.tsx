import {
  useEffect,
  useState,
  Card,
  CardContent,
  TopBar,
  ScreenScroll,
  StatusDot
} from "../shared";

type Cat = "All" | "Verified okay" | "Escalated" | "Device issues";

type HistoryEvent = {
  time: string;
  title: string;
  tone: "amber" | "red" | "blue" | "green" | "grey";
  confidence: string;
  evidence: string;
  action: string;
  outcome: string;
  cats: Cat[];
  isLive?: boolean;
};

type CaregiverAlert = {
  id?: string;
  nodeId?: string;
  resident?: string;
  location?: string;
  eventType?: string;
  riskLevel?: string;
  confidence?: number;
  reason?: string;
  sensorData?: unknown;
  voiceCheckIn?: unknown;
  aiSummary?: string;
  source?: string;
  timestamp?: string;
  receivedAt?: string;
  historyCategory?: "verified" | "escalated" | "device" | "all";
};

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

function formatTime(value?: string) {
  if (!value) return "Live";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRiskTone(riskLevel?: string): HistoryEvent["tone"] {
  const risk = String(riskLevel || "").toLowerCase();

  if (risk === "critical") return "red";
  if (risk === "high") return "red";
  if (risk === "medium") return "amber";
  if (risk === "low") return "green";

  return "blue";
}

function getCategory(alert: CaregiverAlert): Cat[] {
  const risk = String(alert.riskLevel || "").toLowerCase();
  const eventType = String(alert.eventType || "").toLowerCase();
  const reason = String(alert.reason || "").toLowerCase();
  const category = alert.historyCategory;

  const voice = alert.voiceCheckIn as VoiceCheckIn | undefined;
  const intent = String(voice?.intent || "").toLowerCase();

  if (
    category === "device" ||
    eventType.includes("device") ||
    eventType.includes("offline") ||
    reason.includes("wi-fi") ||
    reason.includes("wifi")
  ) {
    return ["Device issues"];
  }

  if (
    category === "verified" ||
    intent === "ok" ||
    eventType.includes("verified") ||
    eventType.includes("okay") ||
    reason.includes("okay")
  ) {
    return ["Verified okay"];
  }

  if (
    category === "escalated" ||
    risk === "high" ||
    risk === "critical" ||
    eventType.includes("no response") ||
    eventType.includes("emergency")
  ) {
    return ["Escalated"];
  }

  return ["All"];
}

function getEvidence(alert: CaregiverAlert) {
  const sensor = alert.sensorData as SensorData | undefined;

  if (alert.reason) return alert.reason;

  if (!sensor) return "Live EchoSync alert";

  const evidence: string[] = [];

  if (sensor.possibleFall) evidence.push("Possible fall");
  if (sensor.soundDetected) evidence.push("Sound detected");
  if (sensor.nearDetected) evidence.push("Near object");
  if (sensor.pirMotion) evidence.push("Motion detected");
  if (sensor.loadDetected) evidence.push("Load change");

  if (typeof sensor.distanceCm === "number") {
    evidence.push(`Distance ${sensor.distanceCm} cm`);
  }

  return evidence.length ? evidence.join(" + ") : "Sensor data received";
}

function getAction(alert: CaregiverAlert) {
  const risk = String(alert.riskLevel || "").toLowerCase();
  const voice = alert.voiceCheckIn as VoiceCheckIn | undefined;
  const intent = String(voice?.intent || "").toLowerCase();

  if (intent === "ok") return "Resident responded okay";
  if (intent === "help") return "Help request detected";

  if (risk === "critical" || risk === "high") {
    return "Caregiver + operator notified";
  }

  if (risk === "medium") {
    return "Caregiver + myResponder notified";
  }

  return "Caregiver notified";
}

function getOutcome(alert: CaregiverAlert) {
  const risk = String(alert.riskLevel || "").toLowerCase();
  const voice = alert.voiceCheckIn as VoiceCheckIn | undefined;
  const intent = String(voice?.intent || "").toLowerCase();

  if (intent === "ok") return "Pending caregiver verification";
  if (intent === "help") return "Escalated for emergency review";

  if (risk === "critical" || risk === "high") {
    return "Sent for operator review";
  }

  if (risk === "medium") {
    return "Sent for verification";
  }

  return "Logged for caregiver review";
}

function convertLiveAlert(alert: CaregiverAlert): HistoryEvent {
  const title = alert.eventType
    ? `Live: ${alert.eventType}`
    : `Live: ${alert.riskLevel || "EchoSync"} alert`;

  return {
    time: formatTime(alert.receivedAt || alert.timestamp),
    title,
    tone: getRiskTone(alert.riskLevel),
    confidence:
      typeof alert.confidence === "number" ? `${alert.confidence}%` : "—",
    evidence: getEvidence(alert),
    action: getAction(alert),
    outcome: getOutcome(alert),
    cats: getCategory(alert),
    isLive: true,
  };
}

export function HistoryScreen() {
  const filters: Cat[] = ["All", "Verified okay", "Escalated", "Device issues"];
  const [active, setActive] = useState<Cat>("All");
  const [liveEvents, setLiveEvents] = useState<HistoryEvent[]>([]);

  useEffect(() => {
    let activeRequest = true;

    const loadCaregiverHistory = async () => {
      try {
        const response = await fetch("/api/caregiver-alert", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const payload = (await response.json()) as {
          alerts?: CaregiverAlert[];
        };

        const realEvents = (payload.alerts || []).map(convertLiveAlert);

        if (activeRequest) {
          setLiveEvents(realEvents);
        }
      } catch {
        // keep mock history fallback
      }
    };

    void loadCaregiverHistory();

    const timer = setInterval(loadCaregiverHistory, 5000);

    return () => {
      activeRequest = false;
      clearInterval(timer);
    };
  }, []);

  const mockEvents: HistoryEvent[] = [
    {
      time: "Yesterday 4:12 PM",
      title: "Caregiver confirmed resident okay",
      tone: "green",
      confidence: "62%",
      evidence: "Brief loud sound",
      action: "Tan Mei Ling verified",
      outcome: "Resolved by caregiver",
      cats: ["Verified okay"],
    },
    {
      time: "Yesterday 9:08 AM",
      title: "Device offline",
      tone: "grey",
      confidence: "—",
      evidence: "Wi-Fi disconnected",
      action: "Caregiver notified",
      outcome: "Reconnected after 12 min",
      cats: ["Device issues"],
    },
    {
      time: "10:22 AM",
      title: "Impact anomaly detected",
      tone: "amber",
      confidence: "78%",
      evidence: "Loud impact + no movement",
      action: "Caregiver notified",
      outcome: "Pending verification",
      cats: ["Escalated"],
    },
    {
      time: "10:23 AM",
      title: "Voice check-in sent",
      tone: "blue",
      confidence: "—",
      evidence: "Automated check-in",
      action: "System",
      outcome: "No response",
      cats: ["Escalated"],
    },
    {
      time: "10:24 AM",
      title: "Caregiver notified",
      tone: "blue",
      confidence: "—",
      evidence: "Push + SMS",
      action: "System",
      outcome: "Delivered",
      cats: ["Escalated"],
    },
    {
      time: "10:25 AM",
      title: "Caregiver verification pending",
      tone: "amber",
      confidence: "78%",
      evidence: "Window 60s",
      action: "Awaiting caregiver",
      outcome: "Timed out",
      cats: ["Escalated"],
    },
    {
      time: "10:26 AM",
      title: "Sent for emergency operator review",
      tone: "red",
      confidence: "91%",
      evidence: "Impact + no response",
      action: "Auto-escalate",
      outcome: "Emergency operator engaged",
      cats: ["Escalated"],
    },
  ];

  const events = [...liveEvents, ...mockEvents];

  const visible =
    active === "All"
      ? events
      : events.filter((e) => e.cats.includes(active));

  return (
    <>
      <TopBar title="Alert history" />
      <ScreenScroll>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-3 py-1.5 rounded-full text-xs border whitespace-nowrap ${
                active === f
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative pl-4">
          <div className="absolute left-1.5 top-2 bottom-2 w-px bg-slate-200" />

          <div className="space-y-3">
            {visible.length === 0 && (
              <div className="text-xs text-slate-500 italic pl-1">
                No events match this filter.
              </div>
            )}

            {visible.map((e, i) => (
              <div key={`${e.title}-${e.time}-${i}`} className="relative">
                <div className="absolute -left-3 top-4">
                  <StatusDot
                    tone={
                      e.tone === "blue" || e.tone === "green"
                        ? e.tone === "green"
                          ? "green"
                          : "grey"
                        : e.tone
                    }
                  />
                </div>

                <Card
                  className={
                    e.isLive
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200"
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-slate-900 text-sm">{e.title}</div>
                      <span className="text-xs text-slate-500 shrink-0">
                        {e.time}
                      </span>
                    </div>

                    {e.isLive && (
                      <div className="mt-1 text-[11px] uppercase tracking-wide text-emerald-700">
                        Live Pi alert
                      </div>
                    )}

                    <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-600">
                      <span>Confidence: {e.confidence}</span>
                      <span>Evidence: {e.evidence}</span>
                      <span>Action: {e.action}</span>
                      <span>Outcome: {e.outcome}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </ScreenScroll>
    </>
  );
}