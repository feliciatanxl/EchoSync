# 🚨 EchoSync — AI-Assisted Pre-Arrival Emergency Intelligence Platform

EchoSync is an AI-assisted pre-arrival intelligence and first response ecosystem designed to improve response coordination for unwitnessed home emergencies in high-density HDB environments.

The system connects a Raspberry Pi / Arduino sensor node, an SCDF-style triage dashboard, a caregiver verification app, and a myResponder-style community responder interface. EchoSync focuses on privacy-preserving anomaly detection, explainable alert routing, caregiver verification, Community First Responder (CFR) coordination, and operational awareness before ambulance arrival.

EchoSync was developed for the SCDF and Dell Lifesavers’ Innovation Challenge 2026, where it was selected as a Top 5 Finalist out of 81 teams from 17 institutions.

---

## 🌐 Live Demo Links

The current prototype is hosted on Vercel.

| Application | URL |
|---|---|
| SCDF Dashboard | https://echosync-portal-kaw8xrzjo-feliciatanxls-projects.vercel.app/dashboard-v2 |
| Caregiver App | https://echosync-portal-kaw8xrzjo-feliciatanxls-projects.vercel.app/caregiver-app |
| myResponder App | https://echosync-portal-kaw8xrzjo-feliciatanxls-projects.vercel.app/myResponder |

> Note: Earlier OpenShift deployment links were used during the competition demo environment and may no longer be active. The Vercel links above are the current public demo links.

---

## 🧠 Project Overview

EchoSync addresses a critical emergency response gap:

> What happens when a senior living alone experiences a fall, collapse, or medical distress, but no one is around to call 995?

Existing solutions such as panic buttons and wearables can help, but they still depend on the resident being conscious, able to move, and able to activate the device.

EchoSync creates the missing first alert before a 995 call exists by detecting possible distress through privacy-first ambient sensors, verifying the situation with Edge AI and voice check-in, and routing alerts based on risk severity.

---

## 🏗️ System Architecture

EchoSync uses a multi-application architecture within one prototype ecosystem.

### 1. SCDF Dashboard `/dashboard-v2`

The SCDF-style dashboard is used to review High and Critical alerts.

Key features:

- Live triage queue for High and Critical cases
- Singapore map-based incident view
- AI-generated alert summary
- Human-readable sensor evidence
- Risk level and confidence score
- Operator-led CFR / AED coordination
- myResponder push workflow
- Full operations log
- Incident timeline tracking
- Dashboard-to-myResponder alert handoff

Low and Medium alerts are not shown directly on the SCDF dashboard. They are routed to the caregiver app for verification first.

---

### 2. Caregiver App `/caregiver-app`

The caregiver app supports non-emergency verification and resident-linked response.

Key features:

- Caregiver onboarding flow
- Primary, secondary, and family caregiver role selection
- Notification permission flow
- Consent flow
- Linked node status view
- Caregiver-side alert handling
- Low and Medium alert verification
- Multilingual check-in support concept

---

### 3. myResponder App `/myResponder`

The myResponder-style app demonstrates how Community First Responders may receive responder tasks after SCDF operator approval.

Key features:

- Receives CFR / AED coordination tasks only after SCDF operator action
- Accept verification task
- OneMap-based responder map
- Active response screen
- Completion logging
- Sends completion status back to SCDF Ops Log

myResponder does not receive alerts automatically. Alerts are pushed only after an SCDF operator decides that CFR / AED support is needed.

---

### 4. Raspberry Pi / Arduino Sensor Node

The sensor node sends live JSON sensor events to the EchoSync API.

Supported prototype signals include:

- Sound / impact detection
- PIR motion detection
- Ultrasonic distance readings
- Mattress / load-cell readings
- Voice check-in result
- Help request detection
- Possible fall pattern
- Risk level and confidence score

---

## 🔁 Alert Routing Logic

EchoSync separates alerts based on risk level.

| Risk Level | Routed To | Purpose |
|---|---|---|
| Low | Caregiver App | Monitor or verify |
| Medium | Caregiver App | Caregiver verification |
| High | SCDF Dashboard | Operator review |
| Critical | SCDF Dashboard | Urgent operator review |

High and Critical alerts remain under SCDF-style operator control. The operator may then push the case to the myResponder-style flow for CFR / AED coordination.

---

## ⚙️ Getting Started

### Prerequisites

Install the following:

- Node.js v20 recommended
- npm
- Git

Optional for container deployment:

- Docker Desktop

---

## 📥 Installation

From the project root:

```bash
npm install
```

