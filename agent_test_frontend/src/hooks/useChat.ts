import { useState, useCallback, useRef } from "react";

export type MessageRole = "user" | "agent";

export interface ToolCall {
  tool_name: string;
  arguments?: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  thinking?: string;
  toolCalls?: ToolCall[];
  isStreaming?: boolean;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const sessionId = useRef<string>(crypto.randomUUID());

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
    };

    const agentMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "agent",
      content: "",
      thinking: "",
      toolCalls: [],
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, agentMsg]);
    setIsLoading(true);

    abortRef.current = new AbortController();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), session_id: sessionId.current }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));

            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id !== agentMsg.id) return msg;

                if (data.type === "thinking") {
                  return {
                    ...msg,
                    thinking: (msg.thinking ?? "") + (data.content ?? ""),
                  };
                }

                if (data.type === "response") {
                  return {
                    ...msg,
                    content: msg.content + (data.content ?? ""),
                  };
                }

                if (data.type === "tool_call") {
                  return {
                    ...msg,
                    toolCalls: [
                      ...(msg.toolCalls ?? []),
                      {
                        tool_name: data.tool_name,
                        arguments: data.arguments,
                      },
                    ],
                  };
                }

                return msg;
              })
            );
          } catch {
            // malformed JSON chunk, skip
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentMsg.id
            ? { ...msg, content: "Erro ao conectar com o servidor.", isStreaming: false }
            : msg
        )
      );
    } finally {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentMsg.id ? { ...msg, isStreaming: false } : msg
        )
      );
      setIsLoading(false);
    }
  }, [isLoading]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { messages, isLoading, sendMessage, stop };
}