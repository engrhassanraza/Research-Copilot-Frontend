import { apiFetch, buildQuery } from "@/services/api";
import type { Manuscript, ManuscriptExportResponse, ManuscriptSummary, TiptapDoc } from "@/types/api";

export function listManuscripts(projectId: string, params: { limit?: number; offset?: number } = {}) {
  return apiFetch<ManuscriptSummary[]>(`/manuscripts${buildQuery({ project_id: projectId, ...params })}`);
}

export function getManuscript(id: string, projectId: string) {
  return apiFetch<Manuscript>(`/manuscripts/${id}${buildQuery({ project_id: projectId })}`);
}

export function createManuscript(projectId: string, body: { title: string; content_json?: TiptapDoc }) {
  return apiFetch<Manuscript>(`/manuscripts${buildQuery({ project_id: projectId })}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateManuscript(id: string, projectId: string, body: { title?: string; content_json?: TiptapDoc }) {
  return apiFetch<Manuscript>(`/manuscripts/${id}${buildQuery({ project_id: projectId })}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function deleteManuscript(id: string, projectId: string) {
  return apiFetch<void>(`/manuscripts/${id}${buildQuery({ project_id: projectId })}`, { method: "DELETE" });
}

export function exportManuscript(id: string, projectId: string, body: { format: "docx" | "pdf"; style?: string }) {
  return apiFetch<ManuscriptExportResponse>(`/manuscripts/${id}/export${buildQuery({ project_id: projectId })}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
