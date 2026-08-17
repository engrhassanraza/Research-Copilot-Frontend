import { API_BASE_URL, ApiError, buildQuery } from "@/services/api";
import { consumeSSE } from "@/services/sse";
import { useAuthStore } from "@/stores/auth-store";
import type { ChatResponse, CitationStyle } from "@/types/api";

export interface ChatRequestBody {
  conversation_id?: string | null;
  message: string;
  citation_style?: CitationStyle;
}

export async function sendChat(projectId: string, body: ChatRequestBody): Promise<ChatResponse> {
  const token = useAuthStore.getState().token;
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/v1/chat${buildQuery({ project_id: projectId })}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, null, `Can't reach the server at ${API_BASE_URL} — check your connection or try again.`);
  }
  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new ApiError(res.status, detail, "Chat request failed");
  }
  return res.json() as Promise<ChatResponse>;
}

export type ChatStreamEvent =
  | { event: "conversation"; data: { conversation_id: string } }
  | { event: "node"; data: { node: string } }
  | { event: "final"; data: ChatResponse };

export interface StreamChatHandlers {
  onConversation?: (conversationId: string) => void;
  onNode?: (node: string) => void;
  onFinal?: (response: ChatResponse) => void;
  onError?: (error: Error) => void;
}

export async function streamChat(
  projectId: string,
  body: ChatRequestBody,
  handlers: StreamChatHandlers,
  signal?: AbortSignal
): Promise<void> {
  let receivedFinal = false;

  await consumeSSE(
    `/chat/stream${buildQuery({ project_id: projectId })}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
    {
      onEvent: (eventName, dataRaw) => {
        let parsed: unknown;
        try {
          parsed = JSON.parse(dataRaw);
        } catch {
          return;
        }
        if (eventName === "conversation") {
          handlers.onConversation?.((parsed as { conversation_id: string }).conversation_id);
        } else if (eventName === "node") {
          handlers.onNode?.((parsed as { node: string }).node);
        } else if (eventName === "final") {
          receivedFinal = true;
          handlers.onFinal?.(parsed as ChatResponse);
        }
      },
      onError: handlers.onError,
    },
    signal
  );

  // The HTTP response starts (200 + headers) before the graph runs, so a
  // failure mid-stream (e.g. Qdrant/Neo4j unreachable) closes the
  // connection cleanly from the server's side rather than surfacing as an
  // HTTP error — `reader.read()` just resolves `done: true` with no
  // exception. Without this check the caller sees a silently "successful"
  // stream that never produced an answer, leaving the UI stuck streaming.
  if (!receivedFinal) {
    const error = new Error("The connection closed before the assistant finished responding. Please try again.");
    handlers.onError?.(error);
    throw error;
  }
}
