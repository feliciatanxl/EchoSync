import {
  Bell,
  ShieldCheck,
  CheckCircle2,
  Fingerprint,
  Lock,
  Phone,
  UserPlus,
  Button,
  Card,
  CardContent,
  type ReactNode
} from "../shared";

export function WelcomeScreen({
  startCaregiverLogin,
  startNeighbourLogin,
}: {
  startCaregiverLogin: () => void;
  startNeighbourLogin: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 px-6 pb-8 pt-10 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 h-44 w-44 -translate-y-1/3 translate-x-1/3 rounded-full bg-white" />
          <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/4 translate-y-1/3 rounded-full bg-white" />
        </div>
        <div className="relative z-10">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 shadow-lg shadow-indigo-950/20 backdrop-blur-sm">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <p className="text-xs font-medium text-indigo-200">EchoSync</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Caregiver</h1>
          <p className="mt-2 max-w-xs text-xs leading-5 text-indigo-100">
            Secure caregiver verification and calm daily status checks for seniors living alone.
          </p>
        </div>
      </div>

      <div className="flex-1 px-6 pb-8 pt-6">
        <AccessPreview />

        <Card className="mt-5 border-0 bg-white">
          <CardContent className="space-y-3 p-5 text-left">
            <div className="mb-1 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Built for safe access</p>
                <p className="mt-0.5 text-xs text-slate-400">Simple checks before caregiver actions</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                Secure
              </span>
            </div>
            <TrustRow icon={<Fingerprint className="h-4 w-4" />} text="Verified caregiver access" />
            <TrustRow icon={<ShieldCheck className="h-4 w-4" />} text="Resident consent required" />
            <TrustRow icon={<CheckCircle2 className="h-4 w-4" />} text="Caregiver actions are logged" />
            <TrustRow icon={<Lock className="h-4 w-4" />} text="Critical alerts cannot be disabled" />
          </CardContent>
        </Card>

        <div className="mt-6 space-y-3">
          <Button
            className="w-full h-12 !bg-[#e60012] hover:!bg-[#c90010] text-white"
            onClick={startCaregiverLogin}
          >
            <Fingerprint className="w-4 h-4" />
            Login with Singpass
          </Button>

          <Button
            variant="outline"
            className="w-full h-12 border-slate-200 bg-white"
            onClick={startNeighbourLogin}
          >
            <UserPlus className="w-4 h-4" />
            Continue as Community Responder
          </Button>

          <div className="flex items-start gap-2 rounded-2xl bg-indigo-50 px-4 py-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
            <p className="text-xs leading-relaxed text-indigo-900">
              Hackathon prototype with mock secure identity login. For real emergencies, call 995.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccessPreview() {
  return (
    <div className="overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-sm shadow-slate-200/70">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Caregiver access</p>
          <p className="mt-0.5 text-xs text-slate-400">Verify first, act safely</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <ShieldCheck className="h-5 w-5" />
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-slate-100">
        <PreviewStep icon={<Fingerprint className="h-4 w-4" />} label="Login" />
        <PreviewStep icon={<Bell className="h-4 w-4" />} label="Alerts" />
        <PreviewStep icon={<Lock className="h-4 w-4" />} label="Audit" />
      </div>
    </div>
  );
}

function PreviewStep({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 px-2 py-4 text-center">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-indigo-600">
        {icon}
      </span>
      <span className="text-xs font-medium text-slate-600">{label}</span>
    </div>
  );
}

function TrustRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-700">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}
