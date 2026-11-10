export interface TranslateResult {
  translation: string;
  romaji?: string;
  sourceLang: string;
  targetLang: string;
}

export interface DecisionResult {
  escalate: boolean;
  choice?: "escalate_to_user" | "auto_reply";
  confidence: number;
  escalateScore?: number;
  urgency?: number;
  model?: string;
  source: string;
}

export interface ServiceStatus {
  services: {
    deepgram: boolean;
    fishAudio: boolean;
    typeSafe: boolean;
    liveKit: boolean;
    llm: boolean;
    exa: boolean;
  };
  realModeReady: boolean;
  appName: string;
}

export async function checkStatus(): Promise<ServiceStatus> {
  const r = await fetch("/api/status");
  return r.json();
}

export async function translateText(opts: {
  text: string;
  sourceLang?: string;
  targetLang?: string;
  formality?: "polite" | "natural";
  context?: string;
  includeRomaji?: boolean;
}): Promise<TranslateResult> {
  const r = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function speechToText(
  audioBlob: Blob,
  language = "ja"
): Promise<{ transcript: string; confidence: number; duration: number }> {
  const form = new FormData();
  form.append("audio", audioBlob);
  form.append("language", language);
  const r = await fetch("/api/stt", { method: "POST", body: form });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function speakText(text: string): Promise<HTMLAudioElement> {
  const r = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!r.ok) throw new Error(await r.text());
  const blob = await r.blob();
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play().catch(() => {});
  return audio;
}

export async function evaluateDecision(opts: {
  transcript?: string;
  lastTurn?: string;
  context?: string;
}): Promise<DecisionResult> {
  const r = await fetch("/api/decision", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function getLiveKitToken(room = "moshi-pilot"): Promise<{
  token: string;
  url: string;
}> {
  const r = await fetch("/api/livekit-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ room }),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function compileReceipt(opts: {
  turns: Array<{ speaker?: string; text?: string; translation?: string; timestamp?: string }>;
  destination?: string;
  scenario?: unknown;
}): Promise<unknown> {
  const r = await fetch("/api/receipt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
