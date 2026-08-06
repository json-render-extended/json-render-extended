import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const host = process.env.JR_EXT_REGISTRY_HOST ?? "127.0.0.1";
const port = Number.parseInt(process.env.JR_EXT_REGISTRY_PORT ?? "3210", 10);
const publicDirectory = fileURLToPath(new URL("./public", import.meta.url));
const contentTypes = {
	".json": "application/json; charset=utf-8",
};

const server = createServer(async (request, response) => {
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Cache-Control", "no-store");

	const pathname = new URL(request.url ?? "/", `http://${host}:${port}`).pathname;
	const relativePath = pathname === "/" ? "r/registry.json" : pathname.replace(/^\/+/, "");
	const filePath = resolve(publicDirectory, relativePath);
	if (!filePath.startsWith(`${publicDirectory}${sep}`)) {
		response.writeHead(403).end("Forbidden");
		return;
	}

	try {
		const file = await stat(filePath);
		if (!file.isFile()) throw new Error("Not a file");
		response.writeHead(200, {
			"Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream",
		});
		createReadStream(filePath).pipe(response);
	} catch {
		response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
		response.end(JSON.stringify({ error: "Registry item not found" }));
	}
});

server.listen(port, host, () => {
	process.stdout.write(`@jr-ext registry available at http://${host}:${port}/r/{name}.json\n`);
});
