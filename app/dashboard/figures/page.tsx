"use client";

import { ImageIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyProjectState } from "@/components/dashboard/empty-project-state";
import { FiguresGallery } from "@/components/dashboard/figures/figures-gallery";
import { DiagramBuilder } from "@/components/dashboard/figures/diagram-builder";
import { IllustrationGenerator } from "@/components/dashboard/figures/illustration-generator";
import { useActiveProject } from "@/hooks/use-active-project";

export default function FiguresPage() {
  const { activeProjectId, projects, isLoading } = useActiveProject();

  if (isLoading) return null;
  if (projects.length === 0 || !activeProjectId) {
    return <EmptyProjectState description="Extracted figures live here, alongside tools to generate diagrams and illustrations." />;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
        <ImageIcon className="h-5 w-5 text-violet-500" />
        Figures
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Charts and tables extracted from your papers, plus tools to generate new diagrams and conceptual illustrations.
      </p>

      <Tabs defaultValue="extracted" className="mt-6">
        <TabsList>
          <TabsTrigger value="extracted">Extracted</TabsTrigger>
          <TabsTrigger value="diagram">Diagram generator</TabsTrigger>
          <TabsTrigger value="illustration">AI illustration</TabsTrigger>
        </TabsList>
        <TabsContent value="extracted">
          <FiguresGallery projectId={activeProjectId} />
        </TabsContent>
        <TabsContent value="diagram">
          <DiagramBuilder projectId={activeProjectId} />
        </TabsContent>
        <TabsContent value="illustration">
          <IllustrationGenerator projectId={activeProjectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
