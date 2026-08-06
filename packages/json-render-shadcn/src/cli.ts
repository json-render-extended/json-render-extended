#!/usr/bin/env node

import { relative, resolve } from "node:path";

import { generateShadcnProjectModule, type LocalProjectExtension } from "./project";

async function main() {
	const args = process.argv.slice(2);
	const command = args[0] && !args[0].startsWith("-") ? args.shift() : "generate";
	if (command === "help" || args.includes("--help") || args.includes("-h")) {
		printHelp();
		return;
	}
	if (command !== "generate") throw new Error(`Unknown command: ${command}`);

	const cwd = resolve(readOption(args, "--cwd") ?? process.cwd());
	const output = readOption(args, "--output");
	const manifestName = readOption(args, "--manifest-name");
	const localCatalog = readOption(args, "--local-catalog");
	const localRegistry = readOption(args, "--local-registry");
	if ((localCatalog && !localRegistry) || (!localCatalog && localRegistry)) {
		throw new Error("--local-catalog and --local-registry must be provided together.");
	}
	const localExtensions: LocalProjectExtension[] = [];
	if (localCatalog && localRegistry) {
		localExtensions.push({
			name: "local",
			catalog: parseModuleReference(localCatalog, "componentDefinitions"),
			registry: parseModuleReference(localRegistry, "components"),
		});
	}

	const generated = await generateShadcnProjectModule({
		cwd,
		output,
		manifestName,
		strict: args.includes("--strict"),
		localExtensions,
	});
	for (const diagnostic of generated.project.diagnostics) {
		process.stderr.write(`warning: ${diagnostic.message}\n`);
	}
	process.stdout.write(
		`Generated ${relative(cwd, generated.outputPath)} for ${generated.project.base}/${generated.project.style} with ${generated.project.iconLibrary?.name ?? "no"} icons, ${generated.project.providers.length} registry provider(s) and ${generated.project.extensions.length} installed or package extension(s).\n`,
	);
}

function readOption(args: string[], name: string): string | undefined {
	const index = args.indexOf(name);
	if (index === -1) return undefined;
	const value = args[index + 1];
	if (!value || value.startsWith("--")) throw new Error(`${name} requires a value.`);
	return value;
}

function parseModuleReference(value: string, defaultExport: string) {
	const separator = value.lastIndexOf("#");
	if (separator === -1) return { module: value, export: defaultExport };
	return { module: value.slice(0, separator), export: value.slice(separator + 1) };
}

function printHelp() {
	process.stdout.write(`json-render-shadcn generate [options]

Read components.json, detect an icon library from package.json, discover JSON Render extensions in configured shadcn
registries and installed item manifests, then generate a statically importable catalog/runtime module.

Options:
  --cwd <path>                 Project root. Defaults to the current directory.
  --output <path>              Generated module. Defaults to json-render-extended.generated.ts.
  --manifest-name <name>       Well-known registry item. Defaults to json-render-extended.
  --local-catalog <module#exp> Add a local catalog module after ecosystem extensions.
  --local-registry <module#exp> Add its matching runtime component module.
  --strict                     Fail on invalid or unreachable extension manifests.

Installed registry items are discovered from lib/json-render-extended/manifests.
`);
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
	process.exitCode = 1;
});
