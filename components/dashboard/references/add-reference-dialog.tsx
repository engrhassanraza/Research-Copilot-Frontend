"use client";

import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateReference } from "@/hooks/use-references";
import { authErrorMessage } from "@/hooks/use-auth";

export function AddReferenceDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [year, setYear] = useState("");
  const [venue, setVenue] = useState("");
  const [doi, setDoi] = useState("");
  const [url, setUrl] = useState("");
  const createReference = useCreateReference(projectId);

  function reset() {
    setTitle("");
    setAuthors("");
    setYear("");
    setVenue("");
    setDoi("");
    setUrl("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createReference.mutate(
      {
        title,
        authors: authors
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        year: year ? Number(year) : undefined,
        venue: venue || undefined,
        doi: doi || undefined,
        url: url || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Reference added");
          setOpen(false);
          reset();
        },
        onError: (err) => toast.error("Couldn't add reference", { description: authErrorMessage(err, "Try again.") }),
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add reference
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a reference</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="ref-title">Title</Label>
            <Input id="ref-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ref-authors">Authors (comma-separated)</Label>
            <Input id="ref-authors" value={authors} onChange={(e) => setAuthors(e.target.value)} placeholder="Jane Doe, John Smith" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ref-year">Year</Label>
              <Input id="ref-year" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ref-venue">Venue</Label>
              <Input id="ref-venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ref-doi">DOI</Label>
              <Input id="ref-doi" value={doi} onChange={(e) => setDoi(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ref-url">URL</Label>
              <Input id="ref-url" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createReference.isPending || !title.trim()}>
              {createReference.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add reference"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
