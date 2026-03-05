import { ChevronDown, ChevronUp, Wrench } from "lucide-react";
import { useState } from "react";
import { type ToolCall } from "@/hooks/useChat";

export default function ToolCallBlock({
	toolCalls,
}: {
	toolCalls: ToolCall[];
}) {
	const [open, setOpen] = useState(false);
	if (!toolCalls.length) return null;
	return (
		<div className="mb-1.5">
			<button
				onClick={() => setOpen((o) => !o)}
				className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono"
			>
				{open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
				<Wrench size={12} />
				{toolCalls.length} tool{toolCalls.length > 1 ? "s" : ""} usada
				{toolCalls.length > 1 ? "s" : ""}
			</button>
			{open && (
				<div className="mt-1 flex flex-col gap-1 border-l border-zinc-700 pl-2">
					{toolCalls.map((tc, i) => (
						<div key={i} className="text-xs font-mono text-zinc-500">
							<span className="text-zinc-400">{tc.tool_name}</span>
							{tc.arguments && (
								<pre className="mt-0.5 text-zinc-600 whitespace-pre-wrap break-all">
									{JSON.stringify(tc.arguments, null, 2)}
								</pre>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
