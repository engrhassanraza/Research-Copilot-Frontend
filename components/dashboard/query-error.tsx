import { AlertTriangle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authErrorMessage } from "@/hooks/use-auth";

export function QueryError({
  error,
  onRetry,
  className,
}: {
  error: unknown;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-3 rounded-3xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center ${className ?? ""}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Couldn&apos;t load this</p>
        <p className="max-w-sm text-xs text-muted-foreground">
          {authErrorMessage(error, "Something went wrong talking to the server.")}
        </p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RotateCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      )}
    </div>
  );
}
