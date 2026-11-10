export type Speaker = "foreign" | "agent" | "whisper" | "system";

export interface Turn {
  id: string;
  speaker: Speaker;
  speakerLabel: string;
  text: string;
  translation?: string;
  romaji?: string;
  timestamp: string;
  isFiller?: boolean;
}

export interface DecisionOption {
  id: string;
  label: string;
  sub?: string;
  recommended?: boolean;
}

export interface DecisionCard {
  id: string;
  title: string;
  description?: string;
  reason?: string;
  options: DecisionOption[];
  source?: string;
  confidence?: number;
}

export type CallStatus =
  | "idle"
  | "connecting"
  | "in_call"
  | "escalating"
  | "user_deciding"
  | "resolved";

export interface StructuredReceipt {
  venue?: string;
  reservationId?: string;
  agreedPoints: string[];
  updatedSchedule: Array<{ event: string; time: string }>;
  summary: string;
  followUps?: string[];
}
