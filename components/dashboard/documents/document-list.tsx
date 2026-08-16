"use client";

import { FileText, Loader2, MoreVertical, RotateCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentStatusBadge } from "@/components/dashboard/documents/status-badge";
import { QueryError } from "@/components/dashboard/query-error";
import { useDeleteDocument, useDocuments, useReprocessDocument } from "@/hooks/use-documents";
import { authErrorMessage } from "@/hooks/use-auth";

export function DocumentList({ projectId }: { projectId: string }) {
  const { data: documents, isLoading, isError, error, refetch } = useDocuments(projectId);
  const deleteDocument = useDeleteDocument(projectId);
  const reprocessDocument = useReprocessDocument(projectId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <QueryError error={error} onRetry={() => refetch()} />;
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-border/60 py-14 text-center">
        <FileText className="h-6 w-6 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {documents.map((doc) => (
        <li
          key={doc.id}
          className="glass flex items-center gap-4 rounded-2xl border-border/50 px-4 py-3.5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-violet-600 dark:text-violet-300">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{doc.title || doc.filename}</p>
            <p className="truncate text-xs text-muted-foreground">
              {doc.filename}
              {doc.page_count ? ` · ${doc.page_count} pages` : ""}
            </p>
            {doc.status === "failed" && doc.processing_error && (
              <p className="mt-1 truncate text-xs text-destructive">{doc.processing_error}</p>
            )}
          </div>
          <DocumentStatusBadge status={doc.status} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={reprocessDocument.isPending}
                onClick={() =>
                  reprocessDocument.mutate(doc.id, {
                    onSuccess: () => toast.success("Reprocessing started"),
                    onError: (err) =>
                      toast.error("Couldn't reprocess", { description: authErrorMessage(err, "Try again.") }),
                  })
                }
              >
                {reprocessDocument.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCw className="h-4 w-4" />
                )}
                Reprocess
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() =>
                  deleteDocument.mutate(doc.id, {
                    onSuccess: () => toast.success("Document deleted"),
                    onError: (err) =>
                      toast.error("Couldn't delete", { description: authErrorMessage(err, "Try again.") }),
                  })
                }
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      ))}
    </ul>
  );
}
