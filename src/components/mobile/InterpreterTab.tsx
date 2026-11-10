"use client";

import { useRef, useState } from "react";
import { Mic, MicOff, Volume2, ArrowLeftRight } from "lucide-react";
import { COUNTRIES, Country } from "@/lib/mobile/countries";
import { speakText, speechToText, translateText } from "@/lib/mobile/api";

interface Message {
  id: string;
  speaker: "you" | "them";
  original: string;
  translation: string;
  lang: string;
  time: string;
}

export function InterpreterTab({
  country,
  onCountryChange,
}: {
  country: Country;
  onCountryChange: (c: Country) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [recording, setRecording] = useState<"you" | "them" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const start = async (speaker: "you" | "them") => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mr.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      mr.onstop = () => onStop(speaker);
      mr.start();
      mrRef.current = mr;
      setRecording(speaker);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Mic access denied");
    }
  };

  const stop = () => mrRef.current?.stop();

  const onStop = async (speaker: "you" | "them") => {
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    chunksRef.current = [];
    mrRef.current?.stream.getTracks().forEach((t) => t.stop());
    mrRef.current = null;
    setRecording(null);
    setBusy(true);
    try {
      const srcLang = speaker === "you" ? "en" : country.langCode;
      const { transcript } = await speechToText(blob, srcLang);
      if (!transcript) {
        setError("No speech detected");
        setBusy(false);
        return;
      }
      const target = speaker === "you" ? country.langName : "English";
      const { translation } = await translateText({
        text: transcript,
        sourceLang: speaker === "you" ? "English" : country.langName,
        targetLang: target,
        formality: "polite",
        includeRomaji: country.code === "jp" && speaker === "you",
      });
      setMessages((m) => [
        ...m,
        {
          id: `${Date.now()}`,
          speaker,
          original: transcript,
          translation,
          lang: target,
          time: new Date().toTimeString().slice(3, 8),
        },
      ]);
      if (autoSpeak) {
        try {
          await speakText(translation);
        } catch {}
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Translation failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Language bar */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-400">🇺🇸 English</span>
          <ArrowLeftRight className="w-3.5 h-3.5 text-zinc-500" />
          <div className="flex items-center gap-1.5">
            <span>{country.flag}</span>
            <select
              value={country.code}
              onChange={(e) => {
                const c = COUNTRIES.find((x) => x.code === e.target.value);
                if (c) onCountryChange(c);
              }}
              className="bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-zinc-900">
                  {c.langName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>{country.formality}</span>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              className="accent-white"
            />
            auto-speak translation
          </label>
        </div>
      </div>

      {/* Two big mic buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => (recording === "you" ? stop() : start("you"))}
          className={`py-4 rounded-2xl border text-xs font-mono font-semibold flex flex-col items-center justify-center gap-1.5 transition ${
            recording === "you"
              ? "border-red-500 bg-red-950/60 text-red-300 animate-pulse"
              : "border-zinc-700 bg-zinc-900 text-white hover:border-zinc-500"
          }`}
        >
          {recording === "you" ? (
            <>
              <MicOff className="w-5 h-5" />
              <span>Tap when done</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 text-zinc-400" />
              <span>You speak</span>
              <span className="text-[10px] text-zinc-500 font-normal">
                English
              </span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => (recording === "them" ? stop() : start("them"))}
          className={`py-4 rounded-2xl border text-xs font-mono font-semibold flex flex-col items-center justify-center gap-1.5 transition ${
            recording === "them"
              ? "border-red-500 bg-red-950/60 text-red-300 animate-pulse"
              : "border-zinc-700 bg-zinc-900 text-white hover:border-zinc-500"
          }`}
        >
          {recording === "them" ? (
            <>
              <MicOff className="w-5 h-5" />
              <span>Tap when done</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 text-zinc-400" />
              <span>They speak</span>
              <span className="text-[10px] text-zinc-500 font-normal">
                {country.langName}
              </span>
            </>
          )}
        </button>
      </div>

      {busy && (
        <div className="text-[11px] font-mono text-zinc-400 text-center animate-pulse">
          Transcribing & translating…
        </div>
      )}
      {error && (
        <div className="text-[11px] font-mono text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Message feed */}
      <div className="space-y-2">
        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
          Conversation
        </div>
        {messages.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-800 p-6 text-center text-xs text-zinc-600 font-mono">
            Tap a mic to speak. Works in person or right next to your phone on
            speaker.
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-xl border p-2.5 text-xs space-y-1 ${
              m.speaker === "you"
                ? "border-zinc-700 bg-zinc-900 text-zinc-200"
                : "border-zinc-800 bg-black text-zinc-200"
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span className="font-semibold text-zinc-400">
                {m.speaker === "you" ? "You" : country.name}
              </span>
              <span>{m.time}</span>
            </div>
            <p className="text-xs text-white leading-relaxed">{m.original}</p>
            <p className="text-[11px] text-zinc-400 font-mono pt-1 border-t border-zinc-800">
              → {m.translation}
            </p>
            <button
              type="button"
              onClick={() => speakText(m.translation)}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono inline-flex items-center gap-1 pt-0.5"
            >
              <Volume2 className="w-2.5 h-2.5" /> replay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
