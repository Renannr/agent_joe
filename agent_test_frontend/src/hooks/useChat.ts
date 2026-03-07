import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export type MessageRole = "user" | "agent";

export interface ToolCall {
  tool_name: string;
  arguments?: Record<string, unknown>;
}

export interface UserInputField {
  field_name: string;
  field_description: string;
  field_type: string;
}

export type MessageBlock =
  | { type: "thinking"; content: string }
  | { type: "response"; content: string }
  | { type: "tool_call"; tool_name: string; arguments?: Record<string, unknown> }
  | { type: "user_input"; fields: UserInputField[]; answered: boolean };

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

  const processStream = useCallback(async (
    response: Response,
    agentMsgId: string,
  ) => {
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

              if (data.type === "user_input") {
                blocks.push({
                  type: "user_input",
                  fields: data.fields ?? [],
                  answered: false,
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
  }, []);

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
      await processStream(response, agentMsgId);

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
  }, [isLoading, processStream]);

  const continueWithInput = useCallback(async (
    msgId: string,
    blockIndex: number,
    fieldValues: Record<string, string>,
  ) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId) return msg;
        const blocks = [...msg.blocks];
        const block = blocks[blockIndex];
        if (block?.type === "user_input") {
          blocks[blockIndex] = { ...block, answered: true };
        }
        return { ...msg, blocks };
      })
    );

    const agentMsgId = uuidv4();
    const agentMsg: ChatMessage = {
      id: agentMsgId,
      role: "agent",
      blocks: [],
      isStreaming: true,
    };

    setMessages((prev) => [...prev, agentMsg]);
    setIsLoading(true);
    abortRef.current = new AbortController();

    try {
      const baseUrl = import.meta.env.VITE_API_URL ?? "";
      const response = await fetch(`${baseUrl}/api/chat/continue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId.current,
          field_values: fieldValues,
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await processStream(response, agentMsgId);

    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentMsgId
            ? {
              ...msg,
              blocks: [{ type: "response", content: "Erro ao continuar." }],
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
  }, [isLoading, processStream]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { messages, isLoading, sendMessage, continueWithInput, stop };
}