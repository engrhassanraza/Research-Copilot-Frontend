"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import * as figuresApi from "@/services/figures";
import type { GenerateDiagramRequest } from "@/types/api";

export function useFigures(projectId: string | null, documentId?: string) {
  return useQuery({
    queryKey: ["figures", projectId, documentId],
    queryFn: () => figuresApi.listFigures(projectId as string, { document_id: documentId, limit: 200 }),
    enabled: !!projectId,
  });
}

export function useGenerateDiagram(projectId: string) {
  return useMutation({
    mutationFn: (body: GenerateDiagramRequest) => figuresApi.generateDiagram(projectId, body),
  });
}

export function useGenerateIllustration(projectId: string) {
  return useMutation({
    mutationFn: (prompt: string) => figuresApi.generateIllustration(projectId, prompt),
  });
}
