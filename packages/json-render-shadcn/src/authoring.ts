import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";

import {
	type AuthoringComponentProp,
	defineAuthoringProvider,
	type ExtensionDiagnostic,
} from "@json-render-extended/core";

import { parseShadcnStyle } from "./project";

type AuthoringElement = {
	type: string;
	props?: Record<string, unknown>;
	children?: string[];
};

type AuthoringSpec = {
	root: string;
	elements: Record<string, AuthoringElement>;
	state?: Record<string, unknown>;
};

type CodegenContext = {
	iconSet: string | null;
	imports: Map<string, Set<string>>;
	uiAlias: string;
	diagnostics: ExtensionDiagnostic[];
	publicProps: Map<string, AuthoringComponentProp>;
};

const gapClass = {
	none: "gap-0",
	sm: "gap-2",
	md: "gap-3",
	lg: "gap-4",
	xl: "gap-6",
} as const;

const shadcnPreset: AuthoringSpec = {
	root: "surface",
	elements: {
		surface: {
			type: "Stack",
			props: {
				direction: "vertical",
				gap: "lg",
				align: "stretch",
				className: "mx-auto w-full max-w-3xl p-6",
			},
			children: ["badge", "title", "lead", "cards", "alert"],
		},
		badge: { type: "Badge", props: { text: "SHADCN REGISTRY", variant: "secondary" } },
		title: {
			type: "Heading",
			props: { text: "One spec, three primitive bases", level: "h2" },
		},
		lead: {
			type: "Text",
			props: {
				text: "Compose a JSON Render surface, inspect the package renderer, then export code for this project.",
				variant: "muted",
			},
		},
		cards: {
			type: "Grid",
			props: { columns: 2, gap: "md" },
			children: ["catalog", "ownership"],
		},
		catalog: {
			type: "Card",
			props: {
				title: "Package catalog",
				description: "The live preview uses the selected JSON Render extension registry.",
			},
		},
		ownership: {
			type: "Card",
			props: {
				title: "Application-owned output",
				description: "Generated code imports the consuming project's shadcn components.",
			},
		},
		alert: {
			type: "Alert",
			props: {
				title: "Ready to iterate",
				message: "Valid JSON updates the preview and TypeScript output in real time.",
			},
		},
	},
};

const iconPreset: AuthoringSpec = {
	...shadcnPreset,
	elements: {
		...shadcnPreset.elements,
		surface: {
			...shadcnPreset.elements.surface,
			children: ["badge", "title", "lead", "icons", "cards", "alert"],
		},
		icons: {
			type: "Stack",
			props: { direction: "horizontal", gap: "lg", align: "center" },
			children: ["success", "payment", "search", "settings"],
		},
		success: {
			type: "Icon",
			props: { name: "circle-check", label: "Success", size: "xl" },
		},
		payment: {
			type: "Icon",
			props: { name: "credit-card", label: "Payment", size: "xl" },
		},
		search: {
			type: "Icon",
			props: { name: "search", label: "Search", size: "xl" },
		},
		settings: {
			type: "Icon",
			props: { name: "settings", label: "Settings", size: "xl" },
		},
	},
};

export const shadcnAuthoringProvider = defineAuthoringProvider({
	id: "@json-render-extended/shadcn/authoring",
	async resolve(context) {
		const componentsJson = await readComponentsJson(context.cwd);
		const shadcnCli = resolveShadcnCli(context.packageJsonPath);
		const uiAlias = componentsJson?.aliases?.ui ?? "@/components/ui";
		const base = componentsJson ? parseShadcnStyle(componentsJson.style).base : "base-ui";
		const iconSet =
			context.extensionIds
				.find((id) => id.startsWith("@json-render-extended/icons/"))
				?.slice("@json-render-extended/icons/".length) ?? null;

		return {
			id: "shadcn",
			label: "shadcn",
			presets: [
				...(iconSet
					? [
							{
								id: "shadcn-icons",
								label: `shadcn + ${iconSet} icons`,
								description: "A package-owned shadcn surface with the detected icon adapter.",
								spec: iconPreset,
							},
						]
					: []),
				{
					id: "shadcn",
					label: "shadcn components",
					description: "A package-owned shadcn surface without an icon dependency.",
					spec: shadcnPreset,
				},
			],
			async prepareMaterialization(spec) {
				if (!componentsJson) {
					throw new Error(
						`Cannot materialize shadcn components in ${context.cwd} without components.json. Run shadcn init in the target package first.`,
					);
				}
				const registrations = collectShadcnRegistrations(spec);
				const items = [...new Set(registrations.map((entry) => entry.item))].sort();
				if (items.length > 0) await installShadcnItems(context.cwd, shadcnCli, items);
				return {
					installed: items,
					runtimeCompositions:
						items.length === 0
							? []
							: [
									{
										factory: shadcnRuntimeFactories[base],
										modules: items.map((item) => `${uiAlias}/${item}`),
										keys: registrations.map((entry) => entry.type),
									},
								],
				};
			},
			generateCode(spec, codegenContext) {
				return generateShadcnCode(spec, { ...codegenContext, iconSet, uiAlias });
			},
		};
	},
});

