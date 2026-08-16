import { useAuthStore } from "@/stores/auth-store";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  detail: unknown;

  constructor(status: number, detail: unknown, message?: string) {
    super(message ?? (typeof detail === "string" ? detail : "Request failed"));
    this.status = status;
    this.detail = detail;
  }
}

function extractMessage(detail: unknown): string {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d) => (typeof d === "object" && d && "msg" in d ? String((d as { msg: unknown }).msg) : JSON.stringify(d)))
      .join("; ");
  }
  if (detail && typeof detail === "object" && "detail" in detail) {
    return extractMessage((detail as { detail: unknown }).detail);
  }
  return "Something went wrong";
}

function handleUnauthorized() {
  useAuthStore.getState().clear();
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}

type ApiFetchInit = RequestInit & { skipAuth?: boolean; rawResponse?: boolean };

export async function apiFetch<T>(path: string, init: ApiFetchInit = {}): Promise<T> {
  const { skipAuth, rawResponse, headers, ...rest } = init;
  const token = useAuthStore.getState().token;

  const finalHeaders = new Headers(headers);
  if (!(rest.body instanceof FormData) && !finalHeaders.has("Content-Type") && rest.body !== undefined) {
    finalHeaders.set("Content-Type", "application/json");
  }
  if (token && !skipAuth) {
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}/api/v1${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  if (response.status === 401 && !skipAuth) {
    handleUnauthorized();
    throw new ApiError(401, "Session expired", "Session expired");
  }

  if (!response.ok) {
    let detail: unknown = null;
    try {
      detail = await response.json();
    } catch {
      // non-JSON error body
    }
    const message = detail && typeof detail === "object" && "detail" in detail
      ? extractMessage((detail as { detail: unknown }).detail)
      : extractMessage(detail);
    throw new ApiError(response.status, detail, message);
  }

  if (rawResponse) {
    return response as unknown as T;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }
  return (await response.text()) as unknown as T;
}

export function buildQuery(params: Record<string, string | number | boolean | undefined | null>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
