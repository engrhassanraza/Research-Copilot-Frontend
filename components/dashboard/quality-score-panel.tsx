"use client";

import { Gauge } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { QualityScore } from "@/types/api";

const METRICS: { key: keyof QualityScore; label: string }[] = [
  { key: "citation_coverage", label: "Citation coverage" },
  { key: "evidence_support", label: "Evidence support" },
  { key: "source_diversity", label: "Source diversity" },
  { key: "contradiction_handling", label: "Contradiction handling" },
  { key: "retrieval_quality", label: "Retrieval quality" },
  { key: "hallucination_risk", label: "Hallucination risk" },
];

function pct(value: number): number {
  return Math.round(value * 100);
}

export function QualityScorePanel({ score, className }: { score: QualityScore | null | undefined; className?: string }) {
  if (!score) return null;

  return (
    <div className={cn("glass rounded-2xl border-border/50 p-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <Gauge className="h-3.5 w-3.5 text-violet-500" />
          Research Quality Score
        </div>
        <span className="text-2xl font-semibold tracking-tight">{pct(score.overall)}%</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {METRICS.map((m) => {
          const raw = score[m.key];
          const value = typeof raw === "number" ? raw : 0;
          return (
            <div key={m.key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{m.label}</span>
                <span className="font-medium">{pct(value)}%</span>
              </div>
              <Progress value={pct(value)} />
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{score.summary}</p>
    </div>
  );
}
