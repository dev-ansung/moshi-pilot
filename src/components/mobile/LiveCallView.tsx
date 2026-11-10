"use client";

import { useRef, useEffect, useState } from "react";
import {
  Mic,
  MicOff,
  PhoneOff,
  Send,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Volume2,
} from "lucide-react";
import { CallStatus, DecisionCard, Turn } from "@/lib/mobile/types";
import { Country } from "@/lib/mobile/countries";

interface Props {
  status: CallStatus;
  turns: Turn[];
  decision: DecisionCard | null;
  duration: number;
  country: Country;
  busy: boolean;
  recording: boolean;

  realMode: boolean;
  onAnswer: (o: { id: string; label: string }) => void;
  onWhisper: (t: string) => void;
  onEnd: () => void;
  onStep?: () => void;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onPlayAgain?: (text: string) => void;
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function LiveCallView({
  status,
  turns,
  decision,
  duration,
  country,
  busy,
  recording,
  realMode,
  onAnswer,
  onWhisper,
  onEnd,
  onStep,
  onStartRecording,
  onStopRecording,
  onPlayAgain,
}: Props) {
  const [whisperText, setWhisperText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, decision]);

  const live =
    status === "in_call" || status === "escalating" || status === "user_deciding";

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Call hero card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{country.flag}</span>
            <div>
              <div className="text-xs font-semibold text-white">
                {country.name} · {country.langName}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">
                {country.formality}
              </div>
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            {fmt(duration)}
          </span>
        </div>

        {/* Status pill */}
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span
              className={`w-2 h-2 rounded-full ${
                status === "connecting"
                  ? "bg-amber-400 animate-ping"
                  : live
                  ? "bg-emerald-400 animate-pulse"
                  : status === "resolved"
                  ? "bg-zinc-500"
                  : "bg-zinc-600"
              }`}
            />
            {status === "connecting" && "Dialing…"}
            {status === "in_call" && "Live · AI proxy speaking"}
            {status === "escalating" && "Polite filler playing — decision needed"}
            {status === "user_deciding" && "Waiting for your decision"}
            {status === "resolved" && "Call resolved"}
          </span>
          {busy && (
            <span className="text-[10px] text-zinc-500 animate-pulse">
              translating…
            </span>
          )}
        </div>

        {/* Animated audio waveform */}
        {live && (
          <div className="h-8 flex items-center justify-center gap-1">
            {[4, 9, 14, 22, 17, 26, 30, 24, 18, 12, 7, 16, 28, 20, 11].map(
              (h, i) => (
                <span
                  key={i}
                  className="w-1 rounded-full bg-emerald-400/80 transition-all duration-300"
                  style={{
                    height: `${Math.max(4, (h * (status === "in_call" ? 1 : 0.4)) % 32)}px`,
                    animationDelay: `${i * 60}ms`,
                  }}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* HITL Decision card popup */}
      {decision && (
        <div className="rounded-2xl border border-white/20 bg-gradient-to-b from-zinc-900 to-zinc-950 p-3.5 space-y-3 shadow-2xl ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="uppercase tracking-widest text-zinc-300 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Human-in-the-loop decision
            </span>
            {decision.confidence !== undefined && (
              <span className="text-zinc-500">
                {decision.source} · {decision.confidence}% conf
              </span>
            )}
          </div>
          <p className="text-xs text-white leading-relaxed font-medium">
            {decision.title}
          </p>
          {decision.description && (
            <p className="text-[11px] text-zinc-400 italic">
              {decision.description}
            </p>
          )}
          {decision.reason && (
            <p className="text-[10px] text-zinc-500 font-mono">
              {decision.reason}
            </p>
          )}
          <div className="space-y-1.5 pt-1">
            {decision.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onAnswer(opt)}
                className={`w-full text-left p-2.5 rounded-xl border text-xs font-mono transition flex items-center justify-between ${
                  opt.recommended
                    ? "border-white bg-white text-black font-semibold hover:bg-zinc-100"
                    : "border-zinc-700 bg-zinc-900/60 text-zinc-200 hover:border-zinc-500"
                }`}
              >
                <div>
                  <div>{opt.label}</div>
                  {opt.sub && (
                    <div
                      className={`text-[10px] font-normal ${
                        opt.recommended ? "text-zinc-700" : "text-zinc-500"
                      }`}
                    >
                      {opt.sub}
                    </div>
                  )}
                </div>
                {opt.recommended ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-black ml-2" />
                ) : (
                  <ChevronRight className="w-4 h-4 shrink-0 text-zinc-500 ml-2" />
                )}
              </button>
            ))}
          </div>
          <div className="text-[9px] text-zinc-500 font-mono text-center">
            Agent never commits to money/policy changes without your tap.
          </div>
        </div>
      )}

