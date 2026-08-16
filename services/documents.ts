import { apiFetch, buildQuery } from "@/services/api";
import type { Document, JobRef } from "@/types/api";

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50MB

export function listDocuments(projectId: string, params: { limit?: number; offset?: number } = {}) {
  return apiFetch<Document[]>(`/documents${buildQuery({ project_id: projectId, ...params })}`);
}

export function getDocument(id: string, projectId: string) {
  return apiFetch<Document>(`/documents/${id}${buildQuery({ project_id: projectId })}`);
}

export function uploadDocument(projectId: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch<JobRef>(`/documents${buildQuery({ project_id: projectId })}`, {
    method: "POST",
    body: formData,
  });
}

export function deleteDocument(id: string, projectId: string) {
  return apiFetch<void>(`/documents/${id}${buildQuery({ project_id: projectId })}`, { method: "DELETE" });
}

export function reprocessDocument(id: string, projectId: string) {
  return apiFetch<JobRef>(`/documents/${id}/reprocess${buildQuery({ project_id: projectId })}`, {
    method: "POST",
  });
}
