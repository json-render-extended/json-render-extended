"use client";

import type { Spec } from "@json-render/core";
import {
	type BaseComponentProps,
	type ComponentRegistry,
	JSONUIProvider,
	Renderer,
} from "@json-render/react";
import { Component, type ReactNode, useMemo, useRef, useState } from "react";

import { DocsIcon } from "@/components/docs-icon";
import { useRegistry } from "@/components/registry-provider";
import type { PackageShowcaseProps } from "@/lib/package-showcase-schema";
import { getPackageShowcaseRegistry } from "@/lib/package-showcase-surfaces";

type DemoElement = {
	type: string;
	props?: Record<string, unknown>;
	children?: string[];
};

type DemoSpec = Spec & {
	root: string;
	elements: Record<string, DemoElement>;
};

type OutputMode = "preview" | "code";
type MobilePane = "editor" | "output";
type CodeLanguage = "json" | "tsx";

type SourceLine = {
	id: string;
	line: string;
	lineNumber: number;
};

const playgroundSession: {
	activeId?: string;
	mobilePane?: MobilePane;
	outputMode?: OutputMode;
	sources?: Record<string, string>;
} = {};

const typescriptTokenPattern =
	/(\/\*.*?\*\/|\/\/.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|<\/?[A-Z][A-Za-z0-9.]*|\b(?:export|from|function|import|interface|return|type|const|let|true|false|null|undefined)\b|-?\d+(?:\.\d+)?)/g;
const jsonTokenPattern = /("(?:\\.|[^"\\])*"|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?)/g;
const consumerUiAlias = "@/components/ui";

function HighlightedText({ language, line }: { language: CodeLanguage; line: string }) {
	const parts: Array<{ className?: string; id: string; text: string }> = [];
	let cursor = 0;

	for (const match of line.matchAll(
		language === "json" ? jsonTokenPattern : typescriptTokenPattern,
	)) {
		const index = match.index ?? 0;
		if (index > cursor) {
			parts.push({ id: `text-${cursor}`, text: line.slice(cursor, index) });
		}

		const text = match[0];
		let className: string;

		if (language === "json") {
			className = text.startsWith('"')
				? line
						.slice(index + text.length)
						.trimStart()
						.startsWith(":")
					? "package-json-key"
					: "package-json-string"
				: /^(?:true|false|null)$/.test(text)
					? "package-json-literal"
					: "package-json-number";
		} else {
			className =
				text.startsWith("/*") || text.startsWith("//")
					? "package-code-comment"
					: text.startsWith('"') || text.startsWith("'") || text.startsWith("`")
						? "package-json-string"
						: text.startsWith("<")
							? "package-code-tag"
							: /^(?:export|from|function|import|interface|return|type|const|let)$/.test(text)
								? "package-code-keyword"
								: /^(?:true|false|null|undefined)$/.test(text)
									? "package-json-literal"
									: "package-json-number";
		}

		parts.push({ className, id: `token-${index}`, text });
		cursor = index + text.length;
	}

	if (cursor < line.length) parts.push({ id: `text-${cursor}`, text: line.slice(cursor) });

	return parts.map((part) => (
		<span className={part.className} key={part.id}>
			{part.text}
		</span>
	));
}

function HighlightedCodeLine({ line, lineNumber }: { line: string; lineNumber: number }) {
	return (
		<span className="package-json-line">
			<span aria-hidden="true" className="package-json-line-number">
				{lineNumber}
			</span>
			<span>
				<HighlightedText language="tsx" line={line} />
			</span>
		</span>
	);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sourceLines(source: string): SourceLine[] {
	let offset = 0;
	return source.split("\n").map((line, index) => {
		const entry = { id: `line-${offset}`, line, lineNumber: index + 1 };
		offset += line.length + 1;
		return entry;
	});
}

function parseSpec(source: string): { error: string | null; spec: DemoSpec | null } {
	try {
		const value: unknown = JSON.parse(source);
		if (!isRecord(value) || typeof value.root !== "string" || !isRecord(value.elements)) {
			return { error: "The spec must contain a root string and an elements object.", spec: null };
		}
		for (const [id, element] of Object.entries(value.elements)) {
			if (!isRecord(element) || typeof element.type !== "string") {
				return { error: `elements.${id} must contain a component type.`, spec: null };
			}
			if (element.props !== undefined && !isRecord(element.props)) {
				return { error: `elements.${id}.props must be an object.`, spec: null };
			}
			if (
				element.children !== undefined &&
				(!Array.isArray(element.children) ||
					element.children.some((child) => typeof child !== "string"))
			) {
				return { error: `elements.${id}.children must contain element IDs.`, spec: null };
			}
		}

		return { error: null, spec: value as unknown as DemoSpec };
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : "The JSON is not valid.",
			spec: null,
		};
	}
}

