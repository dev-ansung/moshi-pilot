"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { Phone, Mic, Compass, Receipt, Sparkles } from "lucide-react";

export type TabId = "call" | "interpreter" | "services" | "receipts";

interface Props {
  activeTab: TabId;
  onTabChange: (t: TabId) => void;
  statusText?: string;
  inCall?: boolean;
  realMode?: boolean;
  onToggleMode?: () => void;
  apiReady?: boolean;
  children: ReactNode;
}

export function MobileShell({
  activeTab,
  onTabChange,
  statusText,
  inCall,
  realMode,
  onToggleMode,
  apiReady,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-0 sm:p-4 select-none">
      {/* Phone frame */}
      <div className="w-full sm:max-w-[420px] sm:h-[900px] h-screen bg-zinc-950 sm:rounded-[44px] sm:border sm:border-zinc-800 shadow-2xl shadow-black/80 flex flex-col overflow-hidden relative sm:ring-1 sm:ring-white/10">
        {/* Dynamic Island / notch */}
        <div className="pt-2 px-6 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>9:41</span>
          <div className="w-24 h-5 bg-black rounded-full border border-zinc-800" />
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>5G</span>
          </div>
        </div>

        {/* Header */}
        <header className="px-4 pt-2 pb-2 flex items-center justify-between border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <Image
              src="/assets/moshi_pilot_logo_concept_c.png"
              alt="Moshi-Pilot logo"
              width={34}
              height={34}
              className="rounded-lg border border-zinc-800"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold tracking-tight text-white font-mono">
                  Moshi-Pilot
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  もしパイロット
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-none">
                Bilingual voice co-pilot for foreign services
              </p>
            </div>
          </div>
          <button
            onClick={onToggleMode}
            type="button"
            className={`text-[10px] font-mono px-2 py-1 rounded-full border flex items-center gap-1 transition ${
              realMode
                ? "border-emerald-500/40 text-emerald-300 bg-emerald-950/40"
                : "border-zinc-700 text-zinc-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-2.5 h-2.5" />
            {realMode ? (apiReady ? "Real · 5 APIs live" : "Real mode") : "Demo mode"}
          </button>
        </header>

        {/* In-call banner */}
        {inCall && statusText && (
          <div className="bg-emerald-950/70 border-b border-emerald-800/40 px-4 py-1.5 text-[11px] font-mono text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {statusText}
            </span>
            <span className="text-[10px] text-emerald-400/80">bilingual proxy active</span>
          </div>
        )}

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-4 py-3 pb-24 scroll-smooth">
          {children}
        </main>

        {/* Bottom tab bar */}
        <nav className="absolute bottom-0 inset-x-0 h-16 bg-zinc-950/95 backdrop-blur border-t border-zinc-800 px-3 flex items-center justify-around z-20">
          {(
            [
              { id: "call", label: "Call", icon: Phone },
              { id: "interpreter", label: "Interpreter", icon: Mic },
              { id: "services", label: "Services", icon: Compass },
              { id: "receipts", label: "Receipts", icon: Receipt },
            ] as const
          ).map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange(id)}
                className={`flex flex-col items-center gap-1 text-[10px] font-mono transition ${
                  active ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <div
                  className={`w-10 h-7 rounded-full flex items-center justify-center transition ${
                    active ? "bg-white text-black" : ""
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
