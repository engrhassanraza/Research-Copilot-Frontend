"use client";

import { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";

import { EntityNode } from "@/components/dashboard/map/entity-node";
import { layoutKnowledgeMap } from "@/components/dashboard/map/layout-knowledge-map";
import { entityColor } from "@/components/dashboard/graph/entity-colors";
import { LogoBadge } from "@/components/brand/logo-badge";
import type { KnowledgeMap } from "@/types/api";

const NODE_TYPES = { entity: EntityNode };

export function KnowledgeMapCanvas({
  map,
  onSelectNode,
}: {
  map: KnowledgeMap;
  onSelectNode: (chunkIds: string[]) => void;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLayouting, setIsLayouting] = useState(true);

  const rootsKey = useMemo(() => JSON.stringify(map.roots.map((r) => r.id)), [map]);

  useEffect(() => {
    let cancelled = false;
    setIsLayouting(true);
    layoutKnowledgeMap(map.roots).then(({ nodes: n, edges: e }) => {
      if (cancelled) return;
      setNodes(n);
      setEdges(e);
      setIsLayouting(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootsKey]);

  function handleNodeClick(_: unknown, node: Node) {
    onSelectNode((node.data as { chunkIds: string[] }).chunkIds ?? []);
  }

  if (isLayouting) {
    return (
      <div className="flex h-full items-center justify-center">
        <LogoBadge className="h-10 w-10 animate-pulse-glow" />
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={handleNodeClick}
      nodeTypes={NODE_TYPES}
      fitView
      minZoom={0.15}
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={18} size={1} className="opacity-40" />
      <Controls className="!rounded-xl !border !border-border !bg-card !fill-foreground !text-foreground [&>button]:!border-border [&>button]:!bg-card [&>button:hover]:!bg-secondary" />
      <MiniMap
        pannable
        zoomable
        maskColor="rgba(0,0,0,0.55)"
        style={{ backgroundColor: "hsl(var(--card))" }}
        nodeColor={(node) => entityColor((node.data as { entityType: string })?.entityType ?? "")}
      />
    </ReactFlow>
  );
}
