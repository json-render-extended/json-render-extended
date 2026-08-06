import type { IconMetadata, IconSearchResult, SearchIconsOptions } from "../metadata";

import { type LucideIconCategory, lucideIconSet } from "./icon-set";
import { type LucideIconName, lucideIconNames } from "./names";

export type LucideIconMetadata = IconMetadata<LucideIconName, LucideIconCategory>;
export type SearchLucideIconsOptions = SearchIconsOptions<LucideIconCategory>;
export type LucideIconSearchResult = IconSearchResult<LucideIconName, LucideIconCategory>;

export const lucideIconMetadata = lucideIconSet.metadata;
export const isLucideIconName = lucideIconSet.isName;
export const getLucideIconMetadata = lucideIconSet.getMetadata;
export const searchLucideIcons = lucideIconSet.search;

export { type LucideIconCategory, type LucideIconName, lucideIconNames };
