import {
  ShieldCheck,
  CheckCircle2,
  Card,
  CardContent,
  type ScreenId,
  TopBar,
  ScreenScroll,
  BottomCTA
} from "../shared";

export function PrivacyScreen({ go }: { go: (s: ScreenId) => void }) {
  const items = [
    "No raw audio stored",
    "No raw video stored",
    "Edge AI processes signals locally",
    "Only alert summaries and node health are shared",
    "Caregiver actions are logged for accountability",
    "Resident consent required for deployment",
    "High-risk alerts remain visible to the emergency operator",
  ];
  return (
    <>
      <TopBar title="Privacy & consent" onBack={() => go("home")} />
      <ScreenScroll>
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4 flex gap-3 items-center">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
            <div>
              <div className="text-emerald-900 text-sm">Privacy-first by design</div>
              <div className="text-xs text-emerald-800">
                Edge processing keeps raw signals on the in-home node.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-3">
            {items.map((t) => (
              <div key={t} className="flex items-start gap-2 text-sm text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" /> {t}
              </div>
            ))}
          </CardContent>
        </Card>
      </ScreenScroll>
      <BottomCTA label="Review consent status" onClick={() => go("consentStatus")} />
    </>
  );
}