If your local project uses the `website` folder as the main app, run:

```bash
cd website
npm install
```

---

## ▶️ Running Locally

Run the EchoSync app:

```bash
npm run dev
```

If using the `website` folder:

```bash
cd website
npm run dev
```

Open these local URLs:

```text
http://localhost:3000/dashboard-v2
http://localhost:3000/caregiver-app
http://localhost:3000/myResponder
```

---

## 🧪 Build Test

Before pushing to GitHub or deploying to Vercel, run:

```bash
npm run build
```

If using the `website` folder:

```bash
cd website
npm run build
```

---

## 🚀 Deployment

The current public demo is deployed on Vercel.

Main deployed paths:

```text
/dashboard-v2
/caregiver-app
/myResponder
```

Current Vercel deployment:

```text
https://echosync-website-brown.vercel.app
```

---

## 🔌 API Routes

EchoSync uses internal Next.js API routes for alert exchange.

| API Route | Purpose |
|---|---|
| `/api/sensor-alert` | Receives live Raspberry Pi / Arduino sensor alerts |
| `/api/caregiver-alert` | Sends Low / Medium alerts to caregiver flow |
| `/api/myresponder-alert` | Sends operator-approved alerts to myResponder |
| `/api/node-control` | Supports node control actions |
| `/api/simulate-alert` | Runs dashboard simulation scenarios |
| `/api/nim-alert-summary` | Generates or returns AI summary content |

---

## 🌟 Core Features

### SCDF Dashboard

- High and Critical alert triage
- Map-based incident monitoring
- Human-readable sensor evidence
- Alert summary and recommended action section
- CFR / AED coordination workflow
- myResponder handoff
- Full Operations Log
- SCDF-style operator review flow

### Caregiver App

- Caregiver onboarding
- Notification permission flow
- Role selection
- Consent screen
- Linked node status
- Low / Medium alert verification

### myResponder App

- Receives SCDF-approved responder tasks
- OneMap responder view
- Accept verification task
- Active response screen
- Completion update to SCDF Ops Log

### AI and Sensor Fusion

- Sensor evidence grouping
- Voice check-in interpretation
- Confidence scoring
- High / Critical escalation logic
- Explainable alert summary
- Operator-friendly recommended action

---

## 🔒 Privacy and Operational Safeguards

EchoSync is designed as a privacy-first emergency support prototype.

Core safeguards:

- No raw audio storage
- No camera surveillance
- Edge-first signal processing
- Human-in-the-loop verification
- SCDF-style operator override authority
- Caregiver verification for Low / Medium cases
- myResponder-style flow activated only after operator action
- PDPA-aware design approach
- Opt-in household deployment concept

---

## ⚠️ Important Notes

EchoSync is a hackathon / innovation challenge prototype.

It does not perform:

- Autonomous medical diagnosis
- Real SCDF dispatch
- Real 995 emergency escalation
- Real biometric identification
- Real caregiver authentication
- Production-grade emergency operations

All emergency workflows are simulated for demonstration, testing, and innovation showcase purposes.

---

## 🛠️ Technology Stack

- Framework: Next.js
- Language: TypeScript
- Styling: Tailwind CSS
- Icons: Lucide React
- Map: OneMap / Leaflet-style map integration
- Frontend State: React Hooks
- Deployment: Vercel
- Hardware Prototype: Raspberry Pi + Arduino sensor node
- AI Summary Layer: LLM / NIM-style endpoint integration
- Speech Layer: Azure STT / TTS concept integration

---

## 📁 Main Project Structure

```text
app/
├── dashboard-v2/
│   ├── page.tsx
│   └── IncidentMap.tsx
├── caregiver-app/
│   ├── CaregiverApp.tsx
│   └── screens/
├── myResponder/
│   ├── src/
│   └── package.json
├── api/
│   ├── sensor-alert/
│   ├── caregiver-alert/
│   ├── myresponder-alert/
│   ├── node-control/
│   ├── simulate-alert/
│   └── nim-alert-summary/
```

---

## 👥 Intended Users

- SCDF-style operators
- Emergency coordinators
- Community First Responders
- Caregivers
- Innovation Challenge judges
- HDB pilot deployment reviewers

---

## 🏆 Competition Context

EchoSync was developed for the SCDF and Dell Lifesavers’ Innovation Challenge 2026.

Achievement:

```text
Top 5 Finalist
81 teams
17 institutions
```

---

## 📄 License

This project was developed for the SCDF and Dell Lifesavers’ Innovation Challenge 2026 prototype showcase.

Built by EchoSync.
