import type { ReactNode } from "react";
import {
  useState,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  QrCode,
  KeyRound,
  UserPlus,
  MapPin,
  Card,
  CardContent,
  Input,
  Label,
  type ScreenId,
  TopBar,
  ScreenScroll,
  BottomCTA,
} from "../shared";

type LinkMethodId = "qr" | "code" | "request";

const DEMO_CODE = "ECHO-TSL-2026";

export function LinkScreen({ go }: { go: (s: ScreenId) => void }) {
  const [method, setMethod] = useState<LinkMethodId>("qr");
  const [inviteCode, setInviteCode] = useState(DEMO_CODE);
  const [residentFound, setResidentFound] = useState(true);

  const selectMethod = (nextMethod: LinkMethodId) => {
    setMethod(nextMethod);
    setResidentFound(true);
    if (nextMethod === "code") setInviteCode(DEMO_CODE);
  };

  return (
    <>
      <TopBar title="Community responder access" onBack={() => go("notifications")} />

      <ScreenScroll>
        <Card className="border-0 bg-white">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-semibold text-slate-900">Link a resident invite</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  Scan a QR, enter an invitation code, or request access from the primary caregiver.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-2">
          <LinkMethod
            active={method === "qr"}
            icon={<QrCode className="w-5 h-5" />}
            title="Scan resident QR"
            sub="Use resident invitation card"
            onClick={() => selectMethod("qr")}
          />

          <LinkMethod
            active={method === "code"}
            icon={<KeyRound className="w-5 h-5" />}
            title="Enter invite code"
            sub={DEMO_CODE}
            onClick={() => selectMethod("code")}
          />

          <LinkMethod
            active={method === "request"}
            icon={<UserPlus className="w-5 h-5" />}
            title="Request access"
            sub="Ask primary caregiver to approve"
            onClick={() => selectMethod("request")}
          />
        </div>

        {method === "qr" && (
          <Card className="border-indigo-100 bg-indigo-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="grid h-20 w-20 shrink-0 grid-cols-3 gap-1 rounded-2xl bg-white p-3 text-indigo-600">
                  {Array.from({ length: 9 }).map((_, index) => (
                    <span
                      key={index}
                      className={index % 2 === 0 ? "rounded-sm bg-indigo-600" : "rounded-sm bg-indigo-100"}
                    />
                  ))}
                </div>
                <div>
                  <div className="text-sm font-semibold text-indigo-950">Demo QR scanned</div>
                  <p className="mt-1 text-xs leading-relaxed text-indigo-800">
                    Invitation code {DEMO_CODE} matched a resident record.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {method === "code" && (
          <Card className="border-slate-100 bg-white">
            <CardContent className="p-4">
              <Label className="text-xs text-slate-500">Invitation code</Label>
              <Input
                className="mt-2"
                value={inviteCode}
                onChange={(event) => {
                  setInviteCode(event.target.value);
                  setResidentFound(event.target.value.trim().length > 0);
                }}
                placeholder={DEMO_CODE}
              />
              <p className="mt-2 text-[11px] text-slate-400">
                Demo code: {DEMO_CODE}
              </p>
            </CardContent>
          </Card>
        )}

        {method === "request" && (
          <Card className="border-blue-100 bg-blue-50">
            <CardContent className="p-4">
              <div className="text-sm font-semibold text-blue-950">Access request prepared</div>
              <p className="mt-1 text-xs leading-relaxed text-blue-800">
                A request will be sent to the primary caregiver. Demo approval is pre-filled for this prototype.
              </p>
            </CardContent>
          </Card>
        )}

        {residentFound && <ResidentMatch method={method} />}
      </ScreenScroll>

      <BottomCTA
        label="Continue to consent"
        onClick={() => go("consent")}
        disabled={!residentFound}
      />
    </>
  );
}

function ResidentMatch({ method }: { method: LinkMethodId }) {
  const note = {
    qr: "Matched from scanned QR invitation",
    code: "Matched from invitation code",
    request: "Primary caregiver approval required",
  }[method];

  return (
    <Card className="border-emerald-100 bg-white">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Resident found
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100">
              <span className="text-lg font-bold text-indigo-600">TS</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-slate-900">Mdm Tan Siew Lan</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" />
              Blk 302 Ang Mo Kio Ave 3
            </p>
            <p className="mt-0.5 text-xs text-slate-400">{note}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LinkMethod({
  active,
  icon,
  title,
  sub,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border p-3 text-left ${
        active ? "border-indigo-100 bg-indigo-50" : "border-slate-100 bg-white"
      }`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? "bg-white text-indigo-600" : "bg-slate-50 text-slate-600"}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="mt-0.5 truncate text-xs text-slate-500">{sub}</div>
      </div>
      {active ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
      ) : (
        <ChevronRight className="h-5 w-5 text-slate-400" />
      )}
    </button>
  );
}
