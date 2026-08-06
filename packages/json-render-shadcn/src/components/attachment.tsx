import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createAttachmentComponent(primitives: ShadcnPrimitiveSet) {
	const { Attachment, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle } =
		primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Attachment">>) => {
		if (!Attachment || !AttachmentContent || !AttachmentTitle) {
			return (
				<PrimitiveFallback name="Attachment">
					<strong>{props.title}</strong>
					{props.description ? <span>{props.description}</span> : null}
				</PrimitiveFallback>
			);
		}

		return (
			<Attachment>
				{AttachmentMedia && props.mediaUrl ? (
					<AttachmentMedia>
						<img alt={props.mediaAlt ?? ""} src={props.mediaUrl} />
					</AttachmentMedia>
				) : null}
				<AttachmentContent>
					<AttachmentTitle>{props.title}</AttachmentTitle>
					{AttachmentDescription && props.description ? (
						<AttachmentDescription>{props.description}</AttachmentDescription>
					) : null}
				</AttachmentContent>
			</Attachment>
		);
	};
}
