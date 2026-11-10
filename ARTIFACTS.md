# Moshi-Pilot — Project Artifacts

Every artifact produced for this hackathon project lives in this repository.

## Video

| File | Description | Size |
|---|---|---|
| [`public/moshi_pilot_demo.mp4`](public/moshi_pilot_demo.mp4) | Master demo video (118 s, 1080p, narrated) — 93% actual live product recording | ~9.5 MB |
| [`public/moshi_pilot_demo_preview.mp4`](public/moshi_pilot_demo_preview.mp4) | Compressed 10-second preview video | ~180 KB |
| [`public/demo_preview.gif`](public/demo_preview.gif) | Animated preview GIF embedded in README | ~325 KB |
| [`public/concept_clip_1.mp4`](public/concept_clip_1.mp4) | Standalone Seedance cinematic concept hook (10 s) | ~8.3 MB |

## Screenshots

| File | Description |
|---|---|
| [`public/screenshots/01_home.png`](public/screenshots/01_home.png) | Home / topic setup screen |
| [`public/screenshots/02_live_call.png`](public/screenshots/02_live_call.png) | Live call with animated waveform & bilingual transcript |
| [`public/screenshots/03_decision_card.png`](public/screenshots/03_decision_card.png) | HITL decision card popup with TypeSafe confidence |
| [`public/screenshots/04_interpreter.png`](public/screenshots/04_interpreter.png) | Two-way live interpreter tab |
| [`public/screenshots/05_services.png`](public/screenshots/05_services.png) | Service directory with ready-made call topics |
| [`public/screenshots/06_receipts.png`](public/screenshots/06_receipts.png) | Manus confirmation receipts with itinerary diffs |

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
| [`docs/demo_video_script.md`](docs/demo_video_script.md) | Demo narration storyboard with scene timings |
| [`public/moshi-pilot.zip`](public/moshi-pilot.zip) | Full codebase archive |

## Application

Full Next.js 15 application source at [`src/`](src/), with 6 server API routes at [`src/app/api/`](src/app/api/) (Deepgram STT, Fish Audio TTS, TypeSafe decision engine, LLM translation, LiveKit tokens, Manus receipts), and mobile UI components at [`src/components/mobile/`](src/components/mobile/).
