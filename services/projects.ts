import { apiFetch, buildQuery } from "@/services/api";
import type { Project, ProjectMember, ProjectRole } from "@/types/api";

export function listProjects(params: { limit?: number; offset?: number } = {}) {
  return apiFetch<Project[]>(`/projects${buildQuery(params)}`);
}

export function getProject(id: string) {
  return apiFetch<Project>(`/projects/${id}`);
}

export function createProject(body: { name: string; description?: string }) {
  return apiFetch<Project>("/projects", { method: "POST", body: JSON.stringify(body) });
}

export function updateProject(id: string, body: { name?: string; description?: string }) {
  return apiFetch<Project>(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}

export function deleteProject(id: string) {
  return apiFetch<void>(`/projects/${id}`, { method: "DELETE" });
}

export function listMembers(projectId: string) {
  return apiFetch<ProjectMember[]>(`/projects/${projectId}/members`);
}

export function addMember(projectId: string, body: { user_id: string; role: ProjectRole }) {
  return apiFetch<ProjectMember>(`/projects/${projectId}/members`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function removeMember(projectId: string, userId: string) {
  return apiFetch<void>(`/projects/${projectId}/members/${userId}`, { method: "DELETE" });
}
