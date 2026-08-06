import type { IconProps } from "../catalog";

import { lucideIconSet } from "./icon-set";
import { type LucideIconName, lucideIconNames } from "./names";

export const lucideIconDefinition = lucideIconSet.componentDefinitions.Icon;
export const lucideComponentDefinitions = lucideIconSet.componentDefinitions;
export const componentDefinitions = lucideComponentDefinitions;

export function createLucideIconDefinition(names: readonly LucideIconName[]) {
	return lucideIconSet.createComponentDefinitions(names).Icon;
}

export function createLucideComponentDefinitions(names: readonly LucideIconName[]) {
	return lucideIconSet.createComponentDefinitions(names);
}

export type LucideIconProps = IconProps;

export { type LucideIconName, lucideIconNames };
