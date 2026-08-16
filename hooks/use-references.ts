"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as referencesApi from "@/services/references";
import type { CitationStyle, ReferenceCreate } from "@/types/api";

export function useReferences(projectId: string | null) {
  return useQuery({
    queryKey: ["references", projectId],
    queryFn: () => referencesApi.listReferences(projectId as string, { limit: 200 }),
    enabled: !!projectId,
  });
}

export function useCreateReference(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ReferenceCreate) => referencesApi.createReference(projectId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["references", projectId] }),
  });
}

export function useDeleteReference(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => referencesApi.deleteReference(id, projectId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["references", projectId] }),
  });
}

export function useFormattedReference(id: string | null, projectId: string | null, style: CitationStyle) {
  return useQuery({
    queryKey: ["reference-format", projectId, id, style],
    queryFn: () => referencesApi.formatReference(id as string, projectId as string, style),
    enabled: !!id && !!projectId,
  });
}
