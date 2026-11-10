import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function POST(req: Request) {
  try {
    const { room = "moshi-pilot-demo", identity = `traveler-${Date.now()}` } =
      await req.json();

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const url = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !url) {
      return NextResponse.json(
        { error: "LiveKit not configured" },
        { status: 500 }
      );
    }

    const at = new AccessToken(apiKey, apiSecret, { identity, name: "Traveler" });
    at.addGrant({ roomJoin: true, room });
    const token = await at.toJwt();

    return NextResponse.json({ token, url, room, identity });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Token generation failed" },
      { status: 500 }
    );
  }
}
