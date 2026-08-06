import { openai } from "@ai-sdk/openai";
import type { ModelMessage } from "ai";
import { streamText } from "ai";

import { catalog } from "$lib/catalog";

import type { RequestHandler } from "./$types";

const system = catalog.prompt({
	mode: "inline",
	customRules: [
		"Keep the UI compact and useful.",
		"Use only components from the available catalog.",
	],
});

export const POST: RequestHandler = async ({ request }) => {
	const body = (await request.json()) as { messages?: ModelMessage[] };
	if (!body.messages?.length) {
		return Response.json({ error: "messages are required" }, { status: 400 });
	}

	const result = streamText({
		model: openai(process.env.OPENAI_MODEL ?? "gpt-5-mini"),
		system,
		messages: body.messages,
	});

	return result.toTextStreamResponse();
};
