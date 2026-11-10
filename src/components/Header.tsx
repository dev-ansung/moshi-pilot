import React from "react";
import Image from "next/image";
import { KeyRound, Play } from "lucide-react";

interface HeaderProps {
  onOpenKeys: () => void;
  onRunStageDemo: () => void;
}

export function Header({ onOpenKeys, onRunStageDemo }: HeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-zinc-200 shadow-sm flex-shrink-0">
            <Image
              src="/assets/moshi_pilot_logo_concept_a.png"
              alt="Moshi-Pilot logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-zinc-950 text-base">
                Moshi-Pilot
              </span>
              <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                もしパイロット
              </span>
              <span className="text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded border border-zinc-200 text-zinc-600 bg-zinc-50">
                HITL voice copilot
              </span>
            </div>
            <p className="text-xs text-zinc-500 hidden md:block">
              Speak fluent Keigo over the phone — without speaking a word of Japanese
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRunStageDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 transition shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Stage Demo (90s)
          </button>
          <button
            onClick={onOpenKeys}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">API</span> Keys
          </button>
        </div>
      </div>
    </header>
  );
}
