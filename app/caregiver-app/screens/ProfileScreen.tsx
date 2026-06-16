import {
  Shield,
  ShieldCheck,
  Clock,
  FileText,
  LogOut,
  Users,
  Button,
  Card,
  CardContent,
  Separator,
  type ScreenId,
  type Role,
  ROLE_LABEL,
  ROLE_PERMS,
  RESIDENT,
  TopBar,
  ScreenScroll,
  ToneBadge,
  Row,
  PermRow,
  ProfileLink
} from "../shared";

export function ProfileScreen({
  go,
  role,
  largeText,
  setLargeText,
  language,
  setLanguage,
}: {
  go: (s: ScreenId) => void;
  role: Role;
  largeText: boolean;
  setLargeText: (v: boolean) => void;
  language: "en" | "zh" | "ms" | "ta";
  setLanguage: (l: "en" | "zh" | "ms" | "ta") => void;
}) {
  const perms = ROLE_PERMS[role];
  const langs: [typeof language, string][] = [
    ["en", "English"],
    ["zh", "中文"],
    ["ms", "Malay"],
    ["ta", "தமிழ்"],
  ];
  return (
    <>
      <TopBar title="Profile & security" />
      <ScreenScroll>
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
              ML
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="text-slate-900">Tan Mei Ling</div>
              <div className="text-xs text-slate-500">{ROLE_LABEL[role]}</div>
              <div className="pt-1">
                <ToneBadge tone="green">
                  <ShieldCheck className="w-3 h-3" /> Singpass-style verified
                </ToneBadge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-2 text-sm">
            <Row label="Linked resident" value={RESIDENT.name} />
            <Row label="Address" value={RESIDENT.address} />
            <Row label="Role" value={ROLE_LABEL[role]} />
            <Row label="Consent status" value="Active" valueTone="green" />
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Role-based permissions
              </div>
              <button
                onClick={() => go("role")}
                className="text-xs text-emerald-700 hover:underline"
              >
                Change role
              </button>
            </div>
            {perms.map((p) => (
              <PermRow key={p.label} text={p.label} value={p.value} />
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-2">
            <div className="text-xs uppercase tracking-wide text-slate-500">Language</div>
            <div className="flex flex-wrap gap-2">
              {langs.map(([code, label]) => {
                const on = language === code;
                return (
                  <button
                    key={code}
                    onClick={() => setLanguage(code)}
                    className={`text-xs px-3 py-1.5 rounded-full border ${
                      on
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500">
              Multilingual content is a hackathon placeholder. Translations coming soon.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Accessibility</div>
            <label className="flex items-center justify-between text-sm text-slate-800">
              <span>Larger text size</span>
              <input
                type="checkbox"
                checked={largeText}
                onChange={(e) => setLargeText(e.target.checked)}
                className="w-4 h-4 accent-emerald-600"
              />
            </label>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <div>
                <div>High contrast mode</div>
                <div className="text-[11px] text-slate-400">Coming in pilot version</div>
              </div>
              <input type="checkbox" disabled className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <div>
                <div>Read alerts aloud</div>
                <div className="text-[11px] text-slate-400">Coming in pilot version</div>
              </div>
              <input type="checkbox" disabled className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-2">
            <div className="text-xs uppercase tracking-wide text-slate-500">Data access</div>
            <div className="text-[11px] text-slate-500 mt-1">Caregiver can view</div>
            <PermRow text="Alert summaries" value="yes" />
            <PermRow text="Device status" value="yes" />
            <PermRow text="Verification history" value="yes" />
            <PermRow text="Emergency contact details" value="yes" />
            <Separator />
            <div className="text-[11px] text-slate-500">Caregiver cannot view</div>
            <PermRow text="Raw audio" value="no" />
            <PermRow text="Raw video" value="no" />
            <PermRow text="Private conversations" value="no" />
            <PermRow text="Medical diagnosis" value="no" />
          </CardContent>
        </Card>

        <div className="space-y-2">
          <ProfileLink
            icon={<Users className="w-5 h-5 text-slate-700" />}
            label="Manage access"
            sub="Review linked caregivers - Revoke - Consent history"
            onClick={() => go("manageAccess")}
          />
          <ProfileLink
            icon={<Clock className="w-5 h-5 text-slate-700" />}
            label="Simulate access pending"
            sub="Demo - see what a non-authorised caregiver sees"
            onClick={() => go("accessPending")}
          />
          <ProfileLink
            icon={<FileText className="w-5 h-5 text-slate-700" />}
            label="Audit log"
            onClick={() => go("history")}
          />
          <ProfileLink
            icon={<Shield className="w-5 h-5 text-slate-700" />}
            label="Help & FAQ"
            sub="What is EchoSync? When to call 995?"
            onClick={() => go("faq")}
          />
        </div>

        <Button
          variant="outline"
          className="w-full h-12 border-slate-300 text-slate-700"
          onClick={() => go("welcome")}
        >
          <LogOut className="w-4 h-4 mr-2" /> Log out
        </Button>
      </ScreenScroll>
    </>
  );
}
