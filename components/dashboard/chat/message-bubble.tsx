"use client";

import { useState } from "react";
import { Download, FileDown, FileType2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AgentPipeline } from "@/components/dashboard/chat/agent-pipeline";
import { CitationMarkdown } from "@/components/dashboard/chat/citation-markdown";
import { SourceList } from "@/components/dashboard/chat/source-list";
import type { LocalMessage } from "@/components/dashboard/chat/types";
import { useCreateExport } from "@/hooks/use-exports";
import { useChatStore } from "@/stores/chat-store";
import { authErrorMessage } from "@/hooks/use-auth";
import type { Citation } from "@/types/api";
import { cn } from "@/lib/utils";

export function MessageBubble({
  message,
  projectId,
  onCiteClick,
}: {
  message: LocalMessage;
  projectId: string;
  onCiteClick: (citation: Citation) => void;
}) {
  const isUser = message.role === "user";
  const citationStyle = useChatStore((s) => s.citationStyle);
  const exportMutation = useCreateExport(projectId);
  const [exportingFormat, setExportingFormat] = useState<"docx" | "pdf" | null>(null);

  function handleExport(format: "docx" | "pdf") {
    if (message.id.startsWith("temp-")) {
      toast.error("Hang on", { description: "Still finalizing this answer — try again in a moment." });
      return;
    }
    setExportingFormat(format);
    exportMutation.mutate(
      { message_id: message.id, format, style: citationStyle },
      {
        onSuccess: (result) => {
          window.open(result.download_url, "_blank");
          toast.success(`Exported as ${format.toUpperCase()}`);
        },
        onError: (error) => {
          toast.error("Export failed", { description: authErrorMessage(error, "Something went wrong.") });
        },
        onSettled: () => setExportingFormat(null),
      }
    );
  }

  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-3">
        <div className="max-w-[75%] rounded-3xl rounded-tr-md bg-gradient-to-br from-violet-600 to-fuchsia-600 px-4 py-3 text-sm text-white shadow-lg shadow-violet-950/30">
          {message.content}
        </div>
        <Avatar className="mt-0.5 h-8 w-8 shrink-0">
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  const showPipeline = (message.pipeline?.length ?? 0) > 0;

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-950/30">
        <span className="text-xs font-semibold text-white">AI</span>
      </div>
      <div className="min-w-0 max-w-[85%] flex-1 space-y-2">
        {showPipeline && (
          <AgentPipeline pipeline={message.pipeline!} isStreaming={!!message.streaming} compact />
        )}

        {(message.content || !message.streaming) && (
          <div
            className={cn(
              "glass rounded-3xl rounded-tl-md border-border/50 px-4 py-3 text-sm",
              message.streaming && "border-violet-500/30"
            )}
          >
            <CitationMarkdown content={message.content} citations={message.citations} onCiteClick={onCiteClick} />
            {message.streaming && (
              <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-violet-500 align-middle" />
            )}

            {!message.streaming && message.sources && message.sources.length > 0 && (
              <SourceList sources={message.sources} projectId={projectId} />
            )}
          </div>
        )}

        {!message.streaming && message.content && (
          <div className="flex items-center gap-1 px-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs text-muted-foreground">
                  {exportingFormat ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => handleExport("docx")}>
                  <FileType2 className="h-4 w-4" />
                  Export as DOCX
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <FileDown className="h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
