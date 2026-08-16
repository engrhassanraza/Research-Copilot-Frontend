"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { FileSearch } from "lucide-react";

import { cn } from "@/lib/utils";
import { entityColor } from "@/components/dashboard/graph/entity-colors";

interface EntityNodeData {
  label: string;
  entityType: string;
  confidence: number | null;
  chunkIds: string[];
}

function EntityNodeInner({ data, selected }: NodeProps<EntityNodeData>) {
  const color = entityColor(data.entityType);

  return (
    <div
      className={cn(
        "glass flex w-[200px] items-center gap-2 rounded-2xl border-border/50 px-3 py-2.5 shadow-lg transition-shadow",
        selected && "ring-2 ring-violet-500"
      )}
      style={{ borderLeftWidth: 3, borderLeftColor: color }}
    >
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !border-none" style={{ background: color }} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium leading-tight">{data.label}</p>
        <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{data.entityType}</p>
      </div>
      {data.chunkIds.length > 0 && (
        <FileSearch className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
      )}
      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !border-none" style={{ background: color }} />
    </div>
  );
}

export const EntityNode = memo(EntityNodeInner);
