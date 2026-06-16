import {
  CheckCircle2,
  Card,
  CardContent,
  type ScreenId,
  TopBar,
  ScreenScroll,
  Row,
  BottomCTA
} from "../shared";

export function SelfTestScreen({ go }: { go: (s: ScreenId) => void }) {
  const rows = [
    ["Microphone sensor", "OK"],
    ["Thermal sensor", "OK"],
    ["Motion sensor", "OK"],
    ["Door / contact sensor", "OK"],
    ["Wi-Fi", "Good"],
    ["Power", "Connected"],
    ["Last device check-in", "12 seconds ago"],
    ["Next auto-check", "12:00 PM"],
  ];
  return (
    <>
      <TopBar title="Self-test result" onBack={() => go("node")} />
      <ScreenScroll>
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-5 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <div className="text-emerald-900">Self-test complete</div>
            <div className="text-xs text-emerald-800 mt-1">All sensors are responding normally.</div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 space-y-2 text-sm">
            {rows.map(([k, v]) => (
              <Row key={k} label={k} value={v} valueTone={v === "OK" || v === "Good" || v === "Connected" ? "green" : undefined} />
            ))}
          </CardContent>
        </Card>
      </ScreenScroll>
      <BottomCTA label="Done" onClick={() => go("node")} />
    </>
  );
}
