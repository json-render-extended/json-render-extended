import { createHash } from "node:crypto";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
	type MaterializationReceipt,
	materializationProtocol,
	verifyMaterializations,
} from "../src/materialize";
import { digestSpec } from "../src/session";
import { ProjectSpecStore, resolveTargetProject } from "../src/spec-store";

describe("materialization verification", () => {
	it("detects drift on either side of a spec-to-component link", async () => {
		const root = await mkdtemp(resolve(tmpdir(), "jr-playground-materialization-"));
		await writeFile(resolve(root, "package.json"), '{"name":"test-app"}', "utf8");
		const store = new ProjectSpecStore(await resolveTargetProject({ cwd: root }));
		const spec = { root: "text", elements: { text: { type: "Text" } } };
		await store.write("profile/card", spec);
		const outputPath = resolve(root, "components/generated/profile-card.tsx");
		const output = "export function ProfileCard() { return null; }";
		await mkdir(dirname(outputPath), { recursive: true });
		await writeFile(outputPath, `${output}\n`, "utf8");
		const receipt: MaterializationReceipt = {
			protocol: materializationProtocol,
			specId: "profile/card",
			specPath: "json-render/specs/profile/card.json",
			sourceDigest: digestSpec(spec),
			providerId: "test",
			component: {
				specId: "profile/card",
				key: "ProfileCard",
				module: "components/generated/profile-card",
				export: "ProfileCard",
				props: [],
			},
			runtimeCompositions: [],
			outputs: [
				{
					path: "components/generated/profile-card.tsx",
					language: "tsx",
					digest: digest(output),
				},
			],
		};
		const receiptPath = resolve(root, "json-render/materializations/profile/card.json");
		await mkdir(dirname(receiptPath), { recursive: true });
		await writeFile(receiptPath, `${JSON.stringify(receipt)}\n`, "utf8");

		expect((await verifyMaterializations({ cwd: root })).current).toBe(true);
		await store.write("profile/card", { ...spec, revision: 2 });
		await writeFile(outputPath, `${output}\n// edited\n`, "utf8");
		const stale = await verifyMaterializations({ cwd: root });
		expect(stale.current).toBe(false);
		expect(stale.results[0]?.issues.map((issue) => issue.code).sort()).toEqual([
			"output-drift",
			"spec-drift",
		]);
	});
});

function digest(source: string) {
	return `sha256:${createHash("sha256").update(source).digest("hex")}`;
}
