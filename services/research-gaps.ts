import { apiFetch, buildQuery } from "@/services/api";

export function startResearchGapAnalysis(projectId: string, body: { topic?: string }) {
  return apiFetch<{ job_id: string }>(`/research-gaps${buildQuery({ project_id: projectId })}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
