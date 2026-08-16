"use client";

import { useState } from "react";
import { Copy, Loader2, Plus, Trash2, Workflow } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MermaidRenderer } from "@/components/dashboard/figures/mermaid-renderer";
import { useGenerateDiagram } from "@/hooks/use-figures";
import { authErrorMessage } from "@/hooks/use-auth";
import type { DiagramEdge, DiagramNode } from "@/types/api";

let idCounter = 0;
function newId() {
  idCounter += 1;
  return `n${idCounter}`;
}

export function DiagramBuilder({ projectId }: { projectId: string }) {
  const [kind, setKind] = useState<"mermaid" | "graphviz">("mermaid");
  const [nodes, setNodes] = useState<DiagramNode[]>([
    { id: newId(), label: "Input" },
    { id: newId(), label: "Process" },
  ]);
  const [edges, setEdges] = useState<(DiagramEdge & { key: string })[]>([]);
  const generate = useGenerateDiagram(projectId);

  function addNode() {
    setNodes((prev) => [...prev, { id: newId(), label: `Step ${prev.length + 1}` }]);
  }
  function updateNode(id: string, label: string) {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, label } : n)));
  }
  function removeNode(id: string) {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
  }
  function addEdge() {
    if (nodes.length < 2) return;
    setEdges((prev) => [...prev, { key: newId(), source: nodes[0].id, target: nodes[1].id, label: "" }]);
  }
  function updateEdge(key: string, patch: Partial<DiagramEdge>) {
    setEdges((prev) => prev.map((e) => (e.key === key ? { ...e, ...patch } : e)));
  }
  function removeEdge(key: string) {
    setEdges((prev) => prev.filter((e) => e.key !== key));
  }

  function handleGenerate() {
    generate.mutate(
      { kind, nodes, edges: edges.map(({ key: _key, ...e }) => e) },
      { onError: (err) => toast.error("Couldn't generate diagram", { description: authErrorMessage(err, "Try again.") }) }
    );
  }

  function copySource() {
    if (!generate.data) return;
    navigator.clipboard.writeText(generate.data.source);
    toast.success("Copied source to clipboard");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Select value={kind} onValueChange={(v) => setKind(v as "mermaid" | "graphviz")}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mermaid">Mermaid flowchart</SelectItem>
              <SelectItem value="graphviz">Graphviz DOT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Nodes</p>
          <div className="flex flex-col gap-2">
            {nodes.map((node) => (
              <div key={node.id} className="flex items-center gap-2">
                <Input value={node.label} onChange={(e) => updateNode(node.id, e.target.value)} placeholder="Node label" />
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeNode(node.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="secondary" size="sm" className="mt-2" onClick={addNode}>
            <Plus className="h-3.5 w-3.5" />
            Add node
          </Button>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Edges</p>
          <div className="flex flex-col gap-2">
            {edges.map((edge) => (
              <div key={edge.key} className="flex items-center gap-2">
                <Select value={edge.source} onValueChange={(v) => updateEdge(edge.key, { source: v })}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {nodes.map((n) => <SelectItem key={n.id} value={n.id}>{n.label || n.id}</SelectItem>)}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground">→</span>
                <Select value={edge.target} onValueChange={(v) => updateEdge(edge.key, { target: v })}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {nodes.map((n) => <SelectItem key={n.id} value={n.id}>{n.label || n.id}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input
                  value={edge.label ?? ""}
                  onChange={(e) => updateEdge(edge.key, { label: e.target.value })}
                  placeholder="label"
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeEdge(edge.key)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="secondary" size="sm" className="mt-2" onClick={addEdge} disabled={nodes.length < 2}>
            <Plus className="h-3.5 w-3.5" />
            Add edge
          </Button>
        </div>

        <Button onClick={handleGenerate} disabled={generate.isPending || nodes.length === 0}>
          {generate.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Workflow className="h-4 w-4" />}
          Generate diagram
        </Button>
      </div>

      <div className="glass rounded-2xl border-border/50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Preview</p>
          {generate.data && (
            <Button variant="ghost" size="sm" onClick={copySource}>
              <Copy className="h-3.5 w-3.5" />
              Copy source
            </Button>
          )}
        </div>
        {!generate.data && !generate.isPending && (
          <p className="py-10 text-center text-sm text-muted-foreground">Build a diagram and generate to preview it here.</p>
        )}
        {generate.isPending && (
          <div className="flex justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {generate.data?.kind === "mermaid" && <MermaidRenderer source={generate.data.source} />}
        {generate.data?.kind === "graphviz" && (
          <pre className="overflow-x-auto rounded-xl bg-secondary/60 p-3 text-xs">{generate.data.source}</pre>
        )}
      </div>
    </div>
  );
}
