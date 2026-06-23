import {
  useState,
  Card,
  CardContent,
  Checkbox,
  type ScreenId,
  type Role,
  TopBar,
  ScreenScroll,
  BottomCTA,
} from "../shared";

export function ConsentScreen({
  go,
  role,
}: {
  go: (s: ScreenId) => void;
  role: Role;
}) {
  const items =
    role === "neighbour"
      ? [
          "I agree to use EchoSync only for authorised neighbour / helper response",
          "I understand I can only view limited alert and resident check-request information",
          "I understand I cannot edit caregiver contacts or pause monitoring",
          "I understand critical alerts remain under emergency operator review",
        ]
      : [
          "I consent to EchoSync monitoring for emergency detection",
          "I allow this caregiver to view node status and alert summaries",
          "I understand no raw audio or raw video is stored",
          "I understand critical alerts may continue to emergency operator review",
        ];

  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const all = checked.every(Boolean);

  const backScreen: ScreenId = role === "neighbour" ? "link" : "role";

  return (
    <>
      <TopBar title="Consent" onBack={() => go(backScreen)} />

      <ScreenScroll>
        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-3">
            {items.map((t, i) => (
              <label key={i} className="flex gap-3 items-start cursor-pointer">
                <Checkbox
                  checked={checked[i]}
                  onCheckedChange={(v) =>
                    setChecked((c) =>
                      c.map((x, idx) => (idx === i ? Boolean(v) : x))
                    )
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

          <span className="text-xs text-emerald-900">
            I consent to all of the above
          </span>
        </label>

        <p className="text-xs text-slate-500">
          Consent can be reviewed or revoked by the resident or authorised administrator.
        </p>
      </ScreenScroll>

      <BottomCTA
        label="Confirm consent"
        onClick={() => go("home")}
        disabled={!all}
      />
    </>
  );
}