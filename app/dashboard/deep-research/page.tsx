"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Download, FileEdit, FlaskConical, Loader2, Users } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyProjectState } from "@/components/dashboard/empty-project-state";
import { ResearchTimeline } from "@/components/dashboard/deep-research/research-timeline";
import { QualityScorePanel } from "@/components/dashboard/quality-score-panel";
import { useActiveProject } from "@/hooks/use-active-project";
import { useStartDeepResearch } from "@/hooks/use-deep-research";
import { useJob, useJobs } from "@/hooks/use-jobs";
import { authErrorMessage } from "@/hooks/use-auth";
import * as exportsApi from "@/services/exports";
import type { CitationStyle, DeepResearchProgress } from "@/types/api";

const CITATION_STYLES: { value: CitationStyle; label: string }[] = [
  { value: "ieee", label: "IEEE" },
  { value: "apa", label: "APA" },
  { value: "vancouver", label: "Vancouver" },
  { value: "chicago", label: "Chicago" },
  { value: "harvard", label: "Harvard" },
];

export default function DeepResearchPage() {
  const router = useRouter();
  const { activeProjectId, projects, isLoading } = useActiveProject();
  const { data: jobs } = useJobs(activeProjectId);
  const [topic, setTopic] = useState("");
  const [workerCount, setWorkerCount] = useState(3);
  const [style, setStyle] = useState<CitationStyle>("ieee");
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const startResearch = useStartDeepResearch(activeProjectId ?? "");
  const { data: activeJob } = useJob(activeJobId, activeProjectId);

  const progress = (activeJob?.progress ?? null) as DeepResearchProgress | null;
  const researchJobs = jobs?.filter((j) => j.job_type === "deep_research") ?? [];

  function handleSubmit() {
    if (!activeProjectId || !topic.trim()) return;
    startResearch.mutate(
      { topic: topic.trim(), worker_count: workerCount, style },
      {
        onSuccess: (res) => {
          setActiveJobId(res.job_id);
          toast.success("Deep research started");
        },
        onError: (err) => toast.error("Couldn't start research", { description: authErrorMessage(err, "Try again.") }),
      }
    );
  }

  async function handleDownload() {
    if (!activeJob?.resource_id || !activeProjectId) return;
    setDownloading(true);
    try {
      const result = await exportsApi.getExport(activeJob.resource_id, activeProjectId);
      window.open(result.download_url, "_blank");
    } catch (err) {
      toast.error("Couldn't fetch the download", { description: authErrorMessage(err, "Try again.") });
    } finally {
      setDownloading(false);
    }
  }

  if (isLoading) return null;
  if (projects.length === 0 || !activeProjectId) {
    return <EmptyProjectState description="A Supervisor plans sub-questions, Workers research them in parallel, and contradictions get investigated automatically." />;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
        <FlaskConical className="h-5 w-5 text-violet-500" />
        Deep research
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        A Supervisor agent plans sub-questions, Workers research them in parallel, and any contradictions found get
        investigated by an additional Worker before the report is written.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic, e.g. does retrieval augmentation reduce hallucination" className="flex-1" />
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
        <Select value={String(workerCount)} onValueChange={(v) => setWorkerCount(Number(v))}>
          <SelectTrigger className="w-32">
            <Users className="h-3.5 w-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[2, 3, 4, 5].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n} workers
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSubmit} disabled={startResearch.isPending || !topic.trim()}>
          {startResearch.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start"}
        </Button>
      </div>

      {activeJobId && (
        <div className="mt-8 flex flex-col gap-4">
          <ResearchTimeline jobId={activeJobId} projectId={activeProjectId} />

          {activeJob?.status === "failed" && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{activeJob.error || "Something went wrong."}</p>
            </div>
          )}

          {activeJob?.status === "succeeded" && progress?.contradictions && progress.contradictions.length > 0 && (
            <div className="glass rounded-2xl border-border/50 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                Contradictions found & investigated
              </p>
              <ul className="flex flex-col gap-2.5">
                {progress.contradictions.map((c, i) => (
                  <li key={i} className="rounded-xl border border-border/50 bg-secondary/20 p-3 text-xs leading-relaxed">
                    <div className="mb-1 flex items-center gap-1.5">
                      <Badge variant={c.resolved ? "default" : "outline"} className="gap-1">
                        {c.resolved ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                        {c.resolved ? "Resolved" : "Unresolved"}
                      </Badge>
                      <span className="text-muted-foreground capitalize">{c.severity} severity</span>
                    </div>
                    <p className="text-muted-foreground">Possible reason: {c.reason}</p>
                    {c.resolution_summary && <p className="mt-1 text-foreground/90">Resolution: {c.resolution_summary}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeJob?.status === "succeeded" && progress?.quality_score && <QualityScorePanel score={progress.quality_score} />}

          {activeJob?.status === "succeeded" && activeJob.resource_type === "generated_document" && activeJob.resource_id && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
              <p className="mr-auto text-sm text-emerald-700 dark:text-emerald-300">Your research report is ready.</p>
              <Button size="sm" variant="secondary" onClick={handleDownload} disabled={downloading}>
                {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                Download DOCX
              </Button>
              <Button size="sm" onClick={() => router.push(`/dashboard/write/${activeJob.resource_id}`)}>
                <FileEdit className="h-3.5 w-3.5" />
                Open in editor
              </Button>
            </div>
          )}
        </div>
      )}

      {researchJobs.length > 0 && (
        <div className="mt-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Past research jobs</p>
          <div className="flex flex-col gap-1.5">
            {researchJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setActiveJobId(job.id)}
                className="glass flex items-center justify-between rounded-xl border-border/50 px-3.5 py-2 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>Research · {job.id.slice(0, 8)}</span>
                <Badge variant={job.status === "succeeded" ? "default" : job.status === "failed" ? "outline" : "secondary"}>{job.status}</Badge>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
