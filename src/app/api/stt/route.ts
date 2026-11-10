import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const key = process.env.DEEPGRAM_API_KEY;
    if (!key) {
      return NextResponse.json({ error: "Deepgram not configured" }, { status: 500 });
    }

    let audioBuffer: ArrayBuffer | null = null;
    let contentType = "audio/webm";
    let language = "ja";

    const incomingType = req.headers.get("content-type") || "";
    if (incomingType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("audio");
      if (!(file instanceof Blob)) {
        return NextResponse.json({ error: "Missing audio file" }, { status: 400 });
      }
      audioBuffer = await file.arrayBuffer();
      contentType = file.type || "audio/webm";
      language = (form.get("language") as string) || language;
    } else {
      audioBuffer = await req.arrayBuffer();
      contentType = incomingType || contentType;
      const url = new URL(req.url);
      language = url.searchParams.get("language") || language;
    }

    if (!audioBuffer || audioBuffer.byteLength === 0) {
      return NextResponse.json({ error: "Empty audio" }, { status: 400 });
    }

    const params = new URLSearchParams({
      model: "nova-2",
      smart_format: "true",
      language,
      filler_words: "false",
      punctuate: "true",
    });

    const r = await fetch(`https://api.deepgram.com/v1/listen?${params.toString()}`, {
      method: "POST",
      headers: {
        Authorization: `Token ${key}`,
        "Content-Type": contentType,
      },
      body: audioBuffer,
    });

    if (!r.ok) {
      const err = await r.text();
      return NextResponse.json({ error: err }, { status: 502 });
    }

    const data = await r.json();
    const alt = data?.results?.channels?.[0]?.alternatives?.[0];
    const transcript = (alt?.transcript || "").trim();
    const confidence = alt?.confidence ?? 0;
    const duration = data?.metadata?.duration ?? 0;

    return NextResponse.json({ transcript, confidence, language, duration });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "STT failed" },
      { status: 500 }
    );
  }
}
