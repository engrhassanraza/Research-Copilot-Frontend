import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DocumentStatus } from "@/types/api";

const STATUS_META: Record<DocumentStatus, { label: string; className: string; icon: typeof Clock }> = {
  uploaded: { label: "Queued", className: "bg-secondary text-secondary-foreground border-border", icon: Clock },
  processing: {
    label: "Processing",
    className: "bg-primary/15 text-violet-700 dark:text-violet-200 border-transparent",
    icon: Loader2,
  },
  parsed: {
    label: "Parsed",
    className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-transparent",
    icon: CheckCircle2,
  },
  failed: { label: "Failed", className: "bg-destructive/15 text-destructive border-transparent", icon: AlertCircle },
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <Badge className={cn("gap-1", meta.className)}>
      <Icon className={cn("h-3 w-3", status === "processing" && "animate-spin")} />
      {meta.label}
    </Badge>
  );
}
