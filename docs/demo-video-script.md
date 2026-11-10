# Moshi-Pilot — 2-Minute Demo Video Script & Storyboard

**Total length:** ~2:00  
**Format:** Screen recording of `https://moshi-pilot.vercel.app` + voiceover narration (Loom, OBS, or QuickTime)  
**Tone:** Confident, concise, focused on the human-in-the-loop trust guarantee and the five partner technologies  
**Built for:** Side Quest Hotline Vapi Hackathon @ Vapi HQ  

---

## Shot-by-Shot Timeline

| Time | Scene | On-Screen Action | Voiceover (read aloud) | Visual Callout |
|---|---|---|---|---|
| **0:00–0:15** | Hook & Problem | Show dashboard landing page, zoom on tagline | *"Traveling in Japan is incredible until you need to make a phone call. Traditional ryokans, omakase counters, luggage services, and clinics still only confirm changes by phone — and only in Japanese. Translation apps can't bridge a phone call, and fully autonomous voice bots are too risky when a five-hundred-dollar dinner is on the line."* | Highlight tagline + problem |
| **0:15–0:30** | Solution & Setup | Hover the scenario switcher → select "Kyoto Ryokan — Late Check-In", point to the Exa grounding panel | *"Meet Moshi-Pilot: a bilingual voice copilot that calls Japanese businesses in fluent, polite Keigo while you steer in English. Here we're letting Kyoto Hatago Ryokan know our party will arrive late at 9:30 PM. Before we even dial, Exa has automatically grounded the agent with the ryokan's hours and its strict 8:00 PM dinner policy."* | Exa grounding card |
| **0:30–0:50** | The Call Begins | Click "Dial venue with Moshi-Pilot", watch the live waveform and bilingual transcript stream | *"We hit dial. Vapi places an outbound SIP call, and the receptionist answers in Japanese. Deepgram's nova-2 transcribes it in real time, and Moshi-Pilot politely introduces the guest in honorific Japanese, asking for a 9:30 PM check-in."* | Live waveform + transcript |
| **0:50–1:15** | The Curveball & HITL | Hotel responds with the dinner cutoff; filler turn fires; decision card appears | *"The hotel agrees to the late check-in — but there's a catch: dinner service strictly ends at 8:00 PM. An autonomous bot would have to guess whether to forfeit a prepaid kaiseki dinner. Instead, TypeSafe/Jev detects a high-stakes branching policy, the agent buys time with polite Japanese filler, and pushes a translated one-tap decision card to our screen."* | Filler pill + decision card modal |
| **1:15–1:35** | Decision + Whisper | Tap "[Cancel dinner, keep room]", then type a quick English whisper in the input bar | *"We tap 'Cancel dinner, keep room' — and while the call is live, we whisper an extra instruction in English: 'Ask if they can hold our bags tomorrow.' The agent weaves it seamlessly into its next Japanese sentence, the hotel confirms, and the call wraps up."* | Whisper bubble + Keigo confirmation |
| **1:35–1:55** | Receipt & Partner Stack | Show Manus confirmation receipt panel + partner widget | *"The moment we hang up, Manus compiles the verified transcript into a structured itinerary update and dispatches the receipt by email and SMS — who we spoke with, agreed terms, and new arrival windows. Every call runs through all five partners: Vapi for voice, Deepgram for transcription, TypeSafe/Jev for decisions, Exa for search, and Manus for automation."* | Manus receipt + partner chips |
| **1:55–2:00** | Close | Final tagline screen | *"Moshi-Pilot: speak fluent Keigo over the phone — without speaking a word of Japanese. Try it live at moshi-pilot.vercel.app. Thank you."* | Logo + live demo URL |

---

## Recording Tips

1. **Resolution & layout:** Record at 1920×1080, browser maximized at 100% zoom on a desktop layout (left grounding / center console / right receipt).
2. **Audio:** Use a decent external microphone; the transcript text does the heavy lifting, but clear narration sells the demo.
3. **Pacing:** Practice reading the script once before recording — 130–140 words per minute lands you almost exactly at 1:55.
4. **Auto-pilot option:** Click **"Stage Demo (90s)"** in the header — the entire flow (dial → hotel → filler → decision → whisper → receipt) runs itself on a realistic timer so you can focus 100% on narrating.
5. **If live Vapi audio is connected:** switch the call audio to speakerphone so the Japanese voice is audible in the recording (this is always the most impressive part for judges).
6. **Hosting:** Upload as unlisted on YouTube or share a Loom link in your submission.

---

## Key Talking Points for Judges

- **Why HITL matters:** *"Autonomous voice agents guess; travel money is unforgiving. Deterministic escalation is the difference between a toy and a product you'd actually use with your family's vacation."*
- **Why Keigo is a moat:** *"Polite honorific Japanese is hard even for native speakers — getting it right over the phone is the cultural trust key to Japanese hospitality."*
- **Market:** *"36.9 million inbound visitors to Japan in 2024, with 8+ trillion yen spend — and the highest-margin experiences are precisely the phone-only ones."*
