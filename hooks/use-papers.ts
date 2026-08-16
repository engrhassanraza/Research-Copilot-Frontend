"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as papersApi from "@/services/papers";
import type { PaperCreate } from "@/types/api";

export function usePapers(projectId: string | null) {
  return useQuery({
    queryKey: ["papers", projectId],
    queryFn: () => papersApi.listPapers(projectId as string, { limit: 200 }),
    enabled: !!projectId,
  });
}

export function useCreatePaper(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: PaperCreate) => papersApi.createPaper(projectId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["papers", projectId] }),
  });
}

export function useDeletePaper(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => papersApi.deletePaper(id, projectId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["papers", projectId] }),
  });
}
