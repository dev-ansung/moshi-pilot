import React, { useState } from "react";
import { Send, MessageSquareQuote } from "lucide-react";

interface WhisperBarProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function WhisperBar({ onSend, disabled }: WhisperBarProps) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="space-y-1.5"
    >
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
        <span className="flex items-center gap-1 text-zinc-800 font-medium">
          <MessageSquareQuote className="w-3 h-3" /> Live whisper steering (type in English)
        </span>
        <span className="text-zinc-400">woven into the agent&apos;s next Japanese sentence</span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          placeholder='e.g. "Ask if they can hold our bags tomorrow morning" / "Request a receipt by email"'
          className="flex-1 h-10 rounded-xl border border-zinc-200 bg-white px-3 text-xs text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:bg-zinc-100 disabled:text-zinc-400 font-normal"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          className="h-10 px-3.5 rounded-xl bg-zinc-950 text-white text-xs font-medium hover:bg-zinc-800 transition disabled:bg-zinc-200 disabled:text-zinc-400 flex items-center gap-1 shadow-sm"
        >
          <Send className="w-3 h-3" />
          <span className="hidden sm:inline">Whisper</span>
        </button>
      </div>
    </form>
  );
}
