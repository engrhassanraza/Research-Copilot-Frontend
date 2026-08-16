"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { DocumentList } from "@/components/dashboard/documents/document-list";
import { JobWatcher } from "@/components/dashboard/documents/job-watcher";
import { UploadDropzone } from "@/components/dashboard/documents/upload-dropzone";
import { EmptyProjectState } from "@/components/dashboard/empty-project-state";
import { useActiveProject } from "@/hooks/use-active-project";
import type { Job, JobRef } from "@/types/api";

interface TrackedJob {
  jobId: string;
  filename: string;
}

export default function DocumentsPage() {
  const { activeProjectId, projects, isLoading } = useActiveProject();
  const [trackedJobs, setTrackedJobs] = useState<TrackedJob[]>([]);

  const handleUploaded = useCallback((job: JobRef, filename: string) => {
    setTrackedJobs((prev) => [...prev, { jobId: job.job_id, filename }]);
  }, []);

  const handleSettled = useCallback((jobId: string, filename: string, job: Job) => {
    setTrackedJobs((prev) => prev.filter((t) => t.jobId !== jobId));
    if (job.status === "succeeded") {
      toast.success("Document processed", { description: filename });
    } else {
      toast.error("Processing failed", { description: job.error || filename });
    }
  }, []);

  if (isLoading) return null;
  if (projects.length === 0 || !activeProjectId) {
    return <EmptyProjectState description="Upload PDFs and Research Copilot will parse, chunk, and index them for chat." />;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload papers to this project — they&apos;re parsed, chunked, and embedded automatically.
      </p>

      <div className="mt-6">
        <UploadDropzone projectId={activeProjectId} onUploaded={handleUploaded} />
      </div>

      {trackedJobs.map((job) => (
        <JobWatcher
          key={job.jobId}
          jobId={job.jobId}
          projectId={activeProjectId}
          onSettled={(resolved) => handleSettled(job.jobId, job.filename, resolved)}
        />
      ))}

      <div className="mt-8">
        <DocumentList projectId={activeProjectId} />
      </div>
    </div>
  );
}
