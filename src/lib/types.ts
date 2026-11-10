export type CallStatus =
  | "idle"
  | "dialing"
  | "in_call"
  | "escalating"
  | "user_deciding"
  | "agent_confirming"
  | "resolved"
  | "failed";

export type Speaker = "agent_jp" | "hotel" | "system" | "whisper";

export interface TranscriptTurn {
  id: string;
  timestamp: string; // MM:SS
  speaker: Speaker;
  speakerLabel: string;
  japaneseText?: string;
  englishText: string;
  romaji?: string;
  isFiller?: boolean;
  isEscalationTrigger?: boolean;
}

export interface DecisionOption {
  id: string;
  labelEn: string;
  labelJp: string;
  description?: string;
  badge?: string;
  accent?: "primary" | "secondary" | "danger";
}

export interface DecisionCard {
  id: string;
  questionEn: string;
  questionJp: string;
  contextEn: string;
  options: DecisionOption[];
  confidence: number;
  routingReason: string;
}

export interface ExaGrounding {
  venueNameEn: string;
  venueNameJp: string;
  phoneNumber: string;
  address: string;
  hours: string;
  checkInRule: string;
  cancellationPolicy: string;
  notes: string[];
  sourceUrl: string;
}

export interface ManusReceipt {
  bookingId: string;
  venue: string;
  date: string;
  spokeWith: string;
  agreedPoints: string[];
  updatedItinerary: { label: string; value: string }[];
  agentSummary: string;
  dispatchedAt: string;
}

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  intent: string;
  destinationNumber: string;
  grounding: ExaGrounding;
  timeline: {
    turns: TranscriptTurn[];
    escalateAtTurnIndex: number;
    decisionCard: DecisionCard;
    resolutionByOptionId: Record<
      string,
      {
        agentConfirmationJp: string;
        agentConfirmationEn: string;
        hotelFinalJp: string;
        hotelFinalEn: string;
      }
    >;
  };
  receipt: ManusReceipt;
}

export interface Partner {
  id: string;
  name: string;
  role: string;
  status: "connected" | "simulated" | "ready";
  description: string;
}

export interface Whisper {
  id: string;
  text: string;
  time: string;
  wovenIntoJp?: string;
  wovenIntoEn?: string;
}
