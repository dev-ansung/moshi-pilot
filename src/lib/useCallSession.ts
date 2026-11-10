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
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [activeDecisionCard, setActiveDecisionCard] = useState<DecisionCard | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ManusReceipt | null>(null);
  const [whispers, setWhispers] = useState<Whisper[]>([]);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);
  const [isDemoAutoPlay, setIsDemoAutoPlay] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); // 0-100 for live waveform

  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stageDemoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const reset = useCallback((newScenario?: Scenario) => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    if (stageDemoTimerRef.current) clearTimeout(stageDemoTimerRef.current);
    if (newScenario) setSelectedScenario(newScenario);
    setStatus("idle");
    setTurns([]);
    setCurrentTurnIndex(0);
    setActiveDecisionCard(null);
    setSelectedOptionId(null);
    setReceipt(null);
    setWhispers([]);
    setCallDurationSeconds(0);
    setIsDemoAutoPlay(false);
    setAudioLevel(0);
  }, [selectedScenario]);

  // Duration timer
  useEffect(() => {
    if (status === "dialing" || status === "in_call" || status === "escalating" || status === "user_deciding" || status === "agent_confirming") {
      callTimerRef.current = setInterval(() => {
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
        setAudioLevel(Math.floor(8 + Math.random() * 12)); // polite background silence
      }, 300);
      return () => clearInterval(id);
    } else {
      setAudioLevel(0);
    }
  }, [status]);

  const advanceOneTurn = useCallback(() => {
    const timeline = selectedScenario.timeline;
    if (currentTurnIndex >= timeline.turns.length) {
      if (status !== "resolved") setStatus("resolved");
      return;
    }
    const nextTurn = timeline.turns[currentTurnIndex];
    setTurns((prev) => [...prev, nextTurn]);
    const newIndex = currentTurnIndex + 1;
    setCurrentTurnIndex(newIndex);

    if (currentTurnIndex === 0) {
      setStatus("dialing");
    } else if (currentTurnIndex === 1) {
      setStatus("in_call");
    }

    // Check if this turn triggers escalation
    if (nextTurn.isEscalationTrigger) {
      setStatus("escalating");
      // polite filler injected automatically after 700ms
      setTimeout(() => {
        const filler: TranscriptTurn = {
          ...FILLER_TURN,
          id: "filler-" + Date.now(),
          timestamp: formatSeconds(callDurationSeconds + 2),
        };
        setTurns((prev) => [...prev, filler]);
        setTimeout(() => {
          setActiveDecisionCard(timeline.decisionCard);
          setStatus("user_deciding");
        }, 500);
      }, 700);
    }
  }, [selectedScenario, currentTurnIndex, status, callDurationSeconds]);

  // Start call
  const startCall = useCallback(() => {
    reset();
    setTimeout(() => {
      setStatus("dialing");
      setTurns([selectedScenario.timeline.turns[0]]);
      setCurrentTurnIndex(1);
    }, 150);
  }, [reset, selectedScenario]);

  // Auto-play mode (natural pacing)
  useEffect(() => {
    if (!isDemoAutoPlay) return;
    if (status === "resolved") return;
    if (status === "user_deciding") return; // waiting on human
    const delay = currentTurnIndex === 0 ? 900 : currentTurnIndex === 1 ? 2600 : currentTurnIndex === 2 ? 3800 : 4200;
    autoPlayTimerRef.current = setTimeout(() => {
      advanceOneTurn();
    }, delay);
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isDemoAutoPlay, status, currentTurnIndex, advanceOneTurn]);

  // Human answers the decision card
  const answerDecision = useCallback(
    (optionId: string) => {
      if (!activeDecisionCard) return;
      setSelectedOptionId(optionId);
      setActiveDecisionCard(null);
      setStatus("agent_confirming");

      const res = selectedScenario.timeline.resolutionByOptionId[optionId];
      if (!res) return;

      const baseSec = callDurationSeconds;
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
        speakerLabel: selectedScenario.timeline.turns[1]?.speakerLabel || "Hotel Staff",
        japaneseText: res.hotelFinalJp,
        englishText: res.hotelFinalEn,
      };

      setTurns((prev) => [...prev, t1]);
      setTimeout(() => {
        setTurns((prev) => [...prev, t2]);
        setTimeout(() => {
          setStatus("resolved");
          setReceipt(selectedScenario.receipt);
        }, 800);
      }, 1600);
    },
    [activeDecisionCard, selectedScenario, callDurationSeconds]
  );

  // Whisper steering input
  const addWhisper = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const w: Whisper = {
        id: "w-" + Date.now(),
        text: text.trim(),
        time: formatSeconds(callDurationSeconds),
      };
      setWhispers((prev) => [w, ...prev]);
      const turn: TranscriptTurn = {
        id: "turn-whisper-" + Date.now(),
        timestamp: formatSeconds(callDurationSeconds),
        speaker: "whisper",
        speakerLabel: "You (whisper steering)",
        englishText: `"${w.text}"`,
      };
      setTurns((prev) => [...prev, turn]);
    },
    [callDurationSeconds]
  );

  // 90-second hackathon stage demo (auto-picks option)
  const runStageDemo = useCallback(() => {
    reset();
    setIsDemoAutoPlay(true);
    setTimeout(() => {
      startCall();
    }, 300);
    // when escalation arrives, automatically pick option after 3.2s
    stageDemoTimerRef.current = setTimeout(() => {
      // handled via effect watching status
    }, 100);
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
