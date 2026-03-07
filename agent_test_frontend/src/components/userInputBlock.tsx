import { useState } from "react";
import { ArrowUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type UserInputField } from "@/hooks/useChat";

export default function UserInputBlock({
	fields,
	answered,
	onSubmit,
	onCancel,
}: {
	fields: UserInputField[];
	answered: boolean;
	onSubmit: (fieldValues: Record<string, string>) => void;
	onCancel: () => void;
}) {
	const [values, setValues] = useState<Record<string, string>>(() =>
		Object.fromEntries(fields.map((f) => [f.field_name, ""])),
	);

	const handleSubmit = () => {
		const filled = Object.fromEntries(
			Object.entries(values).filter(([, v]) => v.trim()),
		);
		if (!Object.keys(filled).length) return;
		onSubmit(values);
	};

	const handleCancel = () => {
		// Envia todos os fields vazios — agno trata como cancelamento
		const empty = Object.fromEntries(fields.map((f) => [f.field_name, ""]));
		onCancel();
		onSubmit(empty);
	};

	if (answered) {
		return (
			<div className="text-xs text-muted-foreground font-mono border-l border-border pl-2 py-0.5">
				resposta enviada
			</div>
		);
	}

	return (
		<div className="rounded-2xl rounded-bl-sm border border-border bg-secondary px-4 py-3 flex flex-col gap-3 w-full max-w-sm">
			{fields.map((field) => (
				<div key={field.field_name} className="flex flex-col gap-1">
					<label className="text-xs text-muted-foreground font-mono leading-snug">
						{field.field_description}
					</label>
					{field.field_type === "bool" ? (
						<div className="flex gap-2">
							{["sim", "não"].map((option) => {
								const val = option === "sim" ? "true" : "false";
								const selected = values[field.field_name] === val;
								return (
									<button
										key={option}
										onClick={() =>
											setValues((prev) => ({
												...prev,
												[field.field_name]: val,
											}))
										}
										className={cn(
											"flex-1 text-xs font-mono px-3 py-1.5 rounded-lg border transition-colors",
											selected
												? "bg-foreground text-background border-foreground"
												: "bg-background text-muted-foreground border-border hover:text-foreground hover:border-foreground",
										)}
									>
										{option}
									</button>
								);
							})}
						</div>
					) : (
						<textarea
							value={values[field.field_name]}
							onChange={(e) =>
								setValues((prev) => ({
									...prev,
									[field.field_name]: e.target.value,
								}))
							}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									handleSubmit();
								}
							}}
							rows={1}
							className="resize-none bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-border min-h-[34px] max-h-24 overflow-y-auto"
						/>
					)}
				</div>
			))}

			<div className="flex items-center justify-between">
				<button
					onClick={handleCancel}
					className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
				>
					<X size={12} />
					cancelar
				</button>

				<button
					onClick={handleSubmit}
					disabled={!fields.some((f) => values[f.field_name]?.trim())}
					className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
				>
					<ArrowUp size={12} />
					enviar
				</button>
			</div>
		</div>
	);
}
