import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Moon, Square, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import MessageBlocks from "./components/messageBlock";

function useTheme() {
	const [dark, setDark] = useState(() => {
		return document.documentElement.classList.contains("dark");
	});

	const toggle = () => {
		const isDark = !dark;
		document.documentElement.classList.toggle("dark", isDark);
		setDark(isDark);
	};

	return { dark, toggle };
}

export default function App() {
	const { messages, isLoading, sendMessage, continueWithInput, stop } =
		useChat();
	const { dark, toggle } = useTheme();
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

	const handleUserInputCancel = (msgId: string, blockIndex: number) => {
		// Envia fields vazios — agno trata como cancelamento
		continueWithInput(msgId, blockIndex, {});
	};

	return (
		<div className="flex flex-col h-svh bg-background text-foreground font-mono">
			<div className="flex justify-end px-4 py-2 border-b border-border">
				<Button
					onClick={toggle}
					size="icon"
					variant="ghost"
					className="text-zinc-400 hover:text-foreground hover:bg-muted"
				>
					{dark ? <Sun size={16} /> : <Moon size={16} />}
				</Button>
			</div>

			{/* Messages area */}
			<div className="flex-1 overflow-y-auto px-4 py-6">
				<div className="max-w-3xl mx-auto flex flex-col gap-4">
					{messages.length === 0 && (
						<p className="text-center text-muted-foreground text-sm mt-24 select-none">
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
							{msg.role === "user" ? (
								<div className="rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words bg-primary text-primary-foreground">
									{msg.blocks[0]?.type === "response"
										? msg.blocks[0].content
										: ""}
								</div>
							) : (
								<MessageBlocks
									blocks={msg.blocks}
									isStreaming={msg.isStreaming}
									msgId={msg.id}
									onUserInputSubmit={continueWithInput}
									onUserInputCancel={handleUserInputCancel}
								/>
							)}
						</div>
					))}

					<div ref={bottomRef} />
				</div>
			</div>

			{/* Input bar */}
			<div className="border-t border-border bg-background px-4 py-4">
				<div className="max-w-2xl mx-auto flex gap-2 items-end">
					<Textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Digite uma mensagem..."
						rows={1}
						className={cn(
							"resize-none font-mono text-sm rounded-xl",
							"min-h-[42px] max-h-40 overflow-y-auto",
						)}
					/>
					{isLoading ? (
						<Button
							onClick={stop}
							size="icon"
							variant="outline"
							className="shrink-0 border-zinc-700 bg-zinc-900 hover:bg-muted text-zinc-300 rounded-xl"
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
