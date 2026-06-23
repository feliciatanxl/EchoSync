"use client";

import { useEffect, useState } from "react";
import {
  AppFrame,
  BottomNav,
  type Role,
  type ScreenId,
  type Tab,
} from "./shared";

import { WelcomeScreen } from "./screens/WelcomeScreen";
import { NotificationsScreen } from "./screens/NotificationsScreen";
import { AccessPendingScreen } from "./screens/AccessPendingScreen";
import { ManageAccessScreen } from "./screens/ManageAccessScreen";
import { FaqScreen } from "./screens/FaqScreen";
import { ConsentStatusScreen } from "./screens/ConsentStatusScreen";
import { RoleScreen } from "./screens/RoleScreen";
import { LinkScreen } from "./screens/LinkScreen";
import { ConsentScreen } from "./screens/ConsentScreen";
import { AccessScreen } from "./screens/AccessScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { AlertScreen } from "./screens/AlertScreen";
import { VerifyScreen } from "./screens/VerifyScreen";
import { ContextScreen } from "./screens/ContextScreen";
import { OutcomeScreen } from "./screens/OutcomeScreen";
import { ContextOutcomeScreen } from "./screens/ContextOutcomeScreen";
import { NodeScreen } from "./screens/NodeScreen";
import { SelfTestScreen } from "./screens/SelfTestScreen";
import { PauseScreen } from "./screens/PauseScreen";
import { PauseConfirmScreen } from "./screens/PauseConfirmScreen";
import { HistoryScreen } from "./screens/HistoryScreen";
import { ContactsScreen } from "./screens/ContactsScreen";
import { PrivacyScreen } from "./screens/PrivacyScreen";
import { ProfileScreen } from "./screens/ProfileScreen";

const TAB_SCREENS: ScreenId[] = [
  "home",
  "alert",
  "verify",
  "context",
  "outcome",
  "contextOutcome",
  "node",
  "selftest",
  "pause",
  "pauseConfirm",
  "history",
  "contacts",
  "privacy",
  "profile",
  "manageAccess",
  "accessPending",
  "faq",
  "consentStatus",
];

export type CaregiverLiveAlert = {
  nodeId?: string;
  resident?: string;
  location?: string;
  eventType?: string;
  riskLevel?: string;
  confidence?: number;
  reason?: string;
  sensorData?: unknown;
  voiceCheckIn?: unknown;
  aiSummary?: string;
  source?: string;
  timestamp?: string;
  receivedAt?: string;
};

