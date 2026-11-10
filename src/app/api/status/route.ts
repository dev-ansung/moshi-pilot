import { NextResponse } from "next/server";

export async function GET() {
  const deepgram = Boolean(process.env.DEEPGRAM_API_KEY);
  const fish = Boolean(process.env.FISH_AUDIO_API_KEY);
  const typesafe = Boolean(process.env.TYPESAFE_API_KEY);
  const livekit = Boolean(
    process.env.LIVEKIT_URL && process.env.LIVEKIT_API_KEY && process.env.LIVEKIT_API_SECRET
  );
  const llm = Boolean(process.env.OPENAI_API_BASE && process.env.OPENAI_API_KEY);
  const exa = Boolean(process.env.EXA_API_KEY);

  return NextResponse.json({
    services: { deepgram, fishAudio: fish, typeSafe: typesafe, liveKit: livekit, llm, exa },
    realModeReady: deepgram && fish && typesafe && llm,
    appName: process.env.NEXT_PUBLIC_APP_NAME || "Moshi-Pilot",
  });
}
