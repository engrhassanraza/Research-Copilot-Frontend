"use client";

import { useEffect } from "react";

import { useProjects } from "@/hooks/use-projects";
import { useProjectStore } from "@/stores/project-store";

export function useActiveProject() {
  const { data: projects, isLoading } = useProjects();
  const activeProjectId = useProjectStore((s) => s.activeProjectId);
  const setActiveProjectId = useProjectStore((s) => s.setActiveProjectId);

  useEffect(() => {
    if (!projects) return;
    const stillExists = projects.some((p) => p.id === activeProjectId);
    if (!stillExists) {
      setActiveProjectId(projects[0]?.id ?? null);
    }
  }, [projects, activeProjectId, setActiveProjectId]);

  const activeProject = projects?.find((p) => p.id === activeProjectId) ?? null;

  return { projects: projects ?? [], activeProject, activeProjectId, isLoading, setActiveProjectId };
}
