import {
  Bell,
  Button,
  Card,
  CardContent,
  type ScreenId,
  TopBar,
  ScreenScroll
} from "../shared";

export function NotificationsScreen({ go }: { go: (s: ScreenId) => void }) {
  return (
    <>
      <TopBar title="Notifications" onBack={() => go("welcome")} />
      <ScreenScroll>
        <Card className="border-slate-200">
          <CardContent className="p-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 mx-auto flex items-center justify-center mb-3">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <div className="text-slate-900">Enable alert notifications</div>
            <div className="text-xs text-slate-500 mt-1">
              EchoSync needs permission so we can reach you the moment something is wrong.
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-2 text-sm text-slate-800">
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-3">
              We will only notify you when
            </div>
            <NotifRow text="Resident does not respond to check-in" />
            <NotifRow text="Device goes offline" />
            <NotifRow text="Verification is needed" />
            <NotifRow text="Alert has been sent for emergency review" />
          </CardContent>
        </Card>

        <p className="text-xs text-slate-500">
          You can change this anytime in Profile → Notifications.
        </p>
      </ScreenScroll>
      <div className="border-t border-slate-200 bg-white p-4 space-y-2">
        <Button
          className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white"
          onClick={() => go("role")}
        >
          Allow notifications
        </Button>
        <Button
          variant="outline"
          className="w-full h-11 border-slate-300"
          onClick={() => go("role")}
        >
          Not now
        </Button>
      </div>
    </>
  );
}

function NotifRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 py-1">
      <Bell className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
      <span className="pl-1">{text}</span>
    </div>
  );
}
