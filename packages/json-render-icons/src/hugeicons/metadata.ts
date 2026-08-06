import type { IconMetadata, IconSearchResult, SearchIconsOptions } from "../metadata";

import { type HugeiconsIconCategory, hugeiconsIconSet } from "./icon-set";
import { type HugeiconsIconName, hugeiconsIconNames } from "./names";

export type HugeiconsIconMetadata = IconMetadata<HugeiconsIconName, HugeiconsIconCategory>;
export type SearchHugeiconsIconsOptions = SearchIconsOptions<HugeiconsIconCategory>;
export type HugeiconsIconSearchResult = IconSearchResult<HugeiconsIconName, HugeiconsIconCategory>;

export const hugeiconsIconMetadata = hugeiconsIconSet.metadata;
export const isHugeiconsIconName = hugeiconsIconSet.isName;
export const getHugeiconsIconMetadata = hugeiconsIconSet.getMetadata;
export const searchHugeiconsIcons = hugeiconsIconSet.search;

export { type HugeiconsIconCategory, type HugeiconsIconName, hugeiconsIconNames };
