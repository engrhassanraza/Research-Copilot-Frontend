"use client";

import { MessageSquarePlus, MessagesSquare } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversations } from "@/hooks/use-conversations";

export function ConversationRail({
  projectId,
  activeConversationId,
  onSelect,
  onNewChat,
}: {
  projectId: string;
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}) {
  const { data: conversations, isLoading } = useConversations(projectId);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-card/20 lg:flex">
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-xl border border-border/60 bg-secondary/40 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/70"
        >
          <MessageSquarePlus className="h-4 w-4 text-violet-500" />
          New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3 scrollbar-thin">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="mx-1 mb-1.5 h-9" />)}

        {!isLoading && (conversations?.length ?? 0) === 0 && (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <MessagesSquare className="h-6 w-6 text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground">No conversations yet. Ask your first question.</p>
          </div>
        )}

        <div className="flex flex-col gap-0.5">
          {conversations?.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={cn(
                "truncate rounded-xl px-3 py-2 text-left text-sm transition-colors",
                conversation.id === activeConversationId
                  ? "bg-primary/15 text-violet-700 dark:text-violet-200"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              {conversation.title || "Untitled conversation"}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
