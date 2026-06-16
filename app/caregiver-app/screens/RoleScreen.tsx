import {
  CheckCircle2,
  ChevronRight,
  type ScreenId,
  type Role,
  TopBar,
  ScreenScroll,
  BottomCTA
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
    { id: "primary", label: "Primary caregiver", desc: "Full caregiver permissions" },
    { id: "secondary", label: "Secondary caregiver", desc: "Verify alerts, add context" },
    { id: "family", label: "Family member", desc: "View status and history" },
    { id: "neighbour", label: "Neighbour / helper", desc: "Acknowledge check requests" },
  ];
  const selected = role;
  const setSelected = setRole;
  return (
    <>
      <TopBar title="Select role" onBack={() => go("welcome")} />
      <ScreenScroll>
        <p className="text-sm text-slate-600">
          Your role determines what actions you can take. Only authorised caregivers can update
          contacts or pause routine monitoring.
        </p>
        <div className="space-y-2">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r.id)}
              className={`w-full text-left rounded-xl border p-4 bg-white transition ${
                selected === r.id ? "border-emerald-600 ring-1 ring-emerald-600" : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-slate-900">{r.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{r.desc}</div>
                </div>
                {selected === r.id ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </button>
          ))}
        </div>
      </ScreenScroll>
      <BottomCTA label="Continue" onClick={() => go("link")} />
    </>
  );
}
