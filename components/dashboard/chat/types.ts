import type { Citation, ChatSource, VerificationOutput } from "@/types/api";
import type { PipelineNodeState } from "@/stores/chat-store";

export interface LocalMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  citations?: Citation[];
  sources?: ChatSource[];
  verification?: VerificationOutput | null;
  pipeline?: PipelineNodeState[];
  streaming?: boolean;
  createdAt: number;
}
