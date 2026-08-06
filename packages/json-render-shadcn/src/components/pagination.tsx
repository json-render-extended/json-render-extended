"use client";

import { type BaseComponentProps, useBoundProp } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

function getPaginationRange(current: number, total: number): Array<number | "ellipsis"> {
	if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
	const pages: Array<number | "ellipsis"> = [1];
	if (current > 3) pages.push("ellipsis");
	for (let page = Math.max(2, current - 1); page <= Math.min(total - 1, current + 1); page++) {
		pages.push(page);
	}
	if (current < total - 2) pages.push("ellipsis");
	pages.push(total);
	return pages;
}

export function createPaginationComponent(primitives: ShadcnPrimitiveSet) {
	const {
		Pagination,
		PaginationContent,
		PaginationEllipsis,
		PaginationItem,
		PaginationLink,
		PaginationNext,
		PaginationPrevious,
	} = primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"Pagination">>) => {
		const [boundPage, setBoundPage] = useBoundProp<number>(
			props.page as number | undefined,
			bindings?.page,
		);
		const currentPage = boundPage ?? 1;
		const totalPages = Math.max(1, props.totalPages ?? 1);
		let ellipsisCount = 0;
		const pages = getPaginationRange(currentPage, totalPages).map((page) => {
			if (page !== "ellipsis") return { key: String(page), page };
			ellipsisCount += 1;
			return { key: `ellipsis-${ellipsisCount}`, page };
		});
		const setPage = (page: number) => {
			setBoundPage(page);
			emit("change");
		};

		return (
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							href="#"
							onClick={(event: MouseEvent) => {
								event.preventDefault();
								if (currentPage > 1) setPage(currentPage - 1);
							}}
						/>
					</PaginationItem>
					{pages.map(({ key, page }) =>
						page === "ellipsis" ? (
							<PaginationItem key={key}>
								<PaginationEllipsis />
							</PaginationItem>
						) : (
							<PaginationItem key={page}>
								<PaginationLink
									href="#"
									isActive={page === currentPage}
									onClick={(event: MouseEvent) => {
										event.preventDefault();
										setPage(page);
									}}
								>
									{page}
								</PaginationLink>
							</PaginationItem>
						),
					)}
					<PaginationItem>
						<PaginationNext
							href="#"
							onClick={(event: MouseEvent) => {
								event.preventDefault();
								if (currentPage < totalPages) setPage(currentPage + 1);
							}}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		);
	};
}