export function generateShadcnCode(
	value: unknown,
	options: {
		iconSet?: string | null;
		uiAlias?: string;
		specId?: string;
		sourceDigest?: string;
		outputPath?: string;
		componentName?: string;
		componentProps?: readonly AuthoringComponentProp[];
	} = {},
) {
	const spec = parseAuthoringSpec(value);
	const context: CodegenContext = {
		iconSet: options.iconSet ?? null,
		imports: new Map(),
		uiAlias: options.uiAlias ?? "@/components/ui",
		diagnostics: [],
		publicProps: new Map((options.componentProps ?? []).map((prop) => [prop.name, prop])),
	};
	const componentName = safeComponentName(options.componentName ?? "GeneratedComponent");
	const root = renderElement(spec.root, spec, 2, new Set(), context);
	const imports = [...context.imports.entries()]
		.sort(([left], [right]) => left.localeCompare(right))
		.map(
			([path, names]) => `import { ${[...names].sort().join(", ")} } from ${JSON.stringify(path)};`,
		)
		.join("\n");

	return {
		code: `/* TypeScript generated for this shadcn project.
 * @json-render-extended/spec ${options.specId ?? "unbound"}
 * @json-render-extended/source ${options.sourceDigest ?? "unbound"}
 * @json-render-extended/provider shadcn
 */
import type { JSX } from "react";
${imports}

export const jsonRenderMaterialization = ${JSON.stringify(
			{
				provider: "shadcn",
				specId: options.specId ?? null,
				sourceDigest: options.sourceDigest ?? null,
			},
			null,
			"\t",
		)} as const;

${renderComponentProps(componentName, options.componentProps ?? [])}export function ${componentName}(${(options.componentProps?.length ?? 0) > 0 ? `props: ${componentName}Props` : ""}): JSX.Element {
\treturn (
${root}
\t);
}`,
		language: "tsx",
		diagnostics: context.diagnostics,
	};
}

function parseAuthoringSpec(value: unknown): AuthoringSpec {
	if (!isRecord(value) || typeof value.root !== "string" || !isRecord(value.elements)) {
		throw new Error("The spec must contain a root string and an elements object.");
	}
	const elements: Record<string, AuthoringElement> = {};
	for (const [id, element] of Object.entries(value.elements)) {
		if (!isRecord(element) || typeof element.type !== "string") {
			throw new Error(`elements.${id} must contain a component type.`);
		}
		if (element.props !== undefined && !isRecord(element.props)) {
			throw new Error(`elements.${id}.props must be an object.`);
		}
		if (
			element.children !== undefined &&
			(!Array.isArray(element.children) ||
				element.children.some((child) => typeof child !== "string"))
		) {
			throw new Error(`elements.${id}.children must contain element IDs.`);
		}
		elements[id] = element as AuthoringElement;
	}
	if (!elements[value.root]) throw new Error(`Root element ${value.root} does not exist.`);
	return {
		root: value.root,
		elements,
		...(isRecord(value.state) ? { state: value.state } : {}),
	};
}

