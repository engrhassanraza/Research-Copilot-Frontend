"use client";

import { Activity, BarChart3, Clock, Coins, Search } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyProjectState } from "@/components/dashboard/empty-project-state";
import { CostChart } from "@/components/dashboard/analytics/cost-chart";
import { StatTile } from "@/components/dashboard/analytics/stat-tile";
import { useActiveProject } from "@/hooks/use-active-project";
import { useAnalytics } from "@/hooks/use-analytics";

export default function AnalyticsPage() {
  const { activeProjectId, projects, isLoading } = useActiveProject();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics(activeProjectId);

  if (isLoading) return null;
  if (projects.length === 0 || !activeProjectId) {
    return <EmptyProjectState description="Model usage, cost, and retrieval latency for this project show up here." />;
  }

  if (analyticsLoading || !analytics) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Skeleton className="h-8 w-48" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  const totalCalls = analytics.model_usage.reduce((sum, m) => sum + m.calls, 0);
  const totalCost = analytics.model_usage.reduce((sum, m) => sum + m.total_cost_usd, 0);
  const totalErrors = analytics.model_usage.reduce((sum, m) => sum + m.error_count, 0);
  const avgLatency =
    analytics.model_usage.length > 0
      ? analytics.model_usage.reduce((sum, m) => sum + m.avg_latency_ms, 0) / analytics.model_usage.length
      : 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
        <BarChart3 className="h-5 w-5 text-violet-500" />
        Analytics
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">Model usage, cost, and retrieval performance for this project.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon={Activity} label="Model calls" value={totalCalls.toLocaleString()} sublabel={totalErrors > 0 ? `${totalErrors} errors` : "No errors"} />
        <StatTile icon={Coins} label="Total cost" value={`$${totalCost.toFixed(4)}`} />
        <StatTile icon={Clock} label="Avg latency" value={`${Math.round(avgLatency)} ms`} />
        <StatTile
          icon={Search}
          label="Retrieval queries"
          value={analytics.retrieval.total_queries.toLocaleString()}
          sublabel={`${Math.round(analytics.retrieval.avg_latency_ms)} ms avg`}
        />
      </div>

      {analytics.model_usage.length > 0 ? (
        <>
          <div className="glass mt-6 rounded-2xl border-border/50 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Cost by model</p>
            <CostChart data={analytics.model_usage} />
          </div>

          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Calls</TableHead>
                  <TableHead>Prompt tokens</TableHead>
                  <TableHead>Completion tokens</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Avg latency</TableHead>
                  <TableHead>Errors</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.model_usage.map((row) => (
                  <TableRow key={`${row.provider}-${row.model_name}`}>
                    <TableCell>
                      <p className="font-medium">{row.model_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{row.provider}</p>
                    </TableCell>
                    <TableCell>{row.calls}</TableCell>
                    <TableCell>{row.total_prompt_tokens.toLocaleString()}</TableCell>
                    <TableCell>{row.total_completion_tokens.toLocaleString()}</TableCell>
                    <TableCell>${row.total_cost_usd.toFixed(4)}</TableCell>
                    <TableCell>{Math.round(row.avg_latency_ms)} ms</TableCell>
                    <TableCell>{row.error_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <p className="mt-10 text-center text-sm text-muted-foreground">No model activity recorded yet.</p>
      )}
    </div>
  );
}
