"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as manuscriptsApi from "@/services/manuscripts";
import type { TiptapDoc } from "@/types/api";

export function useManuscripts(projectId: string | null) {
  return useQuery({
    queryKey: ["manuscripts", projectId],
    queryFn: () => manuscriptsApi.listManuscripts(projectId as string, { limit: 100 }),
    enabled: !!projectId,
  });
}

export function useManuscript(id: string | null, projectId: string | null) {
  return useQuery({
    queryKey: ["manuscripts", projectId, id],
    queryFn: () => manuscriptsApi.getManuscript(id as string, projectId as string),
    enabled: !!id && !!projectId,
  });
}

export function useCreateManuscript(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { title: string; content_json?: TiptapDoc }) => manuscriptsApi.createManuscript(projectId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["manuscripts", projectId] }),
  });
}

export function useUpdateManuscript(id: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { title?: string; content_json?: TiptapDoc }) => manuscriptsApi.updateManuscript(id, projectId, body),
    onSuccess: (updated) => {
      queryClient.setQueryData(["manuscripts", projectId, id], updated);
      queryClient.invalidateQueries({ queryKey: ["manuscripts", projectId], exact: true });
    },
  });
}

export function useDeleteManuscript(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => manuscriptsApi.deleteManuscript(id, projectId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["manuscripts", projectId] }),
  });
}

export function useExportManuscript(projectId: string) {
  return useMutation({
    mutationFn: ({ id, format, style }: { id: string; format: "docx" | "pdf"; style?: string }) =>
      manuscriptsApi.exportManuscript(id, projectId, { format, style }),
  });
}
