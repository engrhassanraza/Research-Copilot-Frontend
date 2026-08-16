"use client";

import { Check, ExternalLink, Loader2, Plus, Quote } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PaperResult } from "@/types/api";

export function SearchResultCard({
  result,
  onAdd,
  isAdding,
  added,
}: {
  result: PaperResult;
  onAdd: () => void;
  isAdding: boolean;
  added: boolean;
}) {
  return (
    <div className="glass flex flex-col gap-2.5 rounded-2xl border-border/50 p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug">{result.title}</h3>
        <Button
          size="sm"
          variant={added ? "secondary" : "default"}
          disabled={isAdding || added}
          onClick={onAdd}
          className="shrink-0"
        >
          {isAdding ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : added ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Plus className="h-3.5 w-3.5" />
          )}
          {added ? "Added" : "Add"}
        </Button>
      </div>

      {result.authors.length > 0 && (
        <p className="truncate text-xs text-muted-foreground">{result.authors.slice(0, 5).join(", ")}</p>
      )}

      {result.abstract && <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{result.abstract}</p>}

      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {result.year && <Badge variant="outline">{result.year}</Badge>}
        {result.venue && <Badge variant="outline">{result.venue}</Badge>}
        <Badge variant="secondary" className="capitalize">
          {result.source}
        </Badge>
        {typeof result.citation_count === "number" && (
          <span className="flex items-center gap-1">
            <Quote className="h-3 w-3" />
            {result.citation_count}
          </span>
        )}
        {result.url && (
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-violet-600 hover:text-violet-700 dark:text-violet-300"
          >
            View <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
