# EchoSync: AI-Powered Community Wellbeing & Safety System

EchoSync shifts care for senior residents from reactive response to proactive protection through the early detection of emergencies and signs of health decline. 

By leveraging secure networked IoT, robotics, and cloud-based AI, the system significantly shortens response times for vulnerable senior residents. Its privacy-first design ensures user trust, while a scalable, modular approach allows cost-effective deployment across high-density housing like Singapore's HDB estates.

## 🚀 The Problem
With one in five Singaporeans currently aged 65 or above, the healthcare system faces mounting pressure. For seniors living alone, the risk of "solitary emergencies"—incidents where a fall or medical episode remains undetected for days—is critical. Existing solutions (panic buttons, wearables) rely on user activation and suffer from low adoption due to stigma or forgetfulness. 

## 💡 Our Solution
EchoSync is an automated, strictly opt-in, non-invasive safety system. It captures environmental and behavioural data signatures via discreet hardware, transmitting them through encrypted gateways to centralized cloud servers for advanced AI analysis. 

### Core Innovations
* **Multi-Layer Filtering System:** Fuses acoustic, thermal, physiological, and routine-based data to drastically reduce false alarms.
* **Zero-Stigma Design:** Core sensors are embedded within standard in-home ceiling light fixtures.
* **Privacy-Preserving Edge Computing:** Fully PDPA-compliant. Audio and thermal data are processed primarily on-device to extract data signatures. Raw audio conversations and optical video are never recorded, transmitted, or stored.
* **The "Kampung Spirit" Workflow:** Tiered alert routing. Low-level anomalies trigger wellness checks from trusted neighbors/volunteers, while critical emergencies instantly dispatch the EchoRover and SCDF.

## ⚙️ System Components

### 1. Home-Level Safety Monitoring (IoT Hubs)
* **Thermal Imaging & Computer Vision (CV):** Detects human heat signatures to assess posture and movement, distinguishing between resting on a bed and collapsing on the floor without using optical cameras.
* **IoT Acoustic Sensors & NLP:** Machine Learning evaluates decibel spikes (heavy falls) and uses Natural Language Processing to detect verbal distress cues. 
* **Under-Mattress Load Mats:** High-sensitivity pressure sensors track micro-vibrations to detect respiratory distress or dangerous immobility.
* **Routine Verification (SP Group API):** Analyzes water/electricity consumption, triggering wellness checks if usage drops to zero for an abnormal duration.

### 2. Community-Level Robotics (EchoRover)
An autonomous patrol robot deployed in HDB corridors and Silver Zones to support frontline responders.
* **First-Responder Assessment:** Navigates to a triggered unit to establish a two-way audio intercom, allowing operators to assess the situation before SCDF arrives.
* **Responder Efficiency:** Carries an onboard Automated External Defibrillator (AED) and emergency medical supplies directly to the doorstep.

### 3. Software Ecosystem & Dashboards
* **B2G Enterprise SaaS Portal:** Estate-wide heatmaps, predictive health insights, and live incident triage for MOH/HDB/SCDF operators.
* **Resident Support Interface:** Delivers localized medication reminders, hydration prompts, and community health advisories.
* **Family/Caregiver App:** Provides peace of mind through secure status monitoring and tier-based alerts.

## 📈 Implementation Plan
* **Phase 1 (Months 0–6): Pilot & Validation**
    * Deploy 200 nodes in HDB "Silver Zones" + 2 EchoRovers.
    * *KPI:* Achieve ≥98% AI accuracy; reduce discovery time to <60s.
* **Phase 2 (Months 6–12): Expansion & Integration**
    * Expand to 1,000+ nodes. 
    * *KPI:* Maintain false-positive dispatch rates <2%; achieve 100% successful detection for critical emergencies.

## 👥 The Team
* **Vivion Oh (Project Lead):** Expert in B2G strategy and system architecture. Leads stakeholder alignment and secure data workflows to ensure PDPA regulatory compliance.
* **Felicia Tan (Technical Lead):** Specialist in AI integration (ML/NLP/CV) and robotics. Ensures the reliability of EchoSync’s emergency alerting logic and autonomous navigation.
* **Chalisa Tan (UI/UX & Backend Lead):** Focuses on scalable platform architecture, database management, and AI integration to ensure a seamless, data-driven experience for operators and caregivers.

---
*Developed for a resilient, smart, and compassionate Smart Nation.*