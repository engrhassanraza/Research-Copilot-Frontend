import { FileSearch, Network, ShieldCheck } from "lucide-react";

import { PromptComposer } from "@/components/dashboard/prompt-composer";

const SUGGESTIONS = [
  { icon: FileSearch, label: "Summarize my uploaded papers" },
  { icon: Network, label: "Map relationships between these methods" },
  { icon: ShieldCheck, label: "Check citations in my last draft" },
];

export default function DashboardPage() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center px-6 py-16">
      <div
        aria-hidden
        className="glow-orb pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl animate-pulse-glow"
      />

      <div className="relative flex flex-col items-center text-center">
        <div className="glow-orb h-24 w-24 rounded-full shadow-2xl shadow-violet-950/50 animate-float" />
        <h1 className="mt-8 text-2xl font-semibold tracking-tight sm:text-3xl">
          Ready to start your research?
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Upload a paper, ask a question, or pick up a project from the
          sidebar — every answer comes with citations you can check.
        </p>
      </div>

      <div className="relative mt-10 w-full max-w-2xl">
        <PromptComposer />
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.label}
              className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
            >
              <suggestion.icon className="h-3.5 w-3.5" />
              {suggestion.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
