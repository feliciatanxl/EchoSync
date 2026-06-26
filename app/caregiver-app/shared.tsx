import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
export { useEffect, useState };
export type { ReactNode } from "react";
import {
  AlertTriangle,
  ShieldCheck,
  Lock,
  Check,
  CheckCircle2,
  Pause,
  Bell,
  Clock,
  Home,
  ClipboardList,
  Cpu,
  User,
  Volume2,
  ChevronRight,
  ChevronLeft,
  MapPin,
  FileText,
  Phone,
  Users,
  Wifi,
} from "lucide-react";
export {
  Shield,
  ShieldCheck,
  Lock,
  Check,
  CheckCircle2,
  AlertTriangle,
  Phone,
  PhoneCall,
  Activity,
  Wifi,
  Battery,
  RotateCw,
  Stethoscope,
  Pause,
  Bell,
  Home,
  ClipboardList,
  Cpu,
  User,
  ChevronRight,
  ChevronLeft,
  QrCode,
  KeyRound,
  UserPlus,
  Volume2,
  DoorClosed,
  Footprints,
  Clock,
  MapPin,
  FileText,
  LogOut,
  Fingerprint,
  Users
} from "lucide-react";


export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
};

export function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  const variantClass = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent shadow-sm shadow-indigo-200/70",
    outline: "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 border border-transparent",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-transparent",
    destructive: "bg-red-600 text-white hover:bg-red-700 border border-transparent",
  }[variant];
  const sizeClass = {
    default: "h-10 px-4 py-2",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-5",
    icon: "h-10 w-10 p-0",
  }[size];

  return (
    <button
      {...props}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        variantClass,
        sizeClass,
        className,
      )}
    />
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx("rounded-2xl border border-slate-100 bg-white shadow-sm shadow-slate-200/50", className)} />;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={className} />;
}

export function Checkbox({
  checked,
  onCheckedChange,
  className,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={cx(
        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-300 bg-white text-white",
        checked && "!border-slate-900 !bg-slate-900",
        className,
      )}
      {...props}
    >
      {checked ? <Check className="h-4 w-4 stroke-[3]" /> : null}
    </button>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx("h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900", className)}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cx("min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-900", className)}
    />
  );
}

export function Separator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx("h-px w-full bg-slate-200", className)} />;
}

export function Label({ className, ...props }: HTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className={className} />;
}

const RadioContext = createContext<{ value: string; setValue: (value: string) => void } | null>(null);

export function RadioGroup({
  value,
  onValueChange,
  className,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <RadioContext.Provider value={{ value, setValue: onValueChange }}>
      <div role="radiogroup" className={className}>
        {children}
      </div>
    </RadioContext.Provider>
  );
}

export function RadioGroupItem({ value, id }: { value: string; id?: string }) {
  const ctx = useContext(RadioContext);
  const selected = ctx?.value === value;
  return (
    <button
      id={id}
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => ctx?.setValue(value)}
      className={cx("h-5 w-5 rounded-full border border-slate-400 bg-white p-1", selected && "border-slate-900")}
    >
      <span className={cx("block h-full w-full rounded-full", selected && "bg-slate-900")} />
    </button>
  );
}

const AlertDialogContext = createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null);

export function AlertDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <AlertDialogContext.Provider value={{ open, setOpen }}>{children}</AlertDialogContext.Provider>;
}

export function AlertDialogTrigger({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = useContext(AlertDialogContext);
  return <button type="button" {...props} onClick={() => ctx?.setOpen(true)} className={className} />;
}

export function AlertDialogContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const ctx = useContext(AlertDialogContext);
  if (!ctx?.open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-5">
      <div {...props} className={cx("w-full max-w-sm rounded-2xl bg-white p-5 text-slate-900 shadow-2xl", className)}>
        {children}
      </div>
    </div>
  );
}

export function AlertDialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx("space-y-2", className)} />;
}

export function AlertDialogTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 {...props} className={cx("text-lg font-semibold text-slate-900", className)} />;
}

export function AlertDialogDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={cx("text-sm text-slate-600", className)} />;
}

export function AlertDialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cx("mt-5 flex justify-end gap-2", className)} />;
}

export function AlertDialogCancel({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = useContext(AlertDialogContext);
  return (
    <Button
      {...props}
      variant="outline"
      onClick={(event) => {
        props.onClick?.(event);
        ctx?.setOpen(false);
      }}
      className={className}
    />
  );
}

export function AlertDialogAction({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = useContext(AlertDialogContext);
  return (
    <Button
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        ctx?.setOpen(false);
      }}
      className={className}
    />
  );
}

