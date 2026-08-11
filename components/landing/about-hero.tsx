import { Bot, Database, Network, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const FACTS = [
  {
    icon: Bot,
    stat: "8 specialized agents",
    label:
      "Search, retrieval, analysis, writing, citations, and verification, coordinated through LangGraph.",
  },
  {
    icon: Database,
    stat: "5 connected sources",
    label:
      "arXiv, PubMed, Semantic Scholar, Crossref, and OpenAlex, plus your own uploads.",
  },
  {
    icon: Network,
    stat: "Hybrid retrieval",
    label:
      "Dense embeddings, sparse search, and a knowledge graph work together on every query.",
  },
  {
    icon: ShieldCheck,
    stat: "Verified before it ships",
    label: "Every claim is checked against its source before it reaches your document.",
  },
];

export function AboutHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-radial-fade pointer-events-none absolute inset-x-0 top-0 h-[560px]" />
      <div
        aria-hidden
        className="glow-orb pointer-events-none absolute -top-24 right-[10%] h-72 w-72 rounded-full blur-3xl animate-pulse-glow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-32 left-[6%] h-56 w-56 rounded-full bg-fuchsia-600/20 blur-3xl"
      />

      <div className="container relative grid gap-16 pb-16 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:pt-14">
        <div>
          <Badge className="mb-5 gap-1.5 py-1.5 pl-2 pr-3">ABOUT RESEARCH COPILOT</Badge>

          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            RESEARCH
            <br />
            <span className="text-gradient">COPILOT</span>
          </h1>

          <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              Research Copilot exists because literature review still takes
              longer than the research itself. Researchers, students, and
              analysts spend hours hunting for the right paper, rereading
              dense methodology sections, and checking whether a citation
              actually supports the claim next to it. We built a system that
              does that work for you, without asking you to trust a black
              box.
            </p>
            <p>
              Papers you upload or pull from arXiv, PubMed, Semantic
              Scholar, Crossref, and OpenAlex are parsed into their
              structure and indexed with hybrid retrieval and a knowledge
              graph. A team of specialized agents then searches, analyzes,
              writes, cites, and verifies every claim before it reaches your
              document.
            </p>
            <p>
              We care about two things above everything else: grounding and
              trust. An answer is only useful if you can trace it back to
              the page it came from, and a research tool is only
              trustworthy if it tells you when it is unsure. Research
              Copilot is built around both of those ideas.
            </p>
          </div>
        </div>

        <div className="relative lg:sticky lg:top-28">
          <div
            aria-hidden
            className="glow-orb pointer-events-none absolute -top-10 right-4 h-40 w-40 rounded-full blur-2xl"
          />
          <div className="glass relative rounded-3xl p-6 shadow-2xl shadow-black/40 sm:p-7">
            <p className="text-xs font-medium tracking-wider text-muted-foreground">
              AT A GLANCE
            </p>
            <dl className="mt-5">
              {FACTS.map((fact, index) => (
                <div
                  key={fact.stat}
                  className={
                    index === 0
                      ? "flex items-start gap-3 pb-5"
                      : "flex items-start gap-3 border-t border-border/60 py-5"
                  }
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 text-violet-600 dark:text-violet-300">
                    <fact.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-foreground">
                      {fact.stat}
                    </dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {fact.label}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
