import {
  ArrowRight,
  BarChart3,
  Bot,
  ImageIcon,
  PenSquare,
  Quote,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AGENTS = [
  {
    icon: Route,
    name: "Router Agent",
    description:
      "Classifies each turn's intent and complexity, then decides whether retrieval, web search, vision, or the knowledge graph are needed.",
  },
  {
    icon: Search,
    name: "Retrieval Agent",
    description:
      "Runs hybrid search: sparse BM25 and dense vectors fused with RRF in Qdrant, then reranked with a cross-encoder.",
  },
  {
    icon: Sparkles,
    name: "Search Agent",
    description:
      "Discovers new papers from arXiv, Semantic Scholar, and other providers when a question needs sources beyond your library.",
  },
  {
    icon: ImageIcon,
    name: "Visual Agent",
    description:
      "Reads the vision-parsed analysis of figures, tables, and equations captured at ingestion, and renders diagrams on request.",
  },
  {
    icon: BarChart3,
    name: "Research Analysis Agent",
    description:
      "Extracts findings, methods, and limitations from retrieved evidence, and surfaces gaps and contradictions across sources.",
  },
  {
    icon: PenSquare,
    name: "Writing Agent",
    description:
      "Drafts the answer from evidence, then runs Cite, Verify, and Format as internal steps before it reaches you.",
  },
  {
    icon: Quote,
    name: "Citation Agent",
    description:
      "A deterministic step that resolves every claim's evidence into reference entries and citation markers.",
  },
  {
    icon: ShieldCheck,
    name: "Verification Agent",
    description:
      "Re-reads every drafted claim against its cited evidence and flags anything unsupported or contradicted.",
  },
];

const FLOW = ["Router", "Retrieval", "Analysis", "Writing", "Cite", "Verify"];

export function Agents() {
  return (
    <section id="agents" className="relative py-24">
      <div
        aria-hidden
        className="bg-radial-fade pointer-events-none absolute inset-x-0 top-0 h-[420px]"
      />
      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="accent" className="mb-4 gap-1.5 py-1.5 pl-2 pr-3">
            <Bot className="h-3.5 w-3.5" />
            AGENTIC AI LAYER
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Eight agents, one LangGraph pipeline
          </h2>
          <p className="mt-4 text-muted-foreground">
            Specialized agents coordinate through a request-scoped LangGraph.
            A router decides what is needed, evidence gathers in shared
            state, and every claim is verified before it reaches you.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AGENTS.map((agent) => (
            <Card
              key={agent.name}
              className="group border-border/60 bg-card/60 backdrop-blur transition-colors hover:border-primary/40"
            >
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 text-violet-600 transition-colors group-hover:from-violet-600/30 group-hover:to-fuchsia-600/30 dark:text-violet-300">
                  <agent.icon className="h-5 w-5" />
                </div>
                <CardTitle className="pt-2 text-base">{agent.name}</CardTitle>
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="mt-14">
          <p className="text-center text-xs font-medium tracking-wider text-muted-foreground">
            HOW A TURN FLOWS THROUGH THE PIPELINE
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
            {FLOW.map((stage, i) => (
              <div key={stage} className="flex items-center gap-2">
                <span className="glass rounded-full border-border/50 px-4 py-2 text-sm font-medium">
                  {stage}
                </span>
                {i < FLOW.length - 1 && (
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
