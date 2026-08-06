import type { IconProps } from "../catalog";

import { remixIconSet } from "./icon-set";
import { type RemixIconName, remixIconNames } from "./names";

export const remixIconDefinition = remixIconSet.componentDefinitions.Icon;
export const remixComponentDefinitions = remixIconSet.componentDefinitions;
export const componentDefinitions = remixComponentDefinitions;

export function createRemixIconDefinition(names: readonly RemixIconName[]) {
	return remixIconSet.createComponentDefinitions(names).Icon;
}

export function createRemixComponentDefinitions(names: readonly RemixIconName[]) {
	return remixIconSet.createComponentDefinitions(names);
}

export type RemixIconProps = IconProps;

export { type RemixIconName, remixIconNames };
