import { apiFetch, buildQuery } from "@/services/api";
import type { Evidence } from "@/types/api";

export function getEvidence(evidenceId: string, projectId: string) {
  return apiFetch<Evidence>(`/evidence/${evidenceId}${buildQuery({ project_id: projectId })}`);
}
