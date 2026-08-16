"use client";

import { useState } from "react";
import { FlaskConical, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyProjectState } from "@/components/dashboard/empty-project-state";
import { JobStatusCard } from "@/components/dashboard/jobs/job-status-card";
import { useActiveProject } from "@/hooks/use-active-project";
import { useJob, useJobs } from "@/hooks/use-jobs";
import { useStartLiteratureReview } from "@/hooks/use-literature-review";
import { authErrorMessage } from "@/hooks/use-auth";
import type { CitationStyle } from "@/types/api";

const CITATION_STYLES: { value: CitationStyle; label: string }[] = [
  { value: "ieee", label: "IEEE" },
  { value: "apa", label: "APA" },
  { value: "vancouver", label: "Vancouver" },
  { value: "chicago", label: "Chicago" },
  { value: "harvard", label: "Harvard" },
];

export default function LiteratureReviewPage() {
  const { activeProjectId, projects, isLoading } = useActiveProject();
  const { data: jobs } = useJobs(activeProjectId);
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState<CitationStyle>("ieee");
  const [paperCount, setPaperCount] = useState(20);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const startReview = useStartLiteratureReview(activeProjectId ?? "");
  const { data: activeJob } = useJob(activeJobId, activeProjectId);

  const reviewJobs = jobs?.filter((j) => j.job_type === "literature_review") ?? [];

  function handleSubmit() {
    if (!activeProjectId || !topic.trim()) return;
    startReview.mutate(
      { topic: topic.trim(), style, paper_count: paperCount },
      {
        onSuccess: (res) => {
          setActiveJobId(res.job_id);
          toast.success("Literature review started");
        },
        onError: (err) => toast.error("Couldn't start review", { description: authErrorMessage(err, "Try again.") }),
      }
    );
  }

  if (isLoading) return null;
  if (projects.length === 0 || !activeProjectId) {
    return <EmptyProjectState description="Generate a full literature review DOCX from your project's papers." />;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
        <FlaskConical className="h-5 w-5 text-violet-500" />
        Literature review
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Generates a structured, cited literature review document from up to N relevant papers.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic, e.g. retrieval-augmented generation" className="flex-1" />
        <Select value={style} onValueChange={(v) => setStyle(v as CitationStyle)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CITATION_STYLES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          min={1}
          max={100}
          value={paperCount}
          onChange={(e) => setPaperCount(Number(e.target.value))}
          className="w-24"
        />
        <Button onClick={handleSubmit} disabled={startReview.isPending || !topic.trim()}>
          {startReview.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
        </Button>
      </div>

      {activeJobId && (
        <div className="mt-8 space-y-3">
          <JobStatusCard jobId={activeJobId} projectId={activeProjectId} label="Literature review" />
          {activeJob?.status === "succeeded" && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Your review document was generated on the server, but the backend doesn&apos;t yet expose a
                download route for it (tracked as a known gap) — ask your workspace admin to add
                <code className="mx-1 rounded bg-black/10 px-1 py-0.5 dark:bg-white/10">
                  GET /literature-review/{"{job_id}"}/result
                </code>
                to fetch it from here.
              </p>
            </div>
          )}
        </div>
      )}

      {reviewJobs.length > 0 && (
        <div className="mt-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Past reviews</p>
          <div className="flex flex-col gap-1.5">
            {reviewJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setActiveJobId(job.id)}
                className="glass flex items-center justify-between rounded-xl border-border/50 px-3.5 py-2 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>Review · {job.id.slice(0, 8)}</span>
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
