import type { ComponentDefinition } from "./catalog";
import { shadcnComponentDefinitions } from "./catalog";

export type ComponentDefinitionMap = Record<string, ComponentDefinition>;
export type RegistryComponentMap = Record<string, unknown>;

type UnionToIntersection<T> = (T extends unknown ? (value: T) => void : never) extends (
	value: infer Intersection,
) => void
	? Intersection
	: never;

/**
 * Extend the synchronized shadcn catalog with package or application definitions.
 * Later extensions intentionally win, which lets an application override an ecosystem package.
 */
export function extendShadcnComponentDefinitions<
	const Extensions extends readonly ComponentDefinitionMap[],
>(
	...extensions: Extensions
): typeof shadcnComponentDefinitions & UnionToIntersection<Extensions[number]> {
	return Object.assign(
		{},
		shadcnComponentDefinitions,
		...extensions,
	) as typeof shadcnComponentDefinitions & UnionToIntersection<Extensions[number]>;
}

/**
 * Extend a selected runtime component map. Use the map that matches the base selected by
 * components.json, then apply ecosystem packages and local overrides in that order.
 */
export function extendShadcnComponents<
	Base extends RegistryComponentMap,
	const Extensions extends readonly RegistryComponentMap[],
>(base: Base, ...extensions: Extensions): Base & UnionToIntersection<Extensions[number]> {
	return Object.assign({}, base, ...extensions) as Base & UnionToIntersection<Extensions[number]>;
}
