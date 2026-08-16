"use client";

import { useQuery } from "@tanstack/react-query";

import * as evidenceApi from "@/services/evidence";

export function useEvidence(evidenceId: string | null, projectId: string | null) {
  return useQuery({
    queryKey: ["evidence", projectId, evidenceId],
    queryFn: () => evidenceApi.getEvidence(evidenceId as string, projectId as string),
    enabled: !!evidenceId && !!projectId,
  });
}
