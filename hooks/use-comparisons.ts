"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as comparisonsApi from "@/services/comparisons";

export function useStartComparison(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { paper_ids: string[]; question?: string }) =>
      comparisonsApi.startComparison(projectId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs", projectId] }),
  });
}
