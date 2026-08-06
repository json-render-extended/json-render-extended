import { basename, extname } from "node:path";

export function componentNameFromSpecId(specId: string) {
	const segment = specId.split("/").filter(Boolean).at(-1) ?? "component";
	return toComponentName(segment);
}

export function componentNameFromOutput(outputPath: string, specId: string) {
	const filename = basename(outputPath, extname(outputPath));
	return filename === "index" ? componentNameFromSpecId(specId) : toComponentName(filename);
}

function toComponentName(value: string) {
	const name = value
		.split(/[^A-Za-z0-9]+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");
	if (!name) return "GeneratedComponent";
	return /^[A-Za-z_$]/.test(name) ? name : `Component${name}`;
}
