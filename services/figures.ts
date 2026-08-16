import { apiFetch, buildQuery } from "@/services/api";
import type { FigureRecord, GenerateDiagramRequest, GenerateDiagramResponse } from "@/types/api";

export function listFigures(
  projectId: string,
  params: { document_id?: string; limit?: number; offset?: number } = {}
) {
  return apiFetch<FigureRecord[]>(`/figures${buildQuery({ project_id: projectId, ...params })}`);
}

export function generateDiagram(projectId: string, body: GenerateDiagramRequest) {
  return apiFetch<GenerateDiagramResponse>(`/figures/generate${buildQuery({ project_id: projectId })}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function generateIllustration(projectId: string, prompt: string): Promise<string> {
  const response = await apiFetch<Response>(`/figures/generate/illustration${buildQuery({ project_id: projectId })}`, {
    method: "POST",
    body: JSON.stringify({ prompt }),
    rawResponse: true,
  });
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
