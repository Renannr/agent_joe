import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid"

export type MessageRole = "user" | "agent";

export interface ToolCall {
  tool_name: string;
  arguments?: Record<string, unknown>;
}

export type MessageBlock =
  | { type: "thinking"; content: string }
  | { type: "response"; content: string }
  | { type: "tool_call"; tool_name: string; arguments?: Record<string, unknown> };

export interface ChatMessage {
  id: string;
  role: MessageRole;
  blocks: MessageBlock[];
  isStreaming?: boolean;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const sessionId = useRef<string>(uuidv4());

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: "user",
      blocks: [{ type: "response", content: text.trim() }],
    };

    const agentMsgId = uuidv4();
    const agentMsg: ChatMessage = {
      id: agentMsgId,
      role: "agent",
      blocks: [],
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, agentMsg]);
    setIsLoading(true);
    abortRef.current = new AbortController();

    try {
      const baseUrl = import.meta.env.VITE_API_URL ?? "";
      const response = await fetch(`${baseUrl}/api/chat`, {
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
                if (msg.id !== agentMsgId) return msg;

                const blocks = [...msg.blocks];
                const last = blocks[blocks.length - 1];

                if (data.type === "thinking") {
                  if (last?.type === "thinking") {
                    blocks[blocks.length - 1] = {
                      ...last,
                      content: last.content + (data.content ?? ""),
                    };
                  } else {
                    blocks.push({ type: "thinking", content: data.content ?? "" });
                  }
                }

                if (data.type === "response") {
                  if (last?.type === "response") {
                    blocks[blocks.length - 1] = {
                      ...last,
                      content: last.content + (data.content ?? ""),
                    };
                  } else {
                    blocks.push({ type: "response", content: data.content ?? "" });
                  }
                }

                if (data.type === "tool_call") {
                  blocks.push({
                    type: "tool_call",
                    tool_name: data.tool_name,
                    arguments: data.arguments,
                  });
                }

                return { ...msg, blocks };
              })
            );
          } catch {
            // malformed chunk, skip
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentMsgId
            ? {
              ...msg,
              blocks: [{ type: "response", content: "Erro ao conectar com o servidor." }],
              isStreaming: false,
            }
            : msg
        )
      );
    } finally {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentMsgId ? { ...msg, isStreaming: false } : msg
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