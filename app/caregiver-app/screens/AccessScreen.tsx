import {
  Lock,
  CheckCircle2,
  Card,
  CardContent,
  type ScreenId,
  TopBar,
  ScreenScroll,
  ToneBadge,
  BottomCTA
} from "../shared";

export function AccessScreen({ go }: { go: (s: ScreenId) => void }) {
  return (
    <>
      <TopBar title="Access level" onBack={() => go("consent")} />
      <ScreenScroll>
        <AccessCard
          tone="green"
          title="Primary caregiver"
          items={[
            "Verify alerts",
            "Update emergency contacts",
            "Restart node",
            "Run self-test",
            "Pause normal monitoring",
          ]}
        />
        <AccessCard
          tone="blue"
          title="Secondary caregiver"
          items={["Verify alerts", "Request callback", "Add context", "View node status"]}
        />
        <AccessCard
          tone="grey"
          title="Neighbour / helper"
          items={["Acknowledge check requests", "Add context only"]}
        />

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-red-700">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Restricted for all caregivers</span>
            </div>
            <ul className="text-xs text-red-800 space-y-1 pl-6 list-disc">
              <li>Cannot disable critical alerts</li>
              <li>Cannot turn off emergency escalation</li>
              <li>Cannot delete audit logs</li>
              <li>Cannot override emergency operator review for strong-signal or no-response alerts</li>
            </ul>
          </CardContent>
        </Card>
      </ScreenScroll>
      <BottomCTA label="Enter dashboard" onClick={() => go("home")} />
    </>
  );
}

function AccessCard({
  tone,
  title,
  items,
}: {
  tone: "green" | "blue" | "grey";
  title: string;
  items: string[];
}) {
  const ring = {
    green: "border-emerald-200",
    blue: "border-blue-200",
    grey: "border-slate-200",
  }[tone];
  return (
    <Card className={`${ring} bg-white`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-slate-900">{title}</div>
          <ToneBadge tone={tone}>Role</ToneBadge>
        </div>
        <ul className="text-sm text-slate-700 space-y-1">
          {items.map((i) => (
            <li key={i} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {i}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
