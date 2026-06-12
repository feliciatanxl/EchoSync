// @ts-nocheck
const STORAGE_KEY = "myresponder_feedback_reports";

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
  },
};
