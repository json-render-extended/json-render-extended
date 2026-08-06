import { createHash, randomUUID } from "node:crypto";
import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, extname, relative, resolve } from "node:path";

import {
	type AuthoringRuntimeComposition,
	resolveExtensionProject,
	resolveProjectAuthoringProviders,
} from "@json-render-extended/core";

import { componentNameFromOutput } from "./component-name";
import { formatProjectSource } from "./format";
import {
	type MaterializedComponentRegistration,
	renderLocalMaterializedRegistry,
} from "./local-registry";
import { digestSpec } from "./session";
import { extractSpecComponentProps } from "./spec-props";
import { normalizeSpecId, ProjectSpecStore, resolveTargetProject } from "./spec-store";

export const materializationProtocol = "json-render-extended-materialization/v1" as const;

export interface MaterializeSpecOptions {
	cwd?: string;
	project?: string;
	specDirectory?: string;
	specId: string;
	providerId?: string;
	output: string;
}

export interface MaterializationReceipt {
	protocol: typeof materializationProtocol;
	specId: string;
	specPath: string;
	sourceDigest: string;
	providerId: string;
	component: MaterializedComponentRegistration;
	runtimeCompositions: readonly AuthoringRuntimeComposition[];
	outputs: Array<{
		path: string;
		language: string;
		digest: string;
	}>;
}

export type MaterializationIssueCode =
	| "invalid-receipt"
	| "missing-output"
	| "missing-receipt"
	| "missing-spec"
	| "output-drift"
	| "spec-drift";

export interface MaterializationVerification {
	specId: string;
	receiptPath: string;
	current: boolean;
	issues: Array<{
		code: MaterializationIssueCode;
		message: string;
		path?: string;
	}>;
}

export async function materializeSpec(options: MaterializeSpecOptions) {
	const target = await resolveTargetProject(options);
	const project = await resolveExtensionProject({ cwd: target.projectRoot, runtime: "react" });
	const providers = await resolveProjectAuthoringProviders(project);
	const selected = options.providerId
		? providers.find(({ provider }) => provider.id === options.providerId)
		: providers[0];
	if (!selected)
		throw new Error(`No matching authoring provider was found in ${target.projectRoot}.`);
	const store = new ProjectSpecStore(target);
	const spec = await store.read(options.specId);
	const sourceDigest = digestSpec(spec.value);
	const outputPath = resolve(target.projectRoot, options.output);
	assertInside(target.projectRoot, outputPath, "materialized output");
	const codegenContext = {
		componentName: componentNameFromOutput(outputPath, options.specId),
		componentProps: extractSpecComponentProps(spec.value),
		specId: options.specId,
		sourceDigest,
		outputPath,
	};
	const prepared = await selected.provider.prepareMaterialization?.(spec.value, codegenContext);
	const generated = await selected.provider.generateCode(spec.value, codegenContext);
	await atomicWrite(outputPath, `${generated.code.trimEnd()}\n`);
	await formatProjectSource(target.packageJsonPath, outputPath);
	const materializedSource = await readFile(outputPath, "utf8");

	const relativeOutput = relative(target.projectRoot, outputPath).replaceAll("\\", "/");
	const receiptPath = resolve(
		target.projectRoot,
		"json-render/materializations",
		`${options.specId}.json`,
	);
	const previous = await readReceipt(receiptPath);
	const outputReceipt = {
		path: relativeOutput,
		language: generated.language,
		digest: digestText(materializedSource.trimEnd()),
	};
	const receipt: MaterializationReceipt = {
		protocol: materializationProtocol,
		specId: options.specId,
		specPath: relative(target.projectRoot, store.pathFor(options.specId)).replaceAll("\\", "/"),
		sourceDigest,
		providerId: selected.provider.id,
		component: {
			specId: options.specId,
			key: codegenContext.componentName,
			module: withoutModuleExtension(relativeOutput),
			export: codegenContext.componentName,
			props: codegenContext.componentProps,
		},
		runtimeCompositions: prepared?.runtimeCompositions ?? [],
		outputs: [
			...(previous?.outputs.filter((entry) => entry.path !== relativeOutput) ?? []),
			outputReceipt,
		].sort((left, right) => left.path.localeCompare(right.path)),
	};
	const receipts = (await loadReceipts(resolve(target.projectRoot, "json-render/materializations")))
		.filter((entry) => entry.path !== receiptPath)
		.map((entry) => entry.receipt);
	const localRegistry = renderLocalMaterializedRegistry(target.projectRoot, [...receipts, receipt]);
	await atomicWrite(receiptPath, `${JSON.stringify(receipt, null, "\t")}\n`);
	await atomicWrite(localRegistry.catalogPath, localRegistry.catalogSource);
	await atomicWrite(localRegistry.registryPath, localRegistry.registrySource);
	await atomicWrite(localRegistry.manifestPath, localRegistry.manifestSource);
	await formatProjectSource(target.packageJsonPath, receiptPath);
	await formatProjectSource(target.packageJsonPath, localRegistry.catalogPath);
	await formatProjectSource(target.packageJsonPath, localRegistry.manifestPath);
	await formatProjectSource(target.packageJsonPath, localRegistry.registryPath);
	return {
		project: target,
		receipt,
		receiptPath,
		outputPath,
		diagnostics: [...(prepared?.diagnostics ?? []), ...(generated.diagnostics ?? [])],
		installed: prepared?.installed ?? [],
		localRegistry: {
			catalogPath: localRegistry.catalogPath,
			manifestPath: localRegistry.manifestPath,
			registryPath: localRegistry.registryPath,
		},
	};
}

