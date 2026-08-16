"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as documentsApi from "@/services/documents";

export function useDocuments(projectId: string | null) {
  return useQuery({
    queryKey: ["documents", projectId],
    queryFn: () => documentsApi.listDocuments(projectId as string, { limit: 200 }),
    enabled: !!projectId,
    refetchInterval: (query) => {
      const docs = query.state.data;
      const hasActive = docs?.some((d) => d.status === "processing" || d.status === "uploaded");
      return hasActive ? 4000 : false;
    },
  });
}

export function useUploadDocument(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => documentsApi.uploadDocument(projectId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
      queryClient.invalidateQueries({ queryKey: ["jobs", projectId] });
    },
  });
}

export function useDeleteDocument(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsApi.deleteDocument(id, projectId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documents", projectId] }),
  });
}

export function useReprocessDocument(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsApi.reprocessDocument(id, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
      queryClient.invalidateQueries({ queryKey: ["jobs", projectId] });
    },
  });
}
