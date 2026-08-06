import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
	cpSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const generatedRoot = join(repositoryRoot, "packages/json-render-shadcn/src/generated");
const npmCache = join(tmpdir(), "json-render-shadcn-npm-cache");
const lockPath = join(generatedRoot, "upstream-lock.json");
const shadcnRepository = "https://github.com/shadcn-ui/ui.git";
const shadcnRegistryEndpoint = "https://ui.shadcn.com/r";
const shadcnCli = fileURLToPath(import.meta.resolve("shadcn"));
const biomeCli = join(repositoryRoot, "node_modules/@biomejs/biome/bin/biome");
const pinnedCommit = "607e8a9717fe6ff0d374ba74c651012f9c052534";
const jsonRenderCommit = "9d3dfc8917c1c6aa5568acbe0969523f3307376c";
const bases = {
	base: "base-ui",
	aria: "react-aria",
	radix: "radix",
};

const args = new Set(process.argv.slice(2));
const sourceArgumentIndex = process.argv.indexOf("--source");
const styleArgumentIndex = process.argv.indexOf("--style");
const providedSource =
	sourceArgumentIndex === -1 ? undefined : resolve(process.argv[sourceArgumentIndex + 1] ?? "");
const lockedStyle = existsSync(lockPath)
	? JSON.parse(readFileSync(lockPath, "utf8")).shadcn?.generatedStyle
	: undefined;
const generatedStyle =
	styleArgumentIndex === -1
		? (lockedStyle ?? "nova")
		: (process.argv[styleArgumentIndex + 1] ?? "");
const checkOnly = args.has("--check");
const update = args.has("--update");
const checkLatest = args.has("--check-latest");

function run(command, commandArgs, options = {}) {
	const output = execFileSync(command, commandArgs, {
		encoding: "utf8",
		env: {
			...process.env,
			npm_config_cache: npmCache,
		},
		stdio: options.capture ? "pipe" : "inherit",
		...options,
	});
	return typeof output === "string" ? output.trim() : "";
}

function checkoutSource() {
	if (providedSource) {
		if (!existsSync(join(providedSource, ".git"))) {
			throw new Error(`--source is not a Git checkout: ${providedSource}`);
		}
		return { path: providedSource, temporary: false };
	}

	const checkout = mkdtempSync(join(tmpdir(), "json-render-shadcn-sync-"));
	run("git", ["clone", "--filter=blob:none", "--no-checkout", shadcnRepository, checkout]);
	const revision = update || checkLatest ? "origin/main" : pinnedCommit;
	run("git", ["-C", checkout, "sparse-checkout", "init", "--cone"]);
	run("git", [
		"-C",
		checkout,
		"sparse-checkout",
		"set",
		"apps/v4/registry/bases",
		"apps/v4/registry/styles",
	]);
	run("git", ["-C", checkout, "checkout", revision]);
	return { path: checkout, temporary: true };
}

function listRegistryNames(sourceRoot, base) {
	const registryFile = join(sourceRoot, "apps/v4/registry/bases", base, "ui/_registry.ts");
	const source = readFileSync(registryFile, "utf8");
	return [...source.matchAll(/\bname:\s*"([^"]+)"/g)]
		.map((match) => match[1])
		.filter(Boolean)
		.sort();
}

function listStyleNames(sourceRoot) {
	const stylesRoot = join(sourceRoot, "apps/v4/registry/styles");
	return readdirSync(stylesRoot)
		.map((file) => file.match(/^style-(.+)\.css$/)?.[1])
		.filter(Boolean)
		.sort();
}

function transformSource(source, base) {
	return source
		.replaceAll(`@/registry/bases/${base}/lib/utils`, "../lib/utils")
		.replaceAll("@/lib/utils", "../lib/utils")
		.replaceAll("@/components/ui/", "./")
		.replaceAll("@/hooks/", "../hooks/");
}

