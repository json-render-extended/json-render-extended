import type { IconProps } from "../catalog";

import { hugeiconsIconSet } from "./icon-set";
import { type HugeiconsIconName, hugeiconsIconNames } from "./names";

export const hugeiconsIconDefinition = hugeiconsIconSet.componentDefinitions.Icon;
export const hugeiconsComponentDefinitions = hugeiconsIconSet.componentDefinitions;
export const componentDefinitions = hugeiconsComponentDefinitions;

export function createHugeiconsIconDefinition(names: readonly HugeiconsIconName[]) {
	return hugeiconsIconSet.createComponentDefinitions(names).Icon;
}

export function createHugeiconsComponentDefinitions(names: readonly HugeiconsIconName[]) {
	return hugeiconsIconSet.createComponentDefinitions(names);
}

export type HugeiconsIconProps = IconProps;

export { type HugeiconsIconName, hugeiconsIconNames };
