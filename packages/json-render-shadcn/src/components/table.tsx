import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import type { ShadcnPrimitiveSet } from "./types";

function withOccurrenceKeys<T>(values: T[], serialize: (value: T) => string) {
	const occurrences = new Map<string, number>();
	return values.map((value) => {
		const serialized = serialize(value);
		const occurrence = occurrences.get(serialized) ?? 0;
		occurrences.set(serialized, occurrence + 1);
		return { key: `${serialized}-${occurrence}`, value };
	});
}

export function createTableComponent(primitives: ShadcnPrimitiveSet) {
	const { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } =
		primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Table">>) => {
		const rows = withOccurrenceKeys(props.rows, (row) => JSON.stringify(row));

		return (
			<div className="overflow-hidden rounded-md border border-border">
				<Table aria-label={props.caption ?? "Data table"}>
					{props.caption && <TableCaption>{props.caption}</TableCaption>}
					<TableHeader>
						<TableRow>
							{props.columns.map((column) => (
								<TableHead key={column}>{column}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map(({ key: rowKey, value: row }) => (
							<TableRow key={rowKey}>
								{withOccurrenceKeys(row, String).map(({ key: cellKey, value: cell }) => (
									<TableCell key={cellKey}>{String(cell)}</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	};
}
