import React, { useRef, useEffect } from "react";
import { CallStatus, TranscriptTurn } from "@/lib/types";
import { Radio, ChevronRight, RotateCcw, Shield } from "lucide-react";

interface CallConsoleProps {
  status: CallStatus;
  turns: TranscriptTurn[];
  duration: number;
  audioLevel: number;
  onAdvance: () => void;
  onEndCall: () => void;
  autoPlay: boolean;
  onToggleAutoPlay: () => void;
  whisperSlot?: React.ReactNode;
}

const STATUS_CONFIG: Record<
  CallStatus,
  { label: string; dot: string; desc: string }
> = {
  idle: { label: "IDLE", dot: "bg-zinc-300", desc: "Ready to dial" },
  dialing: { label: "DIALING", dot: "bg-zinc-950 animate-ping", desc: "Vapi outbound SIP connecting…" },
  in_call: { label: "LIVE · IN CALL", dot: "bg-zinc-950", desc: "Japanese Keigo proxy speaking" },
  escalating: { label: "ESCALATING · HITL", dot: "bg-zinc-950 animate-pulse", desc: "Decision engine detected branching policy" },
  user_deciding: { label: "WAITING FOR YOU", dot: "bg-zinc-950 animate-pulse", desc: "Decision card pushed to your screen" },
  agent_confirming: { label: "CONFIRMING", dot: "bg-zinc-950", desc: "Relaying your decision in polite Japanese" },
  resolved: { label: "RESOLVED", dot: "bg-zinc-950", desc: "Call complete · receipt dispatched" },
  failed: { label: "FAILED", dot: "bg-zinc-400", desc: "Call could not be completed" },
};

function formatSeconds(s: number) {
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(m).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
}

