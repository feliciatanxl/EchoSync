import {
  AlertTriangle,
  Card,
  CardContent,
  RadioGroup,
  RadioGroupItem,
  Label,
  type ScreenId,
  TopBar,
  ScreenScroll,
  BottomCTA
} from "../shared";

export function PauseScreen({
  go,
  duration,
  setDuration,
  reason,
  setReason,
}: {
  go: (s: ScreenId) => void;
  duration: string;
  setDuration: (s: string) => void;
  reason: string;
  setReason: (s: string) => void;
}) {
  return (
    <>
      <TopBar title="Pause low-risk monitoring" onBack={() => go("node")} />
      <ScreenScroll>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <Label className="text-xs text-slate-500">Duration</Label>
            <RadioGroup value={duration} onValueChange={setDuration} className="mt-2 space-y-2">
              {[
                ["15", "15 minutes"],
                ["30", "30 minutes"],
                ["60", "1 hour"],
                ["custom", "Custom"],
              ].map(([v, l]) => (
                <label key={v} className="flex items-center gap-3 cursor-pointer">
                  <RadioGroupItem value={v} id={`d-${v}`} />
                  <span className="text-sm text-slate-800">{l}</span>
                </label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <Label className="text-xs text-slate-500">Reason</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="mt-2 space-y-2">
              {[
                ["family", "Family member visiting"],
                ["maint", "Maintenance"],
                ["away", "Resident away from home"],
                ["false", "False activity pattern"],
              ].map(([v, l]) => (
                <label key={v} className="flex items-center gap-3 cursor-pointer">
                  <RadioGroupItem value={v} id={`r-${v}`} />
                  <span className="text-sm text-slate-800">{l}</span>
                </label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-3 flex gap-2 items-start">
            <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800">
              Critical alerts, no-response alerts, and high-risk events remain active.
            </p>
          </CardContent>
        </Card>
      </ScreenScroll>
      <BottomCTA label="Continue" onClick={() => go("pauseConfirm")} />
    </>
  );
}
