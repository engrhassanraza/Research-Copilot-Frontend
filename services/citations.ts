import { apiFetch, buildQuery } from "@/services/api";
import type { CitationRecord } from "@/types/api";

export function listCitations(
  projectId: string,
  params: { message_id?: string; generated_document_id?: string } = {}
) {
  return apiFetch<CitationRecord[]>(`/citations${buildQuery({ project_id: projectId, ...params })}`);
}
