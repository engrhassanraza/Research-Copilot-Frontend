"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Core, ElementDefinition, EventObject } from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";

import { entityColor } from "@/components/dashboard/graph/entity-colors";
import type { GraphSelection } from "@/components/dashboard/graph/graph-detail-panel";
import type { KnowledgeGraph } from "@/types/api";

export function KnowledgeGraphCanvas({
  graph,
  onSelect,
  fitToken,
}: {
  graph: KnowledgeGraph;
  onSelect: (selection: GraphSelection) => void;
  fitToken: number;
}) {
  const cyRef = useRef<Core | null>(null);

  const elements = useMemo<ElementDefinition[]>(() => {
    const nodes: ElementDefinition[] = graph.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.name || node.label,
        entityType: node.label,
        color: entityColor(node.label),
        size: node.label === "Paper" ? 46 : 30,
        confidence: node.confidence ?? 1,
      },
    }));
    const edges: ElementDefinition[] = graph.edges.map((edge, idx) => ({
      data: {
        id: `e${idx}-${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        relation: edge.relation,
        confidence: edge.confidence ?? 0.5,
      },
    }));
    return [...nodes, ...edges];
  }, [graph]);

  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    const onTapNode = (evt: EventObject) => {
      const id = evt.target.id();
      const node = graph.nodes.find((n) => n.id === id);
      if (node) onSelect({ kind: "node", node });
    };
    const onTapEdge = (evt: EventObject) => {
      const source = evt.target.data("source");
      const target = evt.target.data("target");
      const edge = graph.edges.find((e) => e.source === source && e.target === target);
      if (edge) onSelect({ kind: "edge", edge });
    };
    const onTapBackground = (evt: EventObject) => {
      if (evt.target === cy) onSelect(null);
    };

    cy.on("tap", "node", onTapNode);
    cy.on("tap", "edge", onTapEdge);
    cy.on("tap", onTapBackground);

    return () => {
      cy.removeListener("tap", "node", onTapNode);
      cy.removeListener("tap", "edge", onTapEdge);
      cy.removeListener("tap", onTapBackground);
    };
  }, [graph, onSelect]);

  useEffect(() => {
    if (fitToken > 0) cyRef.current?.fit(undefined, 60);
  }, [fitToken]);

  return (
    <CytoscapeComponent
      elements={elements}
      style={{ width: "100%", height: "100%" }}
      cy={(cy) => {
        cyRef.current = cy;
      }}
      layout={{
        name: "cose",
        animate: false,
        nodeRepulsion: () => 8000,
        idealEdgeLength: () => 110,
        gravity: 0.35,
        numIter: 1000,
      }}
      stylesheet={[
        {
          selector: "node",
          style: {
            "background-color": "data(color)",
            label: "data(label)",
            width: "data(size)",
            height: "data(size)",
            color: "#e5e0f5",
            "font-size": 10,
            "text-valign": "bottom",
            "text-margin-y": 6,
            "text-wrap": "ellipsis",
            "text-max-width": "90px",
            "border-width": 2,
            "border-color": "rgba(255,255,255,0.25)",
            "overlay-padding": 6,
          },
        },
        {
          selector: "edge",
          style: {
            width: "mapData(confidence, 0, 1, 1, 4)",
            "line-color": "rgba(167,139,250,0.35)",
            "target-arrow-color": "rgba(167,139,250,0.55)",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "arrow-scale": 0.8,
          },
        },
        {
          selector: "node:selected",
          style: {
            "border-width": 3,
            "border-color": "#fff",
          },
        },
      ]}
    />
  );
}
