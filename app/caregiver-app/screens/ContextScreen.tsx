import {
  useState,
  CheckCircle2,
  AlertTriangle,
  Card,
  CardContent,
  Textarea,
  Label,
  type ScreenId,
  TopBar,
  ScreenScroll,
  BottomCTAAboveNav
} from "../shared";

export function ContextScreen({ go }: { go: (s: ScreenId) => void }) {
  const options = [
    "I am calling resident now",
    "I am on the way",
    "Resident has mobility issues",
    "Resident is hard of hearing",
    "Unable to verify",
  ];
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (o: string) =>
    setSelected((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]));
  return (
    <>
      <TopBar title="Add context" onBack={() => go("alert")} />
      <ScreenScroll>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-3 flex gap-2 items-start">
            <AlertTriangle className="w-4 h-4 text-red-700 mt-0.5 shrink-0" />
            <p className="text-xs text-red-800">
              High-risk alert remains under emergency operator review. Your context helps
              responders, but cannot cancel this alert.
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
            placeholder="e.g. Reached door, no answer. Asking neighbour to check."
          />
        </div>
        <div className="h-24" />
      </ScreenScroll>
      <BottomCTAAboveNav label="Send context to operator" onClick={() => go("contextOutcome")} />
    </>
  );
}
