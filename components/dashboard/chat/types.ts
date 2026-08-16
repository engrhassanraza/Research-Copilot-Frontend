import type { Citation, ChatSource } from "@/types/api";
import type { PipelineNodeState } from "@/stores/chat-store";

export interface LocalMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  citations?: Citation[];
  sources?: ChatSource[];
  pipeline?: PipelineNodeState[];
  streaming?: boolean;
  createdAt: number;
}
