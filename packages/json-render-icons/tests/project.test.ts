import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { iconSetManifestProtocol, resolveProjectIconSet } from "../src/project";

const temporaryDirectories: string[] = [];

afterEach(async () => {
	await Promise.all(temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true })));
});

async function temporaryProject() {
	const cwd = await mkdtemp(join(tmpdir(), "json-render-icons-"));
	temporaryDirectories.push(cwd);
	return cwd;
}

describe("package.json icon-set detection", () => {
	it("detects a built-in adapter from the installed library dependency", async () => {
		const cwd = await temporaryProject();
		await writeFile(
			join(cwd, "package.json"),
			JSON.stringify({ dependencies: { "lucide-react": "^1.28.0" } }),
		);
		const result = await resolveProjectIconSet({ cwd });
		expect(result).toMatchObject({
			status: "detected",
			iconSet: {
				name: "lucide",
				packageName: "lucide-react",
				source: "built-in",
				catalog: { module: "@json-render-extended/icons/lucide/catalog" },
				registry: { module: "@json-render-extended/icons/lucide/react" },
			},
		});
	});

	it("detects the optional Tabler adapter", async () => {
		const cwd = await temporaryProject();
		await writeFile(
			join(cwd, "package.json"),
			JSON.stringify({ dependencies: { "@tabler/icons-react": "^3.46.0" } }),
		);
		const result = await resolveProjectIconSet({ cwd });
		expect(result).toMatchObject({
			status: "detected",
			iconSet: {
				name: "tabler",
				packageName: "@tabler/icons-react",
				source: "built-in",
				catalog: { module: "@json-render-extended/icons/tabler/catalog" },
				registry: { module: "@json-render-extended/icons/tabler/react" },
			},
		});
	});

	it.each([
		{
			name: "phosphor",
			dependencies: { "@phosphor-icons/react": "^2.1.10" },
			packageName: "@phosphor-icons/react",
		},
		{
			name: "remix",
			dependencies: { "@remixicon/react": "^4.9.0" },
			packageName: "@remixicon/react",
		},
	])("detects the optional $name adapter", async ({ dependencies, name, packageName }) => {
		const cwd = await temporaryProject();
		await writeFile(join(cwd, "package.json"), JSON.stringify({ dependencies }));
		const result = await resolveProjectIconSet({ cwd });
		expect(result).toMatchObject({
			status: "detected",
			iconSet: {
				name,
				packageName,
				source: "built-in",
				catalog: { module: `@json-render-extended/icons/${name}/catalog` },
				registry: { module: `@json-render-extended/icons/${name}/react` },
			},
		});
	});

	it("detects Hugeicons only when both runtime and free icon data are installed", async () => {
		const cwd = await temporaryProject();
		await writeFile(
			join(cwd, "package.json"),
			JSON.stringify({
				dependencies: {
					"@hugeicons/core-free-icons": "^4.2.3",
					"@hugeicons/react": "^1.1.9",
				},
			}),
		);
		expect(await resolveProjectIconSet({ cwd })).toMatchObject({
			status: "detected",
			iconSet: {
				name: "hugeicons",
				packageName: "@hugeicons/core-free-icons",
			},
		});

		await writeFile(
			join(cwd, "package.json"),
			JSON.stringify({ dependencies: { "@hugeicons/core-free-icons": "^4.2.3" } }),
		);
		expect(await resolveProjectIconSet({ cwd })).toMatchObject({ status: "not-found" });
	});

	it("discovers a self-describing ecosystem icon package", async () => {
		const cwd = await temporaryProject();
		await writeFile(
			join(cwd, "package.json"),
			JSON.stringify({ dependencies: { "@acme/icons": "^1.0.0" } }),
		);
		const dependencyDirectory = join(cwd, "node_modules", "@acme", "icons");
		await mkdir(dependencyDirectory, { recursive: true });
		await writeFile(
			join(dependencyDirectory, "package.json"),
			JSON.stringify({
				name: "@acme/icons",
				"json-render-extended": {
					iconSet: {
						protocol: iconSetManifestProtocol,
						name: "acme",
						catalog: {
							module: "@acme/icons/json-render/catalog",
							export: "componentDefinitions",
						},
						registries: {
							react: {
								module: "@acme/icons/json-render/react",
								export: "components",
							},
						},
					},
				},
			}),
		);
		expect(await resolveProjectIconSet({ cwd })).toMatchObject({
			status: "detected",
			iconSet: { name: "acme", packageName: "@acme/icons", source: "package" },
		});
	});

	it("requires an explicit preference when multiple sets are declared", async () => {
		const cwd = await temporaryProject();
		await writeFile(
			join(cwd, "package.json"),
			JSON.stringify({ dependencies: { "lucide-react": "^1.28.0", "@acme/icons": "^1.0.0" } }),
		);
		const dependencyDirectory = join(cwd, "node_modules", "@acme", "icons");
		await mkdir(dependencyDirectory, { recursive: true });
		await writeFile(
			join(dependencyDirectory, "package.json"),
			JSON.stringify({
				"json-render-extended": {
					iconSet: {
						protocol: iconSetManifestProtocol,
						name: "acme",
						catalog: { module: "@acme/icons/catalog", export: "componentDefinitions" },
						registries: {
							react: { module: "@acme/icons/react", export: "components" },
						},
					},
				},
			}),
		);
		expect(await resolveProjectIconSet({ cwd })).toMatchObject({ status: "ambiguous" });
		expect(await resolveProjectIconSet({ cwd, preferredName: "acme" })).toMatchObject({
			status: "detected",
			iconSet: { name: "acme" },
		});
	});

	it("does not guess an icon set when package.json is absent", async () => {
		const cwd = await temporaryProject();
		expect(await resolveProjectIconSet({ cwd })).toMatchObject({
			status: "missing-package-json",
			iconSet: null,
		});
	});
});
