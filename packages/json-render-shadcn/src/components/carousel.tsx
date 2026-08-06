import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

export function createCarouselComponent(primitives: ShadcnPrimitiveSet) {
	const { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } = primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Carousel">>) => (
		<Carousel className="w-full">
			<CarouselContent>
				{(props.items ?? []).map((item) => (
					<CarouselItem
						className="basis-3/4 md:basis-1/2 lg:basis-1/3"
						key={`${item.title}-${item.description}`}
					>
						<div className="h-full rounded-lg border border-border bg-card p-4">
							{item.title && <h4 className="mb-1 font-semibold text-sm">{item.title}</h4>}
							{item.description && (
								<p className="text-muted-foreground text-sm">{item.description}</p>
							)}
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
}
