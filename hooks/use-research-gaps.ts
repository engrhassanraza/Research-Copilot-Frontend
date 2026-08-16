"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as researchGapsApi from "@/services/research-gaps";

export function useStartResearchGapAnalysis(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { topic?: string }) => researchGapsApi.startResearchGapAnalysis(projectId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs", projectId] }),
  });
}
