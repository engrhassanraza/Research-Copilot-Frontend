import type { EntityLabel } from "@/types/api";

// Validated 8-slot categorical set extended with 3 more hues for the graph's 11 entity types.
export const ENTITY_COLORS: Record<EntityLabel, string> = {
  Paper: "#3987e5",
  Author: "#e66767",
  Method: "#199e70",
  Dataset: "#d95926",
  Model: "#9085e9",
  Task: "#c98500",
  Metric: "#d55181",
  Finding: "#22a06b",
  Limitation: "#9ca3af",
  ResearchGap: "#fb7185",
  Topic: "#818cf8",
};

export function entityColor(label: string): string {
  return ENTITY_COLORS[label as EntityLabel] ?? "#9ca3af";
}
