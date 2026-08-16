"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useReferences } from "@/hooks/use-references";
import { referenceLabel } from "@/components/dashboard/manuscript/reference-label";

export function CitationPickerDialog({
  projectId,
  open,
  onOpenChange,
  onSelect,
}: {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (referenceId: string, label: string) => void;
}) {
  const { data: references, isLoading } = useReferences(open ? projectId : null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = references ?? [];
    if (!q) return list;
    return list.filter(
      (r) => r.title.toLowerCase().includes(q) || (r.authors ?? []).some((a) => a.toLowerCase().includes(q))
    );
  }, [references, query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert citation</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search references…"
            className="pl-8"
            autoFocus
          />
        </div>
        <div className="max-h-80 space-y-1 overflow-y-auto scrollbar-thin">
          {isLoading && <p className="py-6 text-center text-sm text-muted-foreground">Loading references…</p>}
          {!isLoading && filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {references && references.length === 0 ? "No references in this project yet." : "No references match."}
            </p>
          )}
          {filtered.map((reference) => (
            <button
              key={reference.id}
              type="button"
              onClick={() => onSelect(reference.id, referenceLabel(reference))}
              className="flex w-full flex-col items-start gap-0.5 rounded-xl border border-border/50 px-3 py-2 text-left text-sm transition-colors hover:bg-secondary/50"
            >
              <span className="line-clamp-1 font-medium">{reference.title}</span>
              <span className="text-xs text-muted-foreground">{referenceLabel(reference)}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
