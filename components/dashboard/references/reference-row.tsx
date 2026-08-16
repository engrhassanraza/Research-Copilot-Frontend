"use client";

import { useState } from "react";
import { ChevronDown, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDeleteReference, useFormattedReference } from "@/hooks/use-references";
import { authErrorMessage } from "@/hooks/use-auth";
import type { CitationStyle, Reference } from "@/types/api";

export function ReferenceRow({
  reference,
  projectId,
  style,
}: {
  reference: Reference;
  projectId: string;
  style: CitationStyle;
}) {
  const [expanded, setExpanded] = useState(false);
  const { data, isLoading } = useFormattedReference(expanded ? reference.id : null, projectId, style);
  const deleteReference = useDeleteReference(projectId);

  return (
    <div className="glass rounded-2xl border-border/50">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-3 px-4 py-3.5 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{reference.title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {reference.authors && reference.authors.length > 0 && (
              <span className="truncate text-xs text-muted-foreground">{reference.authors.slice(0, 4).join(", ")}</span>
            )}
            {reference.year && <Badge variant="outline">{reference.year}</Badge>}
            {reference.venue && <Badge variant="outline">{reference.venue}</Badge>}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            deleteReference.mutate(reference.id, {
              onSuccess: () => toast.success("Reference removed"),
              onError: (err) => toast.error("Couldn't remove", { description: authErrorMessage(err, "Try again.") }),
            });
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <ChevronDown className={cn("mt-1.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-180")} />
      </button>
      {expanded && (
        <div className="border-t border-border/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : data?.formatted}
        </div>
      )}
    </div>
  );
}
