import { API_BASE_URL, ApiError, buildQuery } from "@/services/api";
import { useAuthStore } from "@/stores/auth-store";
import type { ChatResponse, CitationStyle } from "@/types/api";

export interface ChatRequestBody {
  conversation_id?: string | null;
  message: string;
  citation_style?: CitationStyle;
}

export function sendChat(projectId: string, body: ChatRequestBody) {
  const token = useAuthStore.getState().token;
  return fetch(`${API_BASE_URL}/api/v1/chat${buildQuery({ project_id: projectId })}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  }).then(async (res) => {
    if (!res.ok) {
      const detail = await res.json().catch(() => null);
      throw new ApiError(res.status, detail, "Chat request failed");
    }
    return res.json() as Promise<ChatResponse>;
  });
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

/**
 * SSE-over-POST: EventSource can't send a POST body, so this parses the
 * `text/event-stream` response of `POST /chat/stream` by hand — buffering
 * decoded chunks and splitting on blank-line-delimited event blocks.
 */
export async function streamChat(
  projectId: string,
  body: ChatRequestBody,
  handlers: StreamChatHandlers,
  signal?: AbortSignal
): Promise<void> {
  const token = useAuthStore.getState().token;

  const response = await fetch(`${API_BASE_URL}/api/v1/chat/stream${buildQuery({ project_id: projectId })}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok || !response.body) {
    const detail = await response.json().catch(() => null);
    throw new ApiError(response.status, detail, "Chat stream failed to start");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const dispatch = (eventName: string, dataRaw: string) => {
    if (!dataRaw) return;
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
      handlers.onFinal?.(parsed as ChatResponse);
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const rawEvent = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);

        let eventName = "message";
        const dataLines: string[] = [];
        for (const line of rawEvent.split("\n")) {
          if (line.startsWith("event:")) {
            eventName = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            dataLines.push(line.slice(5).trim());
          }
        }
        dispatch(eventName, dataLines.join("\n"));
        boundary = buffer.indexOf("\n\n");
      }
    }
  } catch (error) {
    if ((error as Error).name !== "AbortError") {
      handlers.onError?.(error as Error);
    }
    throw error;
  }
}
