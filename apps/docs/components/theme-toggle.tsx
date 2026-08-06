"use client";

import { useEffect, useState } from "react";

import { DocsIcon } from "@/components/docs-icon";

export function ThemeToggle() {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		setIsDark(document.documentElement.classList.contains("dark"));
	}, []);

	function toggleTheme() {
		const nextIsDark = !document.documentElement.classList.contains("dark");
		document.documentElement.classList.toggle("dark", nextIsDark);
		setIsDark(nextIsDark);
	}

	return (
		<button
			className="theme-toggle"
			type="button"
			onClick={toggleTheme}
			aria-label={isDark ? "Use light theme" : "Use dark theme"}
		>
			<DocsIcon name={isDark ? "sun" : "moon-stars"} size="sm" strokeWidth={1.8} />
		</button>
	);
}
