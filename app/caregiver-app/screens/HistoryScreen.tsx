import {
  useEffect,
  useState,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Wifi,
  Card,
  CardContent,
  TopBar,
  ScreenScroll,
  ToneBadge,
  type ReactNode
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
  soundDetected?: number;
  nearDetected?: number;
  pirMotion?: number;
  loadDetected?: number;
  possibleFall?: number;
  distanceCm?: number;
};

type VoiceCheckIn = {
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

  if (risk === "critical" || risk === "high") return "red";
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
  if (typeof sensor.distanceCm === "number") evidence.push(`Distance ${sensor.distanceCm} cm`);

  return evidence.length ? evidence.join(" + ") : "Sensor data received";
}

function getAction(alert: CaregiverAlert) {
  const risk = String(alert.riskLevel || "").toLowerCase();
  const voice = alert.voiceCheckIn as VoiceCheckIn | undefined;
  const intent = String(voice?.intent || "").toLowerCase();

  if (intent === "ok") return "Resident responded okay";
  if (intent === "help") return "Help request detected";
  if (risk === "critical" || risk === "high") return "Caregiver + operator notified";
  if (risk === "medium") return "Caregiver + myResponder notified";

  return "Caregiver notified";
}

function getOutcome(alert: CaregiverAlert) {
  const risk = String(alert.riskLevel || "").toLowerCase();
  const voice = alert.voiceCheckIn as VoiceCheckIn | undefined;
  const intent = String(voice?.intent || "").toLowerCase();

  if (intent === "ok") return "Pending caregiver verification";
  if (intent === "help") return "Escalated for emergency review";
  if (risk === "critical" || risk === "high") return "Sent for operator review";
  if (risk === "medium") return "Sent for verification";

  return "Logged for caregiver review";
}

function convertLiveAlert(alert: CaregiverAlert): HistoryEvent {
  return {
    time: formatTime(alert.receivedAt || alert.timestamp),
    title: alert.eventType ? `Live: ${alert.eventType}` : `Live: ${alert.riskLevel || "EchoSync"} alert`,
    tone: getRiskTone(alert.riskLevel),
    confidence: typeof alert.confidence === "number" ? `${alert.confidence}%` : "N/A",
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
      confidence: "N/A",
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
  const visible = active === "All" ? events : events.filter((e) => e.cats.includes(active));
  const verifiedCount = events.filter((event) => event.cats.includes("Verified okay")).length;
  const escalatedCount = events.filter((event) => event.cats.includes("Escalated")).length;
  const deviceCount = events.filter((event) => event.cats.includes("Device issues")).length;

  return (
    <>
      <TopBar title="Alert history" />
      <ScreenScroll>
        <Card className="border-0 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base font-semibold text-slate-900">Recent activity</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {events.length} events logged
                </div>
              </div>
              {liveEvents.length > 0 && <ToneBadge tone="green">Live</ToneBadge>}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <HistorySummary icon={<CheckCircle2 className="h-4 w-4" />} label="Okay" value={String(verifiedCount)} tone="green" />
              <HistorySummary icon={<AlertTriangle className="h-4 w-4" />} label="Escalated" value={String(escalatedCount)} tone="red" />
              <HistorySummary icon={<Wifi className="h-4 w-4" />} label="Device" value={String(deviceCount)} tone="grey" />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-3 py-1.5 rounded-full text-xs border whitespace-nowrap ${
                active === f
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {visible.length === 0 && (
            <div className="rounded-2xl bg-white p-4 text-xs italic text-slate-500">
              No events match this filter.
            </div>
          )}

          {visible.map((event, index) => (
            <HistoryCard key={`${event.title}-${event.time}-${index}`} event={event} />
          ))}
        </div>
      </ScreenScroll>
    </>
  );
}

function HistorySummary({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "green" | "red" | "grey";
}) {
  const color = {
    green: "text-emerald-600 bg-emerald-50",
    red: "text-red-600 bg-red-50",
    grey: "text-slate-600 bg-slate-50",
  }[tone];

  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-center">
      <div className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${color}`}>
        {icon}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
      <div className="text-[11px] text-slate-500">{label}</div>
    </div>
  );
}

function HistoryCard({ event }: { event: HistoryEvent }) {
  const icon = getEventIcon(event);
  const badgeTone = event.tone === "red" ? "red" : event.tone === "green" ? "green" : event.tone === "grey" ? "grey" : "amber";

  return (
    <Card className={event.isLive ? "border-emerald-100 bg-emerald-50" : "border-slate-100 bg-white"}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${getEventIconClass(event.tone)}`}>
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="font-semibold text-slate-900">{event.title}</div>
              <span className="shrink-0 text-xs text-slate-500">{event.time}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {event.isLive && <ToneBadge tone="green">Live</ToneBadge>}
              <ToneBadge tone={badgeTone}>Confidence {event.confidence}</ToneBadge>
            </div>
            <div className="mt-3 space-y-1.5 text-xs leading-relaxed text-slate-600">
              <DetailRow label="Evidence" value={event.evidence} />
              <DetailRow label="Outcome" value={event.outcome} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-medium text-slate-500">{label}: </span>
      <span>{value}</span>
    </div>
  );
}

function getEventIcon(event: HistoryEvent) {
  if (event.cats.includes("Verified okay")) return <CheckCircle2 className="h-5 w-5" />;
  if (event.cats.includes("Device issues")) return <Wifi className="h-5 w-5" />;
  if (event.cats.includes("Escalated")) return <AlertTriangle className="h-5 w-5" />;
  return <FileText className="h-5 w-5" />;
}

function getEventIconClass(tone: HistoryEvent["tone"]) {
  if (tone === "red") return "bg-red-50 text-red-600";
  if (tone === "green") return "bg-emerald-50 text-emerald-600";
  if (tone === "grey") return "bg-slate-100 text-slate-500";
  if (tone === "amber") return "bg-amber-50 text-amber-600";
  return "bg-indigo-50 text-indigo-600";
}
