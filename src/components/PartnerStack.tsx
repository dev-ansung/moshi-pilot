import React from "react";
import { PARTNERS } from "@/lib/scenarios";

export function PartnerStack() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider font-mono text-zinc-500">
          Partner stack
        </span>
        <span className="text-[10px] font-mono text-zinc-400">Side Quest @ Vapi HQ</span>
      </div>

      <div className="space-y-1.5">
        {PARTNERS.map((p) => (
          <div
            key={p.name}
            className="flex items-center justify-between p-2 rounded-xl border border-zinc-100 hover:border-zinc-200 transition text-xs"
          >
            <div>
              <div className="font-semibold text-zinc-950 tracking-tight flex items-center gap-1.5">
                {p.name}
                <span className="text-[10px] font-mono font-normal text-zinc-400">
                  {p.role}
                </span>
              </div>
              <div className="text-[11px] text-zinc-500">{p.desc}</div>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 flex-shrink-0 ml-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
