# Moshi-Pilot — Project Artifacts

Every artifact produced for this hackathon project lives in this repository. Nothing is stored only locally.

## Video

| File | Description | Size |
|---|---|---|
| [`public/moshi_pilot_demo.mp4`](public/moshi_pilot_demo.mp4) | Master 2-minute demo video (1080p, narrated) — 93% actual live product recording | ~9.5 MB |
| [`public/moshi_pilot_demo_preview.mp4`](public/moshi_pilot_demo_preview.mp4) | Compressed 10-second preview video | ~180 KB |
| [`public/demo_preview.gif`](public/demo_preview.gif) | Animated preview GIF embedded in README | ~325 KB |
| [`public/concept_clip_1.mp4`](public/concept_clip_1.mp4) | Standalone Seedance cinematic concept hook (10 s) | ~8.3 MB |
| [`docs/demo-video-script.md`](docs/demo-video-script.md) | Narration storyboard with scene timings | |

## Screenshots

| File | Description |
|---|---|
| [`public/screenshots/01_dashboard.png`](public/screenshots/01_dashboard.png) | Command-center dashboard with scenario switcher |
| [`public/screenshots/02_live_call_keigo.png`](public/screenshots/02_live_call_keigo.png) | Live bilingual call with Deepgram transcription |
| [`public/screenshots/03_hitl_decision_card.png`](public/screenshots/03_hitl_decision_card.png) | HITL decision card modal with polite Japanese filler |
| [`public/screenshots/04_manus_receipt.png`](public/screenshots/04_manus_receipt.png) | Manus post-call confirmation receipt |
| [`public/screenshots/hero_concept.png`](public/screenshots/hero_concept.png) | Seedance cinematic hero visual |

## Logos

| File | Description |
|---|---|
| [`public/assets/moshi_pilot_logo_concept_a.png`](public/assets/moshi_pilot_logo_concept_a.png) | Origami crane concept A (cyan) |
| [`public/assets/moshi_pilot_logo_concept_b.png`](public/assets/moshi_pilot_logo_concept_b.png) | Bilingual speech-bridge concept B (coral) |
| [`public/assets/moshi_pilot_logo_concept_c.png`](public/assets/moshi_pilot_logo_concept_c.png) | Folded phone crane concept C (emerald, chosen) |

## Submission copy & docs

| File | Description |
|---|---|
| [`docs/submission_copy.md`](docs/submission_copy.md) | Answers to all submission form fields |
| [`docs/demo-video-script.md`](docs/demo-video-script.md) | 2-minute demo narration script |
| [`public/moshi-pilot.zip`](public/moshi-pilot.zip) | Full codebase archive (excludes node_modules/.git/.next) |

## Application

The full Next.js 15 application source is in this repo at [`src/`](src/), with the landing page at [`src/app/page.tsx`](src/app/page.tsx), the scenario engine at [`src/lib/scenarios.ts`](src/lib/scenarios.ts), and the call state machine at [`src/lib/useCallSession.ts`](src/lib/useCallSession.ts).