function validateSpecForRegistry(spec: DemoSpec, registry: ComponentRegistry): string | null {
	if (!spec.elements[spec.root]) return `Root element "${spec.root}" does not exist.`;

	for (const [id, element] of Object.entries(spec.elements)) {
		if (!registry[element.type]) {
			return `elements.${id}.type: "${element.type}" is not provided by this package registry.`;
		}
		for (const child of element.children ?? []) {
			if (!spec.elements[child]) return `elements.${id}.children: "${child}" does not exist.`;
		}
	}

	return null;
}

type CodegenContext = {
	imports: Map<string, Set<string>>;
};

const gapClass = {
	none: "gap-0",
	sm: "gap-2",
	md: "gap-3",
	lg: "gap-4",
	xl: "gap-6",
} as const;

function addImport(context: CodegenContext, path: string, ...names: string[]) {
	const importedNames = context.imports.get(path) ?? new Set<string>();
	for (const name of names) importedNames.add(name);
	context.imports.set(path, importedNames);
}

function indentation(depth: number) {
	return "\t".repeat(depth);
}

function quotedAttribute(name: string, value: unknown) {
	return typeof value === "string" && value.length > 0 ? ` ${name}=${JSON.stringify(value)}` : "";
}

function textExpression(value: unknown) {
	return `{${JSON.stringify(typeof value === "string" ? value : "")}}`;
}

function classNames(...values: unknown[]) {
	return values
		.filter((value): value is string => typeof value === "string" && value.length > 0)
		.join(" ");
}

function renderChildren(
	element: DemoElement,
	spec: DemoSpec,
	depth: number,
	ancestors: Set<string>,
	context: CodegenContext,
) {
	return (element.children ?? [])
		.map((child) => renderConsumerElement(child, spec, depth, ancestors, context))
		.join("\n");
}

