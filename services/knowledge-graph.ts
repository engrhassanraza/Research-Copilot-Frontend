import { apiFetch, buildQuery } from "@/services/api";
import type { KnowledgeGraph } from "@/types/api";

export function getKnowledgeGraph(projectId: string) {
  return apiFetch<KnowledgeGraph>(`/knowledge-graph${buildQuery({ project_id: projectId })}`);
}