      {/* Transcript feed */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
          Live bilingual transcript
        </div>
        {turns.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-800 p-4 text-center text-xs text-zinc-600 font-mono">
            Waiting for speech…
          </div>
        )}
        {turns.map((t) => {
          const isAgent = t.speaker === "agent";
          const isWhisper = t.speaker === "whisper";
          const isSystem = t.speaker === "system";
          return (
            <div
              key={t.id}
              className={`rounded-xl border p-2.5 text-xs space-y-1 transition ${
                isSystem
                  ? "border-zinc-800/60 bg-zinc-950/60 text-zinc-400 font-mono text-[10px]"
                  : isWhisper
                  ? "border-purple-900/40 bg-purple-950/20 text-purple-200 font-mono text-[11px]"
                  : isAgent
                  ? "border-zinc-800 bg-black text-zinc-200"
                  : t.isFiller
                  ? "border-amber-900/40 bg-amber-950/20 text-amber-200 font-mono"
                  : "border-zinc-800 bg-zinc-900/70 text-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span className="font-semibold text-zinc-400">
                  {t.speakerLabel}
                </span>
                <span>{t.timestamp}</span>
              </div>
              <p className="text-xs text-white leading-relaxed font-sans font-medium">
                {t.text}
              </p>
              {t.romaji && (
                <p className="text-[10px] text-zinc-500 italic font-mono leading-tight">
                  {t.romaji}
                </p>
              )}
              {t.translation && (
                <p className="text-[11px] text-zinc-400 font-mono pt-0.5 border-t border-zinc-800/80">
                  {t.translation}
                </p>
              )}
              {onPlayAgain && !isSystem && !isWhisper && (
                <button
                  type="button"
                  onClick={() => onPlayAgain(t.text)}
                  className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono inline-flex items-center gap-1 pt-0.5"
                >
                  <Volume2 className="w-2.5 h-2.5" /> replay
                </button>
              )}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Mid-call whisper steering bar */}
      {live && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (whisperText.trim()) {
              onWhisper(whisperText.trim());
              setWhisperText("");
            }
          }}
          className="flex items-center gap-1.5"
        >
          <input
            type="text"
            value={whisperText}
            onChange={(e) => setWhisperText(e.target.value)}
            placeholder='Whisper in English — "ask if they can hold bags"'
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
          />
          <button
            type="submit"
            disabled={!whisperText.trim() || busy}
            className="px-3 py-2 rounded-xl bg-white text-black text-xs font-mono font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 transition"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      )}

      {/* Action footer */}
      {live && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {realMode ? (
            <button
              type="button"
              onClick={recording ? onStopRecording : onStartRecording}
              className={`py-3 rounded-xl border text-xs font-mono font-semibold flex items-center justify-center gap-2 transition ${
                recording
                  ? "border-red-500 bg-red-950/60 text-red-300 animate-pulse"
                  : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-500"
              }`}
            >
              {recording ? (
                <>
                  <MicOff className="w-4 h-4" /> Stop & transcribe
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" /> Record foreign reply
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onStep}
              className="py-3 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-200 text-xs font-mono hover:border-zinc-500 font-semibold"
            >
              Step demo turn ▸
            </button>
          )}
          <button
            type="button"
            onClick={onEnd}
            className="py-3 rounded-xl bg-red-600 text-white text-xs font-mono font-semibold hover:bg-red-500 transition flex items-center justify-center gap-2"
          >
            <PhoneOff className="w-4 h-4" /> End call
          </button>
        </div>
      )}
    </div>
  );
}
