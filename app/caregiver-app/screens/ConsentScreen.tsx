import {
  useState,
  Card,
  CardContent,
  Checkbox,
  type ScreenId,
  TopBar,
  ScreenScroll,
  BottomCTA
} from "../shared";

export function ConsentScreen({ go }: { go: (s: ScreenId) => void }) {
  const items = [
    "I consent to EchoSync monitoring for emergency detection",
    "I allow this caregiver to view node status and alert summaries",
    "I understand no raw audio or raw video is stored",
    "I understand critical alerts may continue to emergency operator review",
  ];
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const all = checked.every(Boolean);
  return (
    <>
      <TopBar title="Resident consent" onBack={() => go("link")} />
      <ScreenScroll>
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

        <label className="flex gap-2 items-center cursor-pointer rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
          <Checkbox
            checked={all}
            onCheckedChange={(v) => setChecked(items.map(() => Boolean(v)))}
          />
          <span className="text-xs text-emerald-900">I consent to all of the above</span>
        </label>

        <p className="text-xs text-slate-500">
          Consent can be reviewed or revoked by the resident or authorised administrator.
        </p>
      </ScreenScroll>
      <BottomCTA label="Confirm consent" onClick={() => go("access")} disabled={!all} />
    </>
  );
}
