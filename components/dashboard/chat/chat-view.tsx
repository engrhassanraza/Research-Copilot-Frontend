"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FileSearch, Network, ShieldCheck } from "lucide-react";

import { ConversationRail } from "@/components/dashboard/chat/conversation-rail";
import { EvidencePanel } from "@/components/dashboard/chat/evidence-panel";
import { MessageBubble } from "@/components/dashboard/chat/message-bubble";
import type { LocalMessage } from "@/components/dashboard/chat/types";
import { PromptComposer } from "@/components/dashboard/prompt-composer";
import { EmptyProjectState } from "@/components/dashboard/empty-project-state";
import { LogoBadge } from "@/components/brand/logo-badge";
import { useActiveProject } from "@/hooks/use-active-project";
import { useChatStream } from "@/hooks/use-chat";
import { useConversation } from "@/hooks/use-conversations";
import { useChatStore } from "@/stores/chat-store";
import * as conversationsApi from "@/services/conversations";
import type { Citation, EvidenceBlock } from "@/types/api";

const SUGGESTIONS = [
  { icon: FileSearch, label: "Summarize my uploaded papers" },
  { icon: Network, label: "Map relationships between these methods" },
  { icon: ShieldCheck, label: "What are the research gaps in this area?" },
];

let tempIdCounter = 0;
function tempId() {
  tempIdCounter += 1;
  return `temp-${Date.now()}-${tempIdCounter}`;
}

