import type { LucideIcon } from "lucide-react";
import {
  Database,
  Eye,
  Gauge,
  GraduationCap,
  Lightbulb,
  Microscope,
  Network,
  PenLine,
  ScanSearch,
  Wand2,
  Waypoints,
} from "lucide-react";

export interface AgentNodeMeta {
  label: string;
  description: string;
  icon: LucideIcon;
}

export const AGENT_NODE_META: Record<string, AgentNodeMeta> = {
  router: { label: "Routing", description: "Classifying question complexity", icon: Waypoints },
  query_rewrite: { label: "Rewriting query", description: "Optimizing for retrieval", icon: Wand2 },
  retrieval: { label: "Retrieving evidence", description: "Hybrid search over your papers", icon: Database },
  search: { label: "Searching literature", description: "Scanning external providers", icon: ScanSearch },
  vision: { label: "Reading figures", description: "Interpreting charts & tables", icon: Eye },
  graph_context: { label: "Querying knowledge graph", description: "Pulling entity relationships", icon: Network },
  research_analysis: { label: "Analyzing findings", description: "Synthesizing across papers", icon: Microscope },
  research_gap: { label: "Finding research gaps", description: "Spotting open problems", icon: Lightbulb },
  // Draft -> Cite -> Verify -> Format all run as one Writing agent step now
  // (citation/verification are no longer separate graph nodes).
  writing: { label: "Writing, citing & verifying", description: "Drafting, citing, and cross-checking the answer", icon: PenLine },
  explain: { label: "Explaining", description: "Building a ground-up walkthrough", icon: GraduationCap },
  quality_score: { label: "Scoring quality", description: "Computing the Research Quality Score", icon: Gauge },
};

export function nodeMeta(node: string): AgentNodeMeta {
  return (
    AGENT_NODE_META[node] ?? {
      label: node.replace(/_/g, " "),
      description: "Working…",
      icon: Waypoints,
    }
  );
}
