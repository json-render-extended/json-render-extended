import { execFileSync } from "node:child_process";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageDirectories = [
	"packages/json-render-extended",
	"packages/json-render-icons",
	"packages/json-render-playground",
	"packages/json-render-shadcn",
];
const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "json-render-extended-pack-"));

try {
	for (const packageDirectory of packageDirectories) {
		const packageRoot = path.join(repositoryRoot, packageDirectory);
		const before = new Set(await readdir(temporaryDirectory));
		execFileSync("pnpm", ["pack", "--pack-destination", temporaryDirectory], {
			cwd: packageRoot,
			stdio: "pipe",
		});
		const archiveName = (await readdir(temporaryDirectory)).find((name) => !before.has(name));
		if (!archiveName) throw new Error(`pnpm pack produced no archive for ${packageDirectory}.`);
		const archivePath = path.join(temporaryDirectory, archiveName);
		const entries = execFileSync("tar", ["-tzf", archivePath], { encoding: "utf8" })
			.trim()
			.split("\n");
		const manifest = JSON.parse(
			execFileSync("tar", ["-xOzf", archivePath, "package/package.json"], {
				encoding: "utf8",
			}),
		);

		for (const requiredFile of ["LICENSE", "README.md", "CHANGELOG.md"]) {
			assertArchiveEntry(entries, requiredFile, manifest.name);
		}
		if (manifest.name === "@json-render-extended/icons") {
			assertArchiveEntry(entries, "THIRD_PARTY_NOTICES.md", manifest.name);
		}
		if (manifest.name === "@json-render-extended/shadcn") {
			assertArchiveEntry(entries, "THIRD_PARTY_NOTICES.md", manifest.name);
			assertArchiveEntry(entries, "src/generated/upstream-lock.json", manifest.name);
		}

		assertNoWorkspaceProtocols(manifest);
		for (const target of collectPublicTargets(manifest)) {
			assertArchiveEntry(entries, target, manifest.name);
		}

		const archiveSize = (await readFile(archivePath)).byteLength;
		process.stdout.write(
			`Checked ${manifest.name}@${manifest.version}: ${entries.length} files, ${formatBytes(archiveSize)} packed.\n`,
		);
	}
} finally {
	await rm(temporaryDirectory, { force: true, recursive: true });
}

function assertArchiveEntry(entries, target, packageName) {
	const normalizedTarget = target.replace(/^\.\//, "");
	if (!entries.includes(`package/${normalizedTarget}`)) {
		throw new Error(`${packageName} archive is missing ${normalizedTarget}.`);
	}
}

function assertNoWorkspaceProtocols(manifest) {
	for (const field of ["dependencies", "optionalDependencies", "peerDependencies"]) {
		for (const [dependency, range] of Object.entries(manifest[field] ?? {})) {
			if (typeof range === "string" && range.startsWith("workspace:")) {
				throw new Error(`${manifest.name} keeps workspace protocol for ${dependency} in ${field}.`);
			}
		}
	}
}

function collectPublicTargets(manifest) {
	const targets = new Set();
	for (const field of ["main", "module", "types"]) {
		if (typeof manifest[field] === "string") targets.add(manifest[field]);
	}
	for (const target of Object.values(manifest.bin ?? {})) {
		if (typeof target === "string") targets.add(target);
	}
	collectExportTargets(manifest.exports, targets);
	return targets;
}

function collectExportTargets(value, targets) {
	if (typeof value === "string") {
		targets.add(value);
		return;
	}
	if (!value || typeof value !== "object") return;
	for (const nested of Object.values(value)) collectExportTargets(nested, targets);
}

function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
	return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}
