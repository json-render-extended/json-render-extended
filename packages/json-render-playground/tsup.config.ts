import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		server: "src/server.ts",
		cli: "src/cli.ts",
		client: "src/client.tsx",
		"dev-link": "src/dev-link.ts",
		react: "src/react.tsx",
		runtime: "src/spec-runtime.tsx",
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
	external: [
		"@json-render-extended/core",
		"react",
		"react-dom",
		"vite",
		"@tailwindcss/vite",
		/^node:/,
		/^virtual:/,
	],
});
