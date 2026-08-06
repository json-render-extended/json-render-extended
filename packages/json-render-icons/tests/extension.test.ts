import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { iconsExtensionAdapter } from "../src/extension";
import { iconSetManifestProtocol } from "../src/project";

describe("core extension adapter", () => {
	it("prefers core adapter options over components.json", async () => {
		const cwd = await mkdtemp(join(tmpdir(), "json-render-icons-extension-"));
		const dependencyDirectory = join(cwd, "node_modules", "@acme", "icons");
		try {
			await mkdir(dependencyDirectory, { recursive: true });
			const packageJson = {
				dependencies: { "lucide-react": "1.28.0", "@acme/icons": "1.0.0" },
			};
			await writeFile(join(cwd, "package.json"), JSON.stringify(packageJson));
			await writeFile(join(cwd, "components.json"), JSON.stringify({ iconLibrary: "lucide" }));
			await writeFile(
				join(dependencyDirectory, "package.json"),
				JSON.stringify({
					name: "@acme/icons",
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

			const result = await iconsExtensionAdapter.resolve({
				cwd,
				runtime: "react",
				packageJsonPath: join(cwd, "package.json"),
				packageJson,
				environment: {},
				options: { iconSet: "acme" },
			});

			expect(result.extensions).toEqual([
				expect.objectContaining({ id: "@json-render-extended/icons/acme" }),
			]);
			expect(result.diagnostics).toEqual([]);
		} finally {
			await rm(cwd, { recursive: true });
		}
	});

	it("uses components.json to select among installed icon sets", async () => {
		const cwd = await mkdtemp(join(tmpdir(), "json-render-icons-extension-"));
		const dependencyDirectory = join(cwd, "node_modules", "@acme", "icons");
		try {
			await mkdir(dependencyDirectory, { recursive: true });
			const packageJson = {
				dependencies: { "lucide-react": "1.28.0", "@acme/icons": "1.0.0" },
			};
			await writeFile(join(cwd, "package.json"), JSON.stringify(packageJson));
			await writeFile(join(cwd, "components.json"), JSON.stringify({ iconLibrary: "acme" }));
			await writeFile(
				join(dependencyDirectory, "package.json"),
				JSON.stringify({
					name: "@acme/icons",
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

			const result = await iconsExtensionAdapter.resolve({
				cwd,
				runtime: "react",
				packageJsonPath: join(cwd, "package.json"),
				packageJson,
				environment: {},
				options: {},
			});

			expect(result.extensions).toEqual([
				expect.objectContaining({
					id: "@json-render-extended/icons/acme",
					provenance: { packageName: "@acme/icons", source: "package" },
				}),
			]);
			expect(result.diagnostics).toEqual([]);
		} finally {
			await rm(cwd, { recursive: true });
		}
	});
});
