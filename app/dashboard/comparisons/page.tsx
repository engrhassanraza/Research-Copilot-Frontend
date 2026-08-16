"use client";

import { useState } from "react";
import { GitCompareArrows, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyProjectState } from "@/components/dashboard/empty-project-state";
import { QueryError } from "@/components/dashboard/query-error";
import { JobStatusCard } from "@/components/dashboard/jobs/job-status-card";
import { useActiveProject } from "@/hooks/use-active-project";
import { useStartComparison } from "@/hooks/use-comparisons";
import { useJob, useJobs } from "@/hooks/use-jobs";
import { usePapers } from "@/hooks/use-papers";
import { authErrorMessage } from "@/hooks/use-auth";
import type { ComparisonResult } from "@/types/api";

function ComparisonResultView({ result }: { result: ComparisonResult }) {
  return (
    <div className="mt-6">
      {result.question && <p className="mb-4 text-sm text-muted-foreground">“{result.question}”</p>}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {result.papers.map((paper) => (
          <div key={paper.paper_id} className="glass w-80 shrink-0 rounded-2xl border-border/50 p-4">
            <p className="text-sm font-semibold leading-snug">{paper.title}</p>
            {paper.year && <p className="mt-0.5 text-xs text-muted-foreground">{paper.year}</p>}

            {(["findings", "methods", "limitations"] as const).map((key) => (
              <div key={key} className="mt-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{key}</p>
                {paper[key].length === 0 ? (
                  <p className="mt-1 text-xs text-muted-foreground/70">—</p>
                ) : (
                  <ul className="mt-1 list-disc space-y-1 pl-4 text-xs leading-relaxed">
                    {paper[key].map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ComparisonsPage() {
  const { activeProjectId, projects, isLoading } = useActiveProject();
  const { data: papers, isLoading: papersLoading, isError: papersError, error: papersErrorObj, refetch: refetchPapers } = usePapers(activeProjectId);
  const { data: jobs } = useJobs(activeProjectId);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [question, setQuestion] = useState("");
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const startComparison = useStartComparison(activeProjectId ?? "");
  const { data: activeJob } = useJob(activeJobId, activeProjectId);

  const comparisonJobs = jobs?.filter((j) => j.job_type === "comparison") ?? [];

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit() {
    if (!activeProjectId || selected.size < 2) return;
    startComparison.mutate(
      { paper_ids: Array.from(selected), question: question || undefined },
      {
        onSuccess: (res) => {
          setActiveJobId(res.job_id);
          toast.success("Comparison started");
        },
        onError: (err) => toast.error("Couldn't start comparison", { description: authErrorMessage(err, "Try again.") }),
      }
    );
  }

  if (isLoading) return null;
  if (projects.length === 0 || !activeProjectId) {
    return <EmptyProjectState description="Compare findings, methods, and limitations across papers side by side." />;
  }

  const result = activeJob?.status === "succeeded" ? (activeJob.progress as unknown as ComparisonResult) : null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
        <GitCompareArrows className="h-5 w-5 text-violet-500" />
        Comparisons
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick two or more papers to compare their findings, methods, and limitations.
      </p>

      <div className="mt-6 space-y-3">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Optional focus question, e.g. How do these methods handle noisy data?"
        />

        {papersLoading && <Skeleton className="h-40 w-full" />}
        {papersError && <QueryError error={papersErrorObj} onRetry={() => refetchPapers()} />}
        {!papersLoading && !papersError && (papers?.length ?? 0) === 0 && (
          <p className="text-sm text-muted-foreground">Add papers to this project before comparing.</p>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          {papers?.map((paper) => (
            <label
              key={paper.id}
              className="glass flex cursor-pointer items-start gap-3 rounded-2xl border-border/50 p-3 text-sm"
            >
              <Checkbox checked={selected.has(paper.id)} onCheckedChange={() => toggle(paper.id)} className="mt-0.5" />
              <span className="min-w-0 flex-1 truncate">{paper.title}</span>
              {paper.publication_year && <Badge variant="outline">{paper.publication_year}</Badge>}
            </label>
          ))}
        </div>

        <Button onClick={handleSubmit} disabled={selected.size < 2 || startComparison.isPending}>
          {startComparison.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitCompareArrows className="h-4 w-4" />}
          Compare {selected.size > 0 ? `${selected.size} papers` : ""}
        </Button>
      </div>

      {activeJobId && (
        <div className="mt-8">
          <JobStatusCard jobId={activeJobId} projectId={activeProjectId} label="Comparison" />
          {result && <ComparisonResultView result={result} />}
        </div>
      )}

      {comparisonJobs.length > 0 && (
        <div className="mt-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Past comparisons</p>
          <div className="flex flex-col gap-1.5">
            {comparisonJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setActiveJobId(job.id)}
                className="glass flex items-center justify-between rounded-xl border-border/50 px-3.5 py-2 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>Comparison · {job.id.slice(0, 8)}</span>
                <Badge variant={job.status === "succeeded" ? "default" : job.status === "failed" ? "outline" : "secondary"}>
                  {job.status}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
