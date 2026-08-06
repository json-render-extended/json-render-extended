import type { IconMetadata, IconSearchResult, SearchIconsOptions } from "../metadata";

import { type TablerIconCategory, tablerIconSet } from "./icon-set";
import { type TablerIconName, tablerIconNames } from "./names";

export type TablerIconMetadata = IconMetadata<TablerIconName, TablerIconCategory>;
export type SearchTablerIconsOptions = SearchIconsOptions<TablerIconCategory>;
export type TablerIconSearchResult = IconSearchResult<TablerIconName, TablerIconCategory>;

export const tablerIconMetadata = tablerIconSet.metadata;
export const isTablerIconName = tablerIconSet.isName;
export const getTablerIconMetadata = tablerIconSet.getMetadata;
export const searchTablerIcons = tablerIconSet.search;

export { type TablerIconCategory, type TablerIconName, tablerIconNames };
