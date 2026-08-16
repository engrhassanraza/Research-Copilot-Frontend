"use client";

import { FileSearch } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { entityColor } from "@/components/dashboard/graph/entity-colors";
import type { GraphEdge, GraphNode } from "@/types/api";

export type GraphSelection = { kind: "node"; node: GraphNode } | { kind: "edge"; edge: GraphEdge } | null;

export function GraphDetailPanel({
  selection,
  onOpenChange,
  onViewEvidence,
}: {
  selection: GraphSelection;
  onOpenChange: (open: boolean) => void;
  onViewEvidence: (chunkId: string) => void;
}) {
  const open = selection !== null;
  const chunkIds = selection?.kind === "node" ? selection.node.evidence.chunk_ids : selection?.edge.evidence.chunk_ids ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto scrollbar-thin">
        {selection?.kind === "node" && (
          <>
            <SheetHeader>
              <div
                className="mb-1 flex h-10 w-10 items-center justify-center rounded-2xl text-white"
                style={{ backgroundColor: entityColor(selection.node.label) }}
              >
                {selection.node.label[0]}
              </div>
              <SheetTitle>{selection.node.name || selection.node.id}</SheetTitle>
              <SheetDescription>{selection.node.label}</SheetDescription>
            </SheetHeader>
            {selection.node.confidence !== null && (
              <Badge variant="outline">Confidence {(selection.node.confidence * 100).toFixed(0)}%</Badge>
            )}
          </>
        )}

        {selection?.kind === "edge" && (
          <SheetHeader>
            <SheetTitle className="capitalize">{selection.edge.relation.replace(/_/g, " ").toLowerCase()}</SheetTitle>
            <SheetDescription>
              {selection.edge.source} → {selection.edge.target}
              {selection.edge.confidence !== null && ` · ${(selection.edge.confidence * 100).toFixed(0)}% confidence`}
            </SheetDescription>
          </SheetHeader>
        )}

        <div className="mt-2">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Supporting evidence ({chunkIds.length})
          </p>
          {chunkIds.length === 0 && <p className="text-sm text-muted-foreground">No linked evidence.</p>}
          <div className="flex flex-col gap-1.5">
            {chunkIds.map((chunkId) => (
              <Button
                key={chunkId}
                variant="secondary"
                size="sm"
                className="justify-start"
                onClick={() => onViewEvidence(chunkId)}
              >
                <FileSearch className="h-3.5 w-3.5" />
                View passage
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
