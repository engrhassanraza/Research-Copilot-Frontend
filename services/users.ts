import { apiFetch } from "@/services/api";
import type { AuthUser } from "@/types/api";

export function getUser(id: string) {
  return apiFetch<AuthUser>(`/users/${id}`);
}
