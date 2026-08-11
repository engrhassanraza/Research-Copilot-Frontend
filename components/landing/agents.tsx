import {
  BarChart3,
  Bot,
  Database,
  FileDown,
  PenSquare,
  Quote,
  Search,
  ShieldCheck,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AGENTS = [
  {
    icon: Search,
    name: "Research Search Agent",
    description: "Discovers and collects relevant papers and sources.",
  },
  {
    icon: Database,
    name: "Retrieval Agent",
    description: "Retrieves relevant chunks, tables, figures, and context.",
  },
  {
    icon: BarChart3,
    name: "Analysis Agent",
    description: "Analyzes content, extracts insights, compares methods.",
  },
  {
    icon: Target,
    name: "Gap Detection Agent",
    description: "Identifies research gaps, limitations, and future directions.",
  },
  {
    icon: PenSquare,
    name: "Writing Agent",
    description: "Generates literature reviews, sections, and summaries.",
  },
  {
    icon: Quote,
    name: "Citation Agent",
    description: "Manages citations, references, and formatting.",
  },
  {
    icon: ShieldCheck,
    name: "Verification Agent",
    description: "Fact-checks claims, validates sources, flags hallucinations.",
  },
  {
    icon: FileDown,
    name: "Export Agent",
    description: "Generates a fully cited Word doc, PDF, figures, and references.",
  },
];

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
            Specialized agents coordinate through shared memory and
            orchestration — conversation state, evidence, and tool calls stay
            in sync from the first search to the final export.
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
      </div>
    </section>
  );
}
