"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Maximize2, Network } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyProjectState } from "@/components/dashboard/empty-project-state";
import { GraphDetailPanel, type GraphSelection } from "@/components/dashboard/graph/graph-detail-panel";
import { GraphLegend } from "@/components/dashboard/graph/graph-legend";
import { QueryError } from "@/components/dashboard/query-error";
import { EvidencePanel } from "@/components/dashboard/chat/evidence-panel";
import { useActiveProject } from "@/hooks/use-active-project";
import { useKnowledgeGraph } from "@/hooks/use-knowledge-graph";
import { LogoBadge } from "@/components/brand/logo-badge";

const KnowledgeGraphCanvas = dynamic(
  () => import("@/components/dashboard/graph/knowledge-graph-canvas").then((m) => m.KnowledgeGraphCanvas),
  { ssr: false }
);

export default function KnowledgeGraphPage() {
  const { activeProjectId, projects, isLoading: projectLoading } = useActiveProject();
  const { data: graph, isLoading, isError, error, refetch } = useKnowledgeGraph(activeProjectId);
  const [selection, setSelection] = useState<GraphSelection>(null);
  const [evidenceChunkId, setEvidenceChunkId] = useState<string | null>(null);
  const [fitToken, setFitToken] = useState(0);

  if (projectLoading) return null;
  if (projects.length === 0 || !activeProjectId) {
    return <EmptyProjectState description="Once you upload papers, entities and relationships appear here as a graph." />;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-4 border-b border-border/60 px-6 py-4">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Network className="h-4.5 w-4.5 text-violet-500" />
            Knowledge graph
          </h1>
          <p className="text-xs text-muted-foreground">
            {graph
              ? `${graph.nodes.length} entities · ${graph.edges.length} relationships`
              : isError
                ? "Couldn't load"
                : "Loading…"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <GraphLegend />
          <Button variant="secondary" size="icon" onClick={() => setFitToken((t) => t + 1)} aria-label="Fit to view">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative flex-1">
        {isLoading && (
          <div className="flex h-full items-center justify-center">
            <LogoBadge className="h-10 w-10 animate-pulse-glow" />
          </div>
        )}

        {isError && (
          <div className="flex h-full items-center justify-center p-6">
            <QueryError error={error} onRetry={() => refetch()} className="max-w-md" />
          </div>
        )}

        {!isLoading && !isError && graph && graph.nodes.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <Network className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No graph yet — upload and process a document first.
            </p>
          </div>
        )}

        {!isLoading && graph && graph.nodes.length > 0 && (
          <KnowledgeGraphCanvas graph={graph} onSelect={setSelection} fitToken={fitToken} />
        )}
      </div>

      <GraphDetailPanel
        selection={selection}
        onOpenChange={(open) => !open && setSelection(null)}
        onViewEvidence={setEvidenceChunkId}
      />
      <EvidencePanel
        evidenceId={evidenceChunkId}
        projectId={activeProjectId}
        open={!!evidenceChunkId}
        onOpenChange={(open) => !open && setEvidenceChunkId(null)}
      />
    </div>
  );
}
