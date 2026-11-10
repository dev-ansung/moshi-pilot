# Moshi-Pilot — Submission Copy

Use these answers to fill the hackathon submission form.

---

## Logo

Upload one of the files in `public/assets/`:

- **Concept C (emerald, recommended):** `public/assets/moshi_pilot_logo_concept_c.png`
- Concept A (cyan): `public/assets/moshi_pilot_logo_concept_a.png`
- Concept B (coral): `public/assets/moshi_pilot_logo_concept_b.png`

All are square, 1024×1024 PNG (>256 px required), origami paper-crane motif
("Moshi-Pilot" / もしもし = hello on the phone).

---

## One sentence

> **"The bilingual voice co-pilot for foreign services: put your phone on speaker next to your laptop, write the topic in English, and Moshi-Pilot drives the call in fluent polite foreign speech — pausing with culturally authentic filler phrases until you tap a human-in-the-loop decision card."**

Short versions:
- "Canva for dashboards, but a Keigo voice co-pilot for Japan travel."
- "The voice agent that calls the hotel for you while you hold the phone."

---

## What problem are you solving? Who has this problem today, and what does it cost them?

> 36 million people visit Japan every year, and the vast majority do not
> speak Japanese. Japan's hospitality culture is famously phone-first — ryokans,
> high-end omakase restaurants, and courier services expect verbal negotiation
> in polite Keigo. When a train delay threatens a 7 PM dinner, travelers have
> three bad options: silently forfeit a $400 kaiseki meal, scramble for a
> concierge, or make an incomprehensible phone call.
>
> General translation apps cannot hold a live conversation. Full-autonomy
> telephony bots are dangerous because they can commit you to cancellation fees
> or policy changes without your confirmation. Human interpretation services are
> slow, expensive, and unavailable at 10 PM.
>
> **Moshi-Pilot removes all three costs.** You write the call topic once in
> English, call from your own phone on speaker, and the agent drives the
> conversation in authentic polite speech. The moment a financial or policy
> commitment arises, the agent pauses politely with a natural local-language
> filler phrase and pushes a translated multiple-choice decision card to your
> screen — one tap, nothing assumed. A Manus automation compiles the entire call
> into a structured confirmation receipt.

---

## Visit links

- **GitHub repository:** https://github.com/dev-ansung/moshi-pilot
- **Live application:** https://moshi-pilot.vercel.app

---

## Technologies & platforms

- **Deepgram** — multilingual speech-to-text (Nova-2), <300 ms latency
- **Fish Audio** — multilingual text-to-speech for polite foreign output
- **TypeSafe / Jev** — structured System One decision engine with confidence scores
- **gpt-5-mini** — bidirectional translation into honorific registers + receipt compilation
- **LiveKit** — real-time WebRTC audio rooms
- **Next.js 15 · Tailwind CSS · TypeScript · Vercel**

---

## Features

1. **Speakerphone-native voice agent** — write the topic in English, call from your phone on speaker, let the agent drive the call
2. **Polite fillers during decisions** — culturally authentic "hold" phrases in the local language (*少々お待ちください。同行者と相談いたします。*)
3. **Deterministic HITL guarantee** — decision cards with confidence scores; zero financial/policy commitments without your tap
4. **Live bilingual transcript** — kanji/kana + romaji + English with speaker labels
5. **Live whisper steering** — type in English mid-call; agent weaves it into the next sentence
6. **Manus confirmation receipts** — structured itinerary diffs compiled from real transcripts
7. **Two-way interpreter tab** — in-person live voice translation
8. **Service directory** — ready-made call topics per service
9. **Demo mode** — offline-safe authentic dialogue for stage presentations

---

## Primary users

1. **Foreign travelers in Japan** (and 9+ other countries) who need to negotiate with hotels, ryokans, omakase restaurants, and courier services in polite local language.
2. **Hotels & service staff** who receive fluent, polite calls from non-Japanese guests instead of confusion.
3. **Concierge desks & tour operators** looking for an AI layer that handles routine guest-venue phone coordination safely.
