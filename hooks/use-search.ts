"use client";

import { useMutation } from "@tanstack/react-query";

import * as searchApi from "@/services/search";

export function useSearchPapers() {
  return useMutation({
    mutationFn: (body: { query: string; limit_per_provider?: number }) => searchApi.searchPapers(body),
  });
}
