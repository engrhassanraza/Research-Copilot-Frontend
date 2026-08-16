import { apiFetch, buildQuery } from "@/services/api";
import type { Paper, PaperCreate } from "@/types/api";

export function listPapers(projectId: string, params: { limit?: number; offset?: number } = {}) {
  return apiFetch<Paper[]>(`/papers${buildQuery({ project_id: projectId, ...params })}`);
}

export function getPaper(id: string, projectId: string) {
  return apiFetch<Paper>(`/papers/${id}${buildQuery({ project_id: projectId })}`);
}

export function createPaper(projectId: string, body: PaperCreate) {
  return apiFetch<Paper>(`/papers${buildQuery({ project_id: projectId })}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function deletePaper(id: string, projectId: string) {
  return apiFetch<void>(`/papers/${id}${buildQuery({ project_id: projectId })}`, { method: "DELETE" });
}
