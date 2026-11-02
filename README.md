# SURAKSHA ALERT – Women's Personal Safety Platform
**Tagline:** *Your Safety • Your Strength • Your Freedom*  
**Heading:** *Walk Freely. Stay Prepared. Feel Safe.*  
**Hackathon:** Round 1 Prototype (Future Android Application Preview)

---

## 🌟 Executive Summary

Traditional personal safety apps are purely **reactive** panic buttons. When an actual assault, stalking incident, or distress situation occurs, a victim often has fewer than 5 seconds to respond. Blasting an uncoordinated broadcast SMS to several friends frequently leads to chaos, where everyone assumes someone else is responding.

**SURAKSHA ALERT** redefines personal safety by introducing **proactive readiness**, **journey-based safety checkpoints**, and **guaranteed acknowledgement-based escalation**:

> *"Suraksha Alert focuses not only on emergency response, but also on safety preparation before a journey and organised contact escalation when a check-in is missed."*

---

## 🎨 Design System & Color Palette

In accordance with the project requirements, the user interface uses a **warm, empowering, elegant, feminine-inspired design** (strictly avoiding dark or black backgrounds):

- **Warm White:** `#FFFDFB` (Canvas & backgrounds)
- **Soft Lavender:** `#F8EFF7` (Card tints, surfaces, headers)
- **Rose Pink:** `#E9B8CF` (Borders, accent lines, badges)
- **Deep Plum:** `#604263` (Primary typography, dark accents, hierarchy)
- **Coral Red:** `#E84C68` (Emergency SOS button, high-priority alerts, CTAs)
- **Soft Purple:** `#A88BC4` (Secondary indicators, gradient blends)
- **Light Grey:** `#F3F0F4` (Dividers, inactive tracks, containers)

---

## 🚀 Key Features & Differentiators

### 1. Safety Readiness Score – Main Differentiator
- Audits the user's safety preparedness **before** they begin a journey.
- Dynamically calculates a **0–100% score** based on:
  - 3+ Emergency Contacts configured (+30 pts)
  - Browser/Device Geolocation permission granted (+25 pts)
  - High-precision GPS accuracy calibrated (+15 pts)
  - Safety Journey Timer armed (+15 pts)
  - Emergency profile and shield protocols completed (+15 pts)
- Displays a responsive SVG circular gauge and an interactive checklist with 1-click "Fix Now" / "Calibrate" buttons that dynamically update the score in real time.

### 2. Smart Journey Protection
- Users enter their destination (e.g. *Home, Indiranagar*) and estimated travel duration (e.g. *25 minutes*).
- An interactive countdown runs with route progress checkpoints.
- Users can confirm **"I'm Safe"** at checkpoints (plays an audible chime and logs the event) or extend their transit time.
- If a check-in is missed, the system triggers a **simulated missed check-in alert** and routes immediately into the emergency escalation workflow.

### 3. Smart Emergency Escalation Ladder (Judge Simulation Console)
- Eliminates broadcast panic through an organized, multi-tier cascade:
  1. **Emergency Activated:** Triggered via SOS or missed check-in.
  2. **Priority 1 Contact (Priya Sharma):** Dispatched immediately with GPS coordinates and live tracking link.
  3. **Waiting for Acknowledgement:** 15s/30s countdown timer.
  4. **Simulation Controls:** Judges can test:
     - *"Simulate Contact Acknowledged"*: Marks the contact as acknowledged and pauses escalation.
     - *"Simulate No Response (Force Escalate)"*: Cascades to Priority 2 (Rajesh Verma) and Priority 3 (Ananya Patel).
     - *"Final Escalation"*: Routes encrypted emergency packet to India's National Helpline 112.
- A live SMS dispatch card shows the exact telematics payload: latitude/longitude, battery level, and live tracking URL.

### 4. Active Shield & Fake Call De-escalation
- **Voice Keyword SOS:** Hands-free emergency trigger on recognizing *"SURAKSHA HELP"*.
- **Shake Detection SOS:** Triggers emergency countdown upon 3 rapid phone shakes.
- **Silent SOS:** Covert hardware button sequence without sounding an audio alarm.
- **Realistic Fake Call Simulator:**
  - Full-screen smartphone incoming call interface (*Caller: "Dad"*).
  - Web Audio synthesized dual-tone realistic ringtone.
  - When accepted, plays real audio speech via Web Speech Synthesis: *"Hey sweetie! I'm just around the corner on 100ft road. Waiting for you in the car, see you in 2 minutes!"*
  - Designed for discreet de-escalation in awkward cabs or when being followed.

### 5. Trusted Contacts Management
- Dedicated contact manager with Priority 1, 2, and 3 tier badges.
- Add, Edit, and Delete contacts with real-time validation and priority re-indexing.
- Changes immediately adjust the Safety Readiness Score and dashboard metrics.

### 6. Emergency Services Directory
- Integration with verified Indian statutory helplines:
  - **112:** All-India Emergency Response Support System (ERSS)
  - **1091:** Women in Distress 24x7 Helpline
  - **181:** Women Domestic Violence Helpline Scheme
  - **100:** Police Control Room
- Guidance cards for safe ride-hailing practices and night travel.

### 7. Activity History Timeline
- Audit log tracking user events (Journey started, check-ins, GPS calibrations, SOS activations).
- Filterable by *All, Journeys, Contacts, System*.
- Includes a "Reset Sample" and "Export Log" action.

---

## 🏆 Judge Presentation Experience (2–3 Minute Walkthrough)

A persistent **Judge Demo Bar** floats at the bottom of the screen. Clicking **"2-Min Judge Demo Tour"** guides the evaluator step-by-step:

1. **Step 1 (Landing Page):** Branding, tagline, and mission statement.
2. **Step 2 (Dashboard):** Prominent Coral Red SOS button and system status.
3. **Step 3 (Safety Readiness Score):** Interactive gauge and dynamic factor recalculation.
4. **Step 4 (Trusted Contacts):** Tiered escalation priority ladder.
5. **Step 5 (Smart Journey):** Live countdown and "I'm Safe" check-in demonstration.
6. **Step 6 (Emergency SOS):** 5-second countdown with audible siren and cancellation option.
7. **Step 7 (Smart Escalation):** Manual simulation of contact acknowledgement vs. non-response.
8. **Step 8 (Active Shield):** Hands-free voice trigger and realistic Fake Call demo.
9. **Step 9 (Activity History):** Verifiable event audit log.

---

## 💻 How to Run Locally

### Option A: Open Directly in Browser (No Installation Required)
Double-click `index.html` or open it in any modern desktop browser (Chrome, Edge, Firefox, Safari).  
All audio, styling, and interactions are zero-dependency and run immediately.

### Option B: Run via Lightweight Node.js Server
From the project folder:
```powershell
node server.js
```
Then open your browser at:
```
http://localhost:3000
```

---

## 📱 Future Android Architecture (Round 2 Roadmap)
- **Foreground Services:** Persistent background safety monitoring that survives app closure and battery optimization.
- **Hardware Button Interceptor:** Native Accessibility Service listening for triple power button clicks.
- **On-Device Keyword Spotting:** TensorFlow Lite voice model detecting custom wake-words offline.
- **SMS Gateway Telematics:** Dual-channel SMS + Data packet dispatch for guaranteed delivery even in low-signal rural zones.
# wome-safety-app-and-repo-
