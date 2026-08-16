"use client";

import { useQuery } from "@tanstack/react-query";

import * as kgApi from "@/services/knowledge-graph";
import * as kmApi from "@/services/knowledge-map";

export function useKnowledgeGraph(projectId: string | null) {
  return useQuery({
    queryKey: ["knowledge-graph", projectId],
    queryFn: () => kgApi.getKnowledgeGraph(projectId as string),
    enabled: !!projectId,
  });
}

export function useKnowledgeMap(projectId: string | null) {
  return useQuery({
    queryKey: ["knowledge-map", projectId],
    queryFn: () => kmApi.getKnowledgeMap(projectId as string),
    enabled: !!projectId,
  });
}
