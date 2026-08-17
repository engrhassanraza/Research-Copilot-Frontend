"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as deepResearchApi from "@/services/deep-research";

export function useStartDeepResearch(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { topic: string; worker_count?: number; style?: string }) => deepResearchApi.startDeepResearch(projectId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs", projectId] }),
  });
}
