import { API_BASE_URL, ApiError } from "@/services/api";
import { useAuthStore } from "@/stores/auth-store";

export interface SSEHandlers {
  onEvent?: (eventName: string, data: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Hand-rolled SSE parser over `fetch` — not the browser's `EventSource`,
 * which can't send a POST body or a custom `Authorization` header, both of
 * which this API's streaming endpoints require. Shared by chat streaming
 * (`services/chat.ts`) and the figure-diagram render-verify stream
 * (`components/dashboard/figures/figure-diagram-stream.tsx`).
 */
export async function consumeSSE(path: string, init: RequestInit, handlers: SSEHandlers, signal?: AbortSignal): Promise<void> {
  const token = useAuthStore.getState().token;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1${path}`, {
      ...init,
      headers: {
        Accept: "text/event-stream",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
      signal,
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new ApiError(0, null, `Can't reach the server at ${API_BASE_URL} — check your connection or try again.`);
  }

  if (!response.ok || !response.body) {
    const detail = await response.json().catch(() => null);
    throw new ApiError(response.status, detail, "Stream failed to start");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

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
        const data = dataLines.join("\n");
        if (data) handlers.onEvent?.(eventName, data);
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
