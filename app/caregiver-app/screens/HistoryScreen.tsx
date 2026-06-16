import {
  useState,
  Card,
  CardContent,
  TopBar,
  ScreenScroll,
  StatusDot
} from "../shared";

export function HistoryScreen() {
  type Cat = "All" | "Verified okay" | "Escalated" | "Device issues";
  const filters: Cat[] = ["All", "Verified okay", "Escalated", "Device issues"];
  const [active, setActive] = useState<Cat>("All");
  const events: {
    time: string;
    title: string;
    tone: "amber" | "red" | "blue" | "green" | "grey";
    confidence: string;
    evidence: string;
    action: string;
    outcome: string;
    cats: Cat[];
  }[] = [
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
  const visible = active === "All" ? events : events.filter((e) => e.cats.includes(active));
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
              <div key={i} className="relative">
                <div className="absolute -left-3 top-4">
                  <StatusDot tone={e.tone === "blue" || e.tone === "green" ? (e.tone === "green" ? "green" : "grey") : e.tone} />
                </div>
                <Card className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-slate-900 text-sm">{e.title}</div>
                      <span className="text-xs text-slate-500">{e.time}</span>
                    </div>
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
