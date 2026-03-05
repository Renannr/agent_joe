import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ThinkingBlock({
	content,
	isStreaming,
}: {
	content: string;
	isStreaming?: boolean;
}) {
	const [open, setOpen] = useState(false);
	if (!content) return null;
	return (
		<div className="mb-1.5">
			<button
				onClick={() => setOpen((o) => !o)}
				className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
			>
				{open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
				{isStreaming ? "pensando..." : "pensamento"}
			</button>
			{open && (
				<p className="mt-1 text-xs text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap border-l border-border pl-2">
					{content}
				</p>
			)}
		</div>
	);
}
