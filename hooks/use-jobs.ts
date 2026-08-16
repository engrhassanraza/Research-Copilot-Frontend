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
      return status && TERMINAL.includes(status) ? false : 3000;
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
