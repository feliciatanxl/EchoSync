import {
  ShieldCheck,
  Card,
  CardContent,
  Separator,
  type ScreenId,
  TopBar,
  ScreenScroll,
  Row
} from "../shared";

export function ConsentStatusScreen({ go }: { go: (s: ScreenId) => void }) {
  return (
    <>
      <TopBar title="Consent status" onBack={() => go("privacy")} />
      <ScreenScroll>
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
            <div>
              <div className="text-emerald-900 text-sm">Consent active</div>
              <div className="text-xs text-emerald-800">
                Resident consent is on record and current.
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-2 text-sm">
            <Row label="Consent status" value="Active" valueTone="green" />
            <Row label="Resident consented on" value="10 Jan 2026" />
            <Row label="Linked caregiver" value="Tan Mei Ling" />
            <Row label="Caregiver role" value="Primary caregiver" />
            <Separator />
            <Row label="Last reviewed" value="22 Mar 2026" />
            <Row label="Next review" value="Jan 2027" />
          </CardContent>
        </Card>
        <p className="text-xs text-slate-500">
          Consent can be reviewed or revoked by the resident or authorised administrator at any
          time.
        </p>
      </ScreenScroll>
    </>
  );
}
