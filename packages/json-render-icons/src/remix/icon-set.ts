import type { IconSemantics } from "../metadata";
import { defineStandardIconSet, type StandardIconCategory } from "../standard-icon-set";

import { type RemixIconName, remixIconNames } from "./names";

const curatedSemantics: Partial<Record<RemixIconName, IconSemantics<StandardIconCategory>>> = {
	"arrow-left-line": { aliases: ["back", "previous"], intents: ["navigate back"] },
	"arrow-right-line": { aliases: ["forward", "next"], intents: ["navigate forward"] },
	"bank-card-line": {
		aliases: ["credit card", "billing", "payment", "checkout"],
		intents: ["pay", "billing"],
	},
	"checkbox-circle-line": {
		aliases: ["complete", "completed", "done", "approved", "confirmed", "success"],
		intents: ["show success", "mark complete", "confirm"],
	},
	"close-circle-line": { aliases: ["failed", "error", "invalid"], intents: ["show error"] },
	"error-warning-line": { aliases: ["warning", "attention"], intents: ["warn", "alert"] },
	"home-line": { aliases: ["house", "homepage"], intents: ["go home"] },
	"information-line": { aliases: ["information", "details"], intents: ["show information"] },
	"loader-2-line": { aliases: ["loading", "progress", "busy"], intents: ["show loading"] },
	"question-line": { aliases: ["help", "support"], intents: ["get help"] },
	"search-line": { aliases: ["find", "lookup"], intents: ["search"] },
	"settings-3-line": {
		aliases: ["preferences", "configuration", "gear"],
		intents: ["configure"],
	},
};

export const remixIconSet = defineStandardIconSet({
	id: "remix",
	label: "Remix",
	names: remixIconNames,
	exampleName: "checkbox-circle-line",
	semantics: curatedSemantics,
});

export type RemixIconCategory = StandardIconCategory;
