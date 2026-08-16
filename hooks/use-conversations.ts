"use client";

import { useQuery } from "@tanstack/react-query";

import * as conversationsApi from "@/services/conversations";

export function useConversations(projectId: string | null) {
  return useQuery({
    queryKey: ["conversations", projectId],
    queryFn: () => conversationsApi.listConversations(projectId as string, { limit: 100 }),
    enabled: !!projectId,
  });
}

export function useConversation(id: string | null, projectId: string | null) {
  return useQuery({
    queryKey: ["conversations", projectId, id],
    queryFn: () => conversationsApi.getConversation(id as string, projectId as string),
    enabled: !!id && !!projectId,
  });
}
