"use client";

import Link from "next/link";
import { BookMarked, ExternalLink, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyProjectState } from "@/components/dashboard/empty-project-state";
import { QueryError } from "@/components/dashboard/query-error";
import { useActiveProject } from "@/hooks/use-active-project";
import { useDeletePaper, usePapers } from "@/hooks/use-papers";
import { authErrorMessage } from "@/hooks/use-auth";

const SOURCE_LABEL: Record<string, string> = { upload: "Uploaded", search: "Search", import: "Imported" };

export default function PapersPage() {
  const { activeProjectId, projects, isLoading } = useActiveProject();
  const { data: papers, isLoading: papersLoading, isError: papersError, error: papersErrorObj, refetch: refetchPapers } = usePapers(activeProjectId);
  const deletePaper = useDeletePaper(activeProjectId ?? "");

  if (isLoading) return null;
  if (projects.length === 0 || !activeProjectId) {
    return <EmptyProjectState description="Papers uploaded or imported into this project show up here." />;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Papers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The bibliographic library for this project — from uploads, search, or manual import.
          </p>
        </div>
        <Button variant="secondary" asChild>
          <Link href="/dashboard/search">
            <Search className="h-4 w-4" />
            Find papers
          </Link>
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {papersLoading &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}

        {papersError && <QueryError error={papersErrorObj} onRetry={() => refetchPapers()} />}

        {!papersLoading && !papersError && (papers?.length ?? 0) === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-border/60 py-14 text-center">
            <BookMarked className="h-6 w-6 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No papers yet — upload a PDF or search to add some.</p>
          </div>
        )}

        {papers?.map((paper) => (
          <div key={paper.id} className="glass flex items-start gap-4 rounded-2xl border-border/50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-violet-600 dark:text-violet-300">
              <BookMarked className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{paper.title}</p>
              {paper.authors && paper.authors.length > 0 && (
                <p className="truncate text-xs text-muted-foreground">{paper.authors.slice(0, 5).join(", ")}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {paper.publication_year && <Badge variant="outline">{paper.publication_year}</Badge>}
                {paper.venue && <Badge variant="outline">{paper.venue}</Badge>}
                <Badge variant="secondary">{SOURCE_LABEL[paper.source] ?? paper.source}</Badge>
                {paper.url && (
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 dark:text-violet-300"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() =>
                deletePaper.mutate(paper.id, {
                  onSuccess: () => toast.success("Paper removed"),
                  onError: (err) => toast.error("Couldn't remove paper", { description: authErrorMessage(err, "Try again.") }),
                })
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
