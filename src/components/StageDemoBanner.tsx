import React from "react";
import { Play } from "lucide-react";

interface StageDemoBannerProps {
  onRunStageDemo: () => void;
  isRunning: boolean;
}

const SCENES = [
  { time: "0:00–0:15", title: "Setup", desc: "Select venue, Exa grounds hotel rules" },
  { time: "0:15–0:35", title: "Dial", desc: "Vapi places outbound SIP call" },
  { time: "0:35–0:55", title: "Curveball", desc: "Hotel replies in Japanese with dinner cutoff" },
  { time: "0:55–1:15", title: "HITL Magic", desc: "Polite filler + live decision card" },
  { time: "1:15–1:30", title: "Resolution", desc: "Keigo confirmation + Manus receipt" },
];

export function StageDemoBanner({ onRunStageDemo, isRunning }: StageDemoBannerProps) {
  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-950">
            90-second stage demo · recorded-ready
          </span>
          <span className="text-[10px] font-mono text-zinc-400 px-2 py-0.5 rounded border border-zinc-200 bg-white">
            built for the Side Quest Hotline Vapi Hackathon @ Vapi HQ
          </span>
        </div>

        <button
          onClick={onRunStageDemo}
          className="h-8 px-3 rounded-xl bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 transition inline-flex items-center gap-1.5 shadow-sm"
        >
          <Play className="w-3 h-3 fill-current" />
          {isRunning ? "Restart demo" : "Play demo flow"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {SCENES.map((s, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-200 bg-white p-2.5 text-[11px] space-y-0.5"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span className="font-semibold text-zinc-950">Scene {i + 1}</span>
              <span>{s.time}</span>
            </div>
            <div className="font-semibold text-zinc-950 tracking-tight">{s.title}</div>
            <p className="text-[10px] text-zinc-500 leading-tight">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
