import type { EntityLabel } from "@/types/api";

// Categorical hues (dataviz skill's validated 8-slot set, extended with 3
// more distinguishable hues since the graph has 11 entity types) — paired
// with a distinct icon per type so color is never the only signal.
export const ENTITY_COLORS: Record<EntityLabel, string> = {
  Paper: "#3987e5", // blue
  Author: "#e66767", // red
  Method: "#199e70", // aqua
  Dataset: "#d95926", // orange
  Model: "#9085e9", // violet
  Task: "#c98500", // yellow
  Metric: "#d55181", // magenta
  Finding: "#22a06b", // green
  Limitation: "#9ca3af", // slate
  ResearchGap: "#fb7185", // rose
  Topic: "#818cf8", // indigo
};

export function entityColor(label: string): string {
  return ENTITY_COLORS[label as EntityLabel] ?? "#9ca3af";
}
