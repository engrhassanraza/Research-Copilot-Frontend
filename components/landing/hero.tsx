import Link from "next/link";
import { ArrowRight, FileText, Quote, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-radial-fade pointer-events-none absolute inset-x-0 top-0 h-[640px]" />
      <div
        aria-hidden
        className="glow-orb pointer-events-none absolute -top-24 right-[8%] h-72 w-72 rounded-full blur-3xl animate-pulse-glow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 left-[6%] h-56 w-56 rounded-full bg-fuchsia-600/20 blur-3xl"
      />

      <div className="container relative grid gap-16 pb-28 pt-20 lg:grid-cols-2 lg:items-center lg:pt-28">
        <div className="max-w-xl">
          <Badge className="mb-6 gap-1.5 py-1.5 pl-2 pr-3">
            <Sparkles className="h-3.5 w-3.5" />
            Multi-agent research, grounded in your sources
          </Badge>

          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Research smarter.
            <br />
            Write with{" "}
            <span className="text-gradient">verifiable citations.</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Upload papers, ask questions, and generate literature reviews
            backed by hybrid retrieval, a research knowledge graph, and an
            agent that checks every claim against the source before it ships.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                Start researching
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>

          <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
            <span>Dense + BM25 hybrid retrieval</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>Neo4j knowledge graph</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>Citation verification</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:ml-auto">
          <div
            aria-hidden
            className="glow-orb absolute -top-10 right-4 h-40 w-40 rounded-full blur-2xl"
          />
          <div className="glass animate-float relative rounded-3xl p-5 shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-secondary/50 px-4 py-3">
              <Sparkles className="h-4 w-4 text-violet-300" />
              <span className="text-sm text-muted-foreground">
                What does the literature say about hybrid RAG fusion?
              </span>
            </div>

            <div className="mt-4 space-y-3 rounded-2xl border border-border/60 bg-card/80 p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-violet-300">
                <FileText className="h-3.5 w-3.5" />
                Retrieval Agent · 12 sources
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">
                Reciprocal Rank Fusion combining dense and sparse retrieval
                consistently outperforms either method alone
                <sup className="text-violet-300">[3]</sup>, especially when
                paired with a cross-encoder reranker
                <sup className="text-violet-300">[7]</sup>.
              </p>
              <div className="flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                <Quote className="h-3.5 w-3.5 shrink-0" />
                "RRF fusion improved nDCG@10 by 11% over dense-only retrieval"
                — Gao et al., p. 6
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Verified · 3 citations checked</span>
              <span className="flex h-6 items-center rounded-full bg-primary/15 px-2.5 text-violet-200">
                Supported
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
