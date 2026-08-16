import { apiFetch, buildQuery } from "@/services/api";
import type { ExportResponse } from "@/types/api";

export function createExport(
  projectId: string,
  body: { message_id: string; format: "docx" | "pdf"; style?: string; title?: string }
) {
  return apiFetch<ExportResponse>(`/exports${buildQuery({ project_id: projectId })}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getExport(id: string, projectId: string) {
  return apiFetch<ExportResponse>(`/exports/${id}${buildQuery({ project_id: projectId })}`);
}
