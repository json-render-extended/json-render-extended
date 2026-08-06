#!/usr/bin/env node

import { resolveProjectIconSet } from "./project";

interface CliOptions {
	cwd?: string;
	preferredName?: string;
	json: boolean;
}

async function main() {
	const args = process.argv.slice(2);
	const command = args[0] && !args[0].startsWith("-") ? args.shift() : "detect";
	if (command === "help" || args.includes("--help") || args.includes("-h")) {
		printHelp();
		return;
	}
	if (command !== "detect") throw new Error(`Unknown command: ${command}`);
	const options = parseOptions(args);
	const result = await resolveProjectIconSet({
		cwd: options.cwd,
		preferredName: options.preferredName,
	});
	if (options.json) {
		process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
		return;
	}
	process.stdout.write(`${formatResult(result)}\n`);
}

function parseOptions(args: string[]): CliOptions {
	const options: CliOptions = { json: false };
	for (let index = 0; index < args.length; index += 1) {
		const argument = args[index];
		if (argument === "--json") {
			options.json = true;
			continue;
		}
		if (argument === "--cwd" || argument === "--icon-set") {
			const value = args[index + 1];
			if (!value) throw new Error(`${argument} requires a value.`);
			index += 1;
			if (argument === "--cwd") options.cwd = value;
			if (argument === "--icon-set") options.preferredName = value;
			continue;
		}
		throw new Error(`Unknown option: ${argument}`);
	}
	return options;
}

function formatResult(result: Awaited<ReturnType<typeof resolveProjectIconSet>>) {
	switch (result.status) {
		case "detected":
			return `Detected ${result.iconSet?.name} from ${result.iconSet?.packageName}. JSON Render catalog: ${result.iconSet?.catalog.module}; React registry: ${result.iconSet?.registry.module}.`;
		case "ambiguous":
			return `Multiple icon sets are declared (${result.candidates.map((candidate) => candidate.name).join(", ")}). Select one with --icon-set.`;
		case "missing-package-json":
			return "No package.json was found. No icon set was selected.";
		case "not-found":
			return `No supported or self-describing icon set was found in ${result.packageJsonPath}.`;
	}
}

function printHelp() {
	process.stdout.write(
		`json-render-icons detect [options]\n\nOptions:\n  --cwd <path>          Project directory\n  --icon-set <name>     Select one set when multiple libraries are installed\n  --json                Print machine-readable output\n  -h, --help            Show this help\n`,
	);
}

main().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
	process.exitCode = 1;
});
