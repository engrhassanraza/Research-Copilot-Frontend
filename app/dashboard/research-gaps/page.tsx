"use client";

import { useState } from "react";
import { FileSearch, Lightbulb, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyProjectState } from "@/components/dashboard/empty-project-state";
import { EvidencePanel } from "@/components/dashboard/chat/evidence-panel";
import { JobStatusCard } from "@/components/dashboard/jobs/job-status-card";
import { useActiveProject } from "@/hooks/use-active-project";
import { useJob, useJobs } from "@/hooks/use-jobs";
import { useStartResearchGapAnalysis } from "@/hooks/use-research-gaps";
import { authErrorMessage } from "@/hooks/use-auth";
import type { ResearchGapResult } from "@/types/api";

export default function ResearchGapsPage() {
  const { activeProjectId, projects, isLoading } = useActiveProject();
  const { data: jobs } = useJobs(activeProjectId);
  const [topic, setTopic] = useState("");
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [evidenceChunkId, setEvidenceChunkId] = useState<string | null>(null);
  const startAnalysis = useStartResearchGapAnalysis(activeProjectId ?? "");
  const { data: activeJob } = useJob(activeJobId, activeProjectId);

  const gapJobs = jobs?.filter((j) => j.job_type === "research_gap") ?? [];

  function handleSubmit() {
    if (!activeProjectId) return;
    startAnalysis.mutate(
      { topic: topic || undefined },
      {
        onSuccess: (res) => {
          setActiveJobId(res.job_id);
          toast.success("Analysis started");
        },
        onError: (err) => toast.error("Couldn't start analysis", { description: authErrorMessage(err, "Try again.") }),
      }
    );
  }

  if (isLoading) return null;
  if (projects.length === 0 || !activeProjectId) {
    return <EmptyProjectState description="Surface open problems and under-explored directions across your papers." />;
  }

  const result = activeJob?.status === "succeeded" ? (activeJob.progress as unknown as ResearchGapResult) : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
        <Lightbulb className="h-5 w-5 text-violet-500" />
        Research gaps
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Analyzes every paper in this project to surface open problems and future directions.
      </p>

      <div className="mt-6 flex gap-2">
        <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Optional topic focus, e.g. long-context retrieval" />
        <Button onClick={handleSubmit} disabled={startAnalysis.isPending}>
          {startAnalysis.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}
          Analyze
        </Button>
      </div>

      {activeJobId && (
        <div className="mt-8 space-y-4">
          <JobStatusCard jobId={activeJobId} projectId={activeProjectId} label="Research gap analysis" />

          {result?.research_gaps.map((gap, idx) => (
            <div key={idx} className="glass rounded-2xl border-border/50 p-5">
              <p className="text-sm font-semibold leading-snug">{gap.statement}</p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Existing solutions</p>
                  <ul className="mt-1 list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
                    {gap.existing_solutions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Remaining problem</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{gap.remaining_problem}</p>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Future direction</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{gap.future_direction}</p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {gap.supporting_papers.map((p, i) => (
                  <Badge key={i} variant="outline">
                    {p}
                  </Badge>
                ))}
                {gap.evidence.map((chunkId) => (
                  <Button
                    key={chunkId}
                    variant="ghost"
                    size="sm"
                    className="h-6 gap-1 px-2 text-xs text-violet-600 dark:text-violet-300"
                    onClick={() => setEvidenceChunkId(chunkId)}
                  >
                    <FileSearch className="h-3 w-3" />
                    Evidence
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {gapJobs.length > 0 && (
        <div className="mt-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Past analyses</p>
          <div className="flex flex-col gap-1.5">
            {gapJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setActiveJobId(job.id)}
                className="glass flex items-center justify-between rounded-xl border-border/50 px-3.5 py-2 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>Analysis · {job.id.slice(0, 8)}</span>
                <Badge variant={job.status === "succeeded" ? "default" : job.status === "failed" ? "outline" : "secondary"}>
                  {job.status}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}

      <EvidencePanel
        evidenceId={evidenceChunkId}
        projectId={activeProjectId}
        open={!!evidenceChunkId}
        onOpenChange={(open) => !open && setEvidenceChunkId(null)}
      />
    </div>
  );
}
