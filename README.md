# 🚨 EchoSync — AI-Assisted Pre-Arrival Emergency Intelligence Platform

EchoSync is an SCDF-aligned AI-assisted emergency coordination platform designed to improve pre-arrival response for unwitnessed medical emergencies in high-density HDB environments.

The platform focuses on privacy-preserving anomaly detection, Community First Responder (CFR) coordination, AED routing workflows, and operational situational awareness before ambulance arrival. EchoSync is designed as a software-first operational prototype for the SCDF Innovation Challenge 2026.

## 🏗️ Project Architecture

EchoSync uses a dual-application architecture:

-   Portal Application (/): SCDF-style emergency coordination dashboard and responder management system. Includes:
-   -   Live incident monitoring
    -   AI confidence scoring
    -   CFR coordination workflow
    -   AED deployment tracking
    -   Incident timeline visualization
    -   Edge node health monitoring
    -   HDB deployment simulation
    -   Dispatcher situational awareness tools
-   Public Website (/website): Public-facing presentation website explaining:
-   -   Operational workflow
    -   Deployment strategy
    -   Privacy safeguards
    -   HDB integration concept
    -   AI explainability
    -   Pilot deployment feasibility

## 🚀 Getting Started

### 📋 Prerequisites

-   Node.js v18+
-   npm v9+

### 📥 Installation

1.  Install Portal Dependencies From the project root: npm install
2.  Install Website Dependencies cd website npm install

### Running the Applications

1.  **Main Portal (Port 3000):**
    -   Run: `npm run dev`
    -   URL: `https://echosync-portal.vercel.app/`

2.  **Public Website (Port 3001):**
    -   Open a new terminal.
    -   Navigate: `cd website`
    -   Run: `npm run dev -- -p 3001`
    -   URL: `https://echosync-website-brown.vercel.app/`
-   Intended Users: SCDF operators, emergency coordinators, dispatch simulation reviewers, hackathon judges.

### 🌐 Website Application

From the /website directory:

 npm run dev -p 3001

-   URL: http://localhost:3001
-   Purpose: Public concept showcase, deployment visualization, operational walkthrough, hackathon presentation support.

## 🌟 Core Features

### 🚨 SCDF Coordination Dashboard

-   Real-time incident queue
-   AI-assisted confidence scoring
-   Explainable alert reasoning
-   Incident escalation workflow
-   HDB deployment visualization
-   CFR responder coordination
-   AED tracking workflow
-   Operational timeline replay
-   System health monitoring

### 📱 CFR Mobile Interface

-   Incoming emergency alerts
-   AED pickup workflow
-   Guided CPR action flow
-   Response completion logging
-   Mobile-first emergency UI

### 🧠 AI & Simulation Layer

-   Simulated multi-modal anomaly detection
-   Confidence progression engine
-   Explainable AI classifications
-   Live workflow simulation
-   Fake real-time operational updates
-   Edge-processing architecture simulation

### 🏢 HDB Deployment Simulation

-   Corridor-level deployment mockups
-   Ceiling sensor placement visualization
-   Lift lobby relay nodes
-   AED coordination points
-   Pilot deployment architecture

## 🔒 Privacy & Operational Safeguards

EchoSync is designed as a privacy-first operational support system. Core principles include:

-   No raw audio storage
-   No camera surveillance
-   Edge-based processing
-   Human-in-the-loop verification
-   Operator override authority
-   Encrypted alert transmission
-   Opt-in deployment model
-   PDPA-aligned architecture

## 🛠️ Technology Stack

-   Framework: Next.js 14+
-   Language: TypeScript
-   Styling: Tailwind CSS
-   Icons: Lucide React
-   Animations: CSS Keyframes
-   State Management: React Hooks
-   Architecture: Dual Next.js Applications

## ⚠️ Important Notes

EchoSync is a hackathon simulation prototype and does not perform:

-   Autonomous medical diagnosis
-   Real SCDF dispatch integration
-   Live biometric analysis
-   Actual emergency escalation

All workflows and operational scenarios are simulated for demonstration purposes.

## 📄 License

This project was developed for the SCDF Innovation Challenge 2026 prototype showcase.

Built by Team EchoSync.