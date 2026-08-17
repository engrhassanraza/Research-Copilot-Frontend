"use client";

import { useState } from "react";
import { ChevronDown, Cpu, TrendingDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { RoutingDecision } from "@/types/api";

function providerLabel(provider: string): string {
  return provider === "gemini" ? "Gemini" : provider === "qwen" ? "Qwen" : provider === "groq" ? "Groq" : provider;
}

export function RoutingDecisionPanel({ routing }: { routing: RoutingDecision | null | undefined }) {
  const [expanded, setExpanded] = useState(false);
  if (!routing) return null;

  return (
    <div className="mt-3 rounded-xl border border-border/50 bg-secondary/20">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs"
      >
        <Cpu className="h-3.5 w-3.5 shrink-0 text-violet-500" />
        <span className="font-medium">
          Selected model: {providerLabel(routing.provider)}
          {routing.estimated_cost_usd !== null && (
            <span className="ml-1.5 font-normal text-muted-foreground">· ${routing.estimated_cost_usd.toFixed(4)}</span>
          )}
        </span>
        {routing.estimated_savings_pct !== null && (
          <Badge className="ml-auto gap-1 border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
            <TrendingDown className="h-3 w-3" />
            {routing.estimated_savings_pct}% saved
          </Badge>
        )}
        <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform", !routing.estimated_savings_pct && "ml-auto", expanded && "rotate-180")} />
      </button>
      {expanded && (
        <div className="space-y-1.5 border-t border-border/50 px-3 py-2.5 text-xs leading-relaxed">
          <p>
            <span className="text-muted-foreground">Model: </span>
            <span className="font-mono">{routing.model}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Reason: </span>
            {routing.reason}
          </p>
          {routing.alternative_provider && (
            <p>
              <span className="text-muted-foreground">Alternative: </span>
              {providerLabel(routing.alternative_provider)} (
              <span className="font-mono">{routing.alternative_model}</span>)
              {routing.alternative_cost_usd !== null && ` — $${routing.alternative_cost_usd.toFixed(4)}`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
