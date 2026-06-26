import {
  Phone,
  Card,
  CardContent,
  type ScreenId,
  TopBar,
  ScreenScroll
} from "../shared";

export function FaqScreen({ go }: { go: (s: ScreenId) => void }) {
  const qs = [
    {
      q: "What is EchoSync?",
      a: "EchoSync is a privacy-first in-home device that helps detect possible emergencies for seniors living alone, then notifies a caregiver to verify before involving emergency services.",
    },
    {
      q: "When should I call 995?",
      a: "Call 995 immediately for life-threatening emergencies. EchoSync does not replace emergency calling.",
    },
    {
      q: "Can caregivers turn off alerts?",
      a: "No. Caregivers can verify low/medium-risk alerts and add context, but cannot disable critical alerts or stop emergency operator review.",
    },
    {
      q: "Is audio or video recorded?",
      a: "No raw audio or video is stored. The device processes signals locally and only shares alert summaries.",
    },
  ];
  return (
    <>
      <TopBar title="Help & FAQ" onBack={() => go("profile")} />
      <ScreenScroll>
        {qs.map((item) => (
          <Card key={item.q} className="border-slate-200">
            <CardContent className="p-4">
              <div className="text-slate-900 text-sm">{item.q}</div>
              <div className="text-xs text-slate-600 mt-1">{item.a}</div>
            </CardContent>
          </Card>
        ))}
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-3 flex gap-2 items-start">
            <Phone className="w-4 h-4 text-red-700 mt-0.5 shrink-0" />
            <p className="text-xs text-red-800">
              For immediate life-threatening emergencies, call <span className="text-red-900">995</span>.
            </p>
          </CardContent>
        </Card>
      </ScreenScroll>
    </>
  );
}
