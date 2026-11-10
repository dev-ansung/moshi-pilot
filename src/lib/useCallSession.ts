import { useState, useRef, useEffect, useCallback } from "react";
import {
  CallStatus,
  TranscriptTurn,
  DecisionCard,
  ManusReceipt,
  Scenario,
  Whisper,
} from "./types";
import { SCENARIOS } from "./scenarios";

const FILLER_TURN: Omit<TranscriptTurn, "id" | "timestamp"> = {
  speaker: "agent_jp",
  speakerLabel: "Moshi-Pilot (Keigo filler)",
  japaneseText: "少々お待ちください。お客様にご確認いたしております。",
  romaji: "Shoushou omachi kudasai. Okyaku-sama ni go-kakunin itashite orimasu.",
  englishText: "[Filler, buys time] One moment please, I am just confirming that with the guest.",
  isFiller: true,
};

export function useCallSession() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [status, setStatus] = useState<CallStatus>("idle");
  const [turns, setTurns] = useState<TranscriptTurn[]>([]);
  const [, setTurnRenderCounter] = useState(0);
  const currentTurnRef = useRef(0);
  const [activeDecisionCard, setActiveDecisionCard] = useState<DecisionCard | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ManusReceipt | null>(null);
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);
  const callDurationRef = useRef(0);
  const [isDemoAutoPlay, setIsDemoAutoPlay] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scenarioRef = useRef(selectedScenario);
  scenarioRef.current = selectedScenario;

  const reset = useCallback((newScenario?: Scenario) => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    if (newScenario) setSelectedScenario(newScenario);
    setStatus("idle");
    setTurns([]);
    currentTurnRef.current = 0;
    setTurnRenderCounter((c) => c + 1);
    setActiveDecisionCard(null);
    setSelectedOptionId(null);
    setReceipt(null);
    setWhispers([]);
    callDurationRef.current = 0;
    setCallDurationSeconds(0);
    setIsDemoAutoPlay(false);
    setAudioLevel(0);
  }, []);

  // Duration timer
  useEffect(() => {
    if (status === "dialing" || status === "in_call" || status === "escalating" || status === "user_deciding" || status === "agent_confirming") {
      callTimerRef.current = setInterval(() => {
        callDurationRef.current += 1;
        setCallDurationSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [status]);

  // Simulated live audio waveform
  useEffect(() => {
    if (status === "in_call" || status === "agent_confirming") {
      const id = setInterval(() => {
        setAudioLevel(Math.floor(28 + Math.random() * 62));
      }, 180);
      return () => clearInterval(id);
    } else if (status === "user_deciding") {
      const id = setInterval(() => {
        setAudioLevel(Math.floor(8 + Math.random() * 12));
      }, 300);
      return () => clearInterval(id);
    } else {
      setAudioLevel(0);
    }
  }, [status]);

  const advanceOneTurn = useCallback(() => {
    const sc = scenarioRef.current;
    const timeline = sc.timeline;
    const idx = currentTurnRef.current;
    if (idx >= timeline.turns.length) {
      setStatus("resolved");
      return;
    }
    const nextTurn = timeline.turns[idx];
    setTurns((prev) => [...prev, nextTurn]);
    currentTurnRef.current = idx + 1;
    setTurnRenderCounter((c) => c + 1);

    if (idx === 0) setStatus("dialing");
    else if (idx === 1) setStatus("in_call");

    if (nextTurn.isEscalationTrigger) {
      setStatus("escalating");
      setTimeout(() => {
        const filler: TranscriptTurn = {
          ...FILLER_TURN,
          id: "filler-" + Date.now(),
          timestamp: formatSeconds(callDurationRef.current + 2),
        };
        setTurns((prev) => [...prev, filler]);
        setTimeout(() => {
          setActiveDecisionCard(timeline.decisionCard);
          setStatus("user_deciding");
        }, 500);
      }, 700);
    }
  }, []);

  // Start call - completely synchronous
  const startCall = useCallback(() => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    const sc = scenarioRef.current;
    setTurns([sc.timeline.turns[0]]);
    currentTurnRef.current = 1;
    setTurnRenderCounter((c) => c + 1);
    setStatus("dialing");
    setActiveDecisionCard(null);
    setSelectedOptionId(null);
    setReceipt(null);
    setWhispers([]);
    callDurationRef.current = 0;
    setCallDurationSeconds(0);
  }, []);

  // Auto-play mode (natural pacing)
  useEffect(() => {
    if (!isDemoAutoPlay) return;
    if (status === "resolved") return;
    if (status === "user_deciding") return;
    const idx = currentTurnRef.current;
    const delay = idx === 1 ? 2600 : idx === 2 ? 3800 : idx === 3 ? 4200 : 4200;
    autoPlayTimerRef.current = setTimeout(() => {
      advanceOneTurn();
    }, delay);
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isDemoAutoPlay, status, advanceOneTurn]);

  // Human answers the decision card
  const answerDecision = useCallback((optionId: string) => {
    if (!activeDecisionCard) return;
    setSelectedOptionId(optionId);
    setActiveDecisionCard(null);
    setStatus("agent_confirming");

    const res = scenarioRef.current.timeline.resolutionByOptionId[optionId];
    if (!res) return;

    const baseSec = callDurationRef.current;
    const t1: TranscriptTurn = {
      id: "confirm-" + Date.now(),
      timestamp: formatSeconds(baseSec + 2),
      speaker: "agent_jp",
      speakerLabel: "Moshi-Pilot (Keigo)",
      japaneseText: res.agentConfirmationJp,
      englishText: res.agentConfirmationEn,
    };

    const t2: TranscriptTurn = {
      id: "ack-" + Date.now(),
      timestamp: formatSeconds(baseSec + 7),
      speaker: "hotel",
      speakerLabel: scenarioRef.current.timeline.turns[1]?.speakerLabel || "Hotel Staff",
      japaneseText: res.hotelFinalJp,
      englishText: res.hotelFinalEn,
    };

    setTurns((prev) => [...prev, t1]);
    setTimeout(() => {
      setTurns((prev) => [...prev, t2]);
      setTimeout(() => {
        setStatus("resolved");
        setReceipt(scenarioRef.current.receipt);
      }, 800);
    }, 1600);
  }, [activeDecisionCard]);

  // Whisper steering input
  const addWhisper = useCallback((text: string) => {
    if (!text.trim()) return;
    const w: Whisper = {
      id: "w-" + Date.now(),
      text: text.trim(),
      time: formatSeconds(callDurationRef.current),
    };
    setWhispers((prev) => [w, ...prev]);
    const turn: TranscriptTurn = {
      id: "turn-whisper-" + Date.now(),
      timestamp: formatSeconds(callDurationRef.current),
      speaker: "whisper",
      speakerLabel: "You (whisper steering)",
      englishText: `"${w.text}"`,
    };
    setTurns((prev) => [...prev, turn]);
  }, []);

  // 90-second hackathon stage demo (auto-picks option)
  const runStageDemo = useCallback(() => {
    reset();
    setIsDemoAutoPlay(true);
    setTimeout(() => {
      startCall();
    }, 400);
  }, [reset, startCall]);

  useEffect(() => {
    if (isDemoAutoPlay && status === "user_deciding" && activeDecisionCard) {
      const autoOption = activeDecisionCard.options[0].id;
      const t = setTimeout(() => {
        answerDecision(autoOption);
      }, 3400);
      return () => clearTimeout(t);
    }
  }, [isDemoAutoPlay, status, activeDecisionCard, answerDecision]);

  return {
    scenario: selectedScenario,
    setScenario: (s: Scenario) => reset(s),
    status,
    turns,
    activeDecisionCard,
    selectedOptionId,
    receipt,
    whispers,
    callDurationSeconds,
    isDemoAutoPlay,
    audioLevel,
    startCall,
    advanceOneTurn,
    answerDecision,
    addWhisper,
    reset,
    toggleAutoPlay: () => setIsDemoAutoPlay((v) => !v),
    runStageDemo,
  };
}

function formatSeconds(s: number) {
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(m).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
}
