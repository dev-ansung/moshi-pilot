# ☎️ Moshi-Pilot (もしパイロット)

**Speak fluent Keigo over the phone — without speaking a word of Japanese.**

*A real-time, human-in-the-loop (HITL) bilingual voice concierge for travelers in Japan.*

Built for the **Side Quest Hotline Vapi Hackathon @ Vapi HQ** ⚡

[![Live Demo](https://img.shields.io/badge/demo-moshi--pilot.vercel.app-000?style=for-the-badge&logo=vercel)](https://moshi-pilot.vercel.app)
[![GitHub](https://img.shields.io/badge/github-dev--ansung%2Fmoshi--pilot-181717?style=for-the-badge&logo=github)](https://github.com/dev-ansung/moshi-pilot)

---

## 🎯 The Pitch

### The Problem

Traveling in Japan is magical until you have to make a phone call.

Many traditional **ryokans** (Japanese inns), boutique **omakase** sushi counters, local **luggage forwarding** services (Takkyubin), regional taxi fleets, and medical clinics still **only accept changes, confirmations, and inquiries over the phone — and only in Japanese**.

For non-Japanese-speaking travelers, every existing option is broken:

1. **Pass-the-phone translation apps** cannot be routed through a standard telephone call.
2. **Hotel concierges and Japanese-speaking friends** are scarce, slow, and unavailable after hours.
3. **Fully autonomous AI voice agents are too risky when real money is on the line.** If a hotel staff member says *"Late check-in voids your kaiseki dinner — should we cancel the meal or hold just the room?"*, you cannot trust an autonomous LLM to guess your preference on a $500 dinner.

The result: **$200–$1,000+ lost per incident** in forfeited meals and no-shows, hours wasted hunting for bilingual help, and extreme stress during already tense moments like train delays or lost luggage.

### The Solution

**Moshi-Pilot** is a bilingual telephone copilot that dials Japanese businesses on your behalf, handles polite honorific Japanese (*Keigo*) conversation automatically, and **pauses to push instant, translated decision cards to your screen the exact moment a human choice is required**.

You steer the call in **English** through one-tap buttons and live text; Moshi-Pilot speaks **natural, polite Japanese** on the line.

---

## ✨ Key Features

- 🗣️ **Polite Keigo Voice Proxy** — Conducts greetings, reservation lookups, and confirmations in culturally appropriate honorific Japanese without robotic pauses.
- 🛑 **Deterministic HITL Escalation** — Distinguishes routine dialogue from high-stakes branching questions (fees, cancellations, policy clashes) using a structured decision router instead of LLM guesswork.
- 📱 **Live 1-Tap Decision Cards** — When the business asks something only you can answer, the agent buys time with natural Japanese filler (*"少々お待ちください… / One moment please, let me double-check..."*) while pushing a translated multiple-choice card to your screen.
- ⌨️ **Live English Whisper Steering** — Type custom instructions mid-call in English (e.g., *"Ask if they can hold our bags tomorrow"*), and the agent seamlessly weaves them into its next Japanese sentence.
- 🔎 **Pre-Call Web Grounding** — Automatically fetches the venue's phone number, business hours, and cancellation rules with Exa before dialing so the agent never goes in blind.
- 📄 **Post-Call Manus Receipt** — Dispatches a structured confirmation log (who you spoke with, agreed terms, updated itinerary) via email and SMS the moment you hang up.
- 🎬 **90-Second Stage Demo Mode** — A scripted, reproducible demo flow designed for live presentations and recorded pitches.

---

## 🛠️ Partner Stack & Architecture

We built Moshi-Pilot by combining best-in-class real-time voice, search, and decision infrastructure:

| Partner | Role in Moshi-Pilot |
|---|---|
| **☎️ Vapi** | Core voice orchestration, outbound SIP telephony, barge-in handling, and real-time filler injection. |
| **🎙️ Deepgram** | Ultra-low-latency Japanese STT (`nova-2` multilingual) streaming transcribed hotel speech in under 300 ms. |
| **⚡ TypeSafe / Jev** | Structured decision engine. Evaluates every incoming Japanese turn in milliseconds to route between `AUTO_REPLY` and `ESCALATE_TO_USER` with strict JSON schemas. |
| **🔎 Exa** | Neural web search to fetch venue details, check-in rules, and cancellation policies before dialing. |
| **🖐️ Manus** | Post-call workflow automation — compiling verified call transcripts into clean itinerary updates and dispatching receipts. |

### System Flow

```text
               Traveler Web UI (English)
                    │        ▲
     1. "Late check-in       │  3. Pushes 1-tap decision card:
        @ 9:30 PM"           │     [ Cancel dinner ]  [ Rush by 7:45 ]
                    ▼        │
      [Vapi Outbound SIP Call] ◄───► [Deepgram JP STT] ◄───► [Hotel Staff (Japanese)]
                    │
       2. Hotel: "Check-in OK, but dinner ends at 8 PM. Cancel dinner?"
                    ▼
          [TypeSafe / Jev Router]
                    │
            ──► Detects high-stakes branching decision!
            ──► Agent speaks polite Japanese filler: "少々お待ちください…"
            ──► Traveler taps [Cancel dinner, keep room]
                    ▼
          [Moshi-Pilot Agent] speaks polite Keigo confirmation & closes call
                    ▼
          [Manus Workflow] sends verified confirmation receipt (email/SMS)
```

---

## 🎬 90-Second Live Demo Script

1. **Setup (0:00–0:15):** On the Moshi-Pilot dashboard, select **"Kyoto Ryokan — Late Check-In"** (Reservation #402, new arrival 9:30 PM). **Exa** auto-populates the ryokan's hours and the strict 8:00 PM dinner cutoff.
2. **The Call Begins (0:15–0:35):** Click **"Dial venue with Moshi-Pilot"**. **Vapi** places a live outbound SIP call on speakerphone. The front desk answers in Japanese; Moshi-Pilot politely introduces the guest and states the 9:30 PM arrival.
3. **The Curveball (0:35–0:55):** The receptionist replies in Japanese that dinner service strictly ends at 8:00 PM and asks how the guest wants to proceed.
4. **The HITL Magic (0:55–1:15):** **Jev** catches the policy conflict. Moshi-Pilot automatically asks the hotel to hold a moment in polite Japanese, while a translated decision card appears on screen: *[Cancel dinner, keep room]* vs. *[I'll rush to arrive by 7:45 PM]*. We tap **Cancel dinner** and type a whisper: *"Ask if they can hold our bags tomorrow."*
5. **Resolution (1:15–1:30):** Moshi-Pilot immediately relays both the decision and the baggage question in fluent Keigo, receives confirmation, thanks the host, and **Manus** dispatches the structured itinerary receipt.

---

## 💻 Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn-style monochrome design system
- **Icons:** Lucide React
- **Voice & Telephony:** Vapi Web SDK + Server REST API
- **Transcription:** Deepgram `nova-2` multilingual STT
- **Decision Engine:** TypeSafe / Jev structured JSON routers
- **Search & Grounding:** Exa API
- **Automation:** Manus API & webhooks
- **Deployment:** Vercel

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- (Optional for live calls) API keys for Vapi, Deepgram, TypeSafe/Jev, Exa, Manus — **demo mode works out of the box without any keys**

### Installation

```bash
# Clone the repository
git clone https://github.com/dev-ansung/moshi-pilot.git
cd moshi-pilot

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to launch the Traveler Co-Pilot console.

### Environment Variables (optional, for live mode)

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
VAPI_API_KEY=your_vapi_key
VAPI_PHONE_NUMBER_ID=your_vapi_phone_number_id
DEEPGRAM_API_KEY=your_deepgram_api_key
TYPESAFE_JEV_API_KEY=your_jev_api_key
EXA_API_KEY=your_exa_api_key
MANUS_API_KEY=your_manus_api_key
```

Keys can also be entered at runtime via the **API Keys** button in the app header (stored in your browser only).

---

## 📊 Why This Wins

- **Massive market with proven willingness to pay:** 36.9 million inbound visitors to Japan in 2024 (8+ trillion yen spend); the highest-margin experiences (luxury ryokans, Michelin-starred omakase) are precisely the phone-only ones.
- **Genuine technical wedge:** Keigo honorific Japanese is famously difficult even for native speakers; bilingual sub-second HITL phone orchestration is technically defensible and hard to replicate.
- **Trust architecture:** The deterministic decision router means travelers never worry about autonomous mistakes with money or reservations — the single biggest barrier to AI voice adoption in travel.
- **All five partner technologies are genuinely used** in the critical path of every call: Vapi (voice), Deepgram (STT), TypeSafe/Jev (decisions), Exa (grounding), Manus (receipts).

---

## 🔮 Roadmap

- [x] Bilingual Keigo voice proxy with HITL decision cards
- [x] Exa pre-call venue grounding
- [x] English whisper steering mid-call
- [x] Manus post-call itinerary receipts
- [ ] Inbound call forwarding (hotel calls you back)
- [ ] Emergency escalation to human concierge
- [ ] Expansion to Korea (존댓말) and France (vous)
- [ ] Calendar & OTA sync (Booking.com, Agoda)
- [ ] WhatsApp / LINE receipt delivery

---

## 👥 Team

Built with ❤️ at **Side Quest Hotline Vapi Hackathon @ Vapi HQ** by **dev-ansung** and the Moshi-Pilot team.

---

## 📄 License

MIT © dev-ansung — see [LICENSE](LICENSE) for details.
