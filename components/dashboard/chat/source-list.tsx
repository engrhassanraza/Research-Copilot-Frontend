"use client";

import { useState } from "react";
import { BookOpenText, ChevronDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFormattedReference } from "@/hooks/use-references";
import { useChatStore } from "@/stores/chat-store";
import type { ChatSource } from "@/types/api";

function SourceRow({ source, projectId }: { source: ChatSource; projectId: string }) {
  const [expanded, setExpanded] = useState(false);
  const citationStyle = useChatStore((s) => s.citationStyle);
  const { data, isLoading } = useFormattedReference(expanded ? source.reference_id : null, projectId, citationStyle);

  return (
    <li className="rounded-xl border border-border/50 bg-secondary/30">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm"
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/15 text-[0.65rem] font-semibold text-violet-700 dark:text-violet-200">
          {source.number}
        </span>
        <span className="truncate text-muted-foreground">{source.marker}</span>
        <ChevronDown className={cn("ml-auto h-3.5 w-3.5 text-muted-foreground transition-transform", expanded && "rotate-180")} />
      </button>
      {expanded && (
        <div className="border-t border-border/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : data?.formatted}
        </div>
      )}
    </li>
  );
}

export function SourceList({ sources, projectId }: { sources: ChatSource[]; projectId: string }) {
  if (sources.length === 0) return null;

  return (
    <div className="mt-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <BookOpenText className="h-3.5 w-3.5" />
        Sources
      </div>
      <ul className="flex flex-col gap-1">
        {sources.map((source) => (
          <SourceRow key={source.reference_id + source.number} source={source} projectId={projectId} />
        ))}
      </ul>
    </div>
  );
}
