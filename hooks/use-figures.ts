"use client";

import { useQuery } from "@tanstack/react-query";

import * as figuresApi from "@/services/figures";

export function useFigures(projectId: string | null, documentId?: string) {
  return useQuery({
    queryKey: ["figures", projectId, documentId],
    queryFn: () => figuresApi.listFigures(projectId as string, { document_id: documentId, limit: 200 }),
    enabled: !!projectId,
  });
}
