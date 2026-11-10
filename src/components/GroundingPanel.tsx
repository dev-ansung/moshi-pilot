import React from "react";
import { Scenario } from "@/lib/types";
import { SCENARIOS } from "@/lib/scenarios";
import { Search, PhoneCall, Clock, AlertTriangle } from "lucide-react";

interface GroundingPanelProps {
  scenario: Scenario;
  onSelectScenario: (s: Scenario) => void;
  onStartCall: () => void;
  status: string;
}

export function GroundingPanel({
  scenario,
  onSelectScenario,
  onStartCall,
  status,
}: GroundingPanelProps) {
  const isBusy = status === "dialing" || status === "in_call" || status === "escalating" || status === "user_deciding" || status === "agent_confirming";

  return (
    <div className="space-y-4">
      {/* Scenario switcher */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] uppercase tracking-wider font-mono text-zinc-500">
            Scenario
          </span>
          <span className="text-[10px] font-mono text-zinc-400">demo presets</span>
        </div>
        <div className="space-y-1.5">
          {SCENARIOS.map((s) => {
            const active = s.id === scenario.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelectScenario(s)}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition ${
                  active
                    ? "border-zinc-950 bg-zinc-950 text-white shadow-sm"
                    : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50"
                }`}
              >
                <div className="font-semibold tracking-tight">{s.title}</div>
                <div
                  className={`text-[11px] truncate mt-0.5 ${
                    active ? "text-zinc-300" : "text-zinc-500"
                  }`}
                >
                  {s.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Traveler intent */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm">
        <span className="text-[11px] uppercase tracking-wider font-mono text-zinc-500 block mb-1">
          Traveler intent (English)
        </span>
        <p className="text-xs text-zinc-800 leading-relaxed font-normal">
          {scenario.intent}
        </p>
        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-3 border-t border-zinc-100">
          <span>Destination</span>
          <span className="text-zinc-950 font-medium">{scenario.destinationNumber}</span>
        </div>
      </div>

      {/* Exa grounding */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
            <span className="text-[11px] uppercase tracking-wider font-mono text-zinc-950 font-medium">
              Pre-call web grounding
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-0.5">
            <Search className="w-3 h-3" /> via Exa
          </span>
        </div>

        <div>
          <div className="text-sm font-semibold text-zinc-950 tracking-tight">
            {scenario.grounding.venueNameEn}
          </div>
          <div className="text-xs text-zinc-400 font-mono">
            {scenario.grounding.venueNameJp}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            {scenario.grounding.address}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-2">
            <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Hours
            </div>
            <div className="text-zinc-800 mt-0.5 font-medium leading-tight">
              {scenario.grounding.hours}
            </div>
          </div>
          <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-2">
            <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
              <PhoneCall className="w-3 h-3" /> Phone
            </div>
            <div className="text-zinc-800 mt-0.5 font-mono font-medium truncate">
              {scenario.grounding.phoneNumber}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-2.5 text-xs text-zinc-700 space-y-1">
          <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-medium">
            Check-in rule
          </div>
          <p className="text-[11px] leading-relaxed">{scenario.grounding.checkInRule}</p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-2.5 text-xs text-zinc-700 space-y-1">
          <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-zinc-950" />
            Cancellation policy
          </div>
          <p className="text-[11px] leading-relaxed">{scenario.grounding.cancellationPolicy}</p>
        </div>

        <div className="space-y-1 pt-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block">
            Front-desk notes
          </span>
          {scenario.grounding.notes.map((n, i) => (
            <div key={i} className="text-[11px] text-zinc-600 flex items-start gap-1.5">
              <span className="text-zinc-400">•</span>
              <span className="leading-snug">{n}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Start call CTA */}
      <button
        onClick={onStartCall}
        disabled={isBusy}
        className={`w-full h-12 rounded-2xl font-semibold text-xs tracking-tight transition shadow-sm flex items-center justify-center gap-2 ${
          isBusy
            ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
            : "bg-zinc-950 text-white hover:bg-zinc-800"
        }`}
      >
        <PhoneCall className="w-4 h-4" />
        {isBusy ? "Call in progress…" : "Dial venue with Moshi-Pilot"}
      </button>

      <p className="text-[10px] text-center text-zinc-400 font-mono">
        Bilingual Keigo proxy · HITL decision routing on by default
      </p>
    </div>
  );
}
