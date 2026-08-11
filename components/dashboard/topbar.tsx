"use client";

import { ChevronDown, Download, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MODELS = ["Gemini 2.5 Pro", "Qwen3.5 Flash", "Groq Llama 3.3 70B"];

export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background/60 px-6 backdrop-blur-xl">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
            {MODELS[0]}
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {MODELS.map((model) => (
            <DropdownMenuItem key={model}>{model}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4" />
          Configuration
        </Button>
        <Button variant="secondary" size="sm">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </header>
  );
}
