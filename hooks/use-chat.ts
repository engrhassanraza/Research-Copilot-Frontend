"use client";

import { useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { streamChat } from "@/services/chat";
import { useChatStore } from "@/stores/chat-store";
import type { ChatResponse, CitationStyle } from "@/types/api";

interface SendMessageArgs {
  projectId: string;
  conversationId: string | null;
  message: string;
  citationStyle?: CitationStyle;
}

export function useChatStream(
  onFinal?: (response: ChatResponse, conversationId: string) => void,
  onStreamError?: (message: string) => void
) {
  const queryClient = useQueryClient();
  const { start, pushNode, finish, fail } = useChatStore();
  const controllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async ({ projectId, conversationId, message, citationStyle = "ieee" }: SendMessageArgs) => {
      const controller = new AbortController();
      controllerRef.current = controller;
      start(conversationId);

      let resolvedConversationId = conversationId ?? "";

      try {
        await streamChat(
          projectId,
          { conversation_id: conversationId ?? undefined, message, citation_style: citationStyle },
          {
            onConversation: (id) => {
              resolvedConversationId = id;
            },
            onNode: (node) => pushNode(node),
            onFinal: (response) => {
              finish();
              queryClient.invalidateQueries({ queryKey: ["conversations", projectId] });
              onFinal?.(response, resolvedConversationId || response.conversation_id);
            },
            // Deliberately no onError here — every error path in streamChat
            // (connect failure, non-2xx, mid-stream break, no `final`
            // received) re-throws, so the single catch below is the one
            // place that reacts. Handling it here too would double-fire
            // the toast and the store update.
          },
          controller.signal
        );
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          const message = error instanceof Error ? error.message : "Chat request failed";
          fail(message);
          toast.error("Chat failed", { description: message });
          onStreamError?.(message);
        }
      }
    },
    [start, pushNode, finish, fail, queryClient, onFinal, onStreamError]
  );

  const stop = useCallback(() => {
    controllerRef.current?.abort();
    finish();
  }, [finish]);

  return { sendMessage, stop };
}