function renderElement(
	id: string,
	spec: AuthoringSpec,
	depth: number,
	ancestors: Set<string>,
	context: CodegenContext,
): string {
	const prefix = "\t".repeat(depth);
	const element = spec.elements[id];
	if (!element) throw new Error(`Element ${id} does not exist.`);
	if (ancestors.has(id)) throw new Error(`Element ${id} creates a recursive child graph.`);
	const props = element.props ?? {};
	const nextAncestors = new Set(ancestors).add(id);
	const children = (element.children ?? [])
		.map((child) => renderElement(child, spec, depth + 1, nextAncestors, context))
		.join("\n");

	if (element.type === "Stack") {
		const classes = classNames(
			"flex",
			props.direction === "horizontal" ? "flex-row flex-wrap" : "flex-col",
			gapClass[(typeof props.gap === "string" ? props.gap : "md") as keyof typeof gapClass],
			{
				start: "items-start",
				center: "items-center",
				end: "items-end",
				stretch: "items-stretch",
			}[typeof props.align === "string" ? props.align : "start"],
			{
				start: "justify-start",
				center: "justify-center",
				end: "justify-end",
				between: "justify-between",
				around: "justify-around",
			}[typeof props.justify === "string" ? props.justify : "start"],
			props.className,
		);
		return renderContainer("div", prefix, children, { className: classes }, context);
	}

	if (element.type === "Grid") {
		const columns = Math.max(
			1,
			Math.min(6, Math.round(typeof props.columns === "number" ? props.columns : 1)),
		);
		const classes = classNames(
			"grid",
			`grid-cols-${columns}`,
			gapClass[(typeof props.gap === "string" ? props.gap : "md") as keyof typeof gapClass],
			props.className,
		);
		return renderContainer("div", prefix, children, { className: classes }, context);
	}

	if (element.type === "Heading") {
		const level =
			typeof props.level === "string" && /^h[1-6]$/.test(props.level) ? props.level : "h2";
		return `${prefix}<${level}${renderAttributes({ className: props.className }, context)}>${renderText(props.text, context)}</${level}>`;
	}

	if (element.type === "Text") {
		const variantClass = {
			lead: "text-lg text-muted-foreground",
			muted: "text-muted-foreground",
			caption: "text-sm text-muted-foreground",
		}[typeof props.variant === "string" ? props.variant : ""];
		return `${prefix}<p${renderAttributes({ className: classNames(variantClass, props.className) }, context)}>${renderText(props.text, context)}</p>`;
	}

	if (element.type === "Badge") {
		addImport(context, `${context.uiAlias}/badge`, "Badge");
		return `${prefix}<Badge${renderAttributes({ variant: props.variant }, context)}>${renderText(props.text, context)}</Badge>`;
	}

	if (element.type === "Card") {
		addImport(context, `${context.uiAlias}/card`, "Card", "CardHeader");
		if (children) addImport(context, `${context.uiAlias}/card`, "CardContent");
		if (hasRenderableValue(props.description, context))
			addImport(context, `${context.uiAlias}/card`, "CardDescription");
		if (hasRenderableValue(props.title, context))
			addImport(context, `${context.uiAlias}/card`, "CardTitle");
		const body = [
			`${"\t".repeat(depth + 1)}<CardHeader>`,
			...(hasRenderableValue(props.title, context)
				? [`${"\t".repeat(depth + 2)}<CardTitle>${renderText(props.title, context)}</CardTitle>`]
				: []),
			...(hasRenderableValue(props.description, context)
				? [
						`${"\t".repeat(depth + 2)}<CardDescription>${renderText(props.description, context)}</CardDescription>`,
					]
				: []),
			`${"\t".repeat(depth + 1)}</CardHeader>`,
			...(children
				? [
						`${"\t".repeat(depth + 1)}<CardContent>`,
						children,
						`${"\t".repeat(depth + 1)}</CardContent>`,
					]
				: []),
		].join("\n");
		return `${prefix}<Card${renderAttributes({ className: props.className }, context)}>\n${body}\n${prefix}</Card>`;
	}

	if (element.type === "Alert") {
		addImport(context, `${context.uiAlias}/alert`, "Alert", "AlertDescription", "AlertTitle");
		const body = [
			...(hasRenderableValue(props.title, context)
				? [`${"\t".repeat(depth + 1)}<AlertTitle>${renderText(props.title, context)}</AlertTitle>`]
				: []),
			...(hasRenderableValue(props.message, context)
				? [
						`${"\t".repeat(depth + 1)}<AlertDescription>${renderText(props.message, context)}</AlertDescription>`,
					]
				: []),
			children,
		]
			.filter(Boolean)
			.join("\n");
		return `${prefix}<Alert${renderAttributes({ variant: props.type === "error" ? "destructive" : undefined }, context)}>\n${body}\n${prefix}</Alert>`;
	}

	if (element.type === "Icon") return renderIcon(prefix, props, context);

	const componentName = safeComponentName(element.type);
	const componentPath = element.type.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
	addImport(context, `${context.uiAlias}/${componentPath}`, componentName);
	const serializedProps = renderAttributes(props, context);
	return children
		? `${prefix}<${componentName}${serializedProps}>\n${children}\n${prefix}</${componentName}>`
		: `${prefix}<${componentName}${serializedProps} />`;
}

