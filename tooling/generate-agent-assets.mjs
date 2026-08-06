import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = resolve(repositoryRoot, "skills");
const outputRoot = resolve(repositoryRoot, "apps/docs/public/.well-known/agent-skills");
const discoverySchema = "https://schemas.agentskills.io/discovery/0.2.0/schema.json";
const skillNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const checkOnly = process.argv.includes("--check");

async function main() {
	const skills = await readSkills();
	if (checkOnly) {
		process.stdout.write(`Validated ${skills.length} Agent Skills source(s).\n`);
		return;
	}

	await mkdir(outputRoot, { recursive: true });
	const index = {
		$schema: discoverySchema,
		skills: [],
	};

	for (const skill of skills) {
		const archive = gzipSync(createTar(skill.files), { level: 9, mtime: 0 });
		const filename = `${skill.name}.tar.gz`;
		await writeIfChanged(resolve(outputRoot, filename), archive);
		index.skills.push({
			name: skill.name,
			type: "archive",
			description: skill.description,
			url: filename,
			digest: `sha256:${createHash("sha256").update(archive).digest("hex")}`,
		});
	}

	await writeIfChanged(
		resolve(outputRoot, "index.json"),
		Buffer.from(`${JSON.stringify(index, null, "\t")}\n`),
	);
	process.stdout.write(`Generated ${skills.length} Agent Skills archive(s).\n`);
}

async function readSkills() {
	const entries = await readdir(skillsRoot, { withFileTypes: true });
	const skills = [];
	for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
		if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
		const skillRoot = resolve(skillsRoot, entry.name);
		const skillPath = resolve(skillRoot, "SKILL.md");
		if (!existsSync(skillPath)) continue;
		const source = await readFile(skillPath, "utf8");
		const metadata = parseFrontmatter(source, skillPath);
		if (metadata.name !== entry.name) {
			throw new Error(`${skillPath} name must match its directory (${entry.name}).`);
		}
		if (!skillNamePattern.test(metadata.name) || metadata.name.length > 64) {
			throw new Error(`${skillPath} has an invalid Agent Skills name.`);
		}
		if (metadata.description.length > 1024) {
			throw new Error(`${skillPath} description exceeds 1,024 characters.`);
		}
		skills.push({
			...metadata,
			files: await readSkillFiles(skillRoot),
		});
	}
	if (skills.length === 0) throw new Error(`No Agent Skills found in ${skillsRoot}.`);
	return skills;
}

function parseFrontmatter(source, path) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
	if (!match) throw new Error(`${path} is missing YAML frontmatter.`);
	const name = readFrontmatterString(match[1], "name");
	const description = readFrontmatterString(match[1], "description");
	if (!name || !description) {
		throw new Error(`${path} requires non-empty name and description fields.`);
	}
	return { name, description };
}

function readFrontmatterString(frontmatter, field) {
	const match = frontmatter.match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
	if (!match) return "";
	const value = match[1].trim();
	if (
		(value.startsWith('"') && value.endsWith('"')) ||
		(value.startsWith("'") && value.endsWith("'"))
	) {
		return value.slice(1, -1);
	}
	return value;
}

async function readSkillFiles(skillRoot) {
	const files = [];
	async function visit(directory) {
		const entries = await readdir(directory, { withFileTypes: true });
		for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
			if (entry.name.startsWith(".")) continue;
			const path = resolve(directory, entry.name);
			if (entry.isDirectory()) {
				await visit(path);
				continue;
			}
			if (!entry.isFile()) continue;
			const archivePath = relative(skillRoot, path).replaceAll("\\", "/");
			if (Buffer.byteLength(archivePath) > 100) {
				throw new Error(`${path} is too long for the generated tar archive.`);
			}
			files.push({ path: archivePath, contents: await readFile(path) });
		}
	}
	await visit(skillRoot);
	return files;
}

function createTar(files) {
	const chunks = [];
	for (const file of files) {
		const header = Buffer.alloc(512);
		writeString(header, file.path, 0, 100);
		writeOctal(header, 0o644, 100, 8);
		writeOctal(header, 0, 108, 8);
		writeOctal(header, 0, 116, 8);
		writeOctal(header, file.contents.length, 124, 12);
		writeOctal(header, 0, 136, 12);
		header.fill(" ", 148, 156);
		header[156] = "0".charCodeAt(0);
		writeString(header, "ustar", 257, 6);
		writeString(header, "00", 263, 2);
		writeString(header, "json-render-extended", 265, 32);
		writeString(header, "json-render-extended", 297, 32);
		let checksum = 0;
		for (const value of header) checksum += value;
		const encodedChecksum = checksum.toString(8).padStart(6, "0");
		writeString(header, `${encodedChecksum}\0 `, 148, 8);
		chunks.push(header, file.contents);
		const padding = (512 - (file.contents.length % 512)) % 512;
		if (padding > 0) chunks.push(Buffer.alloc(padding));
	}
	chunks.push(Buffer.alloc(1024));
	return Buffer.concat(chunks);
}

function writeString(buffer, value, offset, length) {
	buffer.write(value, offset, Math.min(Buffer.byteLength(value), length), "utf8");
}

function writeOctal(buffer, value, offset, length) {
	const encoded = value.toString(8).padStart(length - 1, "0");
	writeString(buffer, `${encoded}\0`, offset, length);
}

async function writeIfChanged(path, contents) {
	let current;
	try {
		current = await readFile(path);
	} catch {
		current = null;
	}
	if (current?.equals(contents)) return;
	await mkdir(dirname(path), { recursive: true });
	await writeFile(path, contents);
}

main().catch((error) => {
	process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
	process.exitCode = 1;
});