function writeSyncProject(projectRoot, base, style) {
	mkdirSync(join(projectRoot, "src"), { recursive: true });
	writeFileSync(
		join(projectRoot, "package.json"),
		`${JSON.stringify({ name: `shadcn-${base}-sync`, private: true }, null, 2)}\n`,
	);
	writeFileSync(
		join(projectRoot, "components.json"),
		`${JSON.stringify(
			{
				$schema: "https://ui.shadcn.com/schema.json",
				style: `${base}-${style}`,
				rsc: true,
				tsx: true,
				tailwind: {
					config: "",
					css: "src/styles.css",
					baseColor: "neutral",
					cssVariables: true,
				},
				iconLibrary: "lucide",
				aliases: {
					components: "@/components",
					hooks: "@/hooks",
					lib: "@/lib",
					utils: "@/lib/utils",
					ui: "@/components/ui",
				},
				rtl: false,
				menuColor: "default",
				menuAccent: "subtle",
			},
			null,
			2,
		)}\n`,
	);
	writeFileSync(
		join(projectRoot, "tsconfig.json"),
		`${JSON.stringify(
			{
				compilerOptions: {
					baseUrl: ".",
					paths: { "@/*": ["./src/*"] },
				},
			},
			null,
			2,
		)}\n`,
	);
	writeFileSync(join(projectRoot, "src/styles.css"), '@import "tailwindcss";\n');
}

function copyResolvedFiles(sourceDirectory, destinationDirectory, base) {
	if (!existsSync(sourceDirectory)) return;
	mkdirSync(destinationDirectory, { recursive: true });
	for (const entry of readdirSync(sourceDirectory)) {
		const sourcePath = join(sourceDirectory, entry);
		const destinationPath = join(destinationDirectory, entry);
		if (statSync(sourcePath).isDirectory()) {
			copyResolvedFiles(sourcePath, destinationPath, base);
		} else {
			writeFileSync(destinationPath, transformSource(readFileSync(sourcePath, "utf8"), base));
		}
	}
}

function hashDirectory(directory) {
	const hash = createHash("sha256");
	const visit = (current) => {
		for (const entry of readdirSync(current).sort()) {
			const path = join(current, entry);
			if (statSync(path).isDirectory()) {
				visit(path);
			} else {
				hash.update(relative(directory, path));
				hash.update(readFileSync(path));
			}
		}
	};
	visit(directory);
	return hash.digest("hex");
}

