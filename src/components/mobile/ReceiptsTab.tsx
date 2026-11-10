"use client";

import { useState } from "react";
import { Check, Copy, Receipt, Sparkles } from "lucide-react";
import { StructuredReceipt } from "@/lib/mobile/types";

export function ReceiptsTab({
  receipt,
// removed
}: {
  receipt: StructuredReceipt | null;

}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (!receipt) return;
    const txt = [
      `MOSHI-PILOT CONFIRMATION RECEIPT`,
      receipt.venue ? `Venue: ${receipt.venue}` : "",
      receipt.reservationId ? `Reservation: ${receipt.reservationId}` : "",
      "",
      "AGREED POINTS:",
      ...receipt.agreedPoints.map((p) => `• ${p}`),
      "",
      "UPDATED SCHEDULE:",
      ...receipt.updatedSchedule.map((s) => `• ${s.event}: ${s.time}`),
      "",
      `SUMMARY: ${receipt.summary}`,
    ]
      .filter(Boolean)
      .join("\n");
    navigator.clipboard?.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-white">
            Manus confirmation receipts
          </div>
          <div className="text-[10px] text-zinc-400 font-mono">
            Structured itinerary diffs auto-compiled from your calls
          </div>
        </div>
        <Receipt className="w-4 h-4 text-zinc-600" />
      </div>

      {!receipt && (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center space-y-2">
          <Sparkles className="w-5 h-5 mx-auto text-zinc-600" />
          <p className="text-xs font-mono text-zinc-500">
            No receipts yet. Complete a call in the Call tab and a structured
            confirmation will appear here.
          </p>
        </div>
      )}

      {receipt && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Verified confirmation
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              via Manus workflow
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="text-sm font-semibold text-white">
              {receipt.venue || "Foreign service"}
            </div>
            {receipt.reservationId && (
              <div className="text-[11px] font-mono text-zinc-400">
                Reservation {receipt.reservationId}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Agreed points
            </div>
            <ul className="space-y-1 text-xs text-zinc-200">
              {receipt.agreedPoints.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-zinc-500 font-mono shrink-0">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Updated schedule
            </div>
            <div className="divide-y divide-zinc-800 text-xs font-mono">
              {receipt.updatedSchedule.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <span className="text-zinc-300">{s.event}</span>
                  <span className="text-white font-semibold">{s.time}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-zinc-400 italic leading-relaxed pt-1 border-t border-zinc-800">
            &quot;{receipt.summary}&quot;
          </p>

          <button
            type="button"
            onClick={copy}
            className="w-full py-2.5 rounded-xl bg-white text-black text-xs font-mono font-semibold hover:bg-zinc-100 transition flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy receipt (for email/SMS)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
