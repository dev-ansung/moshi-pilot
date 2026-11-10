import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const key = process.env.TYPESAFE_API_KEY;
    const { transcript, lastTurn, context = "" } = await req.json();

    if (!transcript && !lastTurn) {
      return NextResponse.json({ error: "Missing transcript or lastTurn" }, { status: 400 });
    }

    if (!key) {
      // Graceful fallback when no key is set
      return NextResponse.json({
        escalate: false,
        confidence: 0.5,
        source: "fallback",
      });
    }

    const state = JSON.stringify({
      context,
      transcript: transcript || lastTurn,
      lastTurn,
    });

    const r = await fetch("https://api.typesafe.ai/v1/systemone", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        state,
        model: "jev-latest",
        questions: {
          needs_escalation: {
            type: "noul",
            instructions:
              "Does the staff member's last statement propose a branching choice, cancellation, extra fee, date/time conflict, policy exception, or any decision where the traveler must choose between meaningful outcomes?",
          },
          action: {
            type: "choice",
            instructions: "What should the voice assistant do next?",
            criteria: {
              escalate_to_user:
                "Ask the traveler to choose between options before answering",
              auto_reply:
                "Answer politely and handle routine confirmation without bothering the traveler",
            },
          },
          urgency: {
            type: "noul",
            instructions: "Is the situation time-sensitive or urgent?",
          },
        },
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      return NextResponse.json({ error: err }, { status: 502 });
    }

    const data = await r.json();
    const escalateNoul = data.answers?.needs_escalation?.noul ?? 0.3;
    const choice = data.answers?.action?.choice;
    const choiceConfidence = data.answers?.action?.confidence ?? 0.7;
    const urgency = data.answers?.urgency?.noul ?? 0.2;

    const escalate = choice === "escalate_to_user" || escalateNoul >= 0.5;

    return NextResponse.json({
      escalate,
      choice,
      confidence: Math.round(choiceConfidence * 100),
      escalateScore: escalateNoul,
      urgency,
      model: data.model,
      source: "typesafe-jev",
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Decision check failed" },
      { status: 500 }
    );
  }
}
