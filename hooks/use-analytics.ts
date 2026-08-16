"use client";

import { useQuery } from "@tanstack/react-query";

import * as analyticsApi from "@/services/analytics";

export function useAnalytics(projectId: string | null) {
  return useQuery({
    queryKey: ["analytics", projectId],
    queryFn: () => analyticsApi.getAnalytics(projectId as string),
    enabled: !!projectId,
  });
}
