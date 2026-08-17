"use client";

import { useState } from "react";
import { AlertTriangle, Check, Loader2, Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MermaidRenderer } from "@/components/dashboard/figures/mermaid-renderer";
import { authErrorMessage } from "@/hooks/use-auth";
import { buildQuery } from "@/services/api";
import { consumeSSE } from "@/services/sse";

interface StepEvent {
  step: string;
  message: string;
}

interface DiagramResult {
  source: string;
  valid: boolean;
  attempts: number;
  fixes_applied: number;
  errors: string[];
}

const STEP_LABELS: Record<string, string> = {
  figure_detected: "Figure detected",
  component_extraction: "Component extraction",
  relationship_understanding: "Relationship understanding",
  mermaid_generation: "Mermaid generation",
  corrected: "Syntax auto-corrected",
  syntax_validation: "Syntax validation",
};

export function FigureDiagramStream({ figureId, projectId }: { figureId: string; projectId: string }) {
  const [open, setOpen] = useState(false);
  const [steps, setSteps] = useState<StepEvent[]>([]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<DiagramResult | null>(null);
  const [started, setStarted] = useState(false);

  async function run() {
    setSteps([]);
    setResult(null);
    setRunning(true);
    setStarted(true);
    try {
      await consumeSSE(
        `/figures/${figureId}/diagram/stream${buildQuery({ project_id: projectId })}`,
        { method: "GET" },
        {
          onEvent: (eventName, data) => {
            let parsed: unknown;
            try {
              parsed = JSON.parse(data);
            } catch {
              return;
            }
            if (eventName === "step") {
              setSteps((prev) => [...prev, parsed as StepEvent]);
            } else if (eventName === "final") {
              setResult(parsed as DiagramResult);
            }
          },
          onError: (err) => toast.error("Diagram generation failed", { description: authErrorMessage(err, "Try again.") }),
        }
      );
    } catch {
      // surfaced via onError above
    } finally {
      setRunning(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next && !started) run();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="gap-1.5">
          <Wand2 className="h-3.5 w-3.5" />
          Interpret as diagram
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            Visual agent: render &amp; verify
          </DialogTitle>
          <DialogDescription>Figure → vision analysis → component extraction → Mermaid → syntax validation → correction.</DialogDescription>
        </DialogHeader>

        <ol className="flex flex-col gap-1.5">
          {steps.map((s, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm">
              {result?.errors?.length && i === steps.length - 1 ? (
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
              ) : (
                <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              )}
              <span className={cn(s.step === "corrected" && "text-amber-600 dark:text-amber-300")}>{STEP_LABELS[s.step] ?? s.step}</span>
              <span className="ml-auto truncate text-xs text-muted-foreground">{s.message}</span>
            </li>
          ))}
          {running && (
            <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-violet-500" />
              Working…
            </li>
          )}
        </ol>

        {result?.source && (
          <div className="glass rounded-2xl border-border/50 p-3">
            <MermaidRenderer source={result.source} />
            {!result.valid && result.errors.length > 0 && (
              <p className="mt-2 text-xs text-destructive">Could not produce fully valid syntax: {result.errors.join("; ")}</p>
            )}
          </div>
        )}
        {result && !result.source && (
          <p className="text-sm text-muted-foreground">{result.errors?.[0] ?? "No diagram could be generated for this figure."}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
