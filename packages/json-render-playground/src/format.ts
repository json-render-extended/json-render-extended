import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

export async function formatProjectSource(packageJsonPath: string, outputPath: string) {
	const projectRequire = createRequire(packageJsonPath);
	let biomeManifestPath: string;
	try {
		biomeManifestPath = projectRequire.resolve("@biomejs/biome/package.json");
	} catch {
		return;
	}
	const biomeManifest = JSON.parse(await readFile(biomeManifestPath, "utf8")) as {
		bin?: string | Record<string, string>;
	};
	const relativeBinary =
		typeof biomeManifest.bin === "string"
			? biomeManifest.bin
			: (biomeManifest.bin?.biome ?? Object.values(biomeManifest.bin ?? {})[0]);
	if (!relativeBinary) return;
	const binary = resolve(dirname(biomeManifestPath), relativeBinary);
	await run(binary, ["check", "--write", outputPath], dirname(packageJsonPath));
}

async function run(command: string, args: string[], cwd: string) {
	await new Promise<void>((resolvePromise, reject) => {
		const child = spawn(command, args, {
			cwd,
			env: process.env,
			stdio: ["ignore", "pipe", "pipe"],
		});
		let stderr = "";
		child.stderr.on("data", (chunk) => {
			stderr += String(chunk);
		});
		child.once("error", reject);
		child.once("exit", (code) => {
			if (code === 0) resolvePromise();
			else reject(new Error(stderr.trim() || `${command} exited with code ${code ?? "unknown"}.`));
		});
	});
}
