import React, { useState } from "react";
import { ManusReceipt } from "@/lib/types";
import { CheckCircle2, Copy, Check, FileText } from "lucide-react";

interface ManusReceiptPanelProps {
  receipt: ManusReceipt | null;
}

export function ManusReceiptPanel({ receipt }: ManusReceiptPanelProps) {
  const [copied, setCopied] = useState(false);

  if (!receipt) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm text-center text-zinc-400">
        <FileText className="w-7 h-7 mx-auto mb-1.5 stroke-1 text-zinc-300" />
        <p className="text-xs text-zinc-600 font-medium">Post-call receipt</p>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Manus auto-compiles the transcript into a structured itinerary update when the call resolves.
        </p>
      </div>
    );
  }

  const copyText = () => {
    const text = [
      `Moshi-Pilot Call Receipt — ${receipt.venue}`,
      `Booking: ${receipt.bookingId}`,
      `Date: ${receipt.date}`,
      `Spoke with: ${receipt.spokeWith}`,
      "",
      "Agreed:",
      ...receipt.agreedPoints.map((p) => `- ${p}`),
      "",
      "Updated itinerary:",
      ...receipt.updatedItinerary.map((i) => `- ${i.label}: ${i.value}`),
      "",
      `Summary: ${receipt.agentSummary}`,
      `Dispatched: ${receipt.dispatchedAt}`,
    ].join("\n");
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm space-y-3 text-zinc-950">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-zinc-950" />
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-zinc-950">
            Post-call confirmation receipt
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 px-2 py-0.5 rounded border border-zinc-200">
          via Manus automation
        </span>
      </div>

      <div>
        <div className="text-sm font-semibold tracking-tight text-zinc-950">
          {receipt.venue}
        </div>
        <div className="text-[11px] font-mono text-zinc-500">
          {receipt.bookingId} · {receipt.date}
        </div>
        <div className="text-[11px] text-zinc-400 mt-0.5">
          Spoke with: <span className="text-zinc-700 font-medium">{receipt.spokeWith}</span>
        </div>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-medium block">
          Agreed points
        </span>
        {receipt.agreedPoints.map((p, i) => (
          <div key={i} className="text-xs text-zinc-700 flex items-start gap-1.5">
            <span className="text-zinc-950 font-bold">•</span>
            <span className="leading-snug">{p}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1 pt-1 border-t border-zinc-100">
        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-medium block">
          Updated itinerary
        </span>
        <div className="space-y-1">
          {receipt.updatedItinerary.map((it, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-xs py-1 border-b border-zinc-100 last:border-0"
            >
              <span className="text-zinc-500">{it.label}</span>
              <span className="font-mono text-zinc-950 font-medium">{it.value}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-zinc-600 leading-relaxed italic bg-zinc-50 rounded-xl p-2.5 border border-zinc-100">
        &ldquo;{receipt.agentSummary}&rdquo;
      </p>

      <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-zinc-400">
        <span>{receipt.dispatchedAt}</span>
        <button
          onClick={copyText}
          className="inline-flex items-center gap-1 text-zinc-700 hover:text-zinc-950 font-medium"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy receipt"}
        </button>
      </div>
    </div>
  );
}