export function CallConsole({
  status,
  turns,
  duration,
  audioLevel,
  onAdvance,
  onEndCall,
  autoPlay,
  onToggleAutoPlay,
  whisperSlot,
}: CallConsoleProps) {
  const feedRef = useRef<HTMLDivElement>(null);
  const cfg = STATUS_CONFIG[status];

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  const bars = [14, 38, 70, 52, 88, 64, 40, 92, 55, 30, 68, 48, 80, 24];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col h-[700px] overflow-hidden">
      {/* Top bar */}
      <div className="p-4 border-b border-zinc-200 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
          </span>
          <span className="text-xs font-mono font-semibold tracking-wider text-zinc-950">
            {cfg.label}
          </span>
          <span className="text-xs text-zinc-400 font-mono hidden sm:inline">·</span>
          <span className="text-xs text-zinc-500 hidden sm:inline">{cfg.desc}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="font-mono text-xs text-zinc-700 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-lg">
            {formatSeconds(duration)}
          </div>
          {status !== "idle" && (
            <button
              onClick={onEndCall}
              className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition"
              title="End / reset call"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Agent waveform bar */}
      <div className="px-4 py-3 bg-zinc-50/70 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-950 text-white flex items-center justify-center text-[10px] font-mono font-bold">
            M
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-950 tracking-tight flex items-center gap-1.5">
              Moshi-Pilot · Keigo voice proxy
              <span className="text-[10px] font-mono font-normal text-zinc-400">
                (Vapi + Deepgram nova-2)
              </span>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              日本語 ⇄ English · HITL guarded
            </div>
          </div>
        </div>

        {/* Live waveform */}
        <div className="flex items-center gap-1 h-6">
          {bars.map((b, i) => {
            const h = status === "in_call" || status === "agent_confirming"
              ? Math.max(3, Math.min(24, Math.round((b * audioLevel) / 100)))
              : status === "user_deciding"
              ? 3
              : 2;
            return (
              <span
                key={i}
                style={{ height: `${h}px` }}
                className="w-1 bg-zinc-950/80 rounded-full transition-all duration-150"
              />
            );
          })}
        </div>
      </div>

      {/* Transcript feed */}
      <div ref={feedRef} className="flex-1 p-4 overflow-y-auto space-y-3 font-normal text-xs">
        {turns.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 px-6">
            <Radio className="w-8 h-8 mb-2 stroke-1 text-zinc-300" />
            <p className="text-xs text-zinc-600 font-medium">No live call yet</p>
            <p className="text-[11px] text-zinc-400 mt-1 max-w-xs">
              Click &quot;Dial venue with Moshi-Pilot&quot; or hit &quot;Stage Demo&quot; to watch the real-time Keigo conversation and HITL escalation.
            </p>
          </div>
        )}

        {turns.map((t) => {
          const isAgent = t.speaker === "agent_jp";
          const isSystem = t.speaker === "system";
          const isWhisper = t.speaker === "whisper";

          if (isSystem) {
            return (
              <div key={t.id} className="text-center my-2">
                <span className="font-mono text-[10px] text-zinc-400 px-2.5 py-1 rounded-full border border-zinc-200 bg-zinc-50 inline-block">
                  {t.englishText}
                </span>
              </div>
            );
          }

          if (isWhisper) {
            return (
              <div key={t.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-none border border-zinc-300 bg-zinc-100 p-3 space-y-1">
                  <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-zinc-500">
                    <span className="font-semibold text-zinc-950">You · whisper steering (English)</span>
                    <span>{t.timestamp}</span>
                  </div>
                  <p className="text-xs text-zinc-900 italic">{t.englishText}</p>
                </div>
              </div>
            );
          }

          return (
            <div
              key={t.id}
              className={`flex ${isAgent ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 space-y-2 border ${
                  isAgent
                    ? "rounded-tr-none bg-zinc-950 text-white border-zinc-950"
                    : "rounded-tl-none bg-white text-zinc-950 border-zinc-200"
                } ${t.isFiller ? "ring-2 ring-zinc-300" : ""}`}
              >
                <div
                  className={`flex items-center justify-between gap-3 text-[10px] font-mono ${
                    isAgent ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  <span
                    className={`font-semibold ${
                      isAgent ? "text-white" : "text-zinc-950"
                    }`}
                  >
                    {t.speakerLabel}
                  </span>
                  <span>{t.timestamp}</span>
                </div>

                {t.isFiller && (
                  <span className="inline-block text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border border-zinc-300 text-zinc-950 bg-zinc-100">
                    Polite filler · buying time for human decision
                  </span>
                )}

                {t.isEscalationTrigger && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-300 text-zinc-950">
                    <Shield className="w-2.5 h-2.5" /> High-stakes branching detected → HITL
                  </span>
                )}

                {t.japaneseText && (
                  <p
                    className={`text-sm leading-relaxed ${
                      isAgent ? "text-white font-medium" : "text-zinc-950 font-medium"
                    }`}
                  >
                    {t.japaneseText}
                  </p>
                )}

                {t.romaji && (
                  <p
                    className={`text-[11px] italic font-mono ${
                      isAgent ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    {t.romaji}
                  </p>
                )}

                <p
                  className={`text-xs leading-relaxed pt-1 border-t ${
                    isAgent
                      ? "border-zinc-800 text-zinc-300"
                      : "border-zinc-100 text-zinc-600"
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 mr-1.5">
                    EN
                  </span>
                  {t.englishText}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Whisper slot */}
      {whisperSlot && <div className="border-t border-zinc-200 p-3 bg-zinc-50/80">{whisperSlot}</div>}

      {/* Manual demo stepper */}
      <div className="px-4 py-2.5 border-t border-zinc-100 bg-white flex items-center justify-between text-[11px] font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <span>Demo controls:</span>
          <button
            onClick={onAdvance}
            className="px-2 py-1 rounded border border-zinc-200 text-zinc-800 hover:bg-zinc-100 transition inline-flex items-center gap-1"
          >
            Step turn <ChevronRight className="w-3 h-3" />
          </button>
          <button
            onClick={onToggleAutoPlay}
            className={`px-2 py-1 rounded border transition ${
              autoPlay
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-200 text-zinc-800 hover:bg-zinc-100"
            }`}
          >
            {autoPlay ? "Auto-play: ON" : "Auto-play: OFF"}
          </button>
        </div>
        <span className="text-[10px] text-zinc-400 hidden sm:inline">
          HITL fires fillers + decision cards automatically
        </span>
      </div>
    </div>
  );
}
