import type { IconSemantics } from "../metadata";
import { defineStandardIconSet, type StandardIconCategory } from "../standard-icon-set";

import { type PhosphorIconName, phosphorIconNames } from "./names";

const curatedSemantics: Partial<Record<PhosphorIconName, IconSemantics<StandardIconCategory>>> = {
	"arrow-left": { aliases: ["back", "previous"], intents: ["navigate back"] },
	"arrow-right": { aliases: ["forward", "next"], intents: ["navigate forward"] },
	"check-circle": {
		aliases: ["complete", "completed", "done", "approved", "confirmed", "success"],
		intents: ["show success", "mark complete", "confirm"],
	},
	"credit-card": { aliases: ["billing", "payment", "checkout"], intents: ["pay", "billing"] },
	gear: { aliases: ["preferences", "configuration", "settings"], intents: ["configure"] },
	house: { aliases: ["home", "homepage"], intents: ["go home"] },
	info: { aliases: ["information", "details"], intents: ["show information"] },
	"magnifying-glass": { aliases: ["search", "find", "lookup"], intents: ["search"] },
	question: { aliases: ["help", "support"], intents: ["get help"] },
	spinner: { aliases: ["loading", "progress", "busy"], intents: ["show loading"] },
	"warning-circle": { aliases: ["warning", "attention"], intents: ["warn", "alert"] },
	"x-circle": { aliases: ["failed", "error", "invalid"], intents: ["show error"] },
};

export const phosphorIconSet = defineStandardIconSet({
	id: "phosphor",
	label: "Phosphor",
	names: phosphorIconNames,
	exampleName: "check-circle",
	semantics: curatedSemantics,
});

export type PhosphorIconCategory = StandardIconCategory;
