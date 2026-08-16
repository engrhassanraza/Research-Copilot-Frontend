"use client";

import { useState } from "react";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateProject } from "@/hooks/use-projects";
import { useProjectStore } from "@/stores/project-store";
import { authErrorMessage } from "@/hooks/use-auth";

export function NewProjectDialog({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createProject = useCreateProject();
  const setActiveProjectId = useProjectStore((s) => s.setActiveProjectId);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createProject.mutate(
      { name, description: description || undefined },
      {
        onSuccess: (project) => {
          setActiveProjectId(project.id);
          toast.success("Project created", { description: project.name });
          setOpen(false);
          setName("");
          setDescription("");
        },
        onError: (error) => {
          toast.error("Couldn't create project", {
            description: authErrorMessage(error, "Something went wrong."),
          });
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button className="flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-950/40 transition-opacity hover:opacity-90">
            <Plus className="h-4 w-4" />
            New research
          </button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-violet-600 dark:text-violet-300">
            <Sparkles className="h-5 w-5" />
          </div>
          <DialogTitle>Start a new research project</DialogTitle>
          <DialogDescription>
            Give it a name — you can upload papers and start chatting right after.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hybrid RAG literature review"
              autoFocus
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-description">Description (optional)</Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you researching?"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createProject.isPending || !name.trim()}>
              {createProject.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
