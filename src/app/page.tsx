"use client";

import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { MobileShell, TabId } from "@/components/mobile/MobileShell";
import { CallTab } from "@/components/mobile/CallTab";
import { InterpreterTab } from "@/components/mobile/InterpreterTab";
import { ServicesTab } from "@/components/mobile/ServicesTab";
import { ReceiptsTab } from "@/components/mobile/ReceiptsTab";
import { useLiveCall } from "@/lib/mobile/useLiveCall";
import { checkStatus, speakText } from "@/lib/mobile/api";

export default function Home() {
  const [tab, setTab] = useState<TabId>("call");
  const [realMode, setRealMode] = useState(true);
  const [apiReady, setApiReady] = useState(false);
  const [services, setServices] = useState<{ [k: string]: boolean }>({});

  const call = useLiveCall(realMode);

  useEffect(() => {
    checkStatus()
      .then((s) => {
        setApiReady(s.realModeReady);
        setServices(s.services);
      })
      .catch(() => {});
  }, []);

  const inCall =
    call.status === "connecting" ||
    call.status === "in_call" ||
    call.status === "escalating" ||
    call.status === "user_deciding";

  return (
    <MobileShell
      activeTab={tab}
      onTabChange={setTab}
      inCall={inCall}
      realMode={realMode}
      onToggleMode={() => setRealMode((m) => !m)}
      apiReady={apiReady}
      statusText={
        call.status === "connecting"
          ? "Dialing…"
          : call.status === "in_call"
          ? `Speaking ${call.country.langName} · ${call.country.formality}`
          : call.status === "escalating"
          ? "Polite filler playing — decision needed"
          : call.status === "user_deciding"
          ? "Waiting for your decision"
          : undefined
      }
    >
      {/* Real API status chips */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 overflow-x-auto pb-1 scrollbar-none gap-2">
        <span className="shrink-0">Live stack:</span>
        {[
          ["Deepgram", services.deepgram],
          ["Fish Audio", services.fishAudio],
          ["TypeSafe Jev", services.typeSafe],
          ["gpt-5-mini", services.llm],
          ["LiveKit", services.liveKit],
        ].map(([name, ok]) => (
          <span
            key={name as string}
            className={`shrink-0 flex items-center gap-1 ${
              ok ? "text-emerald-400" : "text-zinc-600"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                ok ? "bg-emerald-400" : "bg-zinc-600"
              }`}
            />
            {name as string}
          </span>
        ))}
      </div>

      {/* Active tab */}
      {tab === "call" && (
        <CallTab
          country={call.country}
          onCountryChange={call.setCountry}
          customerName={call.customerName}
          onCustomerNameChange={call.setCustomerName}
          reservationId={call.reservationId}
          onReservationIdChange={call.setReservationId}
          goal={call.goal}
          onGoalChange={call.setGoal}
          phone={call.phone}
          onPhoneChange={call.setPhone}
          status={call.status}
          turns={call.turns}
          decision={call.decision}
          receipt={call.receipt}
          duration={call.duration}
          busy={call.busy}
          recording={call.recording}
          realMode={realMode}
          onStartCall={call.startCall}
          onAnswer={call.answerDecision}
          onWhisper={call.sendWhisper}
          onEnd={call.endCall}
          onReset={call.resetCall}
          onStep={call.advanceDemo}
          onStartRecording={call.startRecording}
          onStopRecording={call.stopRecordingAndTranscribe}
          onPlayAgain={(t) => speakText(t).catch(() => {})}
          onGoToReceipts={() => setTab("receipts")}
        />
      )}

      {tab === "interpreter" && (
        <InterpreterTab country={call.country} onCountryChange={call.setCountry} />
      )}

      {tab === "services" && (
        <ServicesTab
          country={call.country}
          onUseTopic={(t, p) => {
            call.setGoal(t);
            if (p) call.setPhone(p);
            setTab("call");
          }}
        />
      )}

      {tab === "receipts" && <ReceiptsTab receipt={call.receipt} />}

      {/* Deterministic HITL guarantee footer */}
      <div className="pt-2">
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-2.5 text-[9px] font-mono text-zinc-500 flex items-start gap-2">
          <Shield className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
          <span>
            Deterministic HITL guarantee: the agent never commits to financial or policy
            changes without your explicit screen tap. TypeSafe / Jev decision router · Keigo-trained voice proxy.<br /><span className="text-zinc-600">Built for the Side Quest Hotline Vapi Hackathon @ Vapi HQ · Deepgram · Fish Audio · TypeSafe/Jev · gpt-5-mini · LiveKit Cloud · Vercel</span>
          </span>
        </div>
      </div>
    </MobileShell>
  );
}
