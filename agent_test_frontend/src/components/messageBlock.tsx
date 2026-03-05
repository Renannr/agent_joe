import ThinkingBlock from "./thinkingBlock";
import ToolCallBlock from "./toolCallBlock";
import TypingDots from "./typingDots";
import { type MessageBlock } from "@/hooks/useChat";

export default function MessageBlocks({
	blocks,
	isStreaming,
}: {
	blocks: MessageBlock[];
	isStreaming?: boolean;
}) {
	return (
		<div className="flex flex-col gap-1.5 items-start">
			{blocks.map((block, i) => {
				if (block.type === "thinking") {
					return (
						<ThinkingBlock
							key={i}
							content={block.content}
							isStreaming={isStreaming}
						/>
					);
				}

				if (block.type === "tool_call") {
					return (
						<ToolCallBlock
							key={i}
							toolCalls={[
								{ tool_name: block.tool_name, arguments: block.arguments },
							]}
						/>
					);
				}

				if (block.type === "response") {
					return (
						<div
							key={i}
							className="rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words bg-secondary text-foreground border border-border"
						>
							{block.content ||
								(isStreaming && i === blocks.length - 1 ? (
									<TypingDots />
								) : null)}
						</div>
					);
				}

				return null;
			})}

			{/* dots enquanto nenhum bloco ainda */}
			{isStreaming &&
				!blocks.some((b) => b.type === "response" && b.content) && (
					<div className="rounded-2xl rounded-bl-sm px-4 py-2.5 bg-secondary border border-border">
						<TypingDots />
					</div>
				)}
		</div>
	);
}