/* =========================================================================
   EchoSync Caregiver — Mobile UI prototype (single-file)
   ========================================================================= */

export type ScreenId =
  | "welcome"
  | "role"
  | "link"
  | "consent"
  | "access"
  | "home"
  | "alert"
  | "verify"
  | "context"
  | "outcome"
  | "contextOutcome"
  | "notifications"
  | "accessPending"
  | "manageAccess"
  | "faq"
  | "consentStatus"
  | "selftest"
  | "pauseConfirm"
  | "node"
  | "pause"
  | "history"
  | "contacts"
  | "privacy"
  | "profile";

export type Tab = "home" | "alerts" | "node" | "history" | "profile";

export type Role = "primary" | "secondary" | "family" | "neighbour";

export const ROLE_LABEL: Record<Role, string> = {
  primary: "Primary caregiver",
  secondary: "Secondary caregiver",
  family: "Family member",
  neighbour: "Neighbour / helper",
};

export type Perm = "yes" | "limited" | "no";

export function can(role: Role, action: "verify" | "pause" | "restart" | "contacts" | "selftest"): boolean {
  if (role === "primary") return true;
  if (role === "secondary") return action === "verify";
  if (role === "family" || role === "neighbour") return false;
  return false;
}

export const ROLE_PERMS: Record<Role, { label: string; value: Perm }[]> = {
  primary: [
    { label: "Verify low/medium-risk alerts", value: "yes" },
    { label: "Update emergency contacts", value: "yes" },
    { label: "Pause normal monitoring", value: "yes" },
    { label: "Restart node / run self-test", value: "yes" },
    { label: "Disable critical alerts", value: "no" },
    { label: "Override emergency operator escalation", value: "no" },
  ],
  secondary: [
    { label: "Verify low/medium-risk alerts", value: "yes" },
    { label: "Update emergency contacts", value: "limited" },
    { label: "Pause normal monitoring", value: "no" },
    { label: "Restart node / run self-test", value: "no" },
    { label: "Disable critical alerts", value: "no" },
    { label: "Override emergency operator escalation", value: "no" },
  ],
  family: [
    { label: "View status and history", value: "yes" },
    { label: "Verify alerts", value: "no" },
    { label: "Update emergency contacts", value: "no" },
    { label: "Control node", value: "no" },
    { label: "Disable critical alerts", value: "no" },
  ],
  neighbour: [
    { label: "Acknowledge check requests", value: "yes" },
    { label: "Add context to alerts", value: "limited" },
    { label: "Verify alerts", value: "limited" },
    { label: "Update emergency contacts", value: "no" },
    { label: "Control node", value: "no" },
  ],
};

export const RESIDENT = {
  name: "Mdm Tan Siew Lan",
  address: "Blk 302 Ang Mo Kio Ave 3, #08-112",
  node: "Living Room Ceiling Hub",
};

/* ---------- Small primitives ---------- */



export function AppFrame({
  children,
  largeText,
}: {
  children: ReactNode;
  largeText?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[9999] w-full overflow-y-auto bg-slate-200 text-slate-900">
      {largeText && (
        <style>{`
          .caregiver-large-text {
            font-size: 17px;
            line-height: 1.65;
          }

          .caregiver-large-text .text-\\[10px\\],
          .caregiver-large-text .text-\\[11px\\] {
            font-size: 0.75rem !important;
            line-height: 1.1rem !important;
          }

          .caregiver-large-text .text-xs {
            font-size: 0.875rem !important;
            line-height: 1.3rem !important;
          }

          .caregiver-large-text .text-sm {
            font-size: 1rem !important;
            line-height: 1.5rem !important;
          }

          .caregiver-large-text .text-base {
            font-size: 1.125rem !important;
            line-height: 1.6rem !important;
          }

          .caregiver-large-text .text-lg {
            font-size: 1.25rem !important;
            line-height: 1.75rem !important;
          }

          .caregiver-large-text .text-xl {
            font-size: 1.375rem !important;
            line-height: 1.9rem !important;
          }

          .caregiver-large-text .text-2xl {
            font-size: 1.625rem !important;
            line-height: 2.1rem !important;
          }

          .caregiver-large-text .text-3xl {
            font-size: 1.875rem !important;
            line-height: 2.35rem !important;
          }
        `}</style>
      )}
      <div className={`mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-slate-50 ${largeText ? "caregiver-large-text" : ""}`}>
        {children}
      </div>
    </div>
  );
}


