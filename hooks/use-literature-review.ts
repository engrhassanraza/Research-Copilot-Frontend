"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as literatureReviewApi from "@/services/literature-review";

export function useStartLiteratureReview(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { topic: string; style?: string; paper_count?: number }) =>
      literatureReviewApi.startLiteratureReview(projectId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs", projectId] }),
  });
}
