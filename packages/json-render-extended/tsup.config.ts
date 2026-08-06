import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		protocol: "src/protocol.ts",
		project: "src/project.ts",
		generate: "src/generate.ts",
		cli: "src/cli.ts",
	},
	format: ["esm", "cjs"],
	dts: true,
	clean: true,
	sourcemap: true,
	splitting: false,
	external: [/^node:/, "tsx", /^tsx\//],
});
