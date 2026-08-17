"use client";

import { ImageOff } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { QueryError } from "@/components/dashboard/query-error";
import { FigureDiagramStream } from "@/components/dashboard/figures/figure-diagram-stream";
import { useFigures } from "@/hooks/use-figures";
import { useDocuments } from "@/hooks/use-documents";

export function FiguresGallery({ projectId }: { projectId: string }) {
  const { data: figures, isLoading, isError, error, refetch } = useFigures(projectId);
  const { data: documents } = useDocuments(projectId);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 w-full" />
        ))}
      </div>
    );
  }

  if (isError) return <QueryError error={error} onRetry={() => refetch()} />;

  if (!figures || figures.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-border/60 py-14 text-center">
        <ImageOff className="h-6 w-6 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          No figures extracted yet — they show up automatically once a document with charts, tables, or diagrams finishes processing.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {figures.map((figure) => {
        const doc = documents?.find((d) => d.id === figure.document_id);
        return (
          <div key={figure.id} className="glass overflow-hidden rounded-2xl border-border/50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={figure.image_url} alt={figure.caption ?? "Figure"} className="h-40 w-full bg-secondary/30 object-contain" />
            <div className="p-3">
              <p className="truncate text-xs font-medium">{doc?.title || doc?.filename || "Document"} · p.{figure.page_number}</p>
              {figure.caption && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{figure.caption}</p>}
              {figure.vision_description && (
                <p className="mt-1 line-clamp-3 text-[11px] italic text-muted-foreground/80">{figure.vision_description}</p>
              )}
              <div className="mt-2">
                <FigureDiagramStream figureId={figure.id} projectId={projectId} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
