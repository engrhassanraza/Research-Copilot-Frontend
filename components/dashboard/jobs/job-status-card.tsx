"use client";

import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useJob } from "@/hooks/use-jobs";

const STATUS_COPY: Record<string, string> = {
  pending: "Queued — waiting for a worker…",
  running: "Running…",
  succeeded: "Done",
  failed: "Failed",
};

export function JobStatusCard({
  jobId,
  projectId,
  label,
}: {
  jobId: string;
  projectId: string;
  label: string;
}) {
  const { data: job } = useJob(jobId, projectId);
  const status = job?.status ?? "pending";

  return (
    <div className="glass flex items-center gap-3 rounded-2xl border-border/50 px-4 py-3.5">
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          status === "succeeded" && "bg-emerald-500/15 text-emerald-500",
          status === "failed" && "bg-destructive/15 text-destructive",
          (status === "pending" || status === "running") && "bg-primary/15 text-violet-500"
        )}
      >
        {status === "succeeded" && <CheckCircle2 className="h-4.5 w-4.5" />}
        {status === "failed" && <AlertTriangle className="h-4.5 w-4.5" />}
        {(status === "pending" || status === "running") && <Loader2 className="h-4.5 w-4.5 animate-spin" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{job?.error || STATUS_COPY[status]}</p>
      </div>
    </div>
  );
}
