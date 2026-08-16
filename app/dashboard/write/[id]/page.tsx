"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, FileDown, FileType2, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryError } from "@/components/dashboard/query-error";
import { ManuscriptEditor } from "@/components/dashboard/manuscript/manuscript-editor";
import { useActiveProject } from "@/hooks/use-active-project";
import { useDeleteManuscript, useExportManuscript, useManuscript, useUpdateManuscript } from "@/hooks/use-manuscripts";
import { authErrorMessage } from "@/hooks/use-auth";
import { useChatStore } from "@/stores/chat-store";

export default function ManuscriptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { activeProjectId } = useActiveProject();
  const { data: manuscript, isLoading, isError, error, refetch } = useManuscript(id, activeProjectId);
  const updateTitle = useUpdateManuscript(id, activeProjectId ?? "");
  const deleteManuscript = useDeleteManuscript(activeProjectId ?? "");
  const exportManuscript = useExportManuscript(activeProjectId ?? "");
  const citationStyle = useChatStore((s) => s.citationStyle);
  const [title, setTitle] = useState<string | null>(null);
  const [exportingFormat, setExportingFormat] = useState<"docx" | "pdf" | null>(null);

  function handleTitleBlur() {
    if (title === null || !manuscript || title === manuscript.title) return;
    updateTitle.mutate({ title });
  }

  function handleExport(format: "docx" | "pdf") {
    setExportingFormat(format);
    exportManuscript.mutate(
      { id, format, style: citationStyle },
      {
        onSuccess: (result) => {
          window.open(result.download_url, "_blank");
          toast.success(`Exported as ${format.toUpperCase()}`);
        },
        onError: (err) => toast.error("Export failed", { description: authErrorMessage(err, "Something went wrong.") }),
        onSettled: () => setExportingFormat(null),
      }
    );
  }

  function handleDelete() {
    deleteManuscript.mutate(id, {
      onSuccess: () => {
        toast.success("Manuscript deleted");
        router.push("/dashboard/write");
      },
      onError: (err) => toast.error("Couldn't delete", { description: authErrorMessage(err, "Try again.") }),
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/dashboard/write"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Write
      </Link>

      {isLoading && <Skeleton className="h-96 w-full" />}
      {isError && <QueryError error={error} onRetry={() => refetch()} />}

      {manuscript && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Input
              value={title ?? manuscript.title ?? ""}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              placeholder="Untitled manuscript"
              className="h-auto flex-1 border-none bg-transparent px-0 text-2xl font-semibold tracking-tight shadow-none focus-visible:ring-0"
            />
            <div className="flex shrink-0 items-center gap-1.5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="gap-1.5">
                    {exportingFormat ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("docx")}>
                    <FileType2 className="h-4 w-4" />
                    Export as DOCX
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("pdf")}>
                    <FileDown className="h-4 w-4" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <ManuscriptEditor manuscript={manuscript} projectId={activeProjectId as string} />
          </div>
        </>
      )}
    </div>
  );
}
