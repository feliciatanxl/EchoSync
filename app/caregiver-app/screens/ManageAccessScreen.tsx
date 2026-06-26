import {
  useState,
  Shield,
  CheckCircle2,
  User,
  Card,
  CardContent,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  type ScreenId,
  TopBar,
  ScreenScroll
} from "../shared";

export function ManageAccessScreen({ go }: { go: (s: ScreenId) => void }) {
  const [linked, setLinked] = useState([
    { name: "Tan Mei Ling", role: "Primary caregiver", since: "Jan 2026" },
    { name: "Tan Wei Jie", role: "Secondary caregiver", since: "Feb 2026" },
    { name: "Mdm Lim (#08-110)", role: "Neighbour / helper", since: "Mar 2026" },
  ]);
  const [revoked, setRevoked] = useState<string | null>(null);
  return (
    <>
      <TopBar title="Manage access" onBack={() => go("profile")} />
      <ScreenScroll>
        {revoked && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-3 flex gap-2 items-start">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <div className="text-xs text-emerald-900">
                Access revoked for {revoked}. Action logged to audit trail.
              </div>
            </CardContent>
          </Card>
        )}
        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Linked caregivers</div>
            {linked.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-slate-900">{c.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {c.role} · linked {c.since}
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger className="inline-flex items-center justify-center text-xs h-8 px-3 rounded-md border border-red-300 text-red-700 hover:bg-red-50 leading-none">
                    Revoke
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Revoke caregiver access?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {c.name} will no longer be able to view alerts, add context, or receive
                        check requests. This action is logged to the audit trail.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-700 hover:bg-red-800"
                        onClick={() => {
                          setLinked((l) => l.filter((x) => x.name !== c.name));
                          setRevoked(c.name);
                        }}
                      >
                        Revoke access
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-2">
            <div className="text-xs uppercase tracking-wide text-slate-500">Consent history</div>
            <div className="text-xs text-slate-700">
              2026-01-10 · Mdm Tan confirmed consent for monitoring
            </div>
            <div className="text-xs text-slate-700">
              2026-02-04 · Secondary caregiver access approved
            </div>
            <div className="text-xs text-slate-700">
              2026-03-22 · Neighbour helper access approved
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-100">
          <CardContent className="p-3 flex gap-2 items-start">
            <Shield className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-700">
              Resident or authorised administrator can revoke any caregiver access at any time.
            </p>
          </CardContent>
        </Card>
      </ScreenScroll>
    </>
  );
}
