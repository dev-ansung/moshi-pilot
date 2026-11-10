import React from "react";
import { DecisionCard } from "@/lib/types";

interface DecisionCardModalProps {
  card: DecisionCard | null;
  onSelectOption: (optionId: string) => void;
}

export function DecisionCardModal({ card, onSelectOption }: DecisionCardModalProps) {
  if (!card) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-lg w-full p-6 space-y-4 text-zinc-950">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-950 animate-ping" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-950">
              Human-in-the-loop decision required
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 px-2 py-0.5 rounded border border-zinc-200">
            routed by TypeSafe/Jev · {Math.round(card.confidence * 100)}% conf
          </span>
        </div>

        {/* Filler notice */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-[11px] text-zinc-600 font-mono">
          Agent has paused the call and is saying a polite Japanese filler while you decide.
        </div>

        {/* Question */}
        <div className="space-y-1">
          <p className="text-sm sm:text-base font-semibold tracking-tight text-zinc-950 leading-snug">
            {card.questionEn}
          </p>
          <p className="text-xs text-zinc-400 font-mono italic">{card.questionJp}</p>
        </div>

        {/* Context */}
        <p className="text-xs text-zinc-600 leading-relaxed">{card.contextEn}</p>

        {/* Options */}
        <div className="space-y-2 pt-1">
          {card.options.map((opt) => {
            const isPrimary = opt.accent === "primary";
            return (
              <button
                key={opt.id}
                onClick={() => onSelectOption(opt.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition group ${
                  isPrimary
                    ? "border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm"
                    : "border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs tracking-tight">
                    {opt.labelEn}
                  </span>
                  {opt.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isPrimary
                          ? "bg-zinc-800 text-zinc-200 border border-zinc-700"
                          : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                      }`}
                    >
                      {opt.badge}
                    </span>
                  )}
                </div>
                <div
                  className={`text-[11px] font-mono mt-0.5 ${
                    isPrimary ? "text-zinc-300" : "text-zinc-500"
                  }`}
                >
                  {opt.labelJp}
                </div>
                {opt.description && (
                  <p
                    className={`text-[11px] mt-1.5 leading-snug ${
                      isPrimary ? "text-zinc-300" : "text-zinc-500"
                    }`}
                  >
                    {opt.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Reason footer */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px] font-mono text-zinc-400">
          <span className="truncate">{card.routingReason}</span>
          <span>1 tap · agent speaks immediately</span>
        </div>
      </div>
    </div>
  );
}
