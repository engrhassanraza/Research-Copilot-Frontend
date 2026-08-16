"use client";

import { FileText, Quote, Sigma, Table2, ImageIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEvidence } from "@/hooks/use-evidence";
import { useDocuments } from "@/hooks/use-documents";

const TYPE_META: Record<string, { icon: typeof FileText; label: string }> = {
  text: { icon: Quote, label: "Text passage" },
  figure: { icon: ImageIcon, label: "Figure" },
  table: { icon: Table2, label: "Table" },
  equation: { icon: Sigma, label: "Equation" },
};

export function EvidencePanel({
  evidenceId,
  projectId,
  open,
  onOpenChange,
}: {
  evidenceId: string | null;
  projectId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: evidence, isLoading } = useEvidence(open ? evidenceId : null, projectId);
  const { data: documents } = useDocuments(projectId);
  const document = documents?.find((d) => d.id === evidence?.document_id);
  const meta = TYPE_META[evidence?.type ?? "text"] ?? TYPE_META.text;
  const Icon = meta.icon;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto scrollbar-thin">
        <SheetHeader>
          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-violet-600 dark:text-violet-300">
            <Icon className="h-5 w-5" />
          </div>
          <SheetTitle>Source evidence</SheetTitle>
          <SheetDescription>Traced from source → page → exact passage.</SheetDescription>
        </SheetHeader>

        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {!isLoading && evidence && (
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <FileText className="h-3 w-3" />
                {document?.title || document?.filename || "Document"}
              </Badge>
              {evidence.page !== null && <Badge variant="outline">Page {evidence.page}</Badge>}
              <Badge>{meta.label}</Badge>
            </div>

            {evidence.image_url && (
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-secondary/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={evidence.image_url} alt={evidence.caption ?? "Evidence"} className="w-full object-contain" />
              </div>
            )}

            {evidence.caption && (
              <p className="text-sm italic text-muted-foreground">{evidence.caption}</p>
            )}

            {evidence.text && (
              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4 text-sm leading-relaxed">
                {evidence.text}
              </div>
            )}
          </div>
        )}

        {!isLoading && !evidence && (
          <p className="text-sm text-muted-foreground">Evidence not found.</p>
        )}
      </SheetContent>
    </Sheet>
  );
}
