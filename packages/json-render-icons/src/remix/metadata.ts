import type { IconMetadata, IconSearchResult, SearchIconsOptions } from "../metadata";

import { type RemixIconCategory, remixIconSet } from "./icon-set";
import { type RemixIconName, remixIconNames } from "./names";

export type RemixIconMetadata = IconMetadata<RemixIconName, RemixIconCategory>;
export type SearchRemixIconsOptions = SearchIconsOptions<RemixIconCategory>;
export type RemixIconSearchResult = IconSearchResult<RemixIconName, RemixIconCategory>;

export const remixIconMetadata = remixIconSet.metadata;
export const isRemixIconName = remixIconSet.isName;
export const getRemixIconMetadata = remixIconSet.getMetadata;
export const searchRemixIcons = remixIconSet.search;

export { type RemixIconCategory, type RemixIconName, remixIconNames };
