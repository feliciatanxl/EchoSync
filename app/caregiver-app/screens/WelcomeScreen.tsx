import {
  ShieldCheck,
  CheckCircle2,
  Fingerprint,
  Button,
  Card,
  CardContent,
  type ScreenId
} from "../shared";

export function WelcomeScreen({ go }: { go: (s: ScreenId) => void }) {
  return (
    <div className="flex-1 flex flex-col px-6 pt-20 pb-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-600 flex items-center justify-center shadow-lg mb-6">
          <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        <div className="text-slate-900 text-2xl mb-2">EchoSync Caregiver</div>
        <div className="text-slate-500 px-4">
          Secure caregiver verification for seniors living alone
        </div>

        <Card className="mt-8 w-full border-slate-200 bg-white">
          <CardContent className="p-4 space-y-2 text-left">
            <TrustRow text="Verified caregiver access" />
            <TrustRow text="Resident consent required" />
            <TrustRow text="Caregiver actions are logged" />
            <TrustRow text="Critical alerts cannot be disabled" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <Button
          className="w-full h-12 !bg-[#e60012] hover:!bg-[#c90010] text-white"
          onClick={() => go("notifications")}
        >
          <Fingerprint className="w-4 h-4 mr-2" />
          Login with Singpass (Mock)
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 border-slate-300"
          onClick={() => go("notifications")}
        >
          Continue as Community Responder
        </Button>
        <p className="text-[11px] text-center text-slate-400 px-4">
          Hackathon prototype. Mock secure identity login — not a real government integration.
        </p>
      </div>
    </div>
  );
}

function TrustRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-700">
      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
      {text}
    </div>
  );
}
