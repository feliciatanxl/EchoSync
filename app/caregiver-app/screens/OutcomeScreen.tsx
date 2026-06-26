import {
  CheckCircle2,
  FileText,
  Card,
  CardContent,
  Separator,
  type ScreenId,
  type Role,
  ROLE_LABEL,
  TopBar,
  ScreenScroll,
  Row,
  BottomCTA
} from "../shared";

export function OutcomeScreen({ go, role }: { go: (s: ScreenId) => void; role: Role }) {
  const time = new Date().toLocaleTimeString("en-SG", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <>
      <TopBar title="Verification submitted" />
      <ScreenScroll>
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <div className="text-emerald-900">Verification submitted</div>
            <div className="text-xs text-emerald-800 mt-1">
              Alert resolved by caregiver action.
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-2 text-sm">
            <Row label="Resident status" value="Confirmed okay" valueTone="green" />
            <Row label="Alert outcome" value="Resolved by caregiver" />
            <Row label="Emergency operator escalation" value="Not required" />
            <Separator />
            <Row label="Audit log ID" value="CGV-2026-0842" />
            <Row label="Submitted by" value="Tan Mei Ling" />
            <Row label="Role" value={ROLE_LABEL[role]} />
            <Row label="Time" value={time} />
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-100">
          <CardContent className="p-3 flex gap-2 items-start">
            <FileText className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-700">
              All caregiver actions are recorded in an immutable audit log for accountability and
              public-sector review.
            </p>
          </CardContent>
        </Card>
      </ScreenScroll>
      <BottomCTA label="Back to dashboard" onClick={() => go("home")} />
    </>
  );
}
