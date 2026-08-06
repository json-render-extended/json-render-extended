import type { IconProps } from "../catalog";

import { tablerIconSet } from "./icon-set";
import { type TablerIconName, tablerIconNames } from "./names";

export const tablerIconDefinition = tablerIconSet.componentDefinitions.Icon;
export const tablerComponentDefinitions = tablerIconSet.componentDefinitions;
export const componentDefinitions = tablerComponentDefinitions;

export function createTablerIconDefinition(names: readonly TablerIconName[]) {
	return tablerIconSet.createComponentDefinitions(names).Icon;
}

export function createTablerComponentDefinitions(names: readonly TablerIconName[]) {
	return tablerIconSet.createComponentDefinitions(names);
}

export type TablerIconProps = IconProps;

export { type TablerIconName, tablerIconNames };
