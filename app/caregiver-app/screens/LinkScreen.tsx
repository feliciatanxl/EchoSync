import {
  ShieldCheck,
  ChevronRight,
  QrCode,
  KeyRound,
  UserPlus,
  Input,
  Label,
  type ScreenId,
  TopBar,
  ScreenScroll,
  ResidentCard,
  BottomCTA,
  type ReactNode
} from "../shared";

export function LinkScreen({ go }: { go: (s: ScreenId) => void }) {
  return (
    <>
      <TopBar title="Link to resident" onBack={() => go("role")} />
      <ScreenScroll>
        <ResidentCard />

        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 text-amber-700 px-2 py-0.5 text-[10px]">
            Consent required
          </span>
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px]">
            Pending approval
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px]">
            <ShieldCheck className="w-2.5 h-2.5" /> Verified caregiver
          </span>
        </div>

        <div className="space-y-2">
          <LinkMethod icon={<QrCode className="w-5 h-5" />} title="Scan resident QR code" />
          <LinkMethod icon={<KeyRound className="w-5 h-5" />} title="Enter invitation code" />
          <LinkMethod
            icon={<UserPlus className="w-5 h-5" />}
            title="Request access from resident / primary caregiver"
          />
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-4">
          <Label className="text-xs text-slate-500">Invitation code</Label>
          <Input className="mt-2" placeholder="e.g. ECHO-3F2K-91XA" />
        </div>
      </ScreenScroll>
      <BottomCTA label="Continue to consent" onClick={() => go("consent")} />
    </>
  );
}

function LinkMethod({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white border border-slate-200 p-4">
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
        {icon}
      </div>
      <div className="flex-1 text-sm text-slate-800">{title}</div>
      <ChevronRight className="w-5 h-5 text-slate-400" />
    </div>
  );
}
