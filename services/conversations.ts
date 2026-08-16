import { apiFetch, buildQuery } from "@/services/api";
import type { Conversation, ConversationDetail } from "@/types/api";

export function listConversations(projectId: string, params: { limit?: number; offset?: number } = {}) {
  return apiFetch<Conversation[]>(`/conversations${buildQuery({ project_id: projectId, ...params })}`);
}

export function getConversation(id: string, projectId: string) {
  return apiFetch<ConversationDetail>(`/conversations/${id}${buildQuery({ project_id: projectId })}`);
}
