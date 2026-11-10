import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { turns, scenario = {}, destination = "" } = await req.json();

    const base = process.env.OPENAI_API_BASE;
    const key = process.env.OPENAI_API_KEY;
    if (!base || !key) {
      return NextResponse.json({ error: "LLM not configured" }, { status: 500 });
    }

    const transcriptText = (turns || [])
      .map(
        (t: { speaker?: string; text?: string; translation?: string; timestamp?: string }) =>
          `[${t.timestamp || ""}] ${t.speaker || "Speaker"}: ${t.text || ""} ${t.translation ? `(EN: ${t.translation})` : ""}`
      )
      .join("\n");

    const prompt = `You compile structured post-call confirmation receipts from travel-service phone calls.
Return JSON with exactly these keys:
- venue: string
- reservationId: string
- agreedPoints: string[] (key commitments made during the call)
- updatedSchedule: { event: string, time: string }[] (new itinerary items, e.g. "Late check-in": "21:30 JST")
- summary: string (one-sentence English summary)
- followUps: string[] (any action items remaining)

Context: destination=${destination}, scenario=${JSON.stringify(scenario)}.
Transcript:
${transcriptText}

JSON only, no markdown fences.`;

    const r = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        messages: [{ role: "system", content: prompt }],
        temperature: 0.2,
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      return NextResponse.json({ error: err }, { status: 502 });
    }

    const data = await r.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || "{}";
    const cleaned = raw.replace(/^```json?\s*|\s*```$/g, "");
    let receipt: unknown;
    try {
      receipt = JSON.parse(cleaned);
    } catch {
      receipt = { summary: raw, agreedPoints: [], updatedSchedule: [] };
    }

    return NextResponse.json({ receipt, source: "manus-workflow" });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Receipt generation failed" },
      { status: 500 }
    );
  }
}
