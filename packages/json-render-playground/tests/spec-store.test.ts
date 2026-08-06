import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { ProjectSpecStore, resolveTargetProject } from "../src/spec-store";

describe("project spec storage", () => {
	it("co-locates specs in a selected monorepo package", async () => {
		const repository = await mkdtemp(resolve(tmpdir(), "jr-playground-"));
		await writeFile(resolve(repository, "package.json"), '{"private":true}', "utf8");
		await writeFile(
			resolve(repository, "pnpm-workspace.yaml"),
			'packages:\n  - "apps/*"\n',
			"utf8",
		);
		await mkdir(resolve(repository, "apps/web"), { recursive: true });
		await writeFile(resolve(repository, "apps/web/package.json"), '{"name":"@acme/web"}', "utf8");

		const project = await resolveTargetProject({ cwd: repository, project: "apps/web" });
		const store = new ProjectSpecStore(project);
		await store.write("checkout/summary", { root: "card", elements: {} });

		expect(project.specDirectory).toBe(resolve(repository, "apps/web/json-render/specs"));
		expect(await store.list()).toEqual(["checkout/summary"]);
		expect(JSON.parse(await readFile(store.pathFor("checkout/summary"), "utf8"))).toEqual({
			root: "card",
			elements: {},
		});
	});
});
