// @ts-nocheck
const STORAGE_KEY = "myresponder_feedback_reports";
const ALERTS_STORAGE_KEY = "myresponder_emergency_alerts";

const getReports = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveReports = (reports) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
};

const getAlerts = () => {
  try {
    return JSON.parse(localStorage.getItem(ALERTS_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveAlerts = (alerts) => {
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
};

const mockUser = {
  id: "local-user",
  email: "demo@local.test",
  full_name: "Demo User",
  role: "user",
};

export const base44 = {
  auth: {
    async me() {
      return mockUser;
    },
    async loginViaEmailPassword(email) {
      localStorage.setItem("local_auth_email", email);
      return { access_token: "local-demo-token", user: { ...mockUser, email } };
    },
    async register({ email }) {
      localStorage.setItem("local_auth_email", email);
      return { success: true };
    },
    async verifyOtp({ email }) {
      localStorage.setItem("local_auth_email", email);
      return { access_token: "local-demo-token" };
    },
    async resendOtp() {
      return { success: true };
    },
    async resetPasswordRequest() {
      return { success: true };
    },
    async resetPassword() {
      return { success: true };
    },
    setToken(token) {
      localStorage.setItem("local_auth_token", token);
    },
    logout() {
      localStorage.removeItem("local_auth_token");
      localStorage.removeItem("local_auth_email");
    },
    loginWithProvider() {
      window.location.href = "/home";
    },
    redirectToLogin() {
      window.location.href = "/home";
    },
  },
  entities: {
    FeedbackReport: {
      async create(data) {
        const reports = getReports();
        const report = {
          id: crypto.randomUUID?.() || String(Date.now()),
          created_at: new Date().toISOString(),
          ...data,
        };
        reports.push(report);
        saveReports(reports);
        console.log("Saved feedback report locally:", report);
        return report;
      },
      async list() {
        return getReports();
      },
    },
    EmergencyAlert: {
      async create(data) {
        const alerts = getAlerts();
        const alert = {
          id: crypto.randomUUID?.() || String(Date.now()),
          created_at: new Date().toISOString(),
          ...data,
        };
        alerts.unshift(alert);
        saveAlerts(alerts);
        console.log("Saved emergency alert locally:", alert);
        return alert;
      },
      async list() {
        return getAlerts();
      },
      async update(id, data) {
        const alerts = getAlerts();
        const updatedAlerts = alerts.map((alert) =>
          alert.id === id ? { ...alert, ...data, updated_at: new Date().toISOString() } : alert,
        );
        saveAlerts(updatedAlerts);
        return updatedAlerts.find((alert) => alert.id === id) || null;
      },
    },
  },
};
