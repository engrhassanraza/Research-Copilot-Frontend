import { apiFetch, buildQuery } from "@/services/api";
import type { Job } from "@/types/api";

export function listJobs(projectId: string, params: { limit?: number; offset?: number } = {}) {
  return apiFetch<Job[]>(`/jobs${buildQuery({ project_id: projectId, ...params })}`);
}

export function getJob(id: string, projectId: string) {
  return apiFetch<Job>(`/jobs/${id}${buildQuery({ project_id: projectId })}`);
}