export default function CaregiverApp() {
  const [screen, setScreen] = useState<ScreenId>("welcome");
  const [tab, setTab] = useState<Tab>("home");

  // Caregiver access role
  const [role, setRole] = useState<Role>("primary");

  // Controls what the role selection screen shows:
  // caregiver = Primary / Secondary / Family
  // neighbour = Neighbour / helper only
  const [roleMode, setRoleMode] = useState<"caregiver" | "neighbour">(
    "caregiver"
  );

  const [risk, setRisk] = useState<"medium" | "high">("medium");
  const [nodeOnline, setNodeOnline] = useState(true);
  const [pauseDuration, setPauseDuration] = useState("30");
  const [pauseReason, setPauseReason] = useState("family");
  const [pause, setPause] = useState<{
    reasonLabel: string;
    resumeAt: string;
  } | null>(null);
  const [contactsSaved, setContactsSaved] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [sensorMonitoringEnabled, setSensorMonitoringEnabled] = useState(true);
  const [language, setLanguage] = useState<"en" | "zh" | "ms" | "ta">("en");
  const [liveAlert, setLiveAlert] = useState<CaregiverLiveAlert | null>(null);

  const updateLanguage = (nextLanguage: "en" | "zh" | "ms" | "ta") => {
    setLanguage(nextLanguage);

    void fetch("/api/node-control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preferredLanguage: nextLanguage,
      }),
    });
  };

  const updateSensorMonitoring = async (enabled: boolean) => {
    setSensorMonitoringEnabled(enabled);

    await fetch("/api/node-control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sensorMonitoringEnabled: enabled,
        reason: enabled ? null : "Resident away from home",
        durationMinutes: enabled ? null : 1440,
      }),
    });
  };

  useEffect(() => {
    let active = true;

    const loadAlerts = async () => {
      try {
        const response = await fetch("/api/caregiver-alert", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const payload = (await response.json()) as {
          latest?: CaregiverLiveAlert | null;
          alerts?: CaregiverLiveAlert[];
        };

        const alert = payload.latest || (payload.alerts || [])[0] || null;

        if (active) {
          setLiveAlert(alert);
        }
      } catch {
        // The hardcoded caregiver case remains the fallback.
      }
    };

    void loadAlerts();

    const timer = setInterval(loadAlerts, 5000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const loadNodeControl = async () => {
      try {
        const response = await fetch("/api/node-control", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();

        if (typeof data.sensorMonitoringEnabled === "boolean") {
          setSensorMonitoringEnabled(data.sensorMonitoringEnabled);
        }

        if (
          data.preferredLanguage === "en" ||
          data.preferredLanguage === "zh" ||
          data.preferredLanguage === "ms" ||
          data.preferredLanguage === "ta"
        ) {
          setLanguage(data.preferredLanguage);
        }
      } catch {
        // Keep default caregiver app state.
      }
    };

    void loadNodeControl();
  }, []);

  const updatePause = async (paused: boolean, reason?: string) => {
    try {
      await fetch("/api/node-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pauseLowRiskMonitoring: paused,
          reason: paused ? reason : null,
          durationMinutes: paused
            ? Number(pauseDuration === "custom" ? 30 : pauseDuration)
            : null,
        }),
      });
    } finally {
      if (!paused) setPause(null);
    }
  };

  const screenToTab: Partial<Record<ScreenId, Tab>> = {
    home: "home",
    alert: "alerts",
    verify: "alerts",
    context: "alerts",
    outcome: "alerts",
    contextOutcome: "alerts",
    node: "node",
    selftest: "node",
    pause: "node",
    pauseConfirm: "node",
    history: "history",
    profile: "profile",
    contacts: "profile",
    privacy: "profile",
    manageAccess: "profile",
    accessPending: "profile",
    faq: "profile",
    consentStatus: "profile",
  };

  const go = (s: ScreenId) => {
    setScreen(s);
    const t = screenToTab[s];
    if (t) setTab(t);
  };

  const showNav = TAB_SCREENS.includes(screen);

  return (
    <AppFrame largeText={largeText}>
      {screen === "welcome" && (
        <WelcomeScreen
          startCaregiverLogin={() => {
            setRole("primary");
            go("notifications");
          }}
          startNeighbourLogin={() => {
            setRole("neighbour");
            go("notifications");
          }}
        />
      )}

      {screen === "notifications" && (
        <NotificationsScreen go={go} role={role} />
      )}
      {screen === "accessPending" && <AccessPendingScreen go={go} />}
      {screen === "manageAccess" && <ManageAccessScreen go={go} />}
      {screen === "faq" && <FaqScreen go={go} />}
      {screen === "consentStatus" && <ConsentStatusScreen go={go} />}

      {screen === "role" && (
        <RoleScreen
          go={go}
          role={role}
          setRole={setRole}
        />
      )}

      {screen === "link" && <LinkScreen go={go} />}
      {screen === "consent" && <ConsentScreen go={go} />}
      {screen === "access" && <AccessScreen go={go} />}

      {screen === "home" && (
        <HomeScreen
          go={go}
          role={role}
          pause={pause}
          clearPause={() => {
            void updatePause(false);
          }}
          contactsSaved={contactsSaved}
          clearContactsSaved={() => setContactsSaved(false)}
          liveAlert={liveAlert}
        />
      )}

      {screen === "alert" && (
        <AlertScreen
          go={go}
          risk={risk}
          setRisk={setRisk}
          role={role}
          liveAlert={liveAlert}
        />
      )}

      {screen === "verify" && <VerifyScreen go={go} />}
      {screen === "context" && <ContextScreen go={go} />}
      {screen === "outcome" && <OutcomeScreen go={go} role={role} />}
      {screen === "contextOutcome" && (
        <ContextOutcomeScreen go={go} role={role} />
      )}

      {screen === "node" && (
        <NodeScreen
          go={go}
          role={role}
          online={nodeOnline}
          setOnline={setNodeOnline}
          pause={pause}
          clearPause={() => {
            void updatePause(false);
          }}
          sensorMonitoringEnabled={sensorMonitoringEnabled}
          setSensorMonitoringEnabled={(enabled) => {
            void updateSensorMonitoring(enabled);
          }}
        />
      )}

      {screen === "selftest" && <SelfTestScreen go={go} />}

      {screen === "pause" && (
        <PauseScreen
          go={go}
          duration={pauseDuration}
          setDuration={setPauseDuration}
          reason={pauseReason}
          setReason={setPauseReason}
        />
      )}

      {screen === "pauseConfirm" && (
        <PauseConfirmScreen
          go={go}
          duration={pauseDuration}
          reason={pauseReason}
          onConfirm={(reasonLabel, resumeAt) => {
            setPause({ reasonLabel, resumeAt });
            void updatePause(true, reasonLabel);
          }}
        />
      )}

      {screen === "history" && <HistoryScreen />}

      {screen === "contacts" && (
        <ContactsScreen
          go={go}
          role={role}
          onSave={() => setContactsSaved(true)}
        />
      )}

      {screen === "privacy" && <PrivacyScreen go={go} />}

      {screen === "profile" && (
        <ProfileScreen
          go={go}
          role={role}
          largeText={largeText}
          setLargeText={setLargeText}
          language={language}
          setLanguage={updateLanguage}
        />
      )}

      {showNav && <BottomNav tab={tab} setTab={setTab} go={go} />}
    </AppFrame>
  );
}