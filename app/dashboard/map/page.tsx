"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { FileSearch, Workflow } from "lucide-react";

import { EmptyProjectState } from "@/components/dashboard/empty-project-state";
import { GraphLegend } from "@/components/dashboard/graph/graph-legend";
import { EvidencePanel } from "@/components/dashboard/chat/evidence-panel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useActiveProject } from "@/hooks/use-active-project";
import { useKnowledgeMap } from "@/hooks/use-knowledge-graph";
import { LogoBadge } from "@/components/brand/logo-badge";

const KnowledgeMapCanvas = dynamic(
  () => import("@/components/dashboard/map/knowledge-map-canvas").then((m) => m.KnowledgeMapCanvas),
  { ssr: false }
);

export default function KnowledgeMapPage() {
  const { activeProjectId, projects, isLoading: projectLoading } = useActiveProject();
  const { data: map, isLoading } = useKnowledgeMap(activeProjectId);
  const [chunkIds, setChunkIds] = useState<string[]>([]);
  const [chunksOpen, setChunksOpen] = useState(false);
  const [evidenceChunkId, setEvidenceChunkId] = useState<string | null>(null);

  if (projectLoading) return null;
  if (projects.length === 0 || !activeProjectId) {
    return <EmptyProjectState description="A hierarchical, ELK-laid-out mind map of every paper and what it mentions." />;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-4 border-b border-border/60 px-6 py-4">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Workflow className="h-4.5 w-4.5 text-violet-500" />
            Knowledge map
          </h1>
          <p className="text-xs text-muted-foreground">Papers → the entities they mention, auto-laid-out.</p>
        </div>
        <GraphLegend />
      </div>

      <div className="relative flex-1">
        {isLoading && (
          <div className="flex h-full items-center justify-center">
            <LogoBadge className="h-10 w-10 animate-pulse-glow" />
          </div>
        )}

        {!isLoading && map && map.roots.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <Workflow className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No map yet — upload and process a document first.</p>
          </div>
        )}

        {!isLoading && map && map.roots.length > 0 && (
          <KnowledgeMapCanvas
            map={map}
            onSelectNode={(ids) => {
              setChunkIds(ids);
              setChunksOpen(true);
            }}
          />
        )}
      </div>

      <Sheet open={chunksOpen} onOpenChange={setChunksOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Supporting evidence</SheetTitle>
            <SheetDescription>{chunkIds.length} linked passage(s)</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-1.5">
            {chunkIds.map((id) => (
              <Button key={id} variant="secondary" size="sm" className="justify-start" onClick={() => setEvidenceChunkId(id)}>
                <FileSearch className="h-3.5 w-3.5" />
                View passage
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <EvidencePanel
        evidenceId={evidenceChunkId}
        projectId={activeProjectId}
        open={!!evidenceChunkId}
        onOpenChange={(open) => !open && setEvidenceChunkId(null)}
      />
    </div>
  );
}
