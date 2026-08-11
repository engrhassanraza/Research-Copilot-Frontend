import {
  BookMarked,
  Network,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const FEATURES = [
  {
    icon: ScanSearch,
    title: "Hybrid retrieval",
    description:
      "Dense embeddings and BM25 sparse vectors fused with RRF in Qdrant, then re-ranked with a cross-encoder for precision.",
  },
  {
    icon: Network,
    title: "Research knowledge graph",
    description:
      "Papers, authors, methods, and concepts linked in Neo4j so you can trace relationships, not just keywords.",
  },
  {
    icon: ShieldCheck,
    title: "Citation verification",
    description:
      "A dedicated Verification Agent checks every claim against the source passage before it reaches your document.",
  },
  {
    icon: Workflow,
    title: "Multi-agent pipeline",
    description:
      "Search, Retrieval, Research, Vision, Writing, and Citation agents coordinate through a LangGraph router.",
  },
  {
    icon: Sparkles,
    title: "Multimodal understanding",
    description:
      "Figures, tables, and equations are parsed and linked back to the paragraphs that reference them.",
  },
  {
    icon: BookMarked,
    title: "One-click export",
    description:
      "Generate a fully cited DOCX, PDF, or interactive knowledge map directly from your research thread.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything a literature review needs
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every answer is traceable back to a page, a paragraph, and a
            bounding box in the original PDF.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="group border-border/60 bg-card/60 backdrop-blur transition-colors hover:border-primary/40"
            >
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 text-violet-600 transition-colors group-hover:from-violet-600/30 group-hover:to-fuchsia-600/30 dark:text-violet-300">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="pt-2 text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
