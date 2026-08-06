import { defineIconSet, type IconSemantics } from "../index";

import { type LucideIconName, lucideIconNames } from "./names";

export type LucideIconCategory =
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

const curatedSemantics: Partial<Record<LucideIconName, IconSemantics<LucideIconCategory>>> = {
	"arrow-left": { aliases: ["back", "previous"], intents: ["navigate back"] },
	"arrow-right": { aliases: ["forward", "next"], intents: ["navigate forward"] },
	bell: { aliases: ["notification", "reminder"], intents: ["notify"] },
	calendar: { aliases: ["date", "schedule"], intents: ["schedule", "pick date"] },
	"chart-no-axes-column": {
		aliases: ["analytics", "bar chart", "metrics"],
		intents: ["visualize data"],
	},
	"circle-alert": { aliases: ["warning", "attention"], intents: ["warn", "alert"] },
	"circle-check": {
		aliases: ["complete", "completed", "done", "approved", "confirmed", "success"],
		intents: ["show success", "mark complete", "confirm"],
	},
	"circle-help": { aliases: ["question", "support"], intents: ["get help"] },
	info: { aliases: ["information", "details"], intents: ["show information"] },
	"circle-x": { aliases: ["failed", "error", "invalid"], intents: ["show error"] },
	"credit-card": { aliases: ["billing", "payment", "checkout"], intents: ["pay", "billing"] },
	download: { aliases: ["save", "export"], intents: ["download", "export"] },
	file: { aliases: ["document"], intents: ["show file"] },
	"file-text": { aliases: ["document", "report"], intents: ["show document"] },
	settings: { aliases: ["preferences", "configuration", "gear"], intents: ["configure"] },
	heart: { aliases: ["favorite", "like", "love"], intents: ["favorite"] },
	house: { aliases: ["home", "homepage"], intents: ["go home"] },
	loader: { aliases: ["loading", "progress", "busy"], intents: ["show loading"] },
	mail: { aliases: ["email", "message"], intents: ["send email"] },
	menu: { aliases: ["navigation", "hamburger"], intents: ["open menu"] },
	plus: { aliases: ["add", "create", "new"], intents: ["create", "add"] },
	search: { aliases: ["find", "lookup"], intents: ["search"] },
	trash: { aliases: ["delete", "remove"], intents: ["delete"] },
	upload: { aliases: ["import", "attach"], intents: ["upload", "import"] },
	user: { aliases: ["person", "account", "profile"], intents: ["show user"] },
	x: { aliases: ["close", "cancel", "dismiss"], intents: ["close", "dismiss"] },
};

const tokenAliases: Record<string, readonly string[]> = {
	alert: ["warning", "attention"],
	arrow: ["direction", "navigate"],
	check: ["confirm", "done", "success"],
	chevron: ["navigate", "expand"],
	clock: ["time", "history"],
	cog: ["settings", "configuration"],
	file: ["document"],
	folder: ["directory"],
	lock: ["security", "private"],
	message: ["chat", "communication"],
	pen: ["edit", "write"],
	phone: ["call", "contact"],
	settings: ["preferences", "configuration"],
	star: ["favorite", "rating"],
	trash: ["delete", "remove"],
	user: ["person", "account", "profile"],
	x: ["close", "cancel"],
};

const categoryTokens: Record<LucideIconCategory, readonly string[]> = {
	accessibility: ["accessibility", "audio-lines", "braille", "captions", "ear", "eye"],
	actions: ["check", "copy", "download", "edit", "pen", "plus", "save", "trash", "upload", "x"],
	alerts: ["alert", "bell", "circle-alert", "octagon-alert", "siren", "triangle-alert"],
	commerce: ["badge-dollar", "banknote", "cart", "credit-card", "receipt", "shopping", "wallet"],
	communication: ["at-sign", "mail", "message", "phone", "send"],
	development: ["binary", "braces", "bug", "code", "git", "github", "terminal"],
	devices: ["computer", "laptop", "monitor", "phone", "printer", "server", "tablet"],
	files: ["archive", "file", "folder", "paperclip"],
	maps: ["compass", "globe", "map", "navigation", "pin"],
	media: ["camera", "film", "image", "music", "pause", "play", "volume"],
	navigation: ["arrow", "chevron", "house", "menu", "move"],
	people: ["contact", "person", "user", "users"],
	status: ["check", "circle-check", "circle-x", "loader", "progress", "x"],
	time: ["alarm", "calendar", "clock", "hourglass", "timer"],
	weather: ["cloud", "droplet", "moon", "rain", "snow", "sun", "wind"],
};

export const lucideIconSet = defineIconSet<LucideIconName, LucideIconCategory>({
	id: "lucide",
	names: lucideIconNames,
	exampleName: "circle-check",
	description:
		"A Lucide icon selected by semantic intent. Provide label for meaningful icons; set decorative=true when assistive technology should ignore it.",
	semantics: curatedSemantics,
	tokenAliases,
	categoryTokens,
});
