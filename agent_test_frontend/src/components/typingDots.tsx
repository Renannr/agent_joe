export default function TypingDots() {
	return (
		<span className="flex items-center gap-1 h-4">
			{[0, 1, 2].map((i) => (
				<span
					key={i}
					className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce"
					style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
				/>
			))}
		</span>
	);
}
