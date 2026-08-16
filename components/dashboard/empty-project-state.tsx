import { FolderPlus } from "lucide-react";

import { NewProjectDialog } from "@/components/dashboard/new-project-dialog";

export function EmptyProjectState({ description }: { description?: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/15 text-violet-600 dark:text-violet-300">
        <FolderPlus className="h-7 w-7" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold tracking-tight">Create a project to get started</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {description ?? "Every paper, chat, and citation lives inside a research project."}
        </p>
      </div>
      <NewProjectDialog />
    </div>
  );
}
