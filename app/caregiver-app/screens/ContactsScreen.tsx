import {
  Lock,
  Phone,
  User,
  Button,
  Card,
  CardContent,
  Separator,
  type ScreenId,
  type Role,
  can,
  TopBar,
  ScreenScroll,
  BottomCTA
} from "../shared";

export function ContactsScreen({
  go,
  role,
  onSave,
}: {
  go: (s: ScreenId) => void;
  role: Role;
  onSave: () => void;
}) {
  const canEdit = can(role, "contacts");
  const contacts = [
    { role: "Primary caregiver", name: "Tan Mei Ling (Daughter)", phone: "+65 9123 4567" },
    { role: "Secondary caregiver", name: "Tan Wei Jie (Son)", phone: "+65 9876 5432" },
    { role: "Neighbour / helper", name: "Mdm Lim (#08-110)", phone: "+65 8800 2233" },
  ];
  return (
    <>
      <TopBar title="Emergency contacts" onBack={() => go("home")} />
      <ScreenScroll>
        {contacts.map((c) => (
          <Card key={c.role} className="border-slate-200">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-slate-500">{c.role}</div>
                <div className="text-slate-900 text-sm">{c.name}</div>
                <div className="text-xs text-slate-500">{c.phone}</div>
              </div>
              <Button size="icon" variant="outline" className="border-slate-300">
                <Phone className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}

        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-2">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Preferred hospital / clinic
            </div>
            <div className="text-sm text-slate-800">Ang Mo Kio Polyclinic</div>
            <Separator />
            <div className="text-xs uppercase tracking-wide text-slate-500">Medical context</div>
            <ul className="text-sm text-slate-800 space-y-1">
              <li>• Uses walking aid</li>
              <li>• Hearing difficulty</li>
              <li>• Usually naps 2–4 PM</li>
            </ul>
          </CardContent>
        </Card>

        <p className="text-xs text-slate-500">
          Medical notes are used only as pre-arrival context and do not replace clinical
          assessment.
        </p>
      </ScreenScroll>
      {canEdit ? (
        <BottomCTA
          label="Update contacts"
          onClick={() => {
            onSave();
            go("home");
          }}
        />
      ) : (
        <div className="border-t border-slate-200 bg-white p-4 space-y-2">
          <div className="rounded-lg border border-slate-200 bg-slate-100 p-3 flex items-start gap-2">
            <Lock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
            <span className="text-xs text-slate-700">
              Contact updates restricted to primary caregiver.
            </span>
          </div>
          <Button
            variant="outline"
            className="w-full h-12 border-slate-300"
            onClick={() => go("home")}
          >
            Back to dashboard
          </Button>
        </div>
      )}
    </>
  );
}
