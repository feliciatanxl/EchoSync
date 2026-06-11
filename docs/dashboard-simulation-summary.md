# EchoSync Dashboard Simulation Summary

## What Already Existed

- `/dashboard-v2` already had the SCDF-style 3-column command-centre layout.
- Incident cards, map view, selected incident detail strip, global Ops Log, full Ops Log, and top navigation were already present.
- The map already used prominent incident markers and selected-marker highlighting.
- Broadcast Alert modal, acknowledgement toast, and global Ops Log insertion were already implemented.

## What Was Added Or Fixed

- Added `lib/echosync-simulator.ts` with three EchoSync scenarios and detector model outputs.
- Added `/api/simulate-alert` for scenario-based simulation responses.
- Added verified EchoSync node location handling in `lib/verified-node-locations.ts`.
- Updated `/dashboard-v2` so simulation buttons update the selected case, map popup, evidence, AI reasoning, global Ops Log, and urgent toast.
- Kept Ops Log global, so clicking incidents does not filter the command-centre event stream.
- Shortened map popup and bottom-panel content for faster emergency scanning.

## How Simulation Works

The dashboard simulates this workflow:

`4 detectors -> voice check-in -> confidence score -> AI reasoning -> global Ops Log -> dispatcher action`

When a simulation button is clicked, the dashboard fetches `/api/simulate-alert`, resolves the incident location from the registered node registry, updates the selected incident, writes detector events into the global Ops Log, and shows a toast for Critical or High risk alerts.

## Demo Scenarios

- **Critical No Response:** 91%, Critical. Thermal anomaly, impact detected, load mat no return, no door/fridge activity, voice no response.
- **False Alarm Filtered:** 38%, Low. Impact only, normal movement, resident says "I'm okay".
- **Needs Dispatcher Review:** 76%, High. Weak signals, bed exit/no return, routine deviation, unclear voice response.

## Design Decisions

- Main incident views use short operational language for 1-3 second scanning.
- Detailed model reasoning is kept out of the main map popup and bottom strip.
- Marker locations use registered EchoSync node coordinates instead of road-centre or GPS-style approximations.
- Global Ops Log remains the shared command-centre timeline.

## NIM AI Summary Layer

- NIM is used only to generate short dispatcher-readable summaries from existing detector JSON.
- Rule-based simulation remains the source of truth for confidence, risk, evidence, and recommended action.
- A local fallback summary is used when NIM credentials or endpoint are unavailable.
- No raw audio, raw video, NRIC, face data, or private conversation recordings are sent.

## Future Work

- Add a dedicated incident detail drawer for expanded model explanations.
- Add manual address geocoding for dispatcher-created incidents.
- Connect verified CFR handoff once the myResponder prototype is ready.
- Persist Ops Log events when a backend is introduced.
