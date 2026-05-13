### 🚨 EchoSync — AI-Assisted Pre-Arrival Emergency Intelligence Platform

EchoSync is an SCDF-aligned AI-assisted emergency coordination platform designed to improve pre-arrival response for unwitnessed medical emergencies in high-density HDB environments.

The platform focuses on privacy-preserving anomaly detection, Community First Responder (CFR) coordination, AED routing workflows, and operational situational awareness before ambulance arrival.

EchoSync is designed as a software-first operational prototype for the SCDF Innovation Challenge 2026.

────────────────────────────

### 🏗️ Project Architecture

EchoSync uses a dual-application architecture:

Portal Application (/)
SCDF-style emergency coordination dashboard and responder management system.

Includes:

* Live incident monitoring
* AI confidence scoring
* CFR coordination workflow
* AED deployment tracking
* Incident timeline visualization
* Edge node health monitoring
* HDB deployment simulation
* Dispatcher situational awareness tools

Public Website (/website)
Public-facing presentation website explaining:

* operational workflow
* deployment strategy
* privacy safeguards
* HDB integration concept
* AI explainability
* pilot deployment feasibility

────────────────────────────

### 🚀 Getting Started

📋 Prerequisites

* Node.js v18+
* npm v9+

────────────────────────────

### 📥 Installation

Install Portal Dependencies

From the project root:

npm install

Install Website Dependencies

cd website
npm install

────────────────────────────

### 💻 Running The Applications

Run both applications separately for the full EchoSync ecosystem.

────────────────────────────

### 🖥️ Portal Application

From project root:

npm run dev

URL:
[http://localhost:3000](http://localhost:3000)

Intended Users:

* SCDF operators
* emergency coordinators
* dispatch simulation reviewers
* hackathon judges

────────────────────────────

### 🌐 Website Application

From /website:

npm run dev -- --port 3001

URL:
[http://localhost:3001](http://localhost:3001)

Purpose:

* public concept showcase
* deployment visualization
* operational walkthrough
* hackathon presentation support

────────────────────────────

### 🌟 Core Features

🚨 SCDF Coordination Dashboard

* Real-time incident queue
* AI-assisted confidence scoring
* Explainable alert reasoning
* Incident escalation workflow
* HDB deployment visualization
* CFR responder coordination
* AED tracking workflow
* Operational timeline replay
* System health monitoring

📱 CFR Mobile Interface

* Incoming emergency alerts
* AED pickup workflow
* Guided CPR action flow
* Response completion logging
* Mobile-first emergency UI

🧠 AI & Simulation Layer

* Simulated multi-modal anomaly detection
* Confidence progression engine
* Explainable AI classifications
* Live workflow simulation
* Fake real-time operational updates
* Edge-processing architecture simulation

🏢 HDB Deployment Simulation

* Corridor-level deployment mockups
* Ceiling sensor placement visualization
* Lift lobby relay nodes
* AED coordination points
* Pilot deployment architecture

────────────────────────────

### 🔒 Privacy & Operational Safeguards

EchoSync is designed as a privacy-first operational support system.

Principles:

* No raw audio storage
* No camera surveillance
* Edge-based processing
* Human-in-the-loop verification
* Operator override authority
* Encrypted alert transmission
* Opt-in deployment model
* PDPA-aligned architecture

────────────────────────────

### 🛠️ Technology Stack

Framework:

* Next.js 16

Language:

* TypeScript

Styling:

* Tailwind CSS v4

Icons:

* Lucide React

Animations:

* CSS Keyframes

State Management:

* React Hooks

Architecture:

* Dual Next.js Applications

────────────────────────────

### ⚠️ Important Notes

EchoSync is a hackathon simulation prototype and does not perform:

* autonomous medical diagnosis
* real SCDF dispatch integration
* live biometric analysis
* actual emergency escalation

All workflows and operational scenarios are simulated for demonstration purposes.

────────────────────────────

### 📄 License

This project was developed for the SCDF Innovation Challenge 2026 prototype showcase.

Built by Team EchoSync.