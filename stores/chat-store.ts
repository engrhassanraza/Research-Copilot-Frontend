import { create } from "zustand";

import type { AgentNode, CitationStyle } from "@/types/api";

export type PipelineNodeState = {
  node: AgentNode | string;
  at: number;
};

type ChatStreamState = {
  isStreaming: boolean;
  activeConversationId: string | null;
  streamingAnswer: string;
  pipeline: PipelineNodeState[];
  citationStyle: CitationStyle;
  error: string | null;
  start: (conversationId: string | null) => void;
  pushNode: (node: string) => void;
  appendAnswer: (chunk: string) => void;
  setCitationStyle: (style: CitationStyle) => void;
  finish: () => void;
  fail: (error: string) => void;
  reset: () => void;
};

export const useChatStore = create<ChatStreamState>()((set) => ({
  isStreaming: false,
  activeConversationId: null,
  streamingAnswer: "",
  pipeline: [],
  citationStyle: "ieee",
  error: null,
  start: (conversationId) =>
    set({
      isStreaming: true,
      activeConversationId: conversationId,
      streamingAnswer: "",
      pipeline: [],
      error: null,
    }),
  pushNode: (node) =>
    set((state) => ({ pipeline: [...state.pipeline, { node, at: Date.now() }] })),
  appendAnswer: (chunk) =>
    set((state) => ({ streamingAnswer: state.streamingAnswer + chunk })),
  setCitationStyle: (style) => set({ citationStyle: style }),
  finish: () => set({ isStreaming: false }),
  fail: (error) => set({ isStreaming: false, error }),
  reset: () => set({ isStreaming: false, streamingAnswer: "", pipeline: [], error: null }),
}));
