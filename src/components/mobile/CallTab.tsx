"use client";

import { useState } from "react";
import { PhoneCall, RotateCcw, Sparkles } from "lucide-react";
import { COUNTRIES, Country, SERVICE_CATEGORIES } from "@/lib/mobile/countries";
import { CallStatus, DecisionCard, StructuredReceipt, Turn } from "@/lib/mobile/types";
import { LiveCallView } from "./LiveCallView";

interface Props {
  country: Country;
  onCountryChange: (c: Country) => void;
  goal: string;
  onGoalChange: (g: string) => void;
  phone: string;
  onPhoneChange: (p: string) => void;
  status: CallStatus;
  turns: Turn[];
  decision: DecisionCard | null;
  receipt: StructuredReceipt | null;
  duration: number;
  busy: boolean;
  recording: boolean;
  realMode: boolean;
  onStartCall: () => void;
  onAnswer: (o: { id: string; label: string }) => void;
  onWhisper: (t: string) => void;
  onEnd: () => void;
  onReset: () => void;
  onStep?: () => void;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onPlayAgain?: (t: string) => void;
  onGoToReceipts?: () => void;
}

const GOAL_PRESETS: { label: string; text: string; countryCode: string }[] = [
  {
    label: "Late check-in",
    text: "Notify venue that reservation will arrive late at 9:30 PM instead of 6:00 PM due to train delay. Hold our room.",
    countryCode: "jp",
  },
  {
    label: "Dietary request",
    text: "Confirm our dinner reservation for 2 guests and ask if pescatarian options are available for one person.",
    countryCode: "jp",
  },
  {
    label: "Luggage reroute",
    text: "Check delivery status of luggage forwarding tracking #TK-88341 and request reroute to Tokyo hotel.",
    countryCode: "jp",
  },
  {
    label: "Taxi now",
    text: "Please send a taxi for 2 passengers to our current location as soon as possible.",
    countryCode: "kr",
  },
  {
    label: "Cancel booking",
    text: "Please cancel our reservation for tonight. Are there any cancellation fees?",
    countryCode: "fr",
  },
];

export function CallTab({
  country,
  onCountryChange,
  goal,
  onGoalChange,
  phone,
  onPhoneChange,
  status,
  turns,
  decision,
  receipt,
  duration,
  busy,
  recording,
  realMode,
  onStartCall,
  onAnswer,
  onWhisper,
  onEnd,
  onReset,
  onStep,
  onStartRecording,
  onStopRecording,
  onPlayAgain,
  onGoToReceipts,
}: Props) {
  const [cat, setCat] = useState("hotel");
  const inCall =
    status === "connecting" ||
    status === "in_call" ||
    status === "escalating" ||
    status === "user_deciding";

  const resolved = status === "resolved";

  if (inCall) {
    return (
      <LiveCallView
        status={status}
        turns={turns}
        decision={decision}
        duration={duration}
        country={country}
        busy={busy}
        recording={recording}
        realMode={realMode}
        onAnswer={onAnswer}
        onWhisper={onWhisper}
        onEnd={onEnd}
        onStep={onStep}
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
        onPlayAgain={onPlayAgain}
      />
    );
  }

  return (
    <div className="space-y-3">
      {/* Resolved banner */}
      {resolved && (
        <div className="rounded-2xl border border-emerald-800/60 bg-emerald-950/40 p-3 space-y-2">
          <div className="text-[11px] font-mono text-emerald-300 flex items-center justify-between">
            <span>Call resolved · receipt compiled</span>
            <button
              onClick={onReset}
              className="text-zinc-400 hover:text-white inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> new call
            </button>
          </div>
          {receipt && (
            <p className="text-xs text-white leading-relaxed">
              {receipt.summary}
            </p>
          )}
          <button
            type="button"
            onClick={onGoToReceipts}
            className="w-full py-2 rounded-xl bg-white text-black text-xs font-mono font-semibold hover:bg-zinc-100 transition"
          >
            View full confirmation receipt →
          </button>
        </div>
      )}

      {/* Country picker */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
          Destination & polite form
        </label>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {COUNTRIES.map((c) => {
            const sel = c.code === country.code;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => onCountryChange(c)}
                className={`shrink-0 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition flex items-center gap-1.5 ${
                  sel
                    ? "border-white bg-white text-black font-semibold"
                    : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-zinc-500 font-mono">
          Speaks {country.langName} with {country.formality} · {country.formalityHint}
        </p>
      </div>

      {/* Service category */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
          Service category
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {SERVICE_CATEGORIES.slice(0, 4).map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => setCat(sc.id)}
              className={`p-2 rounded-xl border text-[11px] font-mono text-center transition ${
                cat === sc.id
                  ? "border-zinc-400 bg-zinc-800 text-white font-semibold"
                  : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-white"
              }`}
            >
              <div className="text-base">{sc.icon}</div>
              <div className="truncate text-[10px]">{sc.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Goal textarea + presets */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
            What should the AI say? (English)
          </label>
          <span className="text-[10px] text-zinc-500 font-mono">translated live</span>
        </div>
        <textarea
          rows={3}
          value={goal}
          onChange={(e) => onGoalChange(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 leading-relaxed"
          placeholder="e.g. Call Kyoto ryokan to say we'll arrive late at 9:30 PM due to train delay"
        />
        <div className="flex gap-1 overflow-x-auto pb-1">
          {GOAL_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => onGoalChange(p.text)}
              className="shrink-0 text-[10px] font-mono px-2 py-1 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Phone input */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
          Venue phone / number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
          placeholder="+81 75-551-0000"
        />
      </div>

      {/* Trust pill */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-2.5 text-[10px] font-mono text-zinc-400 space-y-1">
        <div className="text-zinc-300 font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Deterministic HITL guarantee
        </div>
        <p className="leading-relaxed">
          The agent negotiates politely in {country.langName}, but a human-in-the-loop
          decision card appears before any commitment to money, fees, or policy
          changes. One tap from you; nothing is assumed.
        </p>
      </div>

      {/* Big call button */}
      <button
        type="button"
        onClick={onStartCall}
        disabled={!goal.trim()}
        className="w-full py-4 rounded-2xl bg-white text-black text-sm font-mono font-bold hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-lg shadow-white/5 flex items-center justify-center gap-2"
      >
        <PhoneCall className="w-4 h-4" />
        Call via AI Agent
      </button>

      <div className="text-[10px] font-mono text-center text-zinc-500">
        {realMode
          ? "Real mode: live mic → Deepgram → gpt-5-mini Keigo → Fish Audio"
          : "Demo mode: offline-safe authentic dialogue for stage presentations"}
      </div>
    </div>
  );
}
