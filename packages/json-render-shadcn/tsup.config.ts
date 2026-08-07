import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		catalog: "src/catalog.ts",
		capabilities: "src/capabilities.ts",
		"create-registry": "src/create-registry.ts",
		extend: "src/extend.ts",
		project: "src/project.ts",
		extension: "src/extension.ts",
		authoring: "src/authoring.ts",
		cli: "src/cli.ts",
		"base-ui": "src/base-ui.ts",
		"react-aria": "src/react-aria.ts",
		radix: "src/radix.ts",
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
	external: ["react", "react-dom", "shadcn", "tailwindcss", /^node:/, /^shadcn\//],
});
