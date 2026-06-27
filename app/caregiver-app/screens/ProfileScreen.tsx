import {
  Shield,
  ShieldCheck,
  Clock,
  FileText,
  Lock,
  LogOut,
  User,
  Users,
  Button,
  Card,
  CardContent,
  type ScreenId,
  type Role,
  ROLE_LABEL,
  RESIDENT,
  TopBar,
  ScreenScroll,
  ToneBadge,
  Row,
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
  const SHOW_SIMULATE_ACCESS_PENDING = false;
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
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center font-semibold text-indigo-600">
              ML
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="font-semibold text-slate-900">Tan Mei Ling</div>
                <div className="text-xs text-slate-500">{ROLE_LABEL[role]}</div>
              </div>
              <div className="shrink-0">
                <ToneBadge tone="green">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </ToneBadge>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm">
              <Row label="Linked resident" value={RESIDENT.name} />
              <Row label="Consent status" value="Active" valueTone="green" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                <ShieldCheck className="h-4 w-4 text-indigo-500" />
                Access level
              </div>
              <button
                onClick={() => go("role")}
                className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
              >
                Change role
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-2xl bg-slate-50 p-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">{ROLE_LABEL[role]}</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  Controls are limited by caregiver role.
                </div>
              </div>
              <Lock className="h-4 w-4 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
              <FileText className="h-4 w-4 text-indigo-500" />
              Preferences
            </div>
            <div>
              <div className="mb-2 text-xs font-medium text-slate-500">Language</div>
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
            </div>
            <label className="flex items-center justify-between text-sm text-slate-800">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-500" />
                Larger text size
              </span>
              <input
                type="checkbox"
                checked={largeText}
                onChange={(e) => setLargeText(e.target.checked)}
                className="w-4 h-4 accent-emerald-600"
              />
            </label>
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
            icon={<Lock className="w-5 h-5 text-slate-700" />}
            label="Data access"
            sub="View what caregivers can and cannot see"
            onClick={() => go("privacy")}
          />
          {SHOW_SIMULATE_ACCESS_PENDING && (
            <ProfileLink
              icon={<Clock className="w-5 h-5 text-slate-700" />}
              label="Simulate access pending"
              sub="Demo - see what a non-authorised caregiver sees"
              onClick={() => go("accessPending")}
            />
          )}
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
