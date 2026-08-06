import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { type MaterializationReceipt, materializationProtocol } from "../src/materialize";
import { digestSpec } from "../src/session";
import { buildSpecModule } from "../src/spec-module";
import { ProjectSpecStore, resolveTargetProject } from "../src/spec-store";

describe("generated spec modules", () => {
	it("selects materialized components per receipt and keeps other specs at runtime", async () => {
		const root = await mkdtemp(resolve(tmpdir(), "jr-playground-spec-module-"));
		await writeFile(resolve(root, "package.json"), '{"name":"test-app"}', "utf8");
		const store = new ProjectSpecStore(await resolveTargetProject({ cwd: root }));
		const runtimeSpec = {
			root: "text",
			elements: { text: { type: "Text", props: { text: "Runtime" } } },
		};
		const materializedSpec = {
			root: "heading",
			elements: { heading: { type: "Heading", props: { text: "Static" } } },
		};
		await store.write("profile/runtime", runtimeSpec);
		await store.write("profile/static", materializedSpec);
		const componentPath = resolve(root, "components/generated/profile-static.tsx");
		await mkdir(dirname(componentPath), { recursive: true });
		await writeFile(
			componentPath,
			"export function ProfileStatic() { return <h2>Static</h2>; }\n",
			"utf8",
		);
		const receipt: MaterializationReceipt = {
			protocol: materializationProtocol,
			specId: "profile/static",
			specPath: "json-render/specs/profile/static.json",
			sourceDigest: digestSpec(materializedSpec),
			providerId: "shadcn",
			component: {
				specId: "profile/static",
				key: "ProfileStatic",
				module: "components/generated/profile-static",
				export: "ProfileStatic",
				props: [],
			},
			runtimeCompositions: [],
			outputs: [
				{
					path: "components/generated/profile-static.tsx",
					language: "tsx",
					digest: "sha256:test",
				},
			],
		};
		const receiptPath = resolve(root, "json-render/materializations/profile/static.json");
		await mkdir(dirname(receiptPath), { recursive: true });
		await writeFile(receiptPath, `${JSON.stringify(receipt)}\n`, "utf8");

		const result = await buildSpecModule({ cwd: root });
		const source = await readFile(result.outputPath, "utf8");
		expect(result.diagnostics).toEqual([]);
		expect(source).toContain(
			'import { ProfileStatic as MaterializedSpec1 } from "../components/generated/profile-static";',
		);
		expect(source).toContain('"profile/runtime": { mode: "runtime"');
		expect(source).toContain(
			'"profile/static": { mode: "materialized", Component: MaterializedSpec1 }',
		);
	});

	it("falls back to runtime when a receipt no longer matches its spec", async () => {
		const root = await mkdtemp(resolve(tmpdir(), "jr-playground-stale-spec-"));
		await writeFile(resolve(root, "package.json"), '{"name":"test-app"}', "utf8");
		const store = new ProjectSpecStore(await resolveTargetProject({ cwd: root }));
		await store.write("profile/card", {
			root: "text",
			elements: { text: { type: "Text", props: { text: "Changed" } } },
		});
		const receiptPath = resolve(root, "json-render/materializations/profile/card.json");
		await mkdir(dirname(receiptPath), { recursive: true });
		await writeFile(
			receiptPath,
			`${JSON.stringify({
				protocol: materializationProtocol,
				specId: "profile/card",
				sourceDigest: "sha256:old",
				component: { module: "components/generated/profile-card", export: "ProfileCard" },
				outputs: [{ path: "components/generated/profile-card.tsx" }],
			})}\n`,
			"utf8",
		);

		const result = await buildSpecModule({ cwd: root });
		expect(result.diagnostics).toEqual([
			"profile/card has a stale materialization and remains runtime.",
		]);
	});
});
