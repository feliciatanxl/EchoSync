import {
  useState,
  Button,
  Card,
  CardContent,
  type ScreenId,
  TopBar,
  ScreenScroll,
  Row
} from "../shared";

export function PauseConfirmScreen({
  go,
  duration,
  reason,
  onConfirm,
}: {
  go: (s: ScreenId) => void;
  duration: string;
  reason: string;
  onConfirm: (reasonLabel: string, resumeAt: string) => void;
}) {
  const durationMap: Record<string, { label: string; minutes: number }> = {
    "15": { label: "15 minutes", minutes: 15 },
    "30": { label: "30 minutes", minutes: 30 },
    "60": { label: "1 hour", minutes: 60 },
    custom: { label: "Custom", minutes: 30 },
  };
  const reasonMap: Record<string, string> = {
    family: "Family member visiting",
    maint: "Maintenance",
    away: "Resident away from home",
    false: "False activity pattern",
  };
  const d = durationMap[duration] ?? durationMap["30"];
  const [baseTime] = useState(() => Date.now());
  const resumeAt = new Date(baseTime + d.minutes * 60_000).toLocaleTimeString("en-SG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <>
      <TopBar title="Confirm pause" onBack={() => go("pause")} />
      <ScreenScroll>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 space-y-2">
            <div className="text-amber-900 text-sm">
              Low-risk monitoring will pause for {d.label.toLowerCase()}.
            </div>
            <div className="text-xs text-amber-800">
              Critical alerts, no-response alerts, and high-risk events remain active.
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-2 text-sm">
            <Row label="Duration" value={d.label} />
            <Row label="Reason" value={reasonMap[reason] ?? "Not specified"} />
            <Row label="Resumes at" value={resumeAt} />
          </CardContent>
        </Card>
      </ScreenScroll>
      <div className="border-t border-slate-200 bg-white p-4 space-y-2">
        <Button
          className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white"
          onClick={() => {
            onConfirm(reasonMap[reason] ?? "Not specified", resumeAt);
            go("node");
          }}
        >
          Confirm pause
        </Button>
        <Button
          variant="outline"
          className="w-full h-11 border-slate-300"
          onClick={() => go("pause")}
        >
          Cancel
        </Button>
      </div>
    </>
  );
}