function renderIcon(prefix: string, props: Record<string, unknown>, context: CodegenContext) {
	const name = String(props.name ?? "");
	const pascalName = name
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");
	const size =
		typeof props.size === "number"
			? props.size
			: ({ xs: 12, sm: 16, md: 20, lg: 24, xl: 32 } as const)[
					(typeof props.size === "string" ? props.size : "md") as "lg" | "md" | "sm" | "xl" | "xs"
				];
	const accessibility =
		typeof props.label === "string"
			? ` aria-label=${JSON.stringify(props.label)} role="img"`
			: " aria-hidden";
	const shared = `${accessibility} size={${size}}${typeof props.strokeWidth === "number" ? ` strokeWidth={${props.strokeWidth}}` : ""}${renderAttributes({ className: props.className }, context)}`;

	if (context.iconSet === "tabler") {
		const component = `Icon${pascalName}`;
		addImport(context, "@tabler/icons-react", component);
		return `${prefix}<${component}${shared} />`;
	}
	if (context.iconSet === "lucide") {
		addImport(context, "lucide-react", pascalName);
		return `${prefix}<${pascalName}${shared} />`;
	}
	if (context.iconSet === "phosphor") {
		const component = `${pascalName}Icon`;
		addImport(context, "@phosphor-icons/react", component);
		return `${prefix}<${component}${shared} />`;
	}
	if (context.iconSet === "remix") {
		const component = `Ri${pascalName}`;
		addImport(context, "@remixicon/react", component);
		return `${prefix}<${component}${shared} />`;
	}
	if (context.iconSet === "hugeicons") {
		const iconData = `${pascalName}Icon`;
		addImport(context, "@hugeicons/core-free-icons", iconData);
		addImport(context, "@hugeicons/react", "HugeiconsIcon");
		return `${prefix}<HugeiconsIcon icon={${iconData}}${shared} />`;
	}

	context.diagnostics.push({
		code: "missing-icon-codegen-adapter",
		message: `The Icon element ${name} is present, but no consumer icon set was selected.`,
		severity: "warning",
	});
	return `${prefix}{/* Select an icon set to generate ${name}. */}`;
}

function renderContainer(
	tag: string,
	prefix: string,
	children: string,
	props: Record<string, unknown>,
	context: CodegenContext,
) {
	return children
		? `${prefix}<${tag}${renderAttributes(props, context)}>\n${children}\n${prefix}</${tag}>`
		: `${prefix}<${tag}${renderAttributes(props, context)} />`;
}

function renderAttributes(props: Record<string, unknown>, context: CodegenContext) {
	return Object.entries(props)
		.filter(([, value]) => value !== undefined && value !== "")
		.map(([name, value]) => {
			const expression = renderPublicPropExpression(value, context);
			if (expression) return ` ${name}={${expression}}`;
			return typeof value === "string"
				? ` ${name}=${JSON.stringify(value)}`
				: ` ${name}={${JSON.stringify(value)}}`;
		})
		.join("");
}

function renderText(value: unknown, context: CodegenContext) {
	return `{${renderPublicPropExpression(value, context) ?? JSON.stringify(typeof value === "string" ? value : "")}}`;
}

function renderPublicPropExpression(value: unknown, context: CodegenContext) {
	if (!isRecord(value) || typeof value.$state !== "string") return null;
	const match = /^\/props\/([^/]+)$/.exec(value.$state);
	if (!match) return null;
	const name = decodeJsonPointerSegment(match[1] ?? "");
	const prop = context.publicProps.get(name);
	if (!prop) return null;
	return `${memberAccess("props", name)} ?? ${JSON.stringify(prop.defaultValue)}`;
}

