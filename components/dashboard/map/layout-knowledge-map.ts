import ELK from "elkjs/lib/elk.bundled.js";
import type { Edge, Node } from "reactflow";

import type { MapNode } from "@/types/api";

interface FlatNode {
  id: string;
  label: string;
  name: string;
  confidence: number | null;
  chunkIds: string[];
}
interface FlatEdge {
  id: string;
  source: string;
  target: string;
}

function flatten(roots: MapNode[]): { nodes: FlatNode[]; edges: FlatEdge[] } {
  const nodes: FlatNode[] = [];
  const edges: FlatEdge[] = [];
  const seen = new Set<string>();

  function walk(node: MapNode, parentId?: string) {
    if (!seen.has(node.id)) {
      seen.add(node.id);
      nodes.push({
        id: node.id,
        label: node.label,
        name: node.name ?? node.id,
        confidence: node.confidence,
        chunkIds: node.evidence?.chunk_ids ?? [],
      });
    }
    if (parentId) edges.push({ id: `${parentId}->${node.id}`, source: parentId, target: node.id });
    node.children.forEach((child) => walk(child, node.id));
  }

  roots.forEach((root) => walk(root));
  return { nodes, edges };
}

const elk = new ELK();
const NODE_WIDTH = 208;
const NODE_HEIGHT = 60;

export async function layoutKnowledgeMap(roots: MapNode[]): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const { nodes, edges } = flatten(roots);

  if (nodes.length === 0) return { nodes: [], edges: [] };

  const elkGraph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "RIGHT",
      "elk.spacing.nodeNode": "36",
      "elk.layered.spacing.nodeNodeBetweenLayers": "90",
      "elk.layered.spacing.edgeNodeBetweenLayers": "40",
    },
    children: nodes.map((n) => ({ id: n.id, width: NODE_WIDTH, height: NODE_HEIGHT })),
    edges: edges.map((e) => ({ id: e.id, sources: [e.source], targets: [e.target] })),
  };

  const layouted = await elk.layout(elkGraph);
  const positioned = new Map((layouted.children ?? []).map((c) => [c.id, { x: c.x ?? 0, y: c.y ?? 0 }]));

  const rfNodes: Node[] = nodes.map((n) => ({
    id: n.id,
    type: "entity",
    position: positioned.get(n.id) ?? { x: 0, y: 0 },
    data: { label: n.name, entityType: n.label, confidence: n.confidence, chunkIds: n.chunkIds },
    draggable: true,
  }));

  const rfEdges: Edge[] = edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: "smoothstep",
    style: { stroke: "rgba(167,139,250,0.35)", strokeWidth: 1.5 },
  }));

  return { nodes: rfNodes, edges: rfEdges };
}
