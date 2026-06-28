import {
  useState,
  AlertTriangle,
  Card,
  CardContent,
  Checkbox,
  Textarea,
  Label,
  type ScreenId,
  TopBar,
  ScreenScroll,
  BottomCTAAboveNav,
} from "../shared";

export function VerifyScreen({ go }: { go: (s: ScreenId) => void }) {
  const items = [
    "I contacted or saw the resident",
    "Resident confirmed they are okay",
    "No emergency assistance is needed",
  ];
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const all = checked.every(Boolean);
  return (
    <>
      <TopBar title="Confirm resident is okay" onBack={() => go("alert")} />
      <ScreenScroll>
        <p className="text-sm text-slate-700">
          Have you personally verified that the resident is safe?
        </p>
        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-3">
            {items.map((t, i) => (
              <label key={i} className="flex gap-3 items-start cursor-pointer">
                <Checkbox
                  checked={checked[i]}
                  onCheckedChange={(v) =>
                    setChecked((c) => c.map((x, idx) => (idx === i ? Boolean(v) : x)))
                  }
                  className="mt-0.5"
                />
                <span className="text-sm text-slate-800">{t}</span>
              </label>
            ))}
          </CardContent>
        </Card>

        <div>
          <Label className="text-xs text-slate-500">Add short note</Label>
          <Textarea
            className="mt-2"
            placeholder="e.g. Spoke to Mdm Tan, she dropped a pot but is unhurt."
            rows={3}
          />
        </div>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-3 flex gap-2 items-start">
            <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800">
              This action is only available for low/medium-risk alerts. Critical alerts remain
              visible to the emergency operator.
            </p>
          </CardContent>
        </Card>
        <div className="h-24" />
      </ScreenScroll>
      <BottomCTAAboveNav label="Submit verification" onClick={() => go("outcome")} disabled={!all} />
    </>
  );
}
