export type PlaygroundLinkPosition =
	| "inline"
	| "bottom-left"
	| "bottom-right"
	| "top-left"
	| "top-right";

export function buildPlaygroundSpecUrl(href: string, spec: string) {
	const url = new URL(href);
	url.searchParams.set("spec", spec);
	return url.toString();
}

export function playgroundLinkStyle(position: PlaygroundLinkPosition) {
	if (position === "inline") return {};
	const [vertical, horizontal] = position.split("-") as ["bottom" | "top", "left" | "right"];
	return {
		position: "fixed" as const,
		[vertical]: "1rem",
		[horizontal]: "1rem",
		zIndex: 2147483647,
	};
}
