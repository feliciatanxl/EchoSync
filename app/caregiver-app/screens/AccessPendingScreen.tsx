import {
  Lock,
  Clock,
  Card,
  CardContent,
  Separator,
  type ScreenId,
  RESIDENT,
  TopBar,
  ScreenScroll,
  PermRow,
  BottomCTA
} from "../shared";

export function AccessPendingScreen({ go }: { go: (s: ScreenId) => void }) {
  return (
    <>
      <TopBar title="Access pending" onBack={() => go("profile")} />
      <ScreenScroll>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center mb-3">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div className="text-amber-900">Access pending</div>
            <div className="text-xs text-amber-800 mt-1">
              Your request to link with {RESIDENT.name} is waiting for approval.
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-2 text-sm">
            <div className="text-xs uppercase tracking-wide text-slate-500">You can view</div>
            <div className="flex items-center gap-2 text-slate-500">
              <Lock className="w-4 h-4" /> Nothing yet
            </div>
            <Separator />
            <div className="text-xs uppercase tracking-wide text-slate-500">You cannot</div>
            <PermRow text="View alerts" value="no" />
            <PermRow text="Control device" value="no" />
            <PermRow text="Update contacts" value="no" />
          </CardContent>
        </Card>

        <p className="text-xs text-slate-500">
          You will be notified once {RESIDENT.name} or the primary caregiver approves your access.
        </p>
      </ScreenScroll>
      <BottomCTA label="Back to profile" onClick={() => go("profile")} />
    </>
  );
}
