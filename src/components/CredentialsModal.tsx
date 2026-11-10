import React, { useState, useEffect } from "react";
import { X, KeyRound, Check } from "lucide-react";

interface CredentialsModalProps {
  open: boolean;
  onClose: () => void;
}

const KEYS = [
  { name: "VAPI_API_KEY", label: "Vapi API Key", hint: "Voice orchestration & outbound SIP" },
  { name: "VAPI_PHONE_NUMBER_ID", label: "Vapi Phone Number ID", hint: "Purchased Japanese/US number" },
  { name: "DEEPGRAM_API_KEY", label: "Deepgram API Key", hint: "nova-2 Japanese transcription" },
  { name: "TYPESAFE_JEV_API_KEY", label: "TypeSafe / Jev API Key", hint: "Structured decision engine" },
  { name: "EXA_API_KEY", label: "Exa API Key", hint: "Neural web grounding" },
  { name: "MANUS_API_KEY", label: "Manus API Key", hint: "Post-call receipt automation" },
];

export function CredentialsModal({ open, onClose }: CredentialsModalProps) {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open) return;
    try {
      const stored = localStorage.getItem("mp_keys");
      if (stored) setVals(JSON.parse(stored));
    } catch {}
  }, [open]);

  if (!open) return null;

  const save = () => {
    try {
      localStorage.setItem("mp_keys", JSON.stringify(vals));
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {}
  };

  const configured = Object.values(vals).filter((v) => v && v.trim().length > 0).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-lg w-full p-6 space-y-4 text-zinc-950 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-zinc-950" />
            <h3 className="font-semibold text-sm tracking-tight text-zinc-950">
              API Credentials
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-500 leading-relaxed">
          Keys stay in your browser. Leave blank to run in demo simulation mode — perfect for hackathon stage presentations.
        </p>

        <div className="flex items-center justify-between text-[11px] font-mono px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-700">
          <span>{configured}/{KEYS.length} keys configured</span>
          <span className="text-zinc-400">demo mode always available</span>
        </div>

        <div className="space-y-2.5">
          {KEYS.map((k) => (
            <div key={k.name} className="space-y-1">
              <label className="text-[11px] font-mono text-zinc-600 flex items-center justify-between">
                <span>{k.label}</span>
                <span className="text-zinc-400 font-normal">{k.name}</span>
              </label>
              <input
                type="password"
                value={vals[k.name] || ""}
                onChange={(e) => setVals({ ...vals, [k.name]: e.target.value })}
                placeholder={k.hint}
                className="w-full h-9 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-mono text-zinc-950 placeholder:text-zinc-400 placeholder:font-sans focus:outline-none focus:ring-1 focus:ring-zinc-950"
              />
            </div>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
          <p className="text-[10px] text-zinc-400 font-mono">
            Or set via <code className="text-zinc-700">.env.local</code> for server deploys.
          </p>
          <button
            onClick={save}
            className="h-9 px-4 rounded-xl bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 transition shadow-sm inline-flex items-center gap-1"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : null}
            {saved ? "Saved" : "Save keys"}
          </button>
        </div>
      </div>
    </div>
  );
}
