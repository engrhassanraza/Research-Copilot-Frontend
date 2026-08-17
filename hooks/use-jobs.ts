"use client";

import { useQuery } from "@tanstack/react-query";

import * as jobsApi from "@/services/jobs";
import type { Job } from "@/types/api";

const TERMINAL: Job["status"][] = ["succeeded", "failed"];

export function useJob(id: string | null, projectId: string | null) {
  return useQuery({
    queryKey: ["jobs", projectId, id],
    queryFn: () => jobsApi.getJob(id as string, projectId as string),
    enabled: !!id && !!projectId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status && TERMINAL.includes(status)) return false;
      // Deep Research appends to an events array rather than overwriting a
      // single {step, total} snapshot — poll faster so the Research
      // Timeline reads as live.
      return query.state.data?.job_type === "deep_research" ? 1500 : 3000;
    },
  });
}

export function useJobs(projectId: string | null) {
  return useQuery({
    queryKey: ["jobs", projectId, "list"],
    queryFn: () => jobsApi.listJobs(projectId as string, { limit: 100 }),
    enabled: !!projectId,
    refetchInterval: (query) => {
      const jobs = query.state.data;
      const hasActive = jobs?.some((j) => !TERMINAL.includes(j.status));
      return hasActive ? 4000 : false;
    },
  });
}
