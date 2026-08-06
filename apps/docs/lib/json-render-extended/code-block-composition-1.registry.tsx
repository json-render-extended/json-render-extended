"use client";

import type { BaseComponentProps } from "@json-render/react";
import type { z } from "zod";

import {
	type BundledLanguage,
	CodeBlock,
	CodeBlockBody,
	CodeBlockContent,
	CodeBlockCopyButton,
	CodeBlockFilename,
	CodeBlockFiles,
	CodeBlockHeader,
	CodeBlockItem,
} from "@/components/kibo-ui/code-block";

import type { componentDefinitions } from "./code-block-composition-1.catalog";

type CodeBlockProps = z.output<(typeof componentDefinitions)["CodeBlock"]["props"]>;

function CodeBlockRenderer({ props }: BaseComponentProps<CodeBlockProps>) {
	const language = props.language ?? "typescript";
	const data = [
		{
			language,
			filename: props.label ?? language,
			code: props.code,
		},
	];

	return (
		<CodeBlock className="h-auto w-full" data={data} defaultValue={language}>
			<CodeBlockHeader className="justify-between">
				<CodeBlockFiles>
					{(item) => (
						<CodeBlockFilename key={item.language} value={item.language}>
							{item.filename}
						</CodeBlockFilename>
					)}
				</CodeBlockFiles>
				<CodeBlockCopyButton aria-label="Copy code" />
			</CodeBlockHeader>
			<CodeBlockBody>
				{(item) => (
					<CodeBlockItem key={item.language} value={item.language}>
						<CodeBlockContent language={item.language as BundledLanguage}>
							{item.code}
						</CodeBlockContent>
					</CodeBlockItem>
				)}
			</CodeBlockBody>
		</CodeBlock>
	);
}

export const components = {
	CodeBlock: CodeBlockRenderer,
};
