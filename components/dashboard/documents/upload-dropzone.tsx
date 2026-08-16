"use client";

import { useRef, useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { MAX_UPLOAD_BYTES } from "@/services/documents";
import { useUploadDocument } from "@/hooks/use-documents";
import { authErrorMessage } from "@/hooks/use-auth";
import type { JobRef } from "@/types/api";

export function UploadDropzone({
  projectId,
  onUploaded,
}: {
  projectId: string;
  onUploaded: (job: JobRef, filename: string) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadDocument(projectId);

  function validate(file: File): string | null {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return "Only PDF files are supported.";
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return "File is larger than the 50MB limit.";
    }
    return null;
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const error = validate(file);
      if (error) {
        toast.error(file.name, { description: error });
        return;
      }
      upload.mutate(file, {
        onSuccess: (job) => {
          toast.success("Upload started", { description: `${file.name} is processing…` });
          onUploaded(job, file.name);
        },
        onError: (err) => {
          toast.error(`Couldn't upload ${file.name}`, { description: authErrorMessage(err, "Upload failed.") });
        },
      });
    });
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "glass flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-10 text-center transition-colors",
        isDragging ? "border-violet-500 bg-primary/10" : "border-border/60 hover:border-violet-500/50"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-violet-600 dark:text-violet-300">
        {upload.isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-6 w-6" />}
      </div>
      <div>
        <p className="text-sm font-medium">Drop PDFs here or click to browse</p>
        <p className="mt-1 text-xs text-muted-foreground">PDF only · up to 50MB · 500 pages</p>
      </div>
    </div>
  );
}
