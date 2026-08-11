"use client";

import { useState } from "react";
import { ArrowUp, Paperclip, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function PromptComposer() {
  const [value, setValue] = useState("");

  return (
    <div className="glass rounded-3xl p-3 shadow-2xl shadow-black/40">
      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask anything about your papers…"
        rows={1}
        className="min-h-[52px] resize-none border-none bg-transparent px-3 py-2.5 text-base shadow-none focus-visible:ring-0"
      />
      <div className="flex items-center justify-between px-1 pt-1">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Paperclip className="h-4 w-4" />
            Attach
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            Options
          </Button>
        </div>
        <Button
          size="icon"
          disabled={value.trim().length === 0}
          aria-label="Send"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