function hasRenderableValue(value: unknown, context: CodegenContext) {
	return typeof value === "string" || renderPublicPropExpression(value, context) !== null;
}

function renderComponentProps(name: string, props: readonly AuthoringComponentProp[]) {
	if (props.length === 0) return "";
	return `export interface ${name}Props {
${props.map((prop) => `\t${JSON.stringify(prop.name)}?: ${typescriptPropType(prop)};`).join("\n")}
}

`;
}

function typescriptPropType(prop: AuthoringComponentProp) {
	return {
		array: "readonly unknown[]",
		boolean: "boolean",
		number: "number",
		object: "Record<string, unknown>",
		string: "string",
		unknown: "unknown",
	}[prop.type];
}

function decodeJsonPointerSegment(value: string) {
	return value.replaceAll("~1", "/").replaceAll("~0", "~");
}

function memberAccess(object: string, key: string) {
	return /^[$A-Z_a-z][$\w]*$/.test(key) ? `${object}.${key}` : `${object}[${JSON.stringify(key)}]`;
}

function addImport(context: CodegenContext, path: string, ...names: string[]) {
	const imports = context.imports.get(path) ?? new Set<string>();
	for (const name of names) imports.add(name);
	context.imports.set(path, imports);
}

function classNames(...values: unknown[]) {
	return values
		.filter((value): value is string => typeof value === "string" && value.length > 0)
		.join(" ");
}

function safeComponentName(value: string) {
	const name = value.replace(/[^A-Za-z0-9_$]/g, "");
	if (!/^[$A-Z_a-z]/.test(name)) throw new Error(`Invalid component type ${value}.`);
	return name;
}

const shadcnRuntimeFactories = {
	"base-ui": {
		module: "@json-render-extended/shadcn/base-ui",
		export: "createBaseUiComponents",
	},
	"react-aria": {
		module: "@json-render-extended/shadcn/react-aria",
		export: "createReactAriaComponents",
	},
	radix: {
		module: "@json-render-extended/shadcn/radix",
		export: "createRadixComponents",
	},
} as const;

function collectShadcnRegistrations(value: unknown) {
	const spec = parseAuthoringSpec(value);
	const nativeTypes = new Set([
		"Form",
		"Grid",
		"Heading",
		"Icon",
		"Image",
		"Link",
		"Spinner",
		"Stack",
		"Text",
	]);
	return [
		...new Set(
			Object.values(spec.elements)
				.filter((element) => !nativeTypes.has(element.type))
				.map((element) => element.type),
		),
	]
		.sort()
		.map((type) => ({
			type,
			item:
				type === "Radio"
					? "radio-group"
					: type.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
		}));
}

function resolveShadcnCli(packageJsonPath: string) {
	const projectRequire = createRequire(packageJsonPath);
	const authoringModule = projectRequire.resolve("@json-render-extended/shadcn/authoring");
	return createRequire(authoringModule).resolve("shadcn");
}

async function installShadcnItems(cwd: string, shadcnCli: string, items: string[]) {
	await new Promise<void>((resolvePromise, reject) => {
		const child = spawn(
			process.execPath,
			[shadcnCli, "add", ...items, "--cwd", cwd, "--yes", "--silent"],
			{
				cwd,
				env: process.env,
				stdio: ["ignore", "pipe", "pipe"],
			},
		);
		let stderr = "";
		child.stderr.on("data", (chunk) => {
			stderr += String(chunk);
		});
		child.once("error", reject);
		child.once("exit", (code) => {
			if (code === 0) resolvePromise();
			else reject(new Error(stderr.trim() || `shadcn add exited with code ${code ?? "unknown"}.`));
		});
	});
}

async function readComponentsJson(cwd: string): Promise<{
	aliases?: { ui?: string };
	style: string;
} | null> {
	try {
		const value = JSON.parse(await readFile(resolve(cwd, "components.json"), "utf8")) as unknown;
		return isRecord(value) && typeof value.style === "string"
			? (value as { aliases?: { ui?: string }; style: string })
			: null;
	} catch {
		return null;
	}
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
