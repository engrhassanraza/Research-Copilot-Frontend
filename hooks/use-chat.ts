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

export function useChatStream(onFinal?: (response: ChatResponse, conversationId: string) => void) {
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
            onError: (error) => {
              fail(error.message);
              toast.error("Chat failed", { description: error.message });
            },
          },
          controller.signal
        );
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          const message = error instanceof Error ? error.message : "Chat request failed";
          fail(message);
          toast.error("Chat failed", { description: message });
        }
      }
    },
    [start, pushNode, finish, fail, queryClient, onFinal]
  );

  const stop = useCallback(() => {
    controllerRef.current?.abort();
    finish();
  }, [finish]);

  return { sendMessage, stop };
}
