"use client";

import { AlertTriangle, Check, Loader2, Repeat, Sparkles, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { useJob } from "@/hooks/use-jobs";
import type { DeepResearchProgress, TimelineEventKind } from "@/types/api";

const KIND_META: Record<TimelineEventKind, { icon: typeof Sparkles; className: string }> = {
  info: { icon: Sparkles, className: "text-violet-500" },
  worker: { icon: Users, className: "text-violet-500" },
  warning: { icon: AlertTriangle, className: "text-amber-500" },
  success: { icon: Check, className: "text-emerald-500" },
};

export function ResearchTimeline({ jobId, projectId }: { jobId: string; projectId: string }) {
  const { data: job } = useJob(jobId, projectId);
  const progress = (job?.progress ?? null) as DeepResearchProgress | null;
  const events = progress?.events ?? [];
  const isActive = !job || !["succeeded", "failed"].includes(job.status);

  if (events.length === 0) {
    return (
      <div className="glass flex items-center gap-2 rounded-2xl border-border/50 px-4 py-3.5 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
        Starting up…
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl border-border/50 p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-violet-500" />
        Research timeline
        {!!progress?.followup_rounds_run && (
          <span className="flex items-center gap-1 normal-case text-muted-foreground/80">
            <Repeat className="h-3 w-3" />
            {progress.followup_rounds_run} follow-up round{progress.followup_rounds_run === 1 ? "" : "s"}
          </span>
        )}
        {isActive && (
          <span className="ml-auto flex items-center gap-1.5 normal-case text-violet-500">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-500" />
            </span>
            live
          </span>
        )}
      </div>

      {progress?.research_brief && (
        <div className="mb-3 rounded-xl border border-violet-500/20 bg-violet-500/5 px-3 py-2.5 text-xs leading-relaxed text-foreground/80">
          <p className="mb-1 font-medium uppercase tracking-wider text-[10px] text-violet-500">Research brief</p>
          {progress.research_brief}
        </div>
      )}

      <ol className="flex flex-col gap-0.5">
        {events.map((event, idx) => {
          const meta = KIND_META[event.kind] ?? KIND_META.info;
          const Icon = meta.icon;
          const isLast = idx === events.length - 1 && !isActive;
          const time = new Date(event.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

          return (
            <li key={idx} className="relative flex items-start gap-3 pb-3 last:pb-0">
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-[15px] top-8 h-[calc(100%-1.25rem)] w-px bg-gradient-to-b from-violet-500/40 to-transparent"
                />
              )}
              <div className={cn("relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-secondary/60", meta.className)}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1 pt-1.5">
                <p className="text-sm leading-tight text-foreground/90">{event.message}</p>
                <p className="text-[11px] text-muted-foreground">{time}</p>
              </div>
            </li>
          );
        })}
        {isActive && (
          <li className="flex items-start gap-3">
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-950/40">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
            <div className="min-w-0 flex-1 pt-2">
              <p className="text-sm text-muted-foreground">Working…</p>
            </div>
          </li>
        )}
      </ol>
    </div>
  );
}
