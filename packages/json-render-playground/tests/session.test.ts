import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

import type { ResolvedAuthoringProvider } from "@json-render-extended/core";
import { describe, expect, it } from "vitest";

import { PlaygroundSession } from "../src/session";
import { ProjectSpecStore, resolveTargetProject } from "../src/spec-store";

const provider: ResolvedAuthoringProvider = {
	id: "test",
	label: "Test",
	presets: [
		{
			id: "starter",
			label: "Starter",
			spec: { root: "text", elements: { text: { type: "Text", props: { text: "Hello" } } } },
		},
	],
	generateCode: (spec) => ({ code: JSON.stringify(spec), language: "tsx" }),
};

describe("playground session", () => {
	it("persists valid revisions and retains the last valid output for invalid JSON", async () => {
		const root = await mkdtemp(resolve(tmpdir(), "jr-playground-session-"));
		await writeFile(resolve(root, "package.json"), '{"name":"test-app"}', "utf8");
		const store = new ProjectSpecStore(await resolveTargetProject({ cwd: root }));
		const session = await PlaygroundSession.create({ store, provider });
		const validSpec = { root: "next", elements: { next: { type: "Text" } } };
		const valid = await session.update(JSON.stringify(validSpec), 0);

		expect(valid.lastValidSpec).toEqual(validSpec);
		expect(valid.error).toBeNull();
		const invalid = await session.update("{", valid.revision);
		expect(invalid.error).not.toBeNull();
		expect(invalid.lastValidSpec).toEqual(validSpec);
		expect((await store.read("starter")).value).toEqual(validSpec);
	});
});
