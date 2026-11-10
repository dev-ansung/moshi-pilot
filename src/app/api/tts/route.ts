import { NextResponse } from "next/server";

export const runtime = "nodejs";

// In-memory cache for repeated phrases (filler phrases, greetings)
const cache = new Map<string, { buf: ArrayBuffer; ct: string; exp: number }>();

export async function POST(req: Request) {
  try {
    const key = process.env.FISH_AUDIO_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "Fish Audio not configured" }, { status: 500 });
    }

    const { text, format = "mp3" } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const cacheKey = `${format}:${text.slice(0, 160)}`;
    const cached = cache.get(cacheKey);
    if (cached && cached.exp > Date.now()) {
      return new Response(cached.buf.slice(0), {
        headers: {
          "Content-Type": cached.ct,
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    const r = await fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        format,
        latency: "low",
        normalize: true,
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      return NextResponse.json({ error: err }, { status: 502 });
    }

    const ct = r.headers.get("content-type") || "audio/mpeg";
    const buf = await r.arrayBuffer();

    // Cache short phrases for 24h
    if (text.length <= 120 && cache.size < 200) {
      cache.set(cacheKey, { buf, ct, exp: Date.now() + 86400_000 });
    }

    return new Response(buf, {
      headers: {
        "Content-Type": ct,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "TTS failed" },
      { status: 500 }
    );
  }
}
