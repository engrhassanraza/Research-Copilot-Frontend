import { apiFetch, buildQuery } from "@/services/api";

export function startLiteratureReview(
  projectId: string,
  body: { topic: string; style?: string; paper_count?: number }
) {
  return apiFetch<{ job_id: string }>(`/literature-review${buildQuery({ project_id: projectId })}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
