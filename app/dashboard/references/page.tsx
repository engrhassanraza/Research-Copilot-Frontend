"use client";

import { useState } from "react";
import { BookMarked, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyProjectState } from "@/components/dashboard/empty-project-state";
import { AddReferenceDialog } from "@/components/dashboard/references/add-reference-dialog";
import { ReferenceRow } from "@/components/dashboard/references/reference-row";
import { QueryError } from "@/components/dashboard/query-error";
import { useActiveProject } from "@/hooks/use-active-project";
import { useReferences } from "@/hooks/use-references";
import { authErrorMessage } from "@/hooks/use-auth";
import * as referencesApi from "@/services/references";
import { downloadText } from "@/lib/download";
import type { CitationStyle } from "@/types/api";

const CITATION_STYLES: { value: CitationStyle; label: string }[] = [
  { value: "ieee", label: "IEEE" },
  { value: "apa", label: "APA" },
  { value: "vancouver", label: "Vancouver" },
  { value: "chicago", label: "Chicago" },
  { value: "harvard", label: "Harvard" },
];

export default function ReferencesPage() {
  const { activeProjectId, projects, isLoading } = useActiveProject();
  const { data: references, isLoading: referencesLoading, isError: referencesError, error: referencesErrorObj, refetch: refetchReferences } = useReferences(activeProjectId);
  const [style, setStyle] = useState<CitationStyle>("ieee");
  const [exporting, setExporting] = useState<"bibtex" | "ris" | null>(null);

  async function handleExport(fmt: "bibtex" | "ris") {
    if (!activeProjectId) return;
    setExporting(fmt);
    try {
      const { text, filename } = await referencesApi.exportReferences(activeProjectId, fmt);
      downloadText(filename, text);
    } catch (err) {
      toast.error("Export failed", { description: authErrorMessage(err, "Try again.") });
    } finally {
      setExporting(null);
    }
  }

  if (isLoading) return null;
  if (projects.length === 0 || !activeProjectId) {
    return <EmptyProjectState description="Every citation your chats and reviews use lives here — export as BibTeX or RIS." />;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">References</h1>
          <p className="mt-1 text-sm text-muted-foreground">{references?.length ?? 0} reference(s) in this project.</p>
        </div>
        <AddReferenceDialog projectId={activeProjectId} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Select value={style} onValueChange={(v) => setStyle(v as CitationStyle)}>
          <SelectTrigger className="w-40">
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
        <Button variant="secondary" size="sm" onClick={() => handleExport("bibtex")} disabled={exporting !== null}>
          {exporting === "bibtex" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
          BibTeX
        </Button>
        <Button variant="secondary" size="sm" onClick={() => handleExport("ris")} disabled={exporting !== null}>
          {exporting === "ris" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
          RIS
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {referencesLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}

        {referencesError && <QueryError error={referencesErrorObj} onRetry={() => refetchReferences()} />}

        {!referencesLoading && !referencesError && (references?.length ?? 0) === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-border/60 py-14 text-center">
            <BookMarked className="h-6 w-6 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No references yet.</p>
          </div>
        )}

        {references?.map((reference) => (
          <ReferenceRow key={reference.id} reference={reference} projectId={activeProjectId} style={style} />
        ))}
      </div>
    </div>
  );
}
