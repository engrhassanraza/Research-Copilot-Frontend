import { apiFetch } from "@/services/api";
import type { AuthUser, TokenResponse } from "@/types/api";

export function login(body: { email: string; password: string }) {
  return apiFetch<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
    skipAuth: true,
  });
}

export function register(body: { email: string; password: string; full_name?: string }) {
  return apiFetch<TokenResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
    skipAuth: true,
  });
}

export function getMe() {
  return apiFetch<AuthUser>("/auth/me");
}
