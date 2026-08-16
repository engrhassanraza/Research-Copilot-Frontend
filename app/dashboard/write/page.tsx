"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileEdit, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyProjectState } from "@/components/dashboard/empty-project-state";
import { QueryError } from "@/components/dashboard/query-error";
import { useActiveProject } from "@/hooks/use-active-project";
import { useCreateManuscript, useManuscripts } from "@/hooks/use-manuscripts";
import { authErrorMessage } from "@/hooks/use-auth";

export default function WritePage() {
  const router = useRouter();
  const { activeProjectId, projects, isLoading } = useActiveProject();
  const {
    data: manuscripts,
    isLoading: manuscriptsLoading,
    isError,
    error,
    refetch,
  } = useManuscripts(activeProjectId);
  const createManuscript = useCreateManuscript(activeProjectId ?? "");
  const [creating, setCreating] = useState(false);

  function handleCreate() {
    if (!activeProjectId) return;
    setCreating(true);
    createManuscript.mutate(
      { title: "Untitled manuscript" },
      {
        onSuccess: (manuscript) => router.push(`/dashboard/write/${manuscript.id}`),
        onError: (err) => toast.error("Couldn't create manuscript", { description: authErrorMessage(err, "Try again.") }),
        onSettled: () => setCreating(false),
      }
    );
  }

  if (isLoading) return null;
  if (projects.length === 0 || !activeProjectId) {
    return <EmptyProjectState description="Draft a manuscript with in-text citations, right in your workspace, then export to DOCX or PDF." />;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <FileEdit className="h-5 w-5 text-violet-500" />
            Write
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Draft manuscripts with in-text citations, then export publication-ready DOCX or PDF.
          </p>
        </div>
        <Button onClick={handleCreate} disabled={creating}>
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          New manuscript
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {manuscriptsLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}

        {isError && <QueryError error={error} onRetry={() => refetch()} />}

        {!manuscriptsLoading && !isError && (manuscripts?.length ?? 0) === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-border/60 py-14 text-center">
            <FileEdit className="h-6 w-6 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No manuscripts yet.</p>
          </div>
        )}

        {manuscripts?.map((manuscript) => (
          <Link
            key={manuscript.id}
            href={`/dashboard/write/${manuscript.id}`}
            className="glass flex items-center justify-between rounded-2xl border-border/50 px-4 py-3 text-sm transition-colors hover:bg-secondary/40"
          >
            <span className="truncate font-medium">{manuscript.title || "Untitled manuscript"}</span>
            <span className="shrink-0 text-xs text-muted-foreground">
              Updated {new Date(manuscript.updated_at).toLocaleDateString()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
