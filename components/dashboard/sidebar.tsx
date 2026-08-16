"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookMarked,
  FileText,
  FlaskConical,
  FolderClosed,
  GitCompareArrows,
  ImageIcon,
  Lightbulb,
  MessageSquare,
  Network,
  Search,
  Sparkles,
  Workflow,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoBadge } from "@/components/brand/logo-badge";
import { NewProjectDialog } from "@/components/dashboard/new-project-dialog";
import { useActiveProject } from "@/hooks/use-active-project";
import { useMe, useLogout } from "@/hooks/use-auth";
import { LogOut, Settings } from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Workspace",
    items: [
      { label: "Chat", href: "/dashboard", icon: MessageSquare },
      { label: "Documents", href: "/dashboard/documents", icon: FileText },
      { label: "Search papers", href: "/dashboard/search", icon: Search },
      { label: "Papers", href: "/dashboard/papers", icon: BookMarked },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Knowledge graph", href: "/dashboard/graph", icon: Network },
      { label: "Knowledge map", href: "/dashboard/map", icon: Workflow },
      { label: "Comparisons", href: "/dashboard/comparisons", icon: GitCompareArrows },
      { label: "Research gaps", href: "/dashboard/research-gaps", icon: Lightbulb },
      { label: "Literature review", href: "/dashboard/literature-review", icon: FlaskConical },
    ],
  },
  {
    label: "Library",
    items: [
      { label: "References", href: "/dashboard/references", icon: BookMarked },
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
];

function initials(name: string | null | undefined, email: string | undefined) {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
  }
  return (email?.[0] ?? "?").toUpperCase();
}

export function Sidebar() {
  const pathname = usePathname();
  const { projects, activeProjectId, isLoading, setActiveProjectId } = useActiveProject();
  const { data: me } = useMe();
  const logout = useLogout();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-card/40 backdrop-blur-xl">
      <Link href="/dashboard" className="flex items-center gap-2 px-5 py-5">
        <LogoBadge className="h-8 w-8" />
        <span className="text-sm font-semibold tracking-tight">
          Research Copilot
        </span>
      </Link>

      <div className="px-4">
        <NewProjectDialog />
      </div>

      <nav className="mt-5 flex flex-col gap-4 overflow-y-auto px-3 pb-3 scrollbar-thin">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {section.label}
            </p>
            <div className="mt-1.5 flex flex-col gap-0.5">
              {section.items.map((item) => {
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
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Projects
          </p>
          <div className="mt-1.5 flex flex-col gap-0.5">
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="mx-3 h-8" />
              ))}
            {!isLoading && projects.length === 0 && (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                No projects yet — create one above.
              </p>
            )}
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setActiveProjectId(project.id)}
                className={cn(
                  "flex items-center gap-2.5 truncate rounded-xl px-3 py-2 text-left text-sm transition-colors",
                  project.id === activeProjectId
                    ? "bg-secondary/70 text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                {project.id === activeProjectId ? (
                  <Sparkles className="h-4 w-4 shrink-0 text-violet-500" />
                ) : (
                  <FolderClosed className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate">{project.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="border-t border-border/60 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-secondary/50">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials(me?.full_name, me?.email)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{me?.full_name || "Researcher"}</p>
                <p className="truncate text-xs text-muted-foreground">{me?.email ?? ""}</p>
              </div>
              <Settings className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{me?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
