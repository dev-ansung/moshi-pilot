import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      text,
      sourceLang = "auto",
      targetLang = "English",
      formality = "polite",
      context,
      includeRomaji = false,
    } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const base = process.env.OPENAI_API_BASE;
    const key = process.env.OPENAI_API_KEY;
    if (!base || !key) {
      return NextResponse.json({ error: "LLM not configured" }, { status: 500 });
    }

    const politeHint =
      formality === "polite"
        ? "polite/honorific/formal (Japanese Keigo, French 'vous', Spanish 'usted', Korean honorifics), natural and culturally appropriate"
        : "natural conversational";

    const prompt = `You are a multilingual voice translator helping a customer speak with foreign service staff over the phone.
Translate the input from ${sourceLang} into ${targetLang}.
CRITICAL: The speaker is the CUSTOMER themselves — always use the first person ("I / we"), never speak as an assistant, proxy, or third party. Never say "the customer" or "the traveler".
Style: ${politeHint}.
${context ? `Conversation context so far: ${context}` : ""}
${includeRomaji ? `If the output is Japanese, also provide a romaji transliteration on the last line prefixed with "romaji: ".` : ""}
Return ONLY the translation (and optional romaji line), no extra commentary, no quotes.`;

    const r = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: text },
        ],
        temperature: 0.2,
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      return NextResponse.json({ error: err }, { status: 502 });
    }

    const data = await r.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || "";
    let translation = raw;
    let romaji: string | undefined;
    const romajiMatch = raw.match(/\nromaji:\s*(.+)$/i);
    if (romajiMatch) {
      romaji = romajiMatch[1].trim();
      translation = raw.replace(/\nromaji:\s*(.+)$/i, "").trim();
    }

    return NextResponse.json({ translation, romaji, sourceLang, targetLang });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Translation failed" },
      { status: 500 }
    );
  }
}
