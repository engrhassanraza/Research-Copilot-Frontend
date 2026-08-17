import type { CSSProperties } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BookOpen,
  Database,
  GraduationCap,
  Globe,
  ImageIcon,
  Link2,
  type LucideIcon,
  MessageSquare,
  Microscope,
  Network,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogoLoop, type LogoItem } from "@/components/landing/logo-loop";

const MODES: { label: string; description: string; href: string; icon: LucideIcon }[] = [
  { label: "Deep Research", description: "Supervisor + parallel workers, contradictions resolved", href: "/dashboard/deep-research", icon: Microscope },
  { label: "Learn a Topic", description: "Guided, ground-up explanations", href: "/dashboard?mode=learn", icon: GraduationCap },
  { label: "Query My Papers", description: "Chat over your library, fully cited", href: "/dashboard", icon: MessageSquare },
  { label: "Draw / Interpret a Figure", description: "Vision-aware diagram generation", href: "/dashboard/figures", icon: ImageIcon },
];

const SOURCE_LOGOS: LogoItem[] = [
  {
    node: (
      <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground/90">
        <BookOpen className="h-4 w-4" />
        arXiv
      </span>
    ),
    href: "https://arxiv.org",
    ariaLabel: "arXiv",
  },
  {
    node: (
      <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground/90">
        <Stethoscope className="h-4 w-4" />
        PubMed
      </span>
    ),
    href: "https://pubmed.ncbi.nlm.nih.gov",
    ariaLabel: "PubMed",
  },
  {
    node: (
      <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground/90">
        <GraduationCap className="h-4 w-4" />
        Semantic Scholar
      </span>
    ),
    href: "https://www.semanticscholar.org",
    ariaLabel: "Semantic Scholar",
  },
  {
    node: (
      <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground/90">
        <Link2 className="h-4 w-4" />
        Crossref
      </span>
    ),
    href: "https://www.crossref.org",
    ariaLabel: "Crossref",
  },
  {
    node: (
      <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground/90">
        <Globe className="h-4 w-4" />
        OpenAlex
      </span>
    ),
    href: "https://openalex.org",
    ariaLabel: "OpenAlex",
  },
];

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

      <div className="container relative grid gap-16 pb-20 pt-10 lg:grid-cols-2 lg:items-start lg:pt-14">
        <div className="max-w-xl">
          <Badge className="mb-5 gap-1.5 py-1.5 pl-2 pr-3">
            <Sparkles className="h-3.5 w-3.5" />
            Multi-agent research, grounded in your sources
          </Badge>

          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Research smarter.
            <br />
            Write with{" "}
            <span className="text-gradient">verifiable citations.</span>
          </h1>

          <p className="mt-5 text-lg leading-loose text-muted-foreground">
            Upload papers, ask questions, and generate literature reviews
            backed by hybrid retrieval, a research knowledge graph, and an
            agent that checks every claim against the source before it ships.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
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

          <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {MODES.map((mode) => (
              <Link
                key={mode.label}
                href={mode.href}
                className="glass group flex items-start gap-3 rounded-2xl border-border/50 p-3.5 transition-colors hover:border-violet-400/40"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-violet-600 transition-colors group-hover:bg-primary/25 dark:text-violet-300">
                  <mode.icon className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-tight">{mode.label}</p>
                  <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{mode.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-md items-center justify-center py-14 lg:mx-0 lg:ml-auto">
          <div
            aria-hidden
            className="glow-orb pointer-events-none absolute h-80 w-80 rounded-full blur-3xl animate-pulse-glow"
          />

          <div className="relative flex items-center justify-center">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[21rem] w-[21rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-violet-400/25 animate-spin-slow"
            />
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dotted border-fuchsia-400/20 animate-spin-slow-reverse"
            />

            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_12px_4px_rgba(196,132,252,0.8)] animate-orbit"
              style={{ "--orbit-radius": "10.2rem" } as CSSProperties}
            />
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-fuchsia-300 shadow-[0_0_10px_3px_rgba(240,171,252,0.8)] animate-orbit [animation-direction:reverse] [animation-duration:15s]"
              style={{ "--orbit-radius": "8.7rem" } as CSSProperties}
            />

            <div className="glow-orb animate-float relative flex h-56 w-56 items-center justify-center rounded-full shadow-[0_0_140px_45px_rgba(168,85,247,0.35)] sm:h-64 sm:w-64">
              <div className="absolute inset-3 rounded-full border border-white/10" />
              <div
                aria-hidden
                className="absolute h-3 w-3 rounded-full bg-white/80 blur-[2px] animate-ping"
                style={{ top: "22%", left: "30%" }}
              />
              <Sparkles className="h-14 w-14 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.65)]" />
            </div>

            <div
              aria-hidden
              className="absolute left-1/2 top-full -mt-5 h-6 w-[85%] -translate-x-1/2 rounded-[50%] border border-violet-400/30 bg-violet-500/10"
            />
            <div
              aria-hidden
              className="absolute left-1/2 top-full -mt-1 h-4 w-[100%] -translate-x-1/2 rounded-[50%] border border-violet-400/15"
            />

            <div className="glass animate-float absolute -left-10 top-1/2 hidden -translate-y-1/2 rounded-2xl px-4 py-3 sm:block [animation-delay:0.8s]">
              <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-300">
                <Bot className="h-3.5 w-3.5" />
                <span className="text-xs font-medium text-muted-foreground">
                  AI agents
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold tracking-tight">
                8 specialized
              </p>
            </div>

            <div className="glass animate-float absolute -right-6 -top-8 hidden rounded-2xl px-4 py-3 sm:block [animation-delay:1.6s]">
              <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-300">
                <Database className="h-3.5 w-3.5" />
                <span className="text-xs font-medium text-muted-foreground">
                  Data sources
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold tracking-tight">
                5 connected
              </p>
            </div>

            <div className="glass animate-float absolute -right-8 bottom-2 hidden rounded-2xl px-4 py-3 sm:block [animation-delay:2.4s]">
              <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-300">
                <Network className="h-3.5 w-3.5" />
                <span className="text-xs font-medium text-muted-foreground">
                  Retrieval
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold tracking-tight">
                Hybrid + graph
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="container py-8">
          <div className="w-full">
            <LogoLoop
              logos={SOURCE_LOGOS}
              speed={34}
              direction="left"
              logoHeight={20}
              gap={56}
              pauseOnHover
              scaleOnHover
              ariaLabel="Connected research data sources"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
