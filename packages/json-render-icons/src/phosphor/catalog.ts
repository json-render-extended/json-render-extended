import type { IconProps } from "../catalog";

import { phosphorIconSet } from "./icon-set";
import { type PhosphorIconName, phosphorIconNames } from "./names";

export const phosphorIconDefinition = phosphorIconSet.componentDefinitions.Icon;
export const phosphorComponentDefinitions = phosphorIconSet.componentDefinitions;
export const componentDefinitions = phosphorComponentDefinitions;

export function createPhosphorIconDefinition(names: readonly PhosphorIconName[]) {
	return phosphorIconSet.createComponentDefinitions(names).Icon;
}

export function createPhosphorComponentDefinitions(names: readonly PhosphorIconName[]) {
	return phosphorIconSet.createComponentDefinitions(names);
}

export type PhosphorIconProps = IconProps;

export { type PhosphorIconName, phosphorIconNames };
