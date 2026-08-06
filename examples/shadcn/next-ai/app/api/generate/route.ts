import { openai } from "@ai-sdk/openai";
import type { ModelMessage } from "ai";
import { streamText } from "ai";

import { catalog } from "@/lib/catalog";

export const maxDuration = 60;

const system = catalog.prompt({
	mode: "inline",
	customRules: [
		"Keep the UI compact and useful.",
		"Use only components from the available catalog.",
		"Do not mention which React primitive base will render the spec.",
	],
});

export async function POST(request: Request) {
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
}
