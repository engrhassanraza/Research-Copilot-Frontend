import { apiFetch, buildQuery } from "@/services/api";
import type { KnowledgeMap } from "@/types/api";

export function getKnowledgeMap(projectId: string) {
  return apiFetch<KnowledgeMap>(`/knowledge-map${buildQuery({ project_id: projectId })}`);
}
