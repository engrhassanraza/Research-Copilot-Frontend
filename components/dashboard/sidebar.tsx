"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  FileText,
  FolderClosed,
  MessageSquare,
  Network,
  Plus,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogoBadge } from "@/components/brand/logo-badge";

const NAV_ITEMS = [
  { label: "Chat", href: "/dashboard", icon: MessageSquare },
  { label: "Documents", href: "/dashboard/documents", icon: FileText },
  { label: "Knowledge graph", href: "/dashboard/graph", icon: Network },
  { label: "Archived", href: "/dashboard/archived", icon: Archive },
];

const PROJECTS = [
  "Hybrid RAG literature review",
  "LLM evaluation survey",
  "Knowledge graph construction",
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-card/40 backdrop-blur-xl">
      <div className="flex items-center gap-2 px-5 py-5">
        <LogoBadge className="h-8 w-8" />
        <span className="text-sm font-semibold tracking-tight">
          Research Copilot
        </span>
      </div>

      <div className="px-4">
        <button className="flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-950/40 transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          New research
        </button>
      </div>

      <nav className="mt-6 flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary/15 text-violet-700 dark:text-violet-200"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 flex-1 overflow-y-auto px-3">
        <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Projects
        </p>
        <div className="mt-2 flex flex-col gap-0.5">
          {PROJECTS.map((project) => (
            <button
              key={project}
              className="flex items-center gap-2.5 truncate rounded-xl px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
            >
              <FolderClosed className="h-4 w-4 shrink-0" />
              <span className="truncate">{project}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border/60 p-4">
        <button className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-secondary/50">
          <Avatar className="h-8 w-8">
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Ada Lovelace</p>
            <p className="truncate text-xs text-muted-foreground">
              ada@university.edu
            </p>
          </div>
          <Settings className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </div>
    </aside>
  );
}
