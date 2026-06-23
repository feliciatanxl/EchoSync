import {
  CheckCircle2,
  ChevronRight,
  type ScreenId,
  type Role,
  TopBar,
  ScreenScroll,
  BottomCTA,
} from "../shared";

export function RoleScreen({
  go,
  role,
  setRole,
}: {
  go: (s: ScreenId) => void;
  role: Role;
  setRole: (r: Role) => void;
}) {
  const roles: { id: Role; label: string; desc: string }[] = [
    {
      id: "primary",
      label: "Primary caregiver",
      desc: "Full caregiver permissions",
    },
    {
      id: "secondary",
      label: "Secondary caregiver",
      desc: "Verify alerts and add context",
    },
    {
      id: "family",
      label: "Family member",
      desc: "View resident status and alert history",
    },
  ];

  return (
    <>
      <TopBar title="Select role" onBack={() => go("notifications")} />

      <ScreenScroll>
        <p className="text-sm text-slate-600">
          Select your caregiver role. Primary and secondary caregivers can help
          verify alerts, while family members can view resident status and history.
        </p>

        <div className="space-y-2">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`w-full text-left rounded-xl border p-4 bg-white transition ${
                role === r.id
                  ? "border-emerald-600 ring-1 ring-emerald-600"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-900">{r.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {r.desc}
                  </div>
                </div>

                {role === r.id ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </button>
          ))}
        </div>
      </ScreenScroll>

      <BottomCTA
        label="Continue"
        onClick={() => go("consent")}
      />
    </>
  );
}