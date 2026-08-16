import { apiFetch, buildQuery } from "@/services/api";
import type { CitationStyle, Reference, ReferenceCreate } from "@/types/api";

export function listReferences(projectId: string, params: { limit?: number; offset?: number } = {}) {
  return apiFetch<Reference[]>(`/references${buildQuery({ project_id: projectId, ...params })}`);
}

export function getReference(id: string, projectId: string) {
  return apiFetch<Reference>(`/references/${id}${buildQuery({ project_id: projectId })}`);
}

export function createReference(projectId: string, body: ReferenceCreate) {
  return apiFetch<Reference>(`/references${buildQuery({ project_id: projectId })}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function deleteReference(id: string, projectId: string) {
  return apiFetch<void>(`/references/${id}${buildQuery({ project_id: projectId })}`, { method: "DELETE" });
}

export function formatReference(id: string, projectId: string, style: CitationStyle = "ieee") {
  return apiFetch<{ formatted: string }>(
    `/references/${id}/format${buildQuery({ project_id: projectId, style })}`
  );
}

export async function exportReferences(
  projectId: string,
  fmt: "bibtex" | "ris"
): Promise<{ text: string; filename: string }> {
  const response = await apiFetch<Response>(`/references/export/${fmt}${buildQuery({ project_id: projectId })}`, {
    rawResponse: true,
  });
  const text = await response.text();
  return { text, filename: `references.${fmt === "bibtex" ? "bib" : "ris"}` };
}
