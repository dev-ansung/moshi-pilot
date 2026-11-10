"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { COUNTRIES, Country } from "./countries";
import {
  compileReceipt,
  evaluateDecision,
  speakText,
  speechToText,
  translateText,
} from "./api";
import { CallStatus, DecisionCard, StructuredReceipt, Turn } from "./types";

function ts(): string {
  const d = new Date();
  return d.toTimeString().slice(3, 8);
}

// Demo dialogue: authentic Japan ryokan late check-in with real Keigo
// The agent speaks FIRST-PERSON AS the customer ("I am Satō..."), never as a proxy.
const DEMO_TURNS: Omit<Turn, "id">[] = [
  {
    speaker: "system",
    speakerLabel: "System",
    text: "Connecting outbound SIP call to Kyoto Hatago Ryokan (+81 75-551-0000)...",
    timestamp: "00:02",
  },
  {
    speaker: "foreign",
    speakerLabel: "Hotel Staff · 田中 (Tanaka)",
    text: "はい、京都旅籠でございます。いつもご利用ありがとうございます。",
    romaji: "Hai, Kyoto Hatago de gozaimasu. Itsumo go-riyou arigatou gozaimasu.",
    translation: "Yes, this is Kyoto Hatago Ryokan. Thank you as always for your patronage.",
    timestamp: "00:09",
  },
  {
    speaker: "agent",
    speakerLabel: "Moshi-Pilot (as you)",
    text: "恐れ入ります。本日宿泊予定の佐藤と申します。予約番号402番です。新幹線の遅延により、到着が午後9時30分頃になる見込みでございます。大変申し訳ございません。",
    romaji: "Osore-irimasu, honjitsu shukuhaku yotei no Satou to moushimasu. Yoyaku bangou 402-ban desu...",
    translation:
      "Excuse me, I am Satō, with reservation #402 for tonight. Due to a train delay, I expect to arrive around 9:30 PM. I sincerely apologize.",
    timestamp: "00:16",
  },
  {
    speaker: "foreign",
    speakerLabel: "Hotel Staff · 田中 (Tanaka)",
    text: "かしこまりました。ただいまのチェックインであればお部屋は確保できますが、会席のご夕食は午後8時までのご案内となっておりまして、以降はお召し上がりいただけません。いかがなさいますでしょうか。",
    romaji:
      "Kashikomarimashita. Tadaima no chekku-in de areba o-heya wa kakuho dekimasu ga, kaiseki no go-yuushoku wa...",
    translation:
      "Understood. The room is held, but kaiseki dinner service is strictly available until 8 PM and cannot be served after. How would you like to proceed?",
    timestamp: "00:32",
  },
];

const DEMO_DECISION: DecisionCard = {
  id: "d-dinner",
  title: "Kaiseki dinner service ends at 8:00 PM and cannot be held. How would you like to proceed?",
  description: "夕食サービスの継続についてご選択ください",
  reason:
    "TypeSafe / Jev router caught the policy conflict with 86% confidence: the ryokan agreed to the late check-in but dinner cannot be served after 8 PM.",
  options: [
    {
      id: "cancel",
      label: "Cancel dinner, keep room",
      sub: "夕食をお取り消し、お部屋のみ継続 — no extra fee",
      recommended: true,
    },
    {
      id: "rush",
      label: "I'll rush to arrive by 7:45 PM",
      sub: "19時45分までに到着いたします — keeps dinner if you make it",
    },
  ],
  source: "TypeSafe / Jev",
  confidence: 86,
};

