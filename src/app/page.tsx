"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { GroundingPanel } from "@/components/GroundingPanel";
import { CallConsole } from "@/components/CallConsole";
import { WhisperBar } from "@/components/WhisperBar";
import { DecisionCardModal } from "@/components/DecisionCardModal";
import { ManusReceiptPanel } from "@/components/ManusReceiptPanel";
import { PartnerStack } from "@/components/PartnerStack";
import { StageDemoBanner } from "@/components/StageDemoBanner";
import { CredentialsModal } from "@/components/CredentialsModal";
import { useCallSession } from "@/lib/useCallSession";
import { ShieldCheck } from "lucide-react";

export default function HomePage() {
  const [keysOpen, setKeysOpen] = useState(false);

  const {
    scenario,
    setScenario,
    status,
    turns,
    activeDecisionCard,
    receipt,
    
    callDurationSeconds,
    isDemoAutoPlay,
    audioLevel,
    startCall,
    advanceOneTurn,
    answerDecision,
    addWhisper,
    reset,
    toggleAutoPlay,
    runStageDemo,
  } = useCallSession();

  return (
    <div className="min-h-screen bg-white text-zinc-950 flex flex-col font-sans selection:bg-zinc-950 selection:text-white">
      <Header
        onOpenKeys={() => setKeysOpen(true)}
        onRunStageDemo={runStageDemo}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stage demo director banner */}
        <StageDemoBanner
          onRunStageDemo={runStageDemo}
          isRunning={isDemoAutoPlay}
        />

        {/* 3-column dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left panel — pre-call grounding */}
          <div className="lg:col-span-3 lg:sticky lg:top-20">
            <GroundingPanel
              scenario={scenario}
              onSelectScenario={setScenario}
              onStartCall={startCall}
              status={status}
            />
          </div>

          {/* Center panel — live console */}
          <div className="lg:col-span-6">
            <CallConsole
              status={status}
              turns={turns}
              duration={callDurationSeconds}
              audioLevel={audioLevel}
              onAdvance={advanceOneTurn}
              onEndCall={() => reset()}
              autoPlay={isDemoAutoPlay}
              onToggleAutoPlay={toggleAutoPlay}
              whisperSlot={
                <WhisperBar
                  onSend={addWhisper}
                  disabled={status === "idle" || status === "failed" || status === "dialing"}
                />
              }
            />
          </div>

          {/* Right panel — partners & receipt */}
          <div className="lg:col-span-3 lg:sticky lg:top-20 space-y-4">
            <PartnerStack />
            <ManusReceiptPanel receipt={receipt} />
          </div>
        </div>

        {/* Bottom trust bar */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-zinc-950 flex-shrink-0" />
            <span>
              <strong>Deterministic HITL guarantee:</strong> the agent never commits to financial or policy changes without your explicit screen tap.
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">
            Keigo-trained voice proxy · sub-second decision routing
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-6 text-xs text-zinc-400 text-center font-mono space-y-1">
        <p>
          Moshi-Pilot (もしパイロット) · built for the Side Quest Hotline Vapi Hackathon @ Vapi HQ
        </p>
        <p className="text-[11px] text-zinc-400">
          Vapi · Deepgram · TypeSafe/Jev · Exa · Manus · Vercel
        </p>
      </footer>

      {/* HITL decision modal */}
      <DecisionCardModal
        card={activeDecisionCard}
        onSelectOption={answerDecision}
      />

      {/* API keys modal */}
      <CredentialsModal open={keysOpen} onClose={() => setKeysOpen(false)} />
    </div>
  );
}
