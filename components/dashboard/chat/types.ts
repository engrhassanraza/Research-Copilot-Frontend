import type { ChatMode, Citation, ChatSource, DiagramResult, EvidenceBlock, QualityScore, RoutingDecision, VerificationOutput } from "@/types/api";
import type { PipelineNodeState } from "@/stores/chat-store";

export interface LocalMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  citations?: Citation[];
  evidence?: EvidenceBlock[];
  sources?: ChatSource[];
  verification?: VerificationOutput | null;
  routing?: RoutingDecision | null;
  qualityScore?: QualityScore | null;
  mode?: ChatMode;
  diagram?: DiagramResult | null;
  pipeline?: PipelineNodeState[];
  streaming?: boolean;
  createdAt: number;
}
