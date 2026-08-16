"use client";

import { Check, Loader2, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { nodeMeta } from "@/components/dashboard/chat/agent-nodes";
import type { PipelineNodeState } from "@/stores/chat-store";

export function AgentPipeline({
  pipeline,
  isStreaming,
  compact = false,
}: {
  pipeline: PipelineNodeState[];
  isStreaming: boolean;
  compact?: boolean;
}) {
  if (pipeline.length === 0 && !isStreaming) return null;

  return (
    <div
      className={cn(
        "glass rounded-2xl border-border/50 p-4",
        compact && "p-3"
      )}
    >
      <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-violet-500" />
        Agent pipeline
        {isStreaming && (
          <span className="ml-auto flex items-center gap-1.5 normal-case text-violet-500">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-500" />
            </span>
            live
          </span>
        )}
      </div>

      <ol className="flex flex-col gap-0.5">
        {pipeline.map((step, idx) => {
          const meta = nodeMeta(step.node);
          const isLast = idx === pipeline.length - 1;
          const isActive = isLast && isStreaming;
          const Icon = meta.icon;

          return (
            <li key={`${step.node}-${idx}`} className="relative flex items-start gap-3 pb-3 last:pb-0">
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-[15px] top-8 h-[calc(100%-1.25rem)] w-px bg-gradient-to-b from-violet-500/40 to-transparent"
                />
              )}
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
                  isActive
                    ? "border-transparent bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-950/40"
                    : "border-border/60 bg-secondary/60 text-violet-500"
                )}
              >
                {isActive ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <p
                  className={cn(
                    "text-sm font-medium leading-tight",
                    isActive ? "text-foreground" : "text-foreground/80"
                  )}
                >
                  {meta.label}
                </p>
                {!compact && <p className="text-xs text-muted-foreground">{meta.description}</p>}
              </div>
              {!isActive && (
                <Check className="mt-1.5 h-3.5 w-3.5 shrink-0 text-emerald-500/80" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