export function TopBar({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
}) {
  const icon = getTopBarIcon(title);

  return (
    <div className="flex items-center justify-between px-4 pt-10 pb-3 bg-white border-b border-slate-200">
      <div className="w-9">
        {onBack && (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
        )}
      </div>
      <div className="flex min-w-0 items-center justify-center gap-2 text-slate-900">
        {icon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            {icon}
          </span>
        )}
        <span className="truncate font-medium">{title}</span>
      </div>
      <div className="w-9 flex justify-end">{right}</div>
    </div>
  );
}

function getTopBarIcon(title: string) {
  const className = "h-4 w-4";

  if (/alert|verify/i.test(title)) return <AlertTriangle className={className} />;
  if (/device|node|self-test/i.test(title)) return <Cpu className={className} />;
  if (/contact/i.test(title)) return <Phone className={className} />;
  if (/privacy|consent|security|access/i.test(title)) return <ShieldCheck className={className} />;
  if (/history|audit|submitted|result/i.test(title)) return <FileText className={className} />;
  if (/notification/i.test(title)) return <Bell className={className} />;
  if (/pause/i.test(title)) return <Pause className={className} />;
  if (/role|profile/i.test(title)) return <User className={className} />;
  if (/context|help|faq/i.test(title)) return <ClipboardList className={className} />;
  if (/community|responder|link/i.test(title)) return <Users className={className} />;

  return null;
}

export function ScreenScroll({ children }: { children: ReactNode }) {
  return <div className="flex-1 overflow-y-auto px-5 pb-24 pt-5 space-y-5">{children}</div>;
}

export function StatusDot({ tone }: { tone: "green" | "amber" | "red" | "grey" }) {
  const map = {
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    grey: "bg-slate-400",
  };
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${map[tone]}`} />;
}

export function ToneBadge({
  tone,
  children,
}: {
  tone: "green" | "amber" | "red" | "grey" | "blue";
  children: ReactNode;
}) {
  const map = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
    grey: "bg-slate-100 text-slate-600 border-slate-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${map[tone]}`}
    >
      {children}
    </span>
  );
}

