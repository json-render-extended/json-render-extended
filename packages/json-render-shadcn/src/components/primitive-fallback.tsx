import type { ReactNode } from "react";

export function PrimitiveFallback({
	children,
	className,
	name,
}: {
	children?: ReactNode;
	className?: string | null;
	name: string;
}) {
	return (
		<div className={className ?? undefined} data-shadcn-fallback={name}>
			{children}
		</div>
	);
}