export function ChatView() {
  const { activeProjectId, isLoading: projectsLoading, projects } = useActiveProject();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState("");
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [activeEvidenceId, setActiveEvidenceId] = useState<string | null>(null);
  const [activeEvidenceConfidence, setActiveEvidenceConfidence] = useState<number | null>(null);
  const seededFor = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const citationStyle = useChatStore((s) => s.citationStyle);
  const isStreaming = useChatStore((s) => s.isStreaming);
  const livePipeline = useChatStore((s) => s.pipeline);

  const { data: conversationDetail } = useConversation(conversationId, activeProjectId);

  useEffect(() => {
    if (!conversationDetail || !conversationId) return;
    if (seededFor.current === conversationId) return;
    seededFor.current = conversationId;
    setMessages(
      conversationDetail.messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        streaming: false,
        createdAt: Date.now(),
      }))
    );
  }, [conversationDetail, conversationId]);

  const { sendMessage, stop } = useChatStream(async (response, resolvedConversationId) => {
    let assistantMessageId = tempId();
    try {
      if (activeProjectId) {
        const detail = await conversationsApi.getConversation(resolvedConversationId, activeProjectId);
        const lastAssistant = [...detail.messages].reverse().find((m) => m.role === "assistant");
        if (lastAssistant) assistantMessageId = lastAssistant.id;
      }
    } catch {
      // fall back to the temp id — export will ask the user to retry
    }

    const finishedPipeline = useChatStore.getState().pipeline;

    setMessages((prev) => {
      const next = [...prev];
      const idx = next.findIndex((m) => m.streaming);
      const finalized: LocalMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: response.answer,
        citations: response.citations,
        evidence: response.evidence,
        sources: response.sources,
        verification: response.verification,
        pipeline: finishedPipeline,
        streaming: false,
        createdAt: Date.now(),
      };
      if (idx !== -1) next[idx] = finalized;
      else next.push(finalized);
      return next;
    });

    setConversationId(resolvedConversationId);
    seededFor.current = resolvedConversationId;
    queryClient.invalidateQueries({ queryKey: ["conversations", activeProjectId] });
  }, (errorMessage) => {
    // The toast already surfaced this — finalize the stuck placeholder
    // bubble so it doesn't sit frozen mid-"streaming" forever.
    setMessages((prev) => {
      const next = [...prev];
      const idx = next.findIndex((m) => m.streaming);
      if (idx === -1) return prev;
      next[idx] = {
        ...next[idx],
        streaming: false,
        content: next[idx].content || `_Something went wrong: ${errorMessage}_`,
        pipeline: useChatStore.getState().pipeline,
      };
      return next;
    });
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, livePipeline]);

  function handleSend(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!activeProjectId || !text || isStreaming) return;

    const userMessage: LocalMessage = { id: tempId(), role: "user", content: text, streaming: false, createdAt: Date.now() };
    const assistantPlaceholder: LocalMessage = {
      id: tempId(),
      role: "assistant",
      content: "",
      streaming: true,
      pipeline: [],
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
    setInput("");
    sendMessage({ projectId: activeProjectId, conversationId, message: text, citationStyle });
  }

  function handleStop() {
    stop();
    setMessages((prev) => {
      const next = [...prev];
      const idx = next.findIndex((m) => m.streaming);
      if (idx !== -1) {
        next[idx] = {
          ...next[idx],
          streaming: false,
          content: next[idx].content || "_Generation stopped._",
          pipeline: useChatStore.getState().pipeline,
        };
      }
      return next;
    });
  }

  function handleNewChat() {
    setConversationId(null);
    setMessages([]);
    seededFor.current = null;
  }

  function handleSelectConversation(id: string) {
    if (id === conversationId) return;
    setConversationId(id);
    setMessages([]);
    seededFor.current = null;
  }

  function handleCiteClick(citation: Citation, evidence?: EvidenceBlock[]) {
    setActiveEvidenceId(citation.evidence_id);
    setActiveEvidenceConfidence(evidence?.find((e) => e.evidence_id === citation.evidence_id)?.confidence ?? null);
    setEvidenceOpen(true);
  }

  if (projectsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LogoBadge className="h-10 w-10 animate-pulse-glow" />
      </div>
    );
  }

  if (projects.length === 0 || !activeProjectId) {
    return <EmptyProjectState description="Ask questions, get cited answers, and watch the agent pipeline work — once you've created a project." />;
  }

  const displayMessages = messages.map((m) => (m.streaming ? { ...m, pipeline: livePipeline } : m));

  return (
    <div className="flex h-full">
      <ConversationRail
        projectId={activeProjectId}
        activeConversationId={conversationId}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {displayMessages.length === 0 ? (
          <div className="relative flex h-full flex-col items-center justify-center px-6 py-16">
            <div
              aria-hidden
              className="glow-orb pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl animate-pulse-glow"
            />
            <div className="relative flex flex-col items-center text-center">
              <div className="glow-orb h-24 w-24 rounded-full shadow-2xl shadow-violet-950/50 animate-float" />
              <h1 className="mt-8 text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to start your research?
              </h1>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Upload a paper, ask a question, or pick up a conversation — every answer comes
                with citations you can check and a live look at the agents behind it.
              </p>
            </div>

            <div className="relative mt-10 w-full max-w-2xl">
              <PromptComposer value={input} onChange={setInput} onSend={() => handleSend()} isStreaming={isStreaming} />
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion.label}
                    onClick={() => handleSend(suggestion.label)}
                    className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
                  >
                    <suggestion.icon className="h-3.5 w-3.5" />
                    {suggestion.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="mx-auto flex max-w-3xl flex-col gap-5 px-6 py-8">
                {displayMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    projectId={activeProjectId}
                    onCiteClick={handleCiteClick}
                  />
                ))}
                <div ref={bottomRef} />
              </div>
            </div>
            <div className="border-t border-border/60 bg-background/60 px-6 py-4 backdrop-blur-xl">
              <div className="mx-auto max-w-3xl">
                <PromptComposer
                  value={input}
                  onChange={setInput}
                  onSend={() => handleSend()}
                  onStop={handleStop}
                  isStreaming={isStreaming}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <EvidencePanel
        evidenceId={activeEvidenceId}
        projectId={activeProjectId}
        confidence={activeEvidenceConfidence}
        open={evidenceOpen}
        onOpenChange={setEvidenceOpen}
      />
    </div>
  );
}
