import { apiFetch, buildQuery } from "@/services/api";

export function startDeepResearch(projectId: string, body: { topic: string; worker_count?: number; style?: string }) {
  return apiFetch<{ job_id: string }>(`/deep-research${buildQuery({ project_id: projectId })}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