function renderConsumerElement(
	id: string,
	spec: DemoSpec,
	depth: number,
	ancestors: Set<string>,
	context: CodegenContext,
): string {
	const prefix = indentation(depth);
	const element = spec.elements[id];
	if (!element || ancestors.has(id)) return `${prefix}{/* Invalid element reference: ${id} */}`;

	const nextAncestors = new Set(ancestors).add(id);
	const props = element.props ?? {};
	const children = renderChildren(element, spec, depth + 1, nextAncestors, context);

	if (element.type === "Stack") {
		const align = {
			start: "items-start",
			center: "items-center",
			end: "items-end",
			stretch: "items-stretch",
		}[typeof props.align === "string" ? props.align : "start"];
		const justify = {
			start: "justify-start",
			center: "justify-center",
			end: "justify-end",
			between: "justify-between",
			around: "justify-around",
		}[typeof props.justify === "string" ? props.justify : "start"];
		const gap =
			gapClass[(typeof props.gap === "string" ? props.gap : "md") as keyof typeof gapClass];
		const classes = classNames(
			"flex",
			props.direction === "horizontal" ? "flex-row flex-wrap" : "flex-col",
			gap,
			align,
			justify,
			props.className,
		);
		return `${prefix}<div className=${JSON.stringify(classes)}>\n${children}\n${prefix}</div>`;
	}

	if (element.type === "Grid") {
		const requestedColumns = typeof props.columns === "number" ? props.columns : 1;
		const columns = Math.max(1, Math.min(6, Math.round(requestedColumns)));
		const gap =
			gapClass[(typeof props.gap === "string" ? props.gap : "md") as keyof typeof gapClass];
		const classes = classNames("grid", `grid-cols-${columns}`, gap, props.className);
		return `${prefix}<div className=${JSON.stringify(classes)}>\n${children}\n${prefix}</div>`;
	}

	if (element.type === "Heading") {
		const level =
			typeof props.level === "string" && /^h[1-6]$/.test(props.level) ? props.level : "h2";
		return `${prefix}<${level}${quotedAttribute("className", props.className)}>${textExpression(props.text)}</${level}>`;
	}

	if (element.type === "Text") {
		const variantClass = {
			lead: "text-lg text-muted-foreground",
			muted: "text-muted-foreground",
			caption: "text-sm text-muted-foreground",
		}[typeof props.variant === "string" ? props.variant : ""];
		const classes = classNames(variantClass, props.className);
		return `${prefix}<p${quotedAttribute("className", classes)}>${textExpression(props.text)}</p>`;
	}

	if (element.type === "Badge") {
		addImport(context, `${consumerUiAlias}/badge`, "Badge");
		return `${prefix}<Badge${quotedAttribute("variant", props.variant)}>${textExpression(props.text)}</Badge>`;
	}

	if (element.type === "Card") {
		addImport(
			context,
			`${consumerUiAlias}/card`,
			"Card",
			"CardDescription",
			"CardHeader",
			"CardTitle",
		);
		if (children) addImport(context, `${consumerUiAlias}/card`, "CardContent");
		const header = [
			typeof props.title === "string"
				? `${indentation(depth + 2)}<CardTitle>${textExpression(props.title)}</CardTitle>`
				: "",
			typeof props.description === "string"
				? `${indentation(depth + 2)}<CardDescription>${textExpression(props.description)}</CardDescription>`
				: "",
		]
			.filter(Boolean)
			.join("\n");
		const content = children
			? `\n${indentation(depth + 1)}<CardContent>\n${children}\n${indentation(depth + 1)}</CardContent>`
			: "";
		return `${prefix}<Card${quotedAttribute("className", props.className)}>\n${indentation(depth + 1)}<CardHeader>\n${header}\n${indentation(depth + 1)}</CardHeader>${content}\n${prefix}</Card>`;
	}

	if (element.type === "Alert") {
		addImport(context, `${consumerUiAlias}/alert`, "Alert", "AlertDescription", "AlertTitle");
		const variant = props.type === "error" ? ' variant="destructive"' : "";
		const title =
			typeof props.title === "string"
				? `${indentation(depth + 1)}<AlertTitle>${textExpression(props.title)}</AlertTitle>`
				: "";
		const description =
			typeof props.message === "string"
				? `${indentation(depth + 1)}<AlertDescription>${textExpression(props.message)}</AlertDescription>`
				: "";
		return `${prefix}<Alert${variant}>\n${[title, description, children].filter(Boolean).join("\n")}\n${prefix}</Alert>`;
	}

	if (element.type === "Icon") {
		const iconName = `Icon${String(props.name ?? "")
			.split("-")
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join("")}`;
		addImport(context, "@tabler/icons-react", iconName);
		const namedSizes = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 } as const;
		const size =
			typeof props.size === "number"
				? props.size
				: namedSizes[
						(typeof props.size === "string" ? props.size : "md") as keyof typeof namedSizes
					];
		const accessibility =
			typeof props.label === "string"
				? ` aria-label=${JSON.stringify(props.label)} role="img"`
				: " aria-hidden";
		const strokeWidth =
			typeof props.strokeWidth === "number" ? ` strokeWidth={${props.strokeWidth}}` : "";
		return `${prefix}<${iconName}${accessibility} size={${size ?? 20}}${strokeWidth}${quotedAttribute("className", props.className)} />`;
	}

	const componentName = element.type.replace(/[^A-Za-z0-9_$]/g, "");
	const componentPath = element.type.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
	addImport(context, `${consumerUiAlias}/${componentPath}`, componentName);
	return children
		? `${prefix}<${componentName}>\n${children}\n${prefix}</${componentName}>`
		: `${prefix}<${componentName} />`;
}

function generateStaticCode(spec: DemoSpec) {
	const context: CodegenContext = { imports: new Map() };
	const root = renderConsumerElement(spec.root, spec, 2, new Set(), context);
	const imports = [...context.imports.entries()]
		.sort(([left], [right]) => left.localeCompare(right))
		.map(
			([path, names]) => `import { ${[...names].sort().join(", ")} } from ${JSON.stringify(path)};`,
		)
		.join("\n");

	return `/* TypeScript generated for the consuming shadcn project. */
import type { JSX } from "react";
${imports}

export function GeneratedUI(): JSX.Element {
	return (
${root}
	);
}`;
}

class PreviewErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
	state: { error: Error | null } = { error: null };

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	render() {
		if (this.state.error) {
			return (
				<div className="package-showcase-runtime-error" role="alert">
					<strong>The current spec cannot be rendered.</strong>
					<span>{this.state.error.message}</span>
				</div>
			);
		}

		return this.props.children;
	}
}

export function PackageShowcase({ props }: BaseComponentProps<PackageShowcaseProps>) {
	const { base } = useRegistry();
	const [activeId, setActiveId] = useState(() =>
		props.packages.some((packageItem) => packageItem.id === playgroundSession.activeId)
			? playgroundSession.activeId
			: props.packages[0]?.id,
	);
	const [outputMode, setOutputMode] = useState<OutputMode>(
		() => playgroundSession.outputMode ?? "preview",
	);
	const [mobilePane, setMobilePane] = useState<MobilePane>(
		() => playgroundSession.mobilePane ?? "editor",
	);
	const [sources, setSources] = useState<Record<string, string>>(() => ({
		...Object.fromEntries(
			props.packages.map((packageItem) => [packageItem.id, packageItem.source]),
		),
		...playgroundSession.sources,
	}));
	const [copied, setCopied] = useState(false);
	const editorRef = useRef<HTMLTextAreaElement>(null);
	const editorHighlightRef = useRef<HTMLPreElement>(null);
	const lineNumbersRef = useRef<HTMLDivElement>(null);
	const validSpecsRef = useRef<Record<string, DemoSpec>>(
		Object.fromEntries(
			props.packages.flatMap((packageItem) => {
				const result = parseSpec(packageItem.source);
				return result.spec ? [[packageItem.id, result.spec]] : [];
			}),
		),
	);
	const activePackage =
		props.packages.find((candidate) => candidate.id === activeId) ?? props.packages[0];
	const activeSource = sources[activePackage.id] ?? activePackage.source;
	const showcaseRegistry = useMemo(
		() => getPackageShowcaseRegistry(activePackage.extensions, base),
		[activePackage.extensions, base],
	);
	const parseResult = useMemo(() => {
		const parsed = parseSpec(activeSource);
		if (!parsed.spec) return parsed;
		const registryError = validateSpecForRegistry(parsed.spec, showcaseRegistry);
		return registryError ? { error: registryError, spec: null } : parsed;
	}, [activeSource, showcaseRegistry]);

	if (parseResult.spec) validSpecsRef.current[activePackage.id] = parseResult.spec;
	const renderSpec = parseResult.spec ?? validSpecsRef.current[activePackage.id];
	const generatedCode = renderSpec ? generateStaticCode(renderSpec) : "";
	const editorLines = sourceLines(activeSource);
	const generatedLines = sourceLines(generatedCode);

	async function copySource() {
		await navigator.clipboard.writeText(activeSource);
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1600);
	}

	function resetSource() {
		setSources((current) => {
			const nextSources = { ...current, [activePackage.id]: activePackage.source };
			playgroundSession.sources = nextSources;
			return nextSources;
		});
		setCopied(false);
		editorRef.current?.focus();
	}

	return (
		<section
			className={`package-showcase is-mobile-${mobilePane}`}
			aria-label="Production package playground"
		>
			<header className="package-showcase-toolbar">
				<div className="package-showcase-tabs" role="tablist" aria-label="Package presets">
					{props.packages.map((packageItem) => (
						<button
							key={packageItem.id}
							type="button"
							role="tab"
							aria-selected={packageItem.id === activePackage.id}
							onClick={() => {
								playgroundSession.activeId = packageItem.id;
								setActiveId(packageItem.id);
								setCopied(false);
							}}
						>
							{packageItem.label}
						</button>
					))}
				</div>
				<div className="package-showcase-mobile-tabs" role="tablist" aria-label="Playground pane">
					<button
						type="button"
						role="tab"
						aria-selected={mobilePane === "editor"}
						onClick={() => {
							playgroundSession.mobilePane = "editor";
							setMobilePane("editor");
						}}
					>
						<DocsIcon name="code" size="xs" strokeWidth={1.8} />
						Editor
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={mobilePane === "output"}
						onClick={() => {
							playgroundSession.mobilePane = "output";
							setMobilePane("output");
						}}
					>
						<DocsIcon name="play" size="xs" strokeWidth={1.8} />
						Output
					</button>
				</div>
				<div className={`package-showcase-status${parseResult.error ? " is-invalid" : ""}`}>
					<span aria-hidden="true" />
					{parseResult.error ? "Preview paused" : "Live JSON Render spec"}
				</div>
			</header>

			<div className="package-showcase-grid">
				<article className="package-showcase-pane package-showcase-code-pane">
					<header className="package-showcase-pane-header">
						<span>spec.json</span>
						<div className="package-showcase-pane-actions">
							<button type="button" onClick={resetSource} aria-label="Reset JSON spec">
								<DocsIcon name="refresh" size="sm" strokeWidth={1.8} />
							</button>
							<button type="button" onClick={copySource} aria-label="Copy JSON spec">
								<DocsIcon name={copied ? "check" : "copy"} size="sm" strokeWidth={1.8} />
							</button>
						</div>
					</header>
					<div className="package-json-editor">
						<div ref={lineNumbersRef} className="package-json-editor-lines" aria-hidden="true">
							{editorLines.map((line) => (
								<span key={line.id}>{line.lineNumber}</span>
							))}
						</div>
						<div className="package-json-editor-input">
							<pre
								ref={editorHighlightRef}
								className="package-json-editor-highlight"
								aria-hidden="true"
							>
								<code className="language-json">
									{editorLines.map((line) => (
										<span className="package-json-editor-highlight-line" key={line.id}>
											{line.line.length > 0 ? (
												<HighlightedText language="json" line={line.line} />
											) : (
												"\u200b"
											)}
										</span>
									))}
								</code>
							</pre>
							<textarea
								ref={editorRef}
								aria-invalid={parseResult.error ? true : undefined}
								aria-label={`Editable JSON Render spec for ${activePackage.name}`}
								spellCheck={false}
								value={activeSource}
								wrap="off"
								onChange={(event) => {
									const nextSource = event.currentTarget.value;
									setSources((current) => {
										const nextSources = { ...current, [activePackage.id]: nextSource };
										playgroundSession.sources = nextSources;
										return nextSources;
									});
								}}
								onScroll={(event) => {
									if (lineNumbersRef.current) {
										lineNumbersRef.current.scrollTop = event.currentTarget.scrollTop;
									}
									if (editorHighlightRef.current) {
										editorHighlightRef.current.scrollTop = event.currentTarget.scrollTop;
										editorHighlightRef.current.scrollLeft = event.currentTarget.scrollLeft;
									}
								}}
							/>
						</div>
					</div>
					{parseResult.error ? (
						<div className="package-json-error" role="alert">
							{parseResult.error}
						</div>
					) : null}
				</article>

				<article className="package-showcase-pane package-showcase-preview-pane">
					<header className="package-showcase-pane-header">
						<div className="package-showcase-output-tabs" role="tablist" aria-label="Output mode">
							<button
								type="button"
								role="tab"
								aria-selected={outputMode === "preview"}
								onClick={() => {
									playgroundSession.outputMode = "preview";
									setOutputMode("preview");
								}}
							>
								live render
							</button>
							<button
								type="button"
								role="tab"
								aria-selected={outputMode === "code"}
								onClick={() => {
									playgroundSession.outputMode = "code";
									setOutputMode("code");
								}}
							>
								static code
							</button>
						</div>
						<a href={activePackage.href}>
							Documentation
							<DocsIcon name="external-link" size="xs" strokeWidth={1.8} />
						</a>
					</header>
					{outputMode === "preview" ? (
						<div className="package-showcase-stage">
							{renderSpec ? (
								<div className="package-showcase-render-output">
									<PreviewErrorBoundary key={`${base}:${activePackage.id}:${activeSource}`}>
										<JSONUIProvider registry={showcaseRegistry} initialState={{}}>
											<Renderer registry={showcaseRegistry} spec={renderSpec} />
										</JSONUIProvider>
									</PreviewErrorBoundary>
								</div>
							) : null}
						</div>
					) : (
						<section aria-label={`Generated TypeScript code for ${activePackage.name}`}>
							<pre className="package-json-code package-generated-code">
								<code className="language-tsx">
									{generatedLines.map((line) => (
										<HighlightedCodeLine
											key={line.id}
											line={line.line}
											lineNumber={line.lineNumber}
										/>
									))}
								</code>
							</pre>
						</section>
					)}
				</article>
			</div>
		</section>
	);
}
