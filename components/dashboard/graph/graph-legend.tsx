import { ENTITY_COLORS } from "@/components/dashboard/graph/entity-colors";

export function GraphLegend() {
  return (
    <div className="glass flex flex-wrap gap-x-4 gap-y-2 rounded-2xl border-border/50 px-4 py-3">
      {Object.entries(ENTITY_COLORS).map(([label, color]) => (
        <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          {label}
        </div>
      ))}
    </div>
  );
}
