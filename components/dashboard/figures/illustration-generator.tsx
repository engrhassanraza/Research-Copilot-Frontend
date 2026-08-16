"use client";

import { useState } from "react";
import { Download, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateIllustration } from "@/hooks/use-figures";
import { authErrorMessage } from "@/hooks/use-auth";

export function IllustrationGenerator({ projectId }: { projectId: string }) {
  const [prompt, setPrompt] = useState("");
  const generate = useGenerateIllustration(projectId);

  function handleGenerate() {
    if (!prompt.trim()) return;
    generate.mutate(prompt.trim(), {
      onError: (err) => toast.error("Couldn't generate illustration", { description: authErrorMessage(err, "Try again.") }),
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe a conceptual figure, e.g. 'a system architecture diagram showing a retrieval-augmented generation pipeline with a vector database and an LLM'"
          rows={6}
        />
        <Button onClick={handleGenerate} disabled={generate.isPending || !prompt.trim()}>
          {generate.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          Generate illustration
        </Button>
      </div>

      <div className="glass flex flex-col items-center justify-center gap-3 rounded-2xl border-border/50 p-4 min-h-[220px]">
        {!generate.data && !generate.isPending && (
          <p className="py-10 text-center text-sm text-muted-foreground">Your generated image will appear here.</p>
        )}
        {generate.isPending && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        {generate.data && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={generate.data} alt={prompt} className="max-h-80 w-full rounded-xl object-contain" />
            <Button variant="secondary" size="sm" asChild>
              <a href={generate.data} download="illustration.png">
                <Download className="h-3.5 w-3.5" />
                Download PNG
              </a>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
