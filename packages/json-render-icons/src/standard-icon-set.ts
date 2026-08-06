import { defineIconSet, type IconSemantics } from "./index";

export type StandardIconCategory =
	| "accessibility"
	| "actions"
	| "alerts"
	| "commerce"
	| "communication"
	| "development"
	| "devices"
	| "files"
	| "maps"
	| "media"
	| "navigation"
	| "people"
	| "status"
	| "time"
	| "weather";

const tokenAliases: Record<string, readonly string[]> = {
	alert: ["warning", "attention"],
	arrow: ["direction", "navigate"],
	check: ["confirm", "done", "success"],
	checkmark: ["confirm", "done", "success"],
	chevron: ["navigate", "expand"],
	clock: ["time", "history"],
	cog: ["settings", "configuration"],
	delete: ["trash", "remove"],
	file: ["document"],
	folder: ["directory"],
	gear: ["settings", "configuration"],
	lock: ["security", "private"],
	mail: ["email", "message"],
	message: ["chat", "communication"],
	notification: ["bell", "reminder"],
	pen: ["edit", "write"],
	phone: ["call", "contact"],
	settings: ["preferences", "configuration"],
	star: ["favorite", "rating"],
	trash: ["delete", "remove"],
	user: ["person", "account", "profile"],
	x: ["close", "cancel"],
};

const categoryTokens: Record<StandardIconCategory, readonly string[]> = {
	accessibility: ["accessibility", "audio", "braille", "caption", "ear", "eye", "wheelchair"],
	actions: [
		"add",
		"check",
		"copy",
		"delete",
		"download",
		"edit",
		"pen",
		"plus",
		"save",
		"trash",
		"upload",
		"x",
	],
	alerts: ["alert", "bell", "error", "exclamation", "notification", "siren", "warning"],
	commerce: ["banknote", "basket", "card", "cart", "receipt", "shopping", "wallet"],
	communication: ["at", "chat", "mail", "message", "notification", "phone", "send"],
	development: ["binary", "braces", "bug", "code", "git", "github", "terminal"],
	devices: ["computer", "device", "laptop", "monitor", "phone", "printer", "server", "tablet"],
	files: ["archive", "file", "folder", "paperclip"],
	maps: ["compass", "globe", "location", "map", "navigation", "pin"],
	media: ["camera", "film", "image", "music", "pause", "photo", "play", "volume"],
	navigation: ["arrow", "chevron", "home", "house", "menu", "move"],
	people: ["contact", "person", "user", "users"],
	status: ["check", "checkmark", "error", "loader", "loading", "progress", "spinner", "x"],
	time: ["alarm", "calendar", "clock", "hourglass", "time", "timer"],
	weather: ["cloud", "droplet", "moon", "rain", "snow", "sun", "wind"],
};

export function defineStandardIconSet<Name extends string>(options: {
	id: string;
	label?: string;
	names: readonly Name[];
	exampleName: Name;
	semantics?: Partial<Record<Name, IconSemantics<StandardIconCategory>>>;
}) {
	const { label, ...iconSetOptions } = options;
	return defineIconSet<Name, StandardIconCategory>({
		...iconSetOptions,
		description: `A ${label ?? options.id} icon selected by semantic intent. Provide label for meaningful icons; set decorative=true when assistive technology should ignore it.`,
		tokenAliases,
		categoryTokens,
	});
}
