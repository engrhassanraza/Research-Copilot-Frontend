import { Bot, FileCheck2, Network, ScanText, UploadCloud } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: UploadCloud,
    title: "Bring your sources",
    description:
      "Pull papers straight from arXiv, PubMed, Semantic Scholar, Crossref, and OpenAlex, or upload your own PDFs, notes, and personal library.",
  },
  {
    step: "02",
    icon: ScanText,
    title: "Parse & understand",
    description:
      "Structure, tables, figures, and equations are extracted and captioned by vision-language models, then linked back into a document graph.",
  },
  {
    step: "03",
    icon: Network,
    title: "Index & retrieve",
    description:
      "Dense, sparse, and image embeddings are indexed in Qdrant and Neo4j, then fused with hybrid search and cross-encoder reranking.",
  },
  {
    step: "04",
    icon: Bot,
    title: "Agents reason together",
    description:
      "A LangGraph multi-agent system searches, analyzes, writes, and verifies, coordinated through shared memory and orchestration.",
  },
  {
    step: "05",
    icon: FileCheck2,
    title: "Get a verified answer",
    description:
      "Chat, literature reviews, knowledge maps, and fully cited exports, every claim traceable back to a page and paragraph.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-[480px] bg-radial-fade"
      />
      <div
        aria-hidden
        className="glow-orb pointer-events-none absolute -top-16 left-[12%] h-56 w-56 rounded-full blur-3xl opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 right-[12%] h-56 w-56 rounded-full bg-fuchsia-600/15 blur-3xl"
      />

      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            How Research Copilot works
          </h2>
          <p className="mt-4 text-muted-foreground">
            From raw papers to a verified answer, in five coordinated stages.
          </p>
        </div>

        <div className="relative mx-auto mt-16 max-w-3xl">
          <div
            aria-hidden
            className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-violet-500/60 via-border to-transparent sm:left-7"
          />
          <ol className="space-y-10">
            {STEPS.map((s) => (
              <li key={s.step} className="relative flex gap-6">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-card/80 text-violet-600 backdrop-blur dark:text-violet-300 sm:h-14 sm:w-14">
                  <s.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="flex-1 pb-2">
                  <span className="text-xs font-medium tracking-wider text-muted-foreground">
                    STEP {s.step}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
