import { apiFetch, buildQuery } from "@/services/api";
import type { JobRef } from "@/types/api";

export function startComparison(projectId: string, body: { paper_ids: string[]; question?: string }) {
  return apiFetch<{ job_id: string }>(`/comparisons${buildQuery({ project_id: projectId })}`, {
    method: "POST",
    body: JSON.stringify(body),
  }) as Promise<Pick<JobRef, "job_id">>;
}