export function ResidentCard({ peekable = false }: { peekable?: boolean }) {
  const [isHolding, setIsHolding] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPeek = () => {
    if (!peekable) return;

    setIsHolding(true);
    holdTimer.current = setTimeout(() => {
      setIsPeeking(true);
    }, 320);
  };

  const stopPeek = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }

    setIsHolding(false);
    setIsPeeking(false);
  };

  return (
    <Card
      className={cx(
        "border-0 transition-transform",
        peekable && "select-none active:scale-[0.99]",
        isHolding && "ring-2 ring-indigo-100"
      )}
      role={peekable ? "button" : undefined}
      tabIndex={peekable ? 0 : undefined}
      aria-label={peekable ? "Hold to peek senior status" : undefined}
      onPointerDown={startPeek}
      onPointerUp={stopPeek}
      onPointerCancel={stopPeek}
      onPointerLeave={stopPeek}
      onKeyDown={(event) => {
        if (!peekable) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsPeeking(true);
        }
      }}
      onKeyUp={(event) => {
        if (!peekable) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsPeeking(false);
        }
      }}
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
              <span className="text-lg font-bold text-indigo-600">TS</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white bg-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-slate-900">{RESIDENT.name}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {RESIDENT.address}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{RESIDENT.node}</div>
          </div>
        </div>

        {peekable ? (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-40" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {isPeeking ? "Senior status peek" : "Hold to peek senior status"}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isPeeking ? "Release to hide details" : "Privacy-friendly quick check"}
                  </p>
                </div>
              </div>
              <span
                className={cx(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                  isPeeking
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-indigo-50 text-indigo-700"
                )}
              >
                {isPeeking ? "Visible" : "Hold"}
              </span>
            </div>

            <div
              className={cx(
                "grid overflow-hidden transition-all duration-200",
                isPeeking ? "mt-4 max-h-40 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="grid grid-cols-2 gap-2">
                <PeekStat icon={<CheckCircle2 className="h-4 w-4" />} label="Status" value="All normal" />
                <PeekStat icon={<Clock className="h-4 w-4" />} label="Last activity" value="9:42 AM" />
                <PeekStat icon={<Wifi className="h-4 w-4" />} label="Node" value="Online" />
                <PeekStat icon={<Volume2 className="h-4 w-4" />} label="Voice check-in" value="9:30 AM" />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-2.5 border-t border-slate-100 pt-4">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-40" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-700">All normal, monitoring quietly</p>
              <p className="text-xs text-slate-400 mt-0.5">Last activity 9:42 AM &middot; Node online</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PeekStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
        <span className="text-indigo-500">{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

/* ---------- Screens ---------- */

export function PauseBanner({
  pause,
  onResume,
}: {
  pause: { reasonLabel: string; resumeAt: string };
  onResume: () => void;
}) {
  return (
    <Card className="border-amber-300 bg-amber-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900">
            <Pause className="w-4 h-4" />
            <span className="text-sm">Normal monitoring paused</span>
          </div>
          <button
            onClick={onResume}
            className="text-xs text-amber-900 underline"
          >
            Resume now
          </button>
        </div>
        <div className="text-xs text-amber-800 mt-1">
          Reason: {pause.reasonLabel} · Resumes at {pause.resumeAt}
        </div>
        <div className="text-[11px] text-amber-700 mt-1">
          Critical alerts remain active.
        </div>
      </CardContent>
    </Card>
  );
}

export function Row({
  label,
  value,
  valueTone,
}: {
  label: string;
  value: string;
  valueTone?: "green" | "red";
}) {
  const toneClass =
    valueTone === "green"
      ? "text-emerald-700"
      : valueTone === "red"
        ? "text-red-700"
        : "text-slate-900";

  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={toneClass}>{value}</span>
    </div>
  );
}

export function PermRow({
  text,
  allowed,
  value,
}: {
  text: string;
  allowed?: boolean;
  value?: Perm;
}) {
  const v: Perm = value ?? (allowed === false ? "no" : "yes");
  const meta = {
    yes: { icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />, label: "Yes", tone: "text-emerald-700" },
    limited: { icon: <ShieldCheck className="w-4 h-4 text-amber-600" />, label: "Limited", tone: "text-amber-700" },
    no: { icon: <Lock className="w-4 h-4 text-slate-400" />, label: "No", tone: "text-slate-500" },
  }[v];
  return (
    <div className="flex items-center gap-2 text-sm">
      {meta.icon}
      <span className={v === "no" ? "text-slate-500 flex-1" : "text-slate-800 flex-1"}>{text}</span>
      <span className={`text-xs ${meta.tone}`}>{meta.label}</span>
    </div>
  );
}

export function ProfileLink({
  icon,
  label,
  sub,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  sub?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-xl bg-white border border-slate-200 p-4 text-left hover:border-slate-300"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </span>
      <div className="flex-1">
        <div className="text-sm text-slate-800">{label}</div>
        {sub && <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>}
      </div>
      <ChevronRight className="w-5 h-5 text-slate-400" />
    </button>
  );
}

export function BottomCTA({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  const icon = getCtaIcon(label);

  return (
    <div className="border-t border-slate-200 bg-white p-4">
      <Button
        className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white"
        onClick={onClick}
        disabled={disabled}
      >
        {icon}
        {label}
      </Button>
    </div>
  );
}

function getCtaIcon(label: string) {
  const className = "h-4 w-4";

  if (/dashboard|home/i.test(label)) return <Home className={className} />;
  if (/profile/i.test(label)) return <User className={className} />;
  if (/send|submit/i.test(label)) return <CheckCircle2 className={className} />;
  if (/continue|enter|review/i.test(label)) return <ChevronRight className={className} />;
  if (/update|save/i.test(label)) return <Check className={className} />;
  if (/done/i.test(label)) return <CheckCircle2 className={className} />;

  return <ChevronRight className={className} />;
}

/* ---------- Bottom nav ---------- */

export function BottomNav({
  tab,
  setTab,
  go,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  go: (s: ScreenId) => void;
}) {
  const items: { id: Tab; label: string; icon: ReactNode; screen: ScreenId }[] = [
    { id: "home", label: "Home", icon: <Home className="w-5 h-5" />, screen: "home" },
    { id: "alerts", label: "Alerts", icon: <Bell className="w-5 h-5" />, screen: "alert" },
    { id: "node", label: "Node", icon: <Cpu className="w-5 h-5" />, screen: "node" },
    {
      id: "history",
      label: "History",
      icon: <ClipboardList className="w-5 h-5" />,
      screen: "history",
    },
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" />, screen: "profile" },
  ];
  return (
    <>
      <div className="fixed bottom-0 left-1/2 z-[10000] w-full max-w-[430px] -translate-x-1/2 border-t border-slate-100 bg-white/80 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
        <div className="grid grid-cols-5">
        {items.map((it) => {
          const active = tab === it.id;
          return (
            <button
              key={it.id}
              onClick={() => {
                setTab(it.id);
                go(it.screen);
              }}
              className={`group relative flex flex-col items-center gap-1 px-2 py-2.5 text-[10px] font-medium transition-colors ${
                active ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {active && <span className="absolute -top-0.5 h-0.5 w-8 rounded-full bg-indigo-600" />}
              {it.icon}
              <span>{it.label}</span>
            </button>
          );
        })}
        </div>
      </div>
    </>
  );
}

/* ---------- Root ---------- */
