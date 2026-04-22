# 🛡️ EchoSync: AI-Powered Community Wellbeing & Safety

EchoSync is a high-fidelity B2G (Business-to-Government) healthcare ecosystem designed to shift care from reactive response to proactive protection. It leverages secure IoT sensors, edge-computing, and cloud-based AI to protect Singapore's seniors while maintaining 100% PDPA compliance and a zero-stigma experience.

---

## 🏗️ Project Architecture

The project is structured as a dual-app architecture to separate the public-facing marketing presence from the secure enterprise command center.

1.  **Marketing Website (`/website`)**: Built with Next.js, focused on procurement, hospital admins, and the general public.
2.  **Enterprise Portal (Root `/`)**: A secure React/Next.js application for MOH/HDB operators and the Silver Generation Office.

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 📥 Installation

You need to install dependencies for both the Portal and the Website separately.

**1. Install Portal Dependencies (Root)**
```bash
# Navigate to project root
npm install
```

**2. Install Website Dependencies**
```bash
# Navigate to website directory
cd website
npm install
```

---

## 💻 Running the Applications

To see the full ecosystem, you should run both applications simultaneously.

### Running the Enterprise Portal (Command Center)
From the **root directory**:
```bash
npm run dev
```
- **URL**: `http://localhost:3000`
- **Target User**: MOH Operators, HDB Dispatchers.

### Running the Marketing Website
From the **website directory**:
```bash
cd website
npm run dev
```
- **URL**: `http://localhost:3001` (or next available port)
- **Target User**: Procurement officers, Hospital admins, General Public.

---

## 🌟 Core Features

### 🏢 B2G Enterprise Portal
- **Estate Dashboard**: Real-time heatmaps of block-level health and active alert feeds.
- **Incident Triage**: AI-fused evidence (Thermal + Acoustic) with 98% confidence scoring.
- **Response Workflow**: One-click dispatch for EchoRovers, Volunteer notifications, and SCDF escalation.
- **Resolution Logs**: Full audit logs and response time metrics for agency reporting.

### 🌐 Marketing Website
- **EchoAI Assistant**: Integrated AI chatbot available site-wide to handle technical support.
- **Hardware Showcase**: Deep dives into zero-stigma sensors and the EchoRover v2.4.
- **Privacy First**: Detailed breakdown of PDPA compliance and edge-computing (no cameras/raw audio).
- **Interactive FAQ**: Dynamic section for government agencies and caregivers.

---

## 🛠️ Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS / Vanilla CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion / CSS Keyframes
- **State Management**: React Hooks (useState, useEffect)

---

## 🔒 Security & Compliance
- **PDPA Compliant**: Data is processed at the edge; no raw audio or video ever leaves the residential node.
- **B2G Ready**: Designed with Government SSO (Singpass/CorpPass) UI integrations.
- **Role-Based**: Prepared for Admin vs. Operator access levels.

---

## 📄 License
This project is proprietary and built for the **EchoSync Healthcare Ecosystem**.

---

*Built with ❤️ by the EchoSync Development Team.*
