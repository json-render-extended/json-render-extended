import type { BaseComponentProps } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createMessageComponent(primitives: ShadcnPrimitiveSet) {
	const { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader } =
		primitives;

	return ({ props }: BaseComponentProps<ShadcnProps<"Message">>) => {
		if (!Message || !MessageContent) {
			return <PrimitiveFallback name="Message">{props.content}</PrimitiveFallback>;
		}

		const message = (
			<Message data-role={props.role ?? "assistant"}>
				{MessageAvatar && props.avatarSrc ? (
					<MessageAvatar alt={props.author ?? ""} src={props.avatarSrc} />
				) : null}
				{MessageHeader && props.author ? <MessageHeader>{props.author}</MessageHeader> : null}
				<MessageContent>{props.content}</MessageContent>
				{MessageFooter && props.time ? <MessageFooter>{props.time}</MessageFooter> : null}
			</Message>
		);

		return MessageGroup ? <MessageGroup>{message}</MessageGroup> : message;
	};
}
