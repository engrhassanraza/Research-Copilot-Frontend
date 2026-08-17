"use client";

import { useEffect, useRef } from "react";

import { useJob } from "@/hooks/use-jobs";
import type { Job } from "@/types/api";

// Invisible poller: watches one job to terminal status, then fires a one-time callback.
export function JobWatcher({
  jobId,
  projectId,
  onSettled,
}: {
  jobId: string;
  projectId: string;
  onSettled: (job: Job) => void;
}) {
  const { data: job } = useJob(jobId, projectId);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!job || firedRef.current) return;
    if (job.status === "succeeded" || job.status === "failed") {
      firedRef.current = true;
      onSettled(job);
    }
  }, [job, onSettled]);

  return null;
}