function hashFile(path) {
	return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function normalizeGeneratedSources(destination) {
	run(
		biomeCli,
		["format", "--write", "--config-path", join(repositoryRoot, "biome.json"), destination],
		{
			cwd: repositoryRoot,
		},
	);
	run(
		biomeCli,
		[
			"check",
			"--write",
			"--only=assist/source/organizeImports",
			"--config-path",
			join(repositoryRoot, "biome.json"),
			destination,
		],
		{ cwd: repositoryRoot },
	);
}

function generate(sourceRoot, destination) {
	rmSync(destination, { recursive: true, force: true });
	mkdirSync(destination, { recursive: true });
	const availableStyles = listStyleNames(sourceRoot);
	if (!availableStyles.includes(generatedStyle)) {
		throw new Error(
			`Unknown shadcn style "${generatedStyle}". Available styles: ${availableStyles.join(", ")}`,
		);
	}
	const styleChecksums = Object.fromEntries(
		availableStyles.map((style) => [
			style,
			hashFile(join(sourceRoot, "apps/v4/registry/styles", `style-${style}.css`)),
		]),
	);

	const matrix = {};
	for (const [upstreamBase, publicBase] of Object.entries(bases)) {
		const upstreamRoot = join(sourceRoot, "apps/v4/registry/bases", upstreamBase);
		const destinationRoot = join(destination, publicBase);
		const availableComponents = listRegistryNames(sourceRoot, upstreamBase);
		const syncProject = mkdtempSync(join(tmpdir(), `json-render-shadcn-${upstreamBase}-`));
		writeSyncProject(syncProject, upstreamBase, generatedStyle);
		run(process.execPath, [
			shadcnCli,
			"add",
			...availableComponents,
			"--cwd",
			syncProject,
			"--yes",
			"--overwrite",
			"--silent",
		]);
		copyResolvedFiles(
			join(syncProject, "src/components/ui"),
			join(destinationRoot, "ui"),
			upstreamBase,
		);
		copyResolvedFiles(join(syncProject, "src/hooks"), join(destinationRoot, "hooks"), upstreamBase);
		rmSync(syncProject, { recursive: true, force: true });

		const utilsSource = join(upstreamRoot, "lib/utils.ts");
		mkdirSync(join(destinationRoot, "lib"), { recursive: true });
		cpSync(utilsSource, join(destinationRoot, "lib/utils.ts"));
		matrix[publicBase] = availableComponents;
	}

	const registryUnion = [...new Set(Object.values(matrix).flat())].sort();
	const commonComponents = registryUnion.filter((component) =>
		Object.values(matrix).every((components) => components.includes(component)),
	);
	writeFileSync(
		join(destination, "capabilities.ts"),
		`export const shadcnRegistryCapabilities = ${JSON.stringify(matrix, null, 2)} as const;\n\n` +
			`export const commonShadcnComponentNames = ${JSON.stringify(commonComponents, null, 2)} as const;\n\n` +
			`export const allShadcnComponentNames = ${JSON.stringify(registryUnion, null, 2)} as const;\n\n` +
			`export const shadcnStyleNames = ${JSON.stringify(availableStyles, null, 2)} as const;\n\n` +
			`export const generatedShadcnStyle = ${JSON.stringify(generatedStyle)} as const;\n`,
	);
	normalizeGeneratedSources(destination);
	const generatedSourceChecksums = Object.fromEntries(
		Object.values(bases).map((publicBase) => [
			publicBase,
			hashDirectory(join(destination, publicBase)),
		]),
	);

	const revision = run("git", ["-C", sourceRoot, "rev-parse", "HEAD"], {
		capture: true,
	});
	writeFileSync(
		join(destination, "upstream-lock.json"),
		`${JSON.stringify(
			{
				generatedAt: new Date().toISOString(),
				shadcn: {
					repository: shadcnRepository,
					commit: revision,
					cli: "4.16.1",
					generatedStyle,
					availableStyles,
					styleChecksums,
					componentRegistryEndpoint: shadcnRegistryEndpoint,
					generatedSourceChecksums,
					registryMatrix: matrix,
					commonComponents,
					registryUnion,
				},
				jsonRender: {
					package: "@json-render/shadcn@0.19.0",
					commit: jsonRenderCommit,
				},
			},
			null,
			2,
		)}\n`,
	);
	normalizeGeneratedSources(destination);
}

const checkout = checkoutSource();
try {
	const revision = run("git", ["-C", checkout.path, "rev-parse", "HEAD"], {
		capture: true,
	});

	if (checkLatest) {
		const locked = JSON.parse(readFileSync(lockPath, "utf8"));
		if (locked.shadcn.commit !== revision) {
			throw new Error(`shadcn drift detected: pinned ${locked.shadcn.commit}, latest ${revision}`);
		}
		process.stdout.write(`shadcn is current at ${revision}\n`);
		process.exit(0);
	}

	if (checkOnly) {
		const candidate = mkdtempSync(join(tmpdir(), "json-render-shadcn-candidate-"));
		try {
			generate(checkout.path, candidate);
			const actualLock = JSON.parse(readFileSync(lockPath, "utf8"));
			const candidateLockPath = join(candidate, "upstream-lock.json");
			const candidateLock = JSON.parse(readFileSync(candidateLockPath, "utf8"));
			candidateLock.generatedAt = actualLock.generatedAt;
			writeFileSync(candidateLockPath, `${JSON.stringify(candidateLock, null, 2)}\n`);
			normalizeGeneratedSources(candidate);
			if (hashDirectory(candidate) !== hashDirectory(generatedRoot)) {
				throw new Error("generated shadcn sources are out of sync; run pnpm sync:shadcn");
			}
			process.stdout.write(`generated sources match ${revision}\n`);
		} finally {
			rmSync(candidate, { recursive: true, force: true });
		}
	} else {
		generate(checkout.path, generatedRoot);
		process.stdout.write(`synchronized shadcn sources at ${revision}\n`);
	}
} finally {
	if (checkout.temporary) {
		rmSync(checkout.path, { recursive: true, force: true });
	}
}
