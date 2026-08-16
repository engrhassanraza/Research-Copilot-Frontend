"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, ShieldCheck, ShieldAlert, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ClaimSeverity, VerificationOutput } from "@/types/api";

const SEVERITY_META: Record<ClaimSeverity, { label: string; className: string }> = {
  none: { label: "OK", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-transparent" },
  low: { label: "Minor issue", className: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-transparent" },
  medium: { label: "Needs review", className: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-transparent" },
  high: { label: "Flagged", className: "bg-destructive/15 text-destructive border-transparent" },
};

export function VerificationPanel({ verification }: { verification: VerificationOutput | null | undefined }) {
  const [expanded, setExpanded] = useState(false);
  if (!verification || verification.claims.length === 0) return null;

  const total = verification.claims.length;
  const flagged = verification.claims.filter((c) => c.severity !== "none" || !c.supported || !c.citation_valid);
  const allClear = flagged.length === 0;

  return (
    <div className="mt-3 rounded-xl border border-border/50 bg-secondary/20">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs"
      >
        {allClear ? (
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
        ) : (
          <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-amber-500" />
        )}
        <span className="font-medium">
          {allClear ? `Verified · ${total} claim${total === 1 ? "" : "s"} checked` : `${flagged.length}/${total} claims need a look`}
        </span>
        <ChevronDown className={cn("ml-auto h-3.5 w-3.5 text-muted-foreground transition-transform", expanded && "rotate-180")} />
      </button>
      {expanded && (
        <ul className="flex flex-col gap-2 border-t border-border/50 px-3 py-2.5">
          {verification.claims.map((claim, i) => {
            const meta = SEVERITY_META[claim.severity];
            return (
              <li key={i} className="text-xs leading-relaxed">
                <div className="flex items-start gap-2">
                  {claim.supported && claim.citation_valid ? (
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground/90">{claim.claim}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Badge className={meta.className}>{meta.label}</Badge>
                      {!claim.supported && <Badge variant="outline">Not fully supported</Badge>}
                      {!claim.citation_valid && <Badge variant="outline">Citation mismatch</Badge>}
                    </div>
                    {claim.problem && (
                      <p className="mt-1 flex items-start gap-1 text-muted-foreground">
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                        {claim.problem}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
