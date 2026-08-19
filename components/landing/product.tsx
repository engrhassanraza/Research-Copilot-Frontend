import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  ImageIcon,
  LayoutGrid,
  type LucideIcon,
  MessageSquare,
  Microscope,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const MODES: {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    label: "Deep Research",
    description:
      "A supervisor plans sub-questions and dispatches parallel workers to search and analyze independently. Contradictions across sources are detected and reconciled before a literature review is drafted.",
    href: "/dashboard/deep-research",
    icon: Microscope,
  },
  {
    label: "Learn a Topic",
    description:
      "A dedicated explainer agent builds guided, ground-up explanations from your library, with a concept-progression diagram generated alongside when it helps.",
    href: "/dashboard?mode=learn",
    icon: GraduationCap,
  },
  {
    label: "Query My Papers",
    description:
      "Chat over your uploaded library with hybrid retrieval and cross-session memory. Every answer is drafted, cited, and verified against the source before it reaches you.",
    href: "/dashboard",
    icon: MessageSquare,
  },
  {
    label: "Draw / Interpret a Figure",
    description:
      "Ask about a figure, table, or equation and get back the vision-parsed analysis captured at ingestion, including captions and how it connects to the surrounding text.",
    href: "/dashboard/figures",
    icon: ImageIcon,
  },
];

export function Product() {
  return (
    <section id="product" className="relative py-24">
      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <Badge className="mb-4 gap-1.5 py-1.5 pl-2 pr-3">
            <LayoutGrid className="h-3.5 w-3.5" />
            PRODUCT
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            One copilot, four ways to work
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pick a mode and the right agents take over, from a single cited
            answer to a fully drafted literature review.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {MODES.map((mode) => (
            <Link key={mode.label} href={mode.href} className="group block h-full">
              <Card className="h-full border-border/60 bg-card/60 backdrop-blur transition-colors group-hover:border-primary/40">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 text-violet-600 transition-colors group-hover:from-violet-600/30 group-hover:to-fuchsia-600/30 dark:text-violet-300">
                    <mode.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="flex items-center gap-1.5 pt-2 text-lg">
                    {mode.label}
                    <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
