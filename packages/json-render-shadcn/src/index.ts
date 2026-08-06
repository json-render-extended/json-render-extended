export { baseUiComponents, baseUiComponents as shadcnComponents } from "./base-ui";
export { defaultShadcnBase, type ShadcnBase, shadcnBases } from "./bases";
export {
	allShadcnComponentNames,
	commonShadcnComponentNames,
	generatedShadcnStyle,
	shadcnRegistryCapabilities,
	shadcnStyleNames,
} from "./capabilities";
export {
	type ComponentDefinition,
	type ShadcnProps,
	shadcnComponentDefinitions,
} from "./catalog";
export {
	type ComponentDefinitionMap,
	extendShadcnComponentDefinitions,
	extendShadcnComponents,
	type RegistryComponentMap,
} from "./extend";
export { radixComponents } from "./radix";
export { reactAriaComponents } from "./react-aria";
export {
	fallbackJsonRenderComponentNamesByBase,
	type ImplementedJsonRenderComponentName,
	implementedJsonRenderComponentNames,
	type MultiBaseComponentName,
	multiBaseComponentNames,
} from "./supported-components";
