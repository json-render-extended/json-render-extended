import { randomUUID } from "node:crypto";
import { access, mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";

export const defaultSpecDirectory = "json-render/specs";

export interface ResolveTargetProjectOptions {
	cwd?: string;
	project?: string;
	specDirectory?: string;
}

export interface ResolvedTargetProject {
	repositoryRoot: string;
	projectRoot: string;
	packageJsonPath: string;
	projectName: string;
	specDirectory: string;
}

export class ProjectSpecStore {
	readonly directory: string;

	constructor(readonly project: ResolvedTargetProject) {
		this.directory = project.specDirectory;
	}

	async ensure() {
		await mkdir(this.directory, { recursive: true });
	}

	async list(): Promise<string[]> {
		await this.ensure();
		const ids: string[] = [];
		await visitJsonFiles(this.directory, this.directory, ids);
		return ids.sort();
	}

	async has(id: string) {
		try {
			await access(this.pathFor(id));
			return true;
		} catch {
			return false;
		}
	}

	async read(id: string): Promise<{ source: string; value: unknown }> {
		const path = this.pathFor(id);
		const source = await readFile(path, "utf8");
		return { source, value: JSON.parse(source) as unknown };
	}

	async write(id: string, value: unknown): Promise<string> {
		const path = this.pathFor(id);
		await mkdir(dirname(path), { recursive: true });
		const source = `${JSON.stringify(value, null, "\t")}\n`;
		const temporaryPath = `${path}.${process.pid}.${randomUUID()}.tmp`;
		await writeFile(temporaryPath, source, "utf8");
		await rename(temporaryPath, path);
		return source;
	}

	pathFor(id: string): string {
		const normalized = normalizeSpecId(id);
		const path = resolve(this.directory, `${normalized}.json`);
		const relativePath = relative(this.directory, path);
		if (relativePath.startsWith("..") || relativePath === "") {
			throw new Error(`Invalid spec id ${id}.`);
		}
		return path;
	}
}

export async function resolveTargetProject(
	options: ResolveTargetProjectOptions = {},
): Promise<ResolvedTargetProject> {
	const cwd = resolve(options.cwd ?? process.cwd());
	const repositoryRoot = await findRepositoryRoot(cwd);
	const requestedRoot = options.project ? resolve(repositoryRoot, options.project) : cwd;
	const packageJsonPath = await findClosestPackageJson(requestedRoot);
	const projectRoot = packageJsonPath ? dirname(packageJsonPath) : requestedRoot;
	if (!packageJsonPath || (options.project && projectRoot !== requestedRoot)) {
		throw new Error(
			`The playground target ${projectRoot} must be a package or application with its own package.json.`,
		);
	}
	assertInside(repositoryRoot, projectRoot, "project");
	const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
		name?: unknown;
	};
	const specDirectory = resolve(projectRoot, options.specDirectory ?? defaultSpecDirectory);
	assertInside(projectRoot, specDirectory, "spec directory");
	return {
		repositoryRoot,
		projectRoot,
		packageJsonPath,
		projectName:
			typeof packageJson.name === "string"
				? packageJson.name
				: relative(repositoryRoot, projectRoot),
		specDirectory,
	};
}

export function normalizeSpecId(value: string) {
	const id = value
		.trim()
		.replace(/\\/g, "/")
		.replace(/\.json$/i, "");
	if (
		id.length === 0 ||
		id.startsWith("/") ||
		id.split("/").some((segment) => !/^[a-z0-9][a-z0-9._-]*$/i.test(segment))
	) {
		throw new Error(`Invalid spec id ${value}. Use letters, numbers, dots, dashes, and folders.`);
	}
	return id;
}

async function visitJsonFiles(root: string, directory: string, ids: string[]) {
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) {
			await visitJsonFiles(root, path, ids);
		} else if (entry.isFile() && entry.name.endsWith(".json")) {
			ids.push(
				relative(root, path)
					.split(sep)
					.join("/")
					.replace(/\.json$/, ""),
			);
		}
	}
}

async function findRepositoryRoot(start: string) {
	let directory = resolve(start);
	let packageRoot: string | null = null;
	while (true) {
		if (await exists(resolve(directory, "package.json"))) packageRoot ??= directory;
		if (
			(await exists(resolve(directory, "pnpm-workspace.yaml"))) ||
			(await exists(resolve(directory, ".git")))
		) {
			return directory;
		}
		const parent = dirname(directory);
		if (parent === directory) return packageRoot ?? start;
		directory = parent;
	}
}

async function findClosestPackageJson(start: string) {
	let directory = resolve(start);
	while (true) {
		const path = resolve(directory, "package.json");
		if (await exists(path)) return path;
		const parent = dirname(directory);
		if (parent === directory) return null;
		directory = parent;
	}
}

function assertInside(parent: string, child: string, label: string) {
	const value = relative(parent, child);
	if (value.startsWith("..") || value === "..") {
		throw new Error(`The ${label} must stay inside ${parent}.`);
	}
}

async function exists(path: string) {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}