export function useLiveCall(realMode: boolean) {
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [customerName, setCustomerName] = useState("佐藤 (Satō)");
  const [reservationId, setReservationId] = useState("402");
  const [goal, setGoal] = useState("Notify venue that reservation will arrive late at 9:30 PM instead of 6:00 PM due to train delay. Hold our room.");
  const [phone, setPhone] = useState("+81 75-551-0000");
  const [status, setStatus] = useState<CallStatus>("idle");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [decision, setDecision] = useState<DecisionCard | null>(null);
  const [receipt, setReceipt] = useState<StructuredReceipt | null>(null);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [whispers, setWhispers] = useState<string[]>([]);
  const [duration, setDuration] = useState(0);

  const timerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationRef = useRef(0);
  const demoStepRef = useRef(0);
  const statusRef = useRef(status);
  statusRef.current = status;

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    if (status === "in_call" || status === "escalating" || status === "user_deciding") {
      timerRef.current = window.setInterval(() => setDuration((d) => d + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const addTurn = useCallback((turn: Omit<Turn, "id" | "timestamp"> & { timestamp?: string }) => {
    setTurns((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, timestamp: turn.timestamp || ts(), ...turn },
    ]);
  }, []);

  const startCall = useCallback(async () => {
    setError(null);
    setTurns([]);
    setDecision(null);
    setReceipt(null);
    setWhispers([]);
    setDuration(0);
    demoStepRef.current = 0;
    setStatus("connecting");

    if (!realMode) {
      setTimeout(() => {
        addTurn(DEMO_TURNS[0]);
        setStatus("in_call");
      }, 700);
      return;
    }

    try {
      addTurn({
        speaker: "system",
        speakerLabel: "System",
        text: `Starting live call session for ${country.name} · ${country.formality}`,
      });
      setStatus("in_call");

      setBusy(true);
      const greetingPrompt = `You are a polite receptionist greeting incoming callers for a Japanese service (hotel/ryokan/restaurant). Speak one short, natural greeting sentence in ${country.langName} with polite ${country.formality}. Return ONLY the greeting.`;
      const greeting = await translateText({
        text: greetingPrompt,
        sourceLang: "English",
        targetLang: country.langName,
        formality: "polite",
        includeRomaji: country.code === "jp",
      });
      addTurn({
        speaker: "foreign",
        speakerLabel: `${country.name} staff`,
        text: greeting.translation,
        romaji: greeting.romaji,
        translation: "(greeting)",
      });
      try {
        await speakText(greeting.translation);
      } catch {}
      setBusy(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Call failed");
      setStatus("idle");
      setBusy(false);
    }
  }, [addTurn, country, realMode]);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Microphone access denied");
    }
  }, []);

  const stopRecordingAndTranscribe = useCallback(async () => {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    setRecording(false);
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      chunksRef.current = [];
      mr.stream.getTracks().forEach((t) => t.stop());
      mediaRecorderRef.current = null;
      try {
        setBusy(true);
        const { transcript } = await speechToText(blob, country.langCode);
        if (!transcript) {
          setError("No speech detected");
          setBusy(false);
          return;
        }
        const { translation, romaji } = await translateText({
          text: transcript,
          sourceLang: country.langName,
          targetLang: "English",
          includeRomaji: country.code === "jp",
        });
        addTurn({
          speaker: "foreign",
          speakerLabel: `${country.name} staff`,
          text: transcript,
          romaji,
          translation,
        });

        const dec = await evaluateDecision({
          transcript: `${transcript} (English: ${translation})`,
          lastTurn: transcript,
          context: goal,
        });

        if (dec.escalate) {
          setStatus("escalating");
          addTurn({
            speaker: "agent",
            speakerLabel: "Moshi-Pilot (filler)",
            text: country.fillerPhrase,
            translation: country.fillerMeaning,
            isFiller: true,
          });
          try {
            await speakText(country.fillerPhrase);
          } catch {}
          setDecision({
            id: `dec-${Date.now()}`,
            title: translation || transcript,
            description: "How would you like to proceed?",
            reason: `TypeSafe / Jev detected a branching decision (${dec.confidence}% confidence).`,
            options: [
              { id: "accept", label: "Accept / confirm", sub: "Yes, please proceed", recommended: true },
              { id: "decline", label: "Decline / other", sub: "No, let me change this" },
            ],
            source: "TypeSafe / Jev",
            confidence: dec.confidence,
          });
          setStatus("user_deciding");
        }
        setBusy(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Processing failed");
        setBusy(false);
      }
    };
    mr.stop();
  }, [addTurn, country, goal]);

  const advanceDemo = useCallback(async () => {
    const nextIdx = demoStepRef.current + 1;
    if (nextIdx >= DEMO_TURNS.length) {
      if (statusRef.current === "in_call") {
        setStatus("escalating");
        addTurn({
          speaker: "agent",
          speakerLabel: "Moshi-Pilot (filler)",
          text: "少々お待ちください。同行者と相談いたします。",
          romaji: "Shoushou omachi kudasai. Doukousha to soudan itashimasu.",
          translation: "One moment please, I will discuss with my travel companion.",
          isFiller: true,
        });
        try {
          await speakText("少々お待ちください。同行者と相談いたします。");
        } catch {}
        setTimeout(() => {
          setDecision(DEMO_DECISION);
          setStatus("user_deciding");
        }, 500);
      }
      return;
    }
    const t = DEMO_TURNS[nextIdx];
    demoStepRef.current = nextIdx;
    addTurn(t);
  }, [addTurn]);

  const answerDecision = useCallback(
    async (option: { id: string; label: string }) => {
      setDecision(null);
      setBusy(true);
      try {
        const { translation, romaji } = await translateText({
          text: option.label,
          sourceLang: "English",
          targetLang: country.langName,
          formality: "polite",
          context: `You are the customer speaking politely in the first person. Reservation context: ${goal}, name=${customerName}, reservation=${reservationId}. Deliver this decision to the staff.`,
          includeRomaji: country.code === "jp",
        });
        addTurn({
          speaker: "agent",
          speakerLabel: `Moshi-Pilot (as you)`,
          text: translation,
          romaji,
          translation: option.label,
        });
        try {
          await speakText(translation);
        } catch {}
        addTurn({
          speaker: "foreign",
          speakerLabel: `${country.name} staff`,
          text:
            country.code === "jp"
              ? "かしこまりました。お気を付けてお越しください。"
              : "Understood. Safe travels.",
          translation: "Understood. Safe travels.",
        });
        setStatus("resolved");
        const res = (await compileReceipt({
          turns,
          destination: country.name,
          scenario: { goal, phone, customerName, reservationId },
        })) as { receipt?: StructuredReceipt };
        if (res?.receipt) setReceipt(res.receipt);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to send response");
      } finally {
        setBusy(false);
      }
    },
    [addTurn, country, goal, customerName, reservationId, phone, turns]
  );

  const sendWhisper = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      setWhispers((w) => [...w, text]);
      addTurn({
        speaker: "whisper",
        speakerLabel: "You (whisper)",
        text,
      });
      setBusy(true);
      try {
        const { translation, romaji } = await translateText({
          text,
          sourceLang: "English",
          targetLang: country.langName,
          formality: "polite",
          context: `Instruction from the customer mid-call: "${text}". You ARE the customer speaking politely in the first person. Weave it naturally into the next sentence.`,
          includeRomaji: country.code === "jp",
        });
        addTurn({
          speaker: "agent",
          speakerLabel: `Moshi-Pilot (as you)`,
          text: translation,
          romaji,
          translation: text,
        });
        try {
          await speakText(translation);
        } catch {}
      } catch (e) {
        setError(e instanceof Error ? e.message : "Whisper failed");
      } finally {
        setBusy(false);
      }
    },
    [addTurn, country]
  );

  const endCall = useCallback(async () => {
    setStatus("resolved");
    try {
      const res = (await compileReceipt({
        turns,
        destination: country.name,
        scenario: { goal, phone, customerName, reservationId },
      })) as { receipt?: StructuredReceipt };
      if (res?.receipt) setReceipt(res.receipt);
    } catch {}
  }, [country.name, customerName, goal, phone, reservationId, turns]);

  const resetCall = useCallback(() => {
    setStatus("idle");
    setTurns([]);
    setDecision(null);
    setReceipt(null);
    setWhispers([]);
    setError(null);
    setDuration(0);
    demoStepRef.current = 0;
  }, []);

  return {
    country,
    setCountry,
    customerName,
    setCustomerName,
    reservationId,
    setReservationId,
    goal,
    setGoal,
    phone,
    setPhone,
    status,
    turns,
    decision,
    receipt,
    recording,
    busy,
    error,
    whispers,
    duration,
    startCall,
    advanceDemo,
    answerDecision,
    sendWhisper,
    endCall,
    resetCall,
    startRecording,
    stopRecordingAndTranscribe,
  };
}
