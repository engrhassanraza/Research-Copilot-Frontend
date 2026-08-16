"use client";

import { usePathname } from "next/navigation";
import { ChevronDown, FolderKanban } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewProjectDialog } from "@/components/dashboard/new-project-dialog";
import { useActiveProject } from "@/hooks/use-active-project";
import { useChatStore } from "@/stores/chat-store";
import type { CitationStyle } from "@/types/api";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Chat",
  "/dashboard/documents": "Documents",
  "/dashboard/search": "Search papers",
  "/dashboard/papers": "Papers",
  "/dashboard/graph": "Knowledge graph",
  "/dashboard/map": "Knowledge map",
  "/dashboard/comparisons": "Comparisons",
  "/dashboard/research-gaps": "Research gaps",
  "/dashboard/literature-review": "Literature review",
  "/dashboard/references": "References",
  "/dashboard/analytics": "Analytics",
};

const CITATION_STYLES: { value: CitationStyle; label: string }[] = [
  { value: "ieee", label: "IEEE" },
  { value: "apa", label: "APA" },
  { value: "vancouver", label: "Vancouver" },
  { value: "chicago", label: "Chicago" },
  { value: "harvard", label: "Harvard" },
];

export function Topbar() {
  const pathname = usePathname();
  const { projects, activeProject, setActiveProjectId } = useActiveProject();
  const citationStyle = useChatStore((s) => s.citationStyle);
  const setCitationStyle = useChatStore((s) => s.setCitationStyle);

  const pageTitle = PAGE_TITLES[pathname ?? ""] ?? "Research Copilot";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background/60 px-6 backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex max-w-[16rem] items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
              <FolderKanban className="h-3.5 w-3.5 shrink-0 text-violet-500" />
              <span className="truncate">{activeProject?.name ?? "No project selected"}</span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Switch project</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {projects.map((project) => (
              <DropdownMenuItem key={project.id} onClick={() => setActiveProjectId(project.id)}>
                <span className="truncate">{project.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <NewProjectDialog
              trigger={
                <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-violet-600 hover:bg-secondary dark:text-violet-300">
                  + New project
                </button>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="hidden text-sm text-muted-foreground/60 sm:inline">/</span>
        <span className="hidden truncate text-sm font-medium text-foreground sm:inline">{pageTitle}</span>
      </div>

      <div className="flex items-center gap-2">
        <Select value={citationStyle} onValueChange={(v) => setCitationStyle(v as CitationStyle)}>
          <SelectTrigger className="w-[9.5rem]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CITATION_STYLES.map((style) => (
              <SelectItem key={style.value} value={style.value}>
                {style.label} citations
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ThemeToggle />
      </div>
    </header>
  );
}
