import type { IconMetadata, IconSearchResult, SearchIconsOptions } from "../metadata";

import { type PhosphorIconCategory, phosphorIconSet } from "./icon-set";
import { type PhosphorIconName, phosphorIconNames } from "./names";

export type PhosphorIconMetadata = IconMetadata<PhosphorIconName, PhosphorIconCategory>;
export type SearchPhosphorIconsOptions = SearchIconsOptions<PhosphorIconCategory>;
export type PhosphorIconSearchResult = IconSearchResult<PhosphorIconName, PhosphorIconCategory>;

export const phosphorIconMetadata = phosphorIconSet.metadata;
export const isPhosphorIconName = phosphorIconSet.isName;
export const getPhosphorIconMetadata = phosphorIconSet.getMetadata;
export const searchPhosphorIcons = phosphorIconSet.search;

export { type PhosphorIconCategory, type PhosphorIconName, phosphorIconNames };