export async function verifyMaterializations(
	options: Pick<MaterializeSpecOptions, "cwd" | "project" | "specDirectory"> & {
		specId?: string;
	},
) {
	const target = await resolveTargetProject(options);
	const store = new ProjectSpecStore(target);
	const receiptDirectory = resolve(target.projectRoot, "json-render/materializations");
	const receiptPaths = options.specId
		? [resolve(receiptDirectory, `${normalizeSpecId(options.specId)}.json`)]
		: await listJsonFiles(receiptDirectory);
	const results = await Promise.all(
		receiptPaths.map((receiptPath) => verifyReceipt(target.projectRoot, store, receiptPath)),
	);
	return {
		project: target,
		current: results.every((result) => result.current),
		results,
	};
}

async function verifyReceipt(
	projectRoot: string,
	store: ProjectSpecStore,
	receiptPath: string,
): Promise<MaterializationVerification> {
	const fallbackSpecId = relative(resolve(projectRoot, "json-render/materializations"), receiptPath)
		.replaceAll("\\", "/")
		.replace(/\.json$/, "");
	let receiptSource: string;
	try {
		receiptSource = await readFile(receiptPath, "utf8");
	} catch {
		return verification(fallbackSpecId, receiptPath, [
			{
				code: "missing-receipt",
				message: `Materialization receipt ${receiptPath} does not exist.`,
			},
		]);
	}

	let receipt: MaterializationReceipt;
	try {
		receipt = JSON.parse(receiptSource) as MaterializationReceipt;
		if (
			receipt.protocol !== materializationProtocol ||
			typeof receipt.specId !== "string" ||
			typeof receipt.sourceDigest !== "string" ||
			!receipt.component ||
			typeof receipt.component.key !== "string" ||
			!Array.isArray(receipt.runtimeCompositions) ||
			!Array.isArray(receipt.outputs)
		) {
			throw new Error("Unsupported receipt shape.");
		}
	} catch {
		return verification(fallbackSpecId, receiptPath, [
			{
				code: "invalid-receipt",
				message: `Materialization receipt ${receiptPath} is invalid.`,
			},
		]);
	}

	const issues: MaterializationVerification["issues"] = [];
	try {
		const spec = await store.read(receipt.specId);
		if (digestSpec(spec.value) !== receipt.sourceDigest) {
			issues.push({
				code: "spec-drift",
				message: `Spec ${receipt.specId} changed after its component was materialized.`,
				path: relative(projectRoot, store.pathFor(receipt.specId)).replaceAll("\\", "/"),
			});
		}
	} catch {
		issues.push({
			code: "missing-spec",
			message: `Spec ${receipt.specId} no longer exists.`,
			path: receipt.specPath,
		});
	}

	for (const output of receipt.outputs) {
		const outputPath = resolve(projectRoot, output.path);
		try {
			assertInside(projectRoot, outputPath, "materialized output");
			const source = await readFile(outputPath, "utf8");
			if (digestText(source.trimEnd()) !== output.digest) {
				issues.push({
					code: "output-drift",
					message: `Materialized output ${output.path} was edited after generation.`,
					path: output.path,
				});
			}
		} catch (error) {
			issues.push({
				code: "missing-output",
				message:
					error instanceof Error && error.message.includes("must stay inside")
						? `Materialized output ${output.path} points outside the target project.`
						: `Materialized output ${output.path} does not exist.`,
				path: output.path,
			});
		}
	}

	return verification(receipt.specId, receiptPath, issues);
}

function verification(
	specId: string,
	receiptPath: string,
	issues: MaterializationVerification["issues"],
): MaterializationVerification {
	return { specId, receiptPath, current: issues.length === 0, issues };
}

async function listJsonFiles(directory: string): Promise<string[]> {
	try {
		const entries = await readdir(directory, { recursive: true, withFileTypes: true });
		return entries
			.filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
			.map((entry) => resolve(entry.parentPath, entry.name))
			.sort((left, right) => left.localeCompare(right));
	} catch {
		return [];
	}
}

async function readReceipt(path: string): Promise<MaterializationReceipt | null> {
	try {
		const value = JSON.parse(await readFile(path, "utf8")) as MaterializationReceipt;
		return value.protocol === materializationProtocol ? value : null;
	} catch {
		return null;
	}
}

async function loadReceipts(directory: string) {
	const paths = await listJsonFiles(directory);
	const values = await Promise.all(
		paths.map(async (path) => ({ path, receipt: await readReceipt(path) })),
	);
	return values.filter(
		(value): value is { path: string; receipt: MaterializationReceipt } =>
			value.receipt !== null &&
			value.receipt.component !== undefined &&
			Array.isArray(value.receipt.runtimeCompositions),
	);
}

async function atomicWrite(path: string, source: string) {
	await mkdir(dirname(path), { recursive: true });
	const temporaryPath = `${path}.${process.pid}.${randomUUID()}.tmp`;
	await writeFile(temporaryPath, source, "utf8");
	await rename(temporaryPath, path);
}

function digestText(source: string) {
	return `sha256:${createHash("sha256").update(source).digest("hex")}`;
}

function withoutModuleExtension(path: string) {
	const extension = extname(path);
	return [".cts", ".jsx", ".mts", ".tsx", ".ts"].includes(extension)
		? path.slice(0, -extension.length)
		: path;
}

function assertInside(parent: string, child: string, label: string) {
	const value = relative(parent, child);
	if (value.startsWith("..") || value === "..") {
		throw new Error(`The ${label} must stay inside ${parent}.`);
	}
}
