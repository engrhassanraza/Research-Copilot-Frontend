import { apiFetch, buildQuery } from "@/services/api";
import type { Analytics } from "@/types/api";

export function getAnalytics(projectId: string) {
  return apiFetch<Analytics>(`/analytics${buildQuery({ project_id: projectId })}`);
}
