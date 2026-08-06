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
	// Remove this override when https://github.com/egoist/tsup/issues/1388 is resolved.
	dts: {
		compilerOptions: {
			ignoreDeprecations: "6.0",
		},
	},
	clean: true,
	sourcemap: true,
	splitting: false,
	external: [/^node:/, "tsx", /^tsx\//],
});
