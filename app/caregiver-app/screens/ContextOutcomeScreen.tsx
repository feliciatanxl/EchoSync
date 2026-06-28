import {
  Lock,
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
  BottomCTAAboveNav
} from "../shared";

export function ContextOutcomeScreen({ go, role }: { go: (s: ScreenId) => void; role: Role }) {
  const time = new Date().toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" });
  return (
    <>
      <TopBar title="Context submitted" />
      <ScreenScroll>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-3">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="text-blue-900">Context sent to SCDF operator</div>
            <div className="text-xs text-blue-800 mt-1">Medium alert remains under review.</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-2 text-sm">
            <Row label="Alert status" value="Still under review" />
            <Row label="Caregiver action" value="Context added" />
            <Row label="Dashboard review" value="Medium case sent" />
            <Separator />
            <Row label="Audit log ID" value="CTX-2026-0843" />
            <Row label="Submitted by" value="Tan Mei Ling" />
            <Row label="Role" value={ROLE_LABEL[role]} />
            <Row label="Time" value={time} />
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-3 flex gap-2 items-start">
            <Lock className="w-4 h-4 text-red-700 mt-0.5 shrink-0" />
            <p className="text-xs text-red-800">
              Caregiver context has been added. SCDF operator can review and decide whether myResponder support is needed.
            </p>
          </CardContent>
        </Card>

        <div className="h-24" />
      </ScreenScroll>
      <BottomCTAAboveNav label="Back to home" onClick={() => go("home")} />
    </>
  );
}
