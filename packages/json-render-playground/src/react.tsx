"use client";

import type { CSSProperties } from "react";

import {
	buildPlaygroundSpecUrl,
	type PlaygroundLinkPosition,
	playgroundLinkStyle,
} from "./dev-link";

export interface JsonRenderPlaygroundLinkProps {
	href?: string;
	spec: string;
	position?: PlaygroundLinkPosition;
	label?: string;
}

const linkStyle: CSSProperties = {
	display: "inline-flex",
	alignItems: "center",
	gap: ".5rem",
	border: "1px solid #333",
	borderRadius: "999px",
	padding: ".55rem .8rem",
	background: "#090909",
	color: "#fff",
	font: "600 12px/1 ui-sans-serif, system-ui, sans-serif",
	textDecoration: "none",
	boxShadow: "0 8px 30px rgba(0,0,0,.25)",
};

export function JsonRenderPlaygroundLink({
	href,
	spec,
	position = "bottom-right",
	label = "Open JSON Render spec",
}: JsonRenderPlaygroundLinkProps) {
	if (process.env.NODE_ENV !== "development" || !href) return null;
	return (
		<a
			href={buildPlaygroundSpecUrl(href, spec)}
			rel="noreferrer"
			style={{ ...linkStyle, ...playgroundLinkStyle(position) }}
			target="_blank"
		>
			<span aria-hidden>JR</span>
			{label}
		</a>
	);
}
