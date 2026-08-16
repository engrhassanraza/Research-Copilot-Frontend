"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, BookOpenText, Check, Heading1, Heading2, Italic, List, ListOrdered, Loader2, Quote } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Citation } from "@/components/dashboard/manuscript/citation-node";
import { CitationPickerDialog } from "@/components/dashboard/manuscript/citation-picker-dialog";
import { useUpdateManuscript } from "@/hooks/use-manuscripts";
import type { Manuscript, TiptapDoc } from "@/types/api";

const AUTOSAVE_DELAY_MS = 1200;

export function ManuscriptEditor({ manuscript, projectId }: { manuscript: Manuscript; projectId: string }) {
  const updateManuscript = useUpdateManuscript(manuscript.id, projectId);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, Citation],
    content: manuscript.content_json,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setSaveState("idle");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setSaveState("saving");
        updateManuscript.mutate(
          { content_json: editor.getJSON() as TiptapDoc },
          {
            onSuccess: () => setSaveState("saved"),
            onError: () => setSaveState("idle"),
          }
        );
      }, AUTOSAVE_DELAY_MS);
    },
  });

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  if (!editor) return null;

  function insertCitation(referenceId: string, label: string) {
    editor?.chain().focus().insertCitation({ referenceId, label }).run();
    setPickerOpen(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="glass sticky top-4 z-10 flex flex-wrap items-center gap-1 rounded-2xl border-border/50 p-1.5">
        <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-border/60" />
        <ToolbarButton onClick={() => setPickerOpen(true)}>
          <BookOpenText className="h-4 w-4" />
          Cite
        </ToolbarButton>

        <div className="ml-auto flex items-center gap-1.5 px-2 text-xs text-muted-foreground">
          {saveState === "saving" && (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
            </>
          )}
          {saveState === "saved" && (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" /> Saved
            </>
          )}
        </div>
      </div>

      <EditorContent
        editor={editor}
        className={cn(
          "glass min-h-[60vh] rounded-3xl border-border/50 px-8 py-8 text-sm leading-relaxed",
          "[&_.ProseMirror]:min-h-[55vh] [&_.ProseMirror]:outline-none",
          "[&_.ProseMirror_h1]:mb-3 [&_.ProseMirror_h1]:mt-2 [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-semibold",
          "[&_.ProseMirror_h2]:mb-2 [&_.ProseMirror_h2]:mt-4 [&_.ProseMirror_h2]:text-lg [&_.ProseMirror_h2]:font-semibold",
          "[&_.ProseMirror_p]:my-3",
          "[&_.ProseMirror_ul]:my-3 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5",
          "[&_.ProseMirror_ol]:my-3 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5",
          "[&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:border-violet-500/40 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-muted-foreground",
          "[&_.citation-chip]:mx-0.5 [&_.citation-chip]:cursor-default [&_.citation-chip]:rounded-md [&_.citation-chip]:bg-primary/15 [&_.citation-chip]:px-1.5 [&_.citation-chip]:py-0.5 [&_.citation-chip]:text-xs [&_.citation-chip]:font-medium [&_.citation-chip]:text-violet-700",
          "dark:[&_.citation-chip]:text-violet-200"
        )}
      />

      <CitationPickerDialog projectId={projectId} open={pickerOpen} onOpenChange={setPickerOpen} onSelect={insertCitation} />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn("h-8 gap-1.5 px-2 text-xs", active && "bg-primary/15 text-violet-700 dark:text-violet-200")}
    >
      {children}
    </Button>
  );
}
