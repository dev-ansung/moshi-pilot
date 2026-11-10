# Moshi-Pilot — 2-Minute Demo Script (verbatim dialogue + narration)

**Scenario:** Late check-in call to a Kyoto ryokan, driven by the AI voice agent while your phone sits on speaker next to your laptop.

---

## 0:00–0:10 · The Cinematic Hook (Seedance)

- **On screen:** A nervous traveler outside a Kyoto ryokan at night in the rain; a glowing origami crane emerges from his phone into a bilingual speech wave.
- **Narration:** *"Every year, millions of travelers stand outside Japanese hotels, ryokans, and restaurants — needing to talk, but unable to speak a single word of polite Japanese."*

## 0:10–0:25 · Setup: write the topic in English

- **On screen:** Phone home screen. The 3-step banner reads:
  1. Write call topic in English
  2. Call the hotel from your phone — put it on speaker next to your laptop
  3. Tap **Call via AI Agent** — it speaks Keigo, listens, and pauses for your decisions with polite fillers
- **User types the topic:** *"Notify Kyoto Hatago Ryokan that reservation #402 under Satō will arrive at 9:30 PM instead of 6:00 PM due to a train delay. Hold our room."*
- **Selects:** Japan (Keigo, polite) · Hotel category
- **Narration:** *"Most AI calling products try to be a phone company. Moshi-Pilot doesn't. You make the call yourself — phone on speaker next to your laptop — and let Moshi-Pilot be the voice that drives the conversation."*

## 0:25–0:40 · The five real APIs behind it

- **On screen:** Live stack chips: Deepgram ✓ · Fish Audio ✓ · TypeSafe Jev ✓ · gpt-5-mini ✓ · LiveKit ✓
- **Narration:** *"You write what you want in plain English. The stack runs on five real APIs: Deepgram for multilingual speech recognition, Fish Audio for polite foreign-language speech, TypeSafe's Jev model for decision routing, gpt-5-mini for translation into authentic honorific registers, and LiveKit for real-time audio."*

## 0:40–1:05 · The call begins — verbatim dialogue

- **On screen:** User taps **"Call via AI Agent"**. Green status: *Speaking Japanese · Keigo (polite)*. Animated waveform. Bilingual transcript renders live.

**Turn 1 — Hotel answers:**
> **Hotel Staff (田中):**「はい、京都旅籠でございます。いつもご利用ありがとうございます。」
> *(EN: "Yes, this is Kyoto Hatago Ryokan. Thank you as always for your patronage.")*

**Turn 2 — Agent introduces the reservation in polite Keigo:**
> **Moshi-Pilot:**「恐れ入ります。本日ご宿泊予定の予約番号402番、佐藤様についてお伺い申し上げます。新幹線の遅延により、到着時刻が午後9時30分頃になる見込みでございます。大変申し訳ございません。」
> *(EN: "Excuse me, I am calling regarding reservation #402 under Mr./Ms. Satō for tonight. Due to a train delay, their arrival is expected around 9:30 PM. We sincerely apologize.")*

- **Narration:** *"The agent introduces the reservation in proper Keigo. The hotel answers in Japanese — Deepgram transcribes under 300 milliseconds — and you read the conversation live in English, with romaji so you always know what's being said."*

## 1:05–1:30 · The decision: polite filler + one-tap card

**Turn 3 — Hotel's curveball:**
> **Hotel Staff:**「かしこまりました。ただいまのチェックインであればお部屋は確保できますが、会席のご夕食は午後8時までのご案内となっておりまして、以降はお召し上がりいただけません。いかがなさいますでしょうか。」
> *(EN: "Understood. The room is held, but kaiseki dinner service is strictly available until 8 PM and cannot be served after. How would you like to proceed?")*

- **TypeSafe / Jev evaluates the branch** and scores it as a decision requiring human confirmation.
- **The agent buys time with a culturally authentic filler phrase (no dead air!):**

**Turn 4 — Polite filler:**
> **Moshi-Pilot:**「少々お待ちください。お客様にご確認いたしております。」
> *(EN: "One moment please, I am confirming with the customer.")*

- **Decision card pops up** with TypeSafe confidence badge:
  - **Cancel dinner, keep room** ← *夕食をお取り消し、お部屋のみ継続 — no extra fee*
  - **I'll rush to arrive by 7:45 PM**
- **User taps "Cancel dinner, keep room".**
- **Agent delivers the confirmed answer in Keigo:**

**Turn 5 — Agent confirms:**
> **Moshi-Pilot:**「夕食の予約をキャンセルしていただき、客室の予約はそのままにしていただけますでしょうか。午後9時30分頃に到着する見込みです。」
> *(EN: "Could you please cancel the dinner reservation and keep the room reservation as is? We expect to arrive around 9:30 PM.")*

**Turn 6 — Hotel agrees:**
> **Hotel Staff:**「かしこまりました。お気を付けてお越しください。」
> *(EN: "Understood. Please have a safe trip.")*

- **Narration:** *"Here is the most important screen in the product. Instead of dead air, Moshi-Pilot speaks a natural Japanese filler — buying time without awkward silence — while TypeSafe's decision engine pushes a translated multiple-choice card to your screen. The deterministic human-in-the-loop guarantee: the agent never commits to money, fees, or policy changes without your explicit tap."*

## 1:30–1:55 · Whisper steering & the Manus receipt

- **Mid-call steering:** User types an English whisper: *"Ask if they can hold our bags tomorrow"*. Agent weaves it in:
> **Moshi-Pilot:**「恐れ入りますが、明日のチェックアウト後にお荷物をお預かりいただくことは可能でしょうか。」
> **Hotel Staff:**「はい、可能でございます。」
- **User taps "End call".**
- **Manus auto-compiles the transcript into a structured confirmation receipt:**
  - Venue: Kyoto Hatago Ryokan · Reservation 402
  - Agreed points: late check-in held to 21:30; dinner service ended; dinner cancelled with no fee; room kept; bags held after check-out
  - Updated schedule: Late check-in 21:30 JST · Dinner cancelled · Luggage hold tomorrow
  - One-click copy for email/SMS
- **Narration:** *"Mid-call, you steer with live English whispers. When you're done, a Manus automation turns the entire call into a structured itinerary receipt — agreed points, updated schedule, ready to paste into email or SMS."*

## 1:55–2:00 · Outro

- **On screen:** Logo + moshi-pilot.vercel.app + GitHub link + Side Quest Hotline badge.
- **Narration:** *"Moshi-Pilot. Your phone, your voice agent, your decisions. Available live at moshi-pilot.vercel.app."*
