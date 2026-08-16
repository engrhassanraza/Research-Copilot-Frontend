"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Settings as SettingsIcon, ShieldAlert, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyProjectState } from "@/components/dashboard/empty-project-state";
import { QueryError } from "@/components/dashboard/query-error";
import { MemberRow } from "@/components/dashboard/settings/member-row";
import { useActiveProject } from "@/hooks/use-active-project";
import { useMe, authErrorMessage } from "@/hooks/use-auth";
import { useAddMember, useDeleteProject, useProjectMembers, useRemoveMember, useUpdateProject } from "@/hooks/use-projects";
import type { ProjectRole } from "@/types/api";

export default function SettingsPage() {
  const router = useRouter();
  const { activeProject, activeProjectId, projects, isLoading } = useActiveProject();
  const { data: me } = useMe();
  const {
    data: members,
    isLoading: membersLoading,
    isError: membersError,
    error: membersErrorObj,
    refetch: refetchMembers,
  } = useProjectMembers(activeProjectId);

  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const addMember = useAddMember(activeProjectId ?? "");
  const removeMember = useRemoveMember(activeProjectId ?? "");

  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [savingInfo, setSavingInfo] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newUserId, setNewUserId] = useState("");
  const [newRole, setNewRole] = useState<ProjectRole>("viewer");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const isOwner = !!activeProject && !!me && activeProject.owner_id === me.id;

  if (isLoading) return null;
  if (projects.length === 0 || !activeProjectId || !activeProject) {
    return <EmptyProjectState description="Project settings — rename, describe, and manage who has access." />;
  }

  function handleSaveInfo() {
    if (!activeProjectId) return;
    setSavingInfo(true);
    updateProject.mutate(
      { id: activeProjectId, body: { name: name ?? undefined, description: description ?? undefined } },
      {
        onSuccess: () => toast.success("Project updated"),
        onError: (err) => toast.error("Couldn't save", { description: authErrorMessage(err, "Try again.") }),
        onSettled: () => setSavingInfo(false),
      }
    );
  }

  function handleDeleteProject() {
    if (!activeProjectId) return;
    deleteProject.mutate(activeProjectId, {
      onSuccess: () => {
        toast.success("Project deleted");
        setDeleteOpen(false);
        router.push("/dashboard");
      },
      onError: (err) => toast.error("Couldn't delete project", { description: authErrorMessage(err, "Try again.") }),
    });
  }

  function handleAddMember() {
    if (!newUserId.trim()) return;
    addMember.mutate(
      { user_id: newUserId.trim(), role: newRole },
      {
        onSuccess: () => {
          toast.success("Member added");
          setNewUserId("");
        },
        onError: (err) => toast.error("Couldn't add member", { description: authErrorMessage(err, "Check the user ID and try again.") }),
      }
    );
  }

  function handleRemoveMember(userId: string) {
    setRemovingId(userId);
    removeMember.mutate(userId, {
      onSuccess: () => toast.success("Member removed"),
      onError: (err) => toast.error("Couldn't remove member", { description: authErrorMessage(err, "Try again.") }),
      onSettled: () => setRemovingId(null),
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
        <SettingsIcon className="h-5 w-5 text-violet-500" />
        Project settings
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage {activeProject.name}&apos;s details and team access.</p>

      <section className="mt-8 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Project info</h2>
        <div className="space-y-2">
          <Label htmlFor="project-name">Name</Label>
          <Input
            id="project-name"
            value={name ?? activeProject.name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isOwner}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-description">Description</Label>
          <Textarea
            id="project-description"
            value={description ?? activeProject.description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!isOwner}
            rows={3}
          />
        </div>
        {isOwner && (
          <Button onClick={handleSaveInfo} disabled={savingInfo || (name === null && description === null)}>
            {savingInfo ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
          </Button>
        )}
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          Members
        </h2>

        {isOwner && (
          <div className="glass flex flex-wrap items-end gap-2 rounded-2xl border-border/50 p-3">
            <div className="min-w-[14rem] flex-1 space-y-1.5">
              <Label htmlFor="new-member-id" className="text-xs">
                User ID
              </Label>
              <Input
                id="new-member-id"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                placeholder="UUID of the user to invite"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Role</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as ProjectRole)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddMember} disabled={addMember.isPending || !newUserId.trim()}>
              {addMember.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {membersLoading && Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          {membersError && <QueryError error={membersErrorObj} onRetry={() => refetchMembers()} />}
          {members?.map((member) => (
            <MemberRow
              key={member.user_id}
              member={member}
              canManage={isOwner}
              isSelf={member.user_id === me?.id}
              onRemove={() => handleRemoveMember(member.user_id)}
              removing={removingId === member.user_id}
            />
          ))}
        </div>
      </section>

      {isOwner && (
        <section className="mt-10 space-y-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-destructive">
            <ShieldAlert className="h-3.5 w-3.5" />
            Danger zone
          </h2>
          <p className="text-xs text-muted-foreground">
            Deleting a project permanently removes its documents, chats, references, and manuscripts.
          </p>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-3.5 w-3.5" />
                Delete project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete &quot;{activeProject.name}&quot;?</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">This can&apos;t be undone.</p>
              <DialogFooter>
                <Button variant="destructive" onClick={handleDeleteProject} disabled={deleteProject.isPending}>
                  {deleteProject.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete permanently"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
      )}
    </div>
  );
}
