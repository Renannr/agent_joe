import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import ThinkingBlock from "./components/ThinkingBlock";
import ToolCallBlock from "./components/toolCallBlock";
import TypingDots from "./components/typingDots";

export default function App() {
	const { messages, isLoading, sendMessage, stop } = useChat();
	const [input, setInput] = useState("");
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSend = () => {
		sendMessage(input);
		setInput("");
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="flex flex-col h-svh bg-zinc-950 text-zinc-100 font-mono">
			{/* Messages area */}
			<div className="flex-1 overflow-y-auto px-4 py-6">
				<div className="max-w-2xl mx-auto flex flex-col gap-4">
					{messages.length === 0 && (
						<p className="text-center text-zinc-600 text-sm mt-24 select-none">
							nenhuma mensagem ainda
						</p>
					)}

					{messages.map((msg) => (
						<div
							key={msg.id}
							className={cn(
								"flex flex-col max-w-[80%]",
								msg.role === "user"
									? "self-end items-end"
									: "self-start items-start",
							)}
						>
							{/* Thinking block (agent only) */}
							{msg.role === "agent" && msg.thinking && (
								<ThinkingBlock
									content={msg.thinking}
									isStreaming={msg.isStreaming}
								/>
							)}

							{/* Tool calls (agent only) */}
							{msg.role === "agent" && !!msg.toolCalls?.length && (
								<ToolCallBlock toolCalls={msg.toolCalls} />
							)}

							{/* Bubble */}
							<div
								className={cn(
									"rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
									msg.role === "user"
										? "bg-zinc-100 text-zinc-900 rounded-br-sm"
										: "bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-bl-sm",
								)}
							>
								{msg.role === "agent" && msg.isStreaming && !msg.content ? (
									<TypingDots />
								) : (
									msg.content
								)}
							</div>
						</div>
					))}

					<div ref={bottomRef} />
				</div>
			</div>

			{/* Input bar */}
			<div className="border-t border-zinc-800 bg-zinc-950 px-4 py-4">
				<div className="max-w-2xl mx-auto flex gap-2 items-end">
					<Textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Digite uma mensagem..."
						rows={1}
						className={cn(
							"resize-none bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-600",
							"font-mono text-sm rounded-xl focus-visible:ring-1 focus-visible:ring-zinc-500",
							"min-h-[42px] max-h-40 overflow-y-auto",
						)}
					/>
					{isLoading ? (
						<Button
							onClick={stop}
							size="icon"
							variant="outline"
							className="shrink-0 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl"
						>
							<Square size={16} />
						</Button>
					) : (
						<Button
							onClick={handleSend}
							disabled={!input.trim()}
							size="icon"
							className="shrink-0 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-xl"
						>
							<ArrowUp size={16} />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
