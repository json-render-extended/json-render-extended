#!/usr/bin/env node

import { relative, resolve } from "node:path";

import { generateExtensionProjectModule, validateDeclaredExtensionCollisions } from "./generate";
import { resolveExtensionProject } from "./project";
import { parseModuleReference } from "./protocol";

async function main() {
	const args = process.argv.slice(2);
	const command = args[0] && !args[0].startsWith("-") ? args.shift() : "generate";
	if (command === "help" || args.includes("--help") || args.includes("-h")) {
		printHelp();
		return;
	}
	if (!command || !["generate", "inspect", "validate"].includes(command)) {
		throw new Error(`Unknown command: ${command}`);
	}

	const cwd = resolve(readOption(args, "--cwd") ?? process.cwd());
	const runtime = readOption(args, "--runtime");
	const configValue = readOption(args, "--config");
	const configPath = args.includes("--no-config") ? false : configValue;
	const extensions = readRepeatedOptions(args, "--extension").map((value) => {
		const reference = parseReferenceArgument(value);
		if (!reference) throw new Error(`Invalid extension module reference: ${value}`);
		return reference;
	});
	const strict = args.includes("--strict");

	if (command === "inspect" || command === "validate") {
		const project = await resolveExtensionProject({
			cwd,
			runtime,
			configPath,
			extensions,
			strict: command === "validate" || strict,
		});
		if (command === "inspect") {
			process.stdout.write(`${JSON.stringify(project, null, "\t")}\n`);
			return;
		}
		const collisions = validateDeclaredExtensionCollisions(project);
		if (collisions.length > 0) {
			throw new Error(collisions.map((diagnostic) => diagnostic.message).join("\n"));
		}
		process.stdout.write(
			`Validated ${project.extensions.length} extension(s) for runtime ${project.runtime}.\n`,
		);
		return;
	}

	const generated = await generateExtensionProjectModule({
		cwd,
		runtime,
		configPath,
		extensions,
		strict,
		output: readOption(args, "--output"),
	});
	for (const diagnostic of generated.project.diagnostics) {
		process.stderr.write(`${diagnostic.severity ?? "warning"}: ${diagnostic.message}\n`);
	}
	process.stdout.write(
		`Generated ${relative(cwd, generated.outputPath)} with ${generated.project.extensions.length} extension(s) for ${generated.project.runtime}.\n`,
	);
}

function readOption(args: string[], name: string): string | undefined {
	const index = args.indexOf(name);
	if (index === -1) return undefined;
	const value = args[index + 1];
	if (!value || value.startsWith("--")) throw new Error(`${name} requires a value.`);
	return value;
}

function readRepeatedOptions(args: string[], name: string): string[] {
	const values: string[] = [];
	for (let index = 0; index < args.length; index += 1) {
		if (args[index] !== name) continue;
		const value = args[index + 1];
		if (!value || value.startsWith("--")) throw new Error(`${name} requires a value.`);
		values.push(value);
		index += 1;
	}
	return values;
}

function parseReferenceArgument(value: string) {
	const separator = value.lastIndexOf("#");
	return parseModuleReference({
		module: separator === -1 ? value : value.slice(0, separator),
		export: separator === -1 ? "default" : value.slice(separator + 1),
	});
}

function printHelp() {
	process.stdout.write(`json-render-extended <command> [options]

Commands:
  generate    Discover extensions and generate a statically importable project module.
  inspect     Print the resolved extension project as JSON without generating source.
  validate    Resolve extensions strictly and fail on invalid manifests or declared collisions.

Options:
  --cwd <path>                  Project root. Defaults to the current directory.
  --output <path>               Generated module. Defaults to json-render-extended.generated.ts.
  --runtime <name>              Runtime registry to compose. Defaults to react.
  --config <path>               Explicit config module or JSON file.
  --no-config                   Disable automatic config discovery.
  --extension <module#export>   Add a local or installed extension. Repeatable.
  --strict                      Fail on extension diagnostics.

Installed direct dependencies opt in through the json-render-extended/v1 package manifest.
TypeScript, JavaScript, and JSON config files are supported.
`);
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
	process.exitCode = 1;
});
