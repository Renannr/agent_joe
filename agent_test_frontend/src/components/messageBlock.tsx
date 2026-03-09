import ThinkingBlock from "./thinkingBlock";
import ToolCallBlock from "./toolCallBlock";
import UserInputBlock from "./userInputBlock";
import TypingDots from "./typingDots";
import { type MessageBlock } from "@/hooks/useChat";

export default function MessageBlocks({
	blocks,
	isStreaming,
	msgId,
	onUserInputSubmit,
	onUserInputCancel,
}: {
	blocks: MessageBlock[];
	isStreaming?: boolean;
	msgId: string;
	onUserInputSubmit: (
		msgId: string,
		blockIndex: number,
		fieldValues: Record<string, string>,
	) => void;
	onUserInputCancel: (msgId: string, blockIndex: number) => void;
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

				if (block.type === "tool_call_group") {
					return <ToolCallBlock key={i} toolCalls={block.tools} />;
				}

				if (block.type === "user_input") {
					return (
						<UserInputBlock
							key={i}
							fields={block.fields}
							answered={block.answered}
							onSubmit={(fieldValues) =>
								onUserInputSubmit(msgId, i, fieldValues)
							}
							onCancel={() => onUserInputCancel(msgId, i)}
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

			{isStreaming &&
				!blocks.some((b) => b.type === "response" && b.content) && (
					<div className="rounded-2xl rounded-bl-sm px-4 py-2.5 bg-secondary border border-border">
						<TypingDots />
					</div>
				)}
		</div>
	);
}
