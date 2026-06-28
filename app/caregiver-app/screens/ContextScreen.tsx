import {
  useState,
  CheckCircle2,
  AlertTriangle,
  Card,
  CardContent,
  Textarea,
  Label,
  type ScreenId,
  type Role,
  ROLE_LABEL,
  TopBar,
  ScreenScroll,
  BottomCTAAboveNav
} from "../shared";
import type { CaregiverLiveAlert } from "../CaregiverApp";

export function ContextScreen({
  go,
  role,
  liveAlert,
}: {
  go: (s: ScreenId) => void;
  role: Role;
  liveAlert: CaregiverLiveAlert | null;
}) {
  const options = [
    "I am calling resident now",
    "I am on the way",
    "Resident has mobility issues",
    "Resident is hard of hearing",
    "Unable to verify",
  ];

  const [selected, setSelected] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  const toggle = (o: string) =>
    setSelected((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]));

  const sendContextToDashboard = async () => {
    if (sending) return;

    setSending(true);

    const now = new Date().toISOString();
    const selectedContext =
      selected.length > 0 ? selected : ["Unable to verify"];

    const originalRisk = liveAlert?.riskLevel || "Medium";
    const originalConfidence =
      typeof liveAlert?.confidence === "number" ? liveAlert.confidence : 72;

    const payload = {
      nodeId: liveAlert?.nodeId || "NODE-HDB-302-08-112",
      resident: liveAlert?.resident || "Mdm Tan Siew Lan",
      location: liveAlert?.location || "Blk 302 Ang Mo Kio Ave 3, #08-112",

      eventType: "Caregiver Unable to Verify",
      riskLevel: "Medium",
      confidence: originalConfidence,

      reason:
        "Caregiver could not verify the resident after a medium-risk EchoSync alert. SCDF operator review is requested. Operator may consider myResponder coordination if the risk is confirmed.",

      sensorData: liveAlert?.sensorData || {
        note: "Original sensor data was not available from caregiver app.",
      },

      voiceCheckIn: liveAlert?.voiceCheckIn || {
        intent: "not_available",
        transcript: "",
      },

      caregiverContext: {
        submittedBy: "Tan Mei Ling",
        role: ROLE_LABEL[role],
        selectedContext,
        note: note.trim(),
        originalRiskLevel: originalRisk,
        originalConfidence,
        submittedAt: now,
      },

      aiSummary:
        "Alert Summary: Caregiver could not verify the resident after a medium-risk EchoSync alert. Original sensor evidence has been forwarded together with the caregiver context. Recommendation: SCDF operator should review the caregiver note and sensor readings, then consider pushing to myResponder for CFR/AED coordination if the situation cannot be verified. Do not auto-dispatch 995 unless emergency signs are confirmed.",

      source: "Caregiver App Context Update",
      timestamp: now,
    };

    try {
      await fetch("/api/sensor-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } finally {
      setSending(false);
      go("contextOutcome");
    }
  };

  return (
    <>
      <TopBar title="Add context" onBack={() => go("alert")} />

      <ScreenScroll>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-3 flex gap-2 items-start">
            <AlertTriangle className="w-4 h-4 text-red-700 mt-0.5 shrink-0" />
            <p className="text-xs text-red-800">
              If you are unable to verify the resident, this context will be sent
              to the SCDF operator review dashboard.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-2">
            <div className="text-xs text-slate-500 mb-1">Quick context</div>
            {options.map((o) => {
              const on = selected.includes(o);
              return (
                <button
                  key={o}
                  onClick={() => toggle(o)}
                  className={`w-full text-left rounded-lg border px-3 py-2.5 text-sm flex items-center justify-between ${
                    on
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  {o}
                  {on && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div>
          <Label className="text-xs text-slate-500">Add a short note</Label>
          <Textarea
            className="mt-2"
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="e.g. Reached door, no answer. Asking neighbour to check."
          />
        </div>

        <div className="h-24" />
      </ScreenScroll>

      <BottomCTAAboveNav
        label={sending ? "Sending context..." : "Send context to operator"}
        onClick={sendContextToDashboard}
        disabled={sending}
      />
    </>
  );
}