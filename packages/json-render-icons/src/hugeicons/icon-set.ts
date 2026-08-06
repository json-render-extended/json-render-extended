import type { IconSemantics } from "../metadata";
import { defineStandardIconSet, type StandardIconCategory } from "../standard-icon-set";

import { type HugeiconsIconName, hugeiconsIconNames } from "./names";

const curatedSemantics: Partial<Record<HugeiconsIconName, IconSemantics<StandardIconCategory>>> = {
	"alert-circle": { aliases: ["warning", "attention"], intents: ["warn", "alert"] },
	"arrow-left": { aliases: ["back", "previous"], intents: ["navigate back"] },
	"arrow-right": { aliases: ["forward", "next"], intents: ["navigate forward"] },
	"cancel-circle": { aliases: ["failed", "error", "invalid"], intents: ["show error"] },
	"checkmark-circle-02": {
		aliases: ["complete", "completed", "done", "approved", "confirmed", "success"],
		intents: ["show success", "mark complete", "confirm"],
	},
	"credit-card": { aliases: ["billing", "payment", "checkout"], intents: ["pay", "billing"] },
	"help-circle": { aliases: ["question", "support"], intents: ["get help"] },
	"home-01": { aliases: ["house", "homepage"], intents: ["go home"] },
	"information-circle": { aliases: ["information", "details"], intents: ["show information"] },
	"loading-01": { aliases: ["loading", "progress", "busy"], intents: ["show loading"] },
	"notification-03": { aliases: ["bell", "reminder"], intents: ["notify"] },
	"search-01": { aliases: ["find", "lookup"], intents: ["search"] },
	"settings-01": { aliases: ["preferences", "configuration", "gear"], intents: ["configure"] },
};

export const hugeiconsIconSet = defineStandardIconSet({
	id: "hugeicons",
	label: "Hugeicons",
	names: hugeiconsIconNames,
	exampleName: "checkmark-circle-02",
	semantics: curatedSemantics,
});

export type HugeiconsIconCategory = StandardIconCategory;
