"use client";

import type { IconProps } from "@json-render-extended/icons/catalog";
import { TablerIcon } from "@json-render-extended/icons/tabler/react";

export function DocsIcon(props: IconProps) {
	return (
		<TablerIcon
			props={{ decorative: true, ...props }}
			emit={() => undefined}
			on={() => undefined as never}
		/>
	);
}
