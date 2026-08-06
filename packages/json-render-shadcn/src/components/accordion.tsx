import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { CreateShadcnComponentsOptions, ShadcnPrimitiveSet } from "./types";

export function createAccordionComponent(
	primitives: ShadcnPrimitiveSet,
	options: CreateShadcnComponentsOptions,
) {
	const { Accordion, AccordionContent, AccordionItem, AccordionTrigger } = primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Accordion">>) => {
		const isMultiple = props.type === "multiple";
		const rootProps =
			options.base === "react-aria"
				? { allowsMultipleExpanded: isMultiple }
				: options.base === "base-ui"
					? { multiple: isMultiple }
					: { type: isMultiple ? "multiple" : "single", collapsible: true };

		return (
			<Accordion className="w-full" {...rootProps}>
				{(props.items ?? []).map((item) => (
					<AccordionItem
						key={item.title}
						{...(options.base === "react-aria" ? { id: item.title } : { value: item.title })}
					>
						<AccordionTrigger>{item.title}</AccordionTrigger>
						<AccordionContent>{item.content}</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		);
	};
}
