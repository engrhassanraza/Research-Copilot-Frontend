"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUp, Paperclip, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function PromptComposer({
  value,
  onChange,
  onSend,
  onStop,
  isStreaming,
  placeholder = "Ask anything about your papers…",
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop?: () => void;
  isStreaming?: boolean;
  placeholder?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (value.trim() && !isStreaming) onSend();
    }
  }

  return (
    <div className="glass rounded-3xl p-3 shadow-2xl shadow-black/40">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        className="min-h-[52px] resize-none border-none bg-transparent px-3 py-2.5 text-base shadow-none focus-visible:ring-0"
      />
      <div className="flex items-center justify-between px-1 pt-1">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
            <Link href="/dashboard/documents">
              <Paperclip className="h-4 w-4" />
              Upload paper
            </Link>
          </Button>
        </div>
        {isStreaming ? (
          <Button size="icon" variant="secondary" onClick={onStop} aria-label="Stop">
            <Square className="h-3.5 w-3.5 fill-current" />
          </Button>
        ) : (
          <Button
            size="icon"
            disabled={value.trim().length === 0}
            aria-label="Send"
            onClick={onSend}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
