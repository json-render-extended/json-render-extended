import type { AuthoringComponentProp } from "@json-render-extended/core";

export function extractSpecComponentProps(value: unknown): AuthoringComponentProp[] {
	if (!isRecord(value) || !isRecord(value.state) || !isRecord(value.state.props)) return [];
	return Object.entries(value.state.props)
		.map(([name, defaultValue]) => ({
			name,
			type: valueType(defaultValue),
			defaultValue,
		}))
		.sort((left, right) => left.name.localeCompare(right.name));
}

function valueType(value: unknown): AuthoringComponentProp["type"] {
	if (Array.isArray(value)) return "array";
	if (value === null) return "unknown";
	if (typeof value === "boolean") return "boolean";
	if (typeof value === "number") return "number";
	if (typeof value === "string") return "string";
	if (isRecord(value)) return "object";
	return "unknown";
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
