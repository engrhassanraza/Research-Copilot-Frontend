import { apiFetch } from "@/services/api";
import type { PaperResult } from "@/types/api";

export function searchPapers(body: { query: string; limit_per_provider?: number }) {
  return apiFetch<{ results: PaperResult[] }>("/search", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
