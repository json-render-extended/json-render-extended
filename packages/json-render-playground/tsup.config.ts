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
	dts: true,
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
