# 🚨 EchoSync — AI-Assisted Pre-Arrival Emergency Intelligence Platform

EchoSync is an SCDF-aligned AI-assisted emergency coordination platform designed to improve pre-arrival response for unwitnessed home emergencies in high-density HDB environments.

The system connects a Raspberry Pi / Arduino sensor node, an SCDF-style triage dashboard, a caregiver verification app, and a myResponder-style community responder interface. EchoSync focuses on privacy-preserving anomaly detection, explainable alert routing, caregiver verification, Community First Responder (CFR) coordination, and operational awareness before ambulance arrival.

EchoSync was developed as a software-first operational prototype for the SCDF Innovation Challenge 2026.

---

## 🌐 Live Demo Links

| Application | URL |
|---|---|
| SCDF Dashboard | https://echosync-echosync.apps.innovate.sg-aie.com/dashboard-v2 |
| Caregiver App | https://echosync-echosync.apps.innovate.sg-aie.com/caregiver-app |
| myResponder App | https://echosync-echosync.apps.innovate.sg-aie.com/myResponder |

---

## 🏗️ Project Architecture

EchoSync uses a multi-application architecture within one deployment.

### 1. SCDF Dashboard `/dashboard-v2`

The SCDF Dashboard is used by operators to review High and Critical alerts only.

Key features:

- Live triage queue for High and Critical cases
- Singapore map-based incident view
- AI-generated alert summary
- Human-readable sensor evidence
- Operator-led CFR / AED coordination
- myResponder push workflow
- Full operations log
- Incident timeline tracking
- Dashboard-to-myResponder alert handoff

Low and Medium risk alerts are not shown on the SCDF dashboard. These are routed to the caregiver app for verification.

---

### 2. Caregiver App `/caregiver-app`

The Caregiver App supports non-emergency verification and resident-linked response.

Key features:

- Singpass-style caregiver onboarding flow
- Primary / secondary / family caregiver role selection
- Community responder access flow
- Notification permissions
- Consent flow
- Node status view
- Caregiver-side alert handling
- Low and Medium alert verification

---

### 3. myResponder App `/myResponder`

The myResponder app is a clone-style responder interface inspired by the real myResponder workflow.

Key features:

- Receives CFR / AED coordination tasks only after SCDF operator action
- Accept verification task
- OneMap-based responder map
- Active response screen
- Completion logging
- Sends completion status back to SCDF Ops Log

myResponder does not receive alerts automatically. Alerts are only pushed after an SCDF operator decides CFR / AED support is needed.

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

High and Critical alerts remain under SCDF operator control. The operator may then push the case to myResponder for CFR / AED coordination.

---

## 🚀 Getting Started

### Prerequisites

Install the following:

- Node.js v20 recommended
- npm
- Docker Desktop
- Git

---

## 📥 Installation

From the project root:

```bash
npm install
```

Install myResponder dependencies:

```bash
cd app/myResponder
npm install
cd ../..
```

---

## ▶️ Running Locally

Run the main EchoSync app:

```bash
npm run dev
```

Open these URLs:

```text
http://localhost:3000/dashboard-v2
http://localhost:3000/caregiver-app
http://localhost:3000/myResponder
```

---

## 🧪 Build Test

Before pushing to Docker or OpenShift, run:

```bash
npm run build
```

The build command also builds the myResponder app before building the main Next.js application.

---

## 🐳 Docker Build and Push

Use a new image tag whenever the dashboard, caregiver app, and myResponder app are all updated together.

Example tag:

```text
allapps-v1
```

Build:

```bash
docker build --no-cache -t ihl-harbor.apps.innovate.sg-aie.com/echosync/echosync:allapps-v1 .
```

Push:

```bash
docker push ihl-harbor.apps.innovate.sg-aie.com/echosync/echosync:allapps-v1
```

Then update the OpenShift deployment image to:

```text
ihl-harbor.apps.innovate.sg-aie.com/echosync/echosync:allapps-v1
```

---

## ☁️ OpenShift Deployment

The deployed OpenShift route is:

```text
https://echosync-echosync.apps.innovate.sg-aie.com
```

Main deployed paths:

```text
/dashboard-v2
/caregiver-app
/myResponder
```

OpenShift should run the latest Harbor image tag selected in the deployment settings.

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
- SCDF operator review flow

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
- SCDF operator override authority
- Caregiver verification for Low / Medium cases
- myResponder only activated after SCDF operator action
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
- Container: Docker
- Registry: Harbor
- Deployment: OpenShift
- Hardware Prototype: Raspberry Pi + Arduino sensor node
- AI Summary Layer: GB10 / NIM-style endpoint integration

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

- SCDF operators
- Emergency coordinators
- Community First Responders
- Caregivers
- Innovation Challenge judges
- HDB pilot deployment reviewers

---

## 📄 License

This project was developed for the SCDF Innovation Challenge 2026 prototype showcase.

Built by Team EchoSync.
