# Moshi-Pilot — Hackathon Submission & Pitch Copy

**Product name:** Moshi-Pilot (もしパイロット)  
**Tagline:** Speak fluent Keigo over the phone — without speaking a word of Japanese.  
**Category:** Human-in-the-Loop Voice AI / Travel Tech  

---

## 1. Logo

Three production-ready square logos (1920 x 1920 px, well above the 256 px minimum) have been created in `assets/`:

- **Concept A (Recommended):** The Origami App Icon — an origami paper airplane fusing into a telephone handset, set against a deep indigo field with a rising-sun red disk and coral audio waves. Premium iOS-style badge.
- **Concept B:** The Enso Call Emblem — a bold Japanese ink-circle brushstroke framing a telephone handset lifting off like a paper jet, with broadcast waves. Stark, artistic, high-contrast.
- **Concept C:** The Origami Co-Pilot — a friendly origami bird wearing a telephone headset on a cobalt gradient badge. Warm, memorable, and consumer-friendly.

---

## 2. In one sentence, what are you building? *

**Recommended answer (Option A — strongest for judges and investors):**

> **An AI voice copilot that calls Japanese hotels, restaurants, and services in fluent, polite Keigo on your behalf — pausing to put high-stakes decisions on your screen in English so you stay in full control.**

**Alternative 1 (Option B — category analogy):**

> **The bilingual telephone copilot for Japan travel: an AI that handles the polite Japanese call while you steer the conversation in English through one-tap decision cards.**

**Alternative 2 (Option C — problem-focused):**

> **A real-time, human-in-the-loop voice proxy that lets non-Japanese-speaking travelers confidently manage reservations, changes, and inquiries over the phone.**

---

## 3. What problem are you solving?

**Subtitle:** *Who has this problem today, and what does it cost them?*

> Over thirty-six million international tourists visit Japan each year, and more than ninety percent do not speak Japanese. Despite Japan's high-tech reputation, a surprising amount of daily hospitality commerce still runs exclusively on the phone: traditional ryokans, boutique omakase counters, luggage forwarding services, taxi fleets, and local clinics require bookings, changes, and confirmations to be conducted over a landline call — exclusively in polite honorific Japanese (Keigo).
>
> Today's workarounds are fundamentally broken. In-person translation apps cannot be bridged into a telephone call, and fully autonomous voice AI is too risky when real money is on the line — no traveler wants an LLM to guess whether to forfeit a five-hundred-dollar multi-course dinner when a hotel announces that meal service ends before a delayed train arrives. Hotel concierges and Japanese-speaking friends are slow, scarce, and unavailable after hours.
>
> This failure costs travelers real money and ruined trips: non-refundable deposits between two hundred and one thousand dollars lost on missed meals and no-shows, hours wasted hunting for bilingual help, and immense anxiety during high-stress moments like flight delays, lost luggage, or medical questions. It also costs small Japanese businesses significant revenue in empty tables and misunderstandings that never get resolved. Moshi-Pilot eliminates this friction by letting travelers steer genuine Japanese phone conversations in English, with AI handling the language and humans making the decisions.

---

## 4. Visit (Links)

- **Website / Live Demo URL:** `https://moshi-pilot.vercel.app` *(update once deployed; temporarily you can keep the GitHub link)*
- **GitHub Repository:** `https://github.com/dev-ansung/moshi-pilot`

---

## 5. Technologies and Platforms

**Already added:** Vapi, Deepgram, Exa, Manus, Vercel

**Recommended additions (if the form accepts more tags):**
- **TypeSafe / Jev** — structured decision-engine routing between auto-reply and human escalation (part of your core partner stack)
- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**

---

## 6. Features

**Option 1: Short tag format (for chip-based inputs):**
Polite Keigo Voice Proxy • Deterministic Human-in-the-Loop Escalation • Live 1-Tap Decision Cards • English Whisper Steering • Pre-Call Web Grounding • Post-Call Confirmation Receipts

**Option 2: Blurb format (for text/list inputs):**
1. **Polite Keigo Voice Proxy** — Dials Japanese businesses and conducts natural, honorific-level phone conversations on your behalf.
2. **Deterministic HITL Escalation** — Automatically detects high-stakes decision points (fees, cancellations, policy clashes) instead of guessing.
3. **Live 1-Tap Decision Cards** — Buys time with polite Japanese filler phrases while pushing translated choice cards to your screen.
4. **English Whisper Steering** — Type instructions mid-call in English; the agent weaves them into its next Japanese sentence.
5. **Pre-Call Web Grounding** — Auto-fetches venue phone numbers, hours, and cancellation rules with Exa before dialing.
6. **Post-Call Receipt & Itinerary Summary** — Dispatches a structured confirmation log and itinerary update via Manus once the call ends.

---

## 7. Primary Users

**Option 1: Short tag format:**
Inbound tourists in Japan • Foreign expats and digital nomads • Frequent business travelers • Travel agents and concierges

**Option 2: Blurb format:**
1. **International tourists visiting Japan** — The 36+ million annual visitors who want authentic experiences (ryokans, omakase, local tours) but cannot call in Japanese.
2. **Foreign expats and digital nomads** — Residents who need to manage clinic visits, luggage forwarding, utility calls, and service appointments without a translator on retainer.
3. **Frequent business travelers** — Professionals who must confirm logistics, dinner arrangements, and schedule changes quickly between meetings.
4. **Boutique travel agents and concierges** — Advisors booking phone-only Japanese venues for high-value English-speaking clients.

---

## Key Stats & Proof Points (for judges / slides)

- **Market size:** 36.9 million inbound visitors to Japan in 2024, with the Japanese government targeting 40 million visitors; inbound travel spending exceeded 8 trillion yen.
- **Language barrier:** The vast majority of inbound travelers speak zero Japanese, while Keigo is difficult even for native speakers.
- **Unique wedge:** Phone-only venues are precisely the highest-margin, highest-value experiences in Japan (luxury ryokans, Michelin-level omakase, private transport).
- **Why now:** Real-time voice stacks (Vapi + Deepgram) and structured LLM routing (TypeSafe/Jev) make sub-second, HITL-enabled voice agents technically feasible for the first time.
