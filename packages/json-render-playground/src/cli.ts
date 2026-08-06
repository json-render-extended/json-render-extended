#!/usr/bin/env node

import { materializeSpec, verifyMaterializations } from "./materialize";
import { startPlayground } from "./server";
import { buildSpecModule } from "./spec-module";

void main().catch((error) => {
	process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
	process.exitCode = 1;
});

async function main() {
	const options = parseArguments(process.argv.slice(2));
	if (options.command === "materialize") {
		if (!options.specId || !options.output) {
			throw new Error("materialize requires --spec and --output.");
		}
		const result = await materializeSpec({
			cwd: options.cwd,
			project: options.project,
			specDirectory: options.specDirectory,
			specId: options.specId,
			providerId: options.providerId,
			output: options.output,
		});
		const materialized = {
			event: "materialized",
			specId: result.receipt.specId,
			sourceDigest: result.receipt.sourceDigest,
			outputPath: result.outputPath,
			receiptPath: result.receiptPath,
			installed: result.installed,
			localRegistry: result.localRegistry,
			diagnostics: result.diagnostics,
		};
		process.stdout.write(
			options.json
				? `${JSON.stringify(materialized)}\n`
				: `Materialized ${materialized.specId} to ${materialized.outputPath}\nReceipt: ${materialized.receiptPath}\n`,
		);
		return;
	}
	if (options.command === "check") {
		const result = await verifyMaterializations({
			cwd: options.cwd,
			project: options.project,
			specDirectory: options.specDirectory,
			specId: options.specId,
		});
		if (options.json) {
			process.stdout.write(`${JSON.stringify(result)}\n`);
		} else if (result.results.length === 0) {
			process.stdout.write("No materialization receipts found.\n");
		} else {
			for (const verification of result.results) {
				process.stdout.write(
					verification.current
						? `Current: ${verification.specId}\n`
						: `Stale: ${verification.specId}\n${verification.issues
								.map((issue) => `  - ${issue.message}`)
								.join("\n")}\n`,
				);
			}
		}
		if (!result.current) process.exitCode = 1;
		return;
	}
	if (options.command === "build") {
		const result = await buildSpecModule({
			cwd: options.cwd,
			project: options.project,
			specDirectory: options.specDirectory,
			output: options.output,
			refreshMaterializations: options.refreshMaterializations,
		});
		const built = {
			event: "built-spec-module",
			outputPath: result.outputPath,
			specIds: result.specIds,
			diagnostics: result.diagnostics,
		};
		process.stdout.write(
			options.json
				? `${JSON.stringify(built)}\n`
				: `Built ${built.outputPath} with ${built.specIds.length} spec${built.specIds.length === 1 ? "" : "s"}.\n${built.diagnostics.map((diagnostic) => `- ${diagnostic}`).join("\n")}${built.diagnostics.length > 0 ? "\n" : ""}`,
		);
		return;
	}
	const playground = await startPlayground(options);
	const ready = {
		event: "ready",
		url: playground.url,
		apiUrl: playground.apiUrl,
		token: playground.token,
		sessionId: playground.session.id,
		projectRoot: playground.project.projectRoot,
		specDirectory: playground.project.specDirectory,
		specId: playground.session.state.specId,
	};

	if (options.json) {
		process.stdout.write(`${JSON.stringify(ready)}\n`);
	} else {
		process.stdout.write(`JSON Render Extended Playground\n\n${playground.url}\n\n`);
		process.stdout.write(
			`Project: ${playground.project.projectName}\nSpec: ${playground.session.state.specId}\nAPI: ${playground.apiUrl}\n`,
		);
	}

	for (const signal of ["SIGINT", "SIGTERM"] as const) {
		process.once(signal, () => {
			void playground.close().finally(() => process.exit(0));
		});
	}
}

function parseArguments(arguments_: string[]) {
	const options: Parameters<typeof startPlayground>[0] & {
		command: "build" | "check" | "materialize" | "start";
		json?: boolean;
		output?: string;
		refreshMaterializations?: boolean;
	} = { command: "start" };
	for (let index = 0; index < arguments_.length; index += 1) {
		const argument = arguments_[index];
		if (argument === "start") continue;
		if (argument === "check") {
			options.command = "check";
			continue;
		}
		if (argument === "materialize") {
			options.command = "materialize";
			continue;
		}
		if (argument === "build") {
			options.command = "build";
			continue;
		}
		if (argument === "--refresh-materialized") {
			options.refreshMaterializations = true;
			continue;
		}
		if (argument === "--json") {
			options.json = true;
			continue;
		}
		const next = arguments_[index + 1];
		if (!next) throw new Error(`${argument} requires a value.`);
		if (argument === "--cwd") options.cwd = next;
		else if (argument === "--project") options.project = next;
		else if (argument === "--spec-dir") options.specDirectory = next;
		else if (argument === "--spec") options.specId = next;
		else if (argument === "--preset") options.presetId = next;
		else if (argument === "--provider") options.providerId = next;
		else if (argument === "--port") options.port = Number.parseInt(next, 10);
		else if (argument === "--output") options.output = next;
		else throw new Error(`Unknown argument ${argument}.`);
		index += 1;
	}
	return options;
}
