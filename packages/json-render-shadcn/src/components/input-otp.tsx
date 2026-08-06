"use client";

import { type BaseComponentProps, useBoundProp } from "@json-render/react";

import type { ShadcnProps } from "../catalog";
import { PrimitiveFallback } from "./primitive-fallback";
import type { ShadcnPrimitiveSet } from "./types";

export function createInputOtpComponent(primitives: ShadcnPrimitiveSet) {
	const { InputOTP, InputOTPGroup, InputOTPSlot } = primitives;

	return ({ props, bindings, emit }: BaseComponentProps<ShadcnProps<"InputOtp">>) => {
		const [value, setValue] = useBoundProp<string>(props.value ?? undefined, bindings?.value);
		const length = props.length ?? 6;
		if (!InputOTP || !InputOTPGroup || !InputOTPSlot) return <PrimitiveFallback name="InputOtp" />;

		return (
			<InputOTP
				disabled={props.disabled}
				maxLength={length}
				onChange={(nextValue: string) => {
					setValue(nextValue);
					emit("change");
				}}
				onComplete={() => emit("complete")}
				value={value ?? ""}
			>
				<InputOTPGroup>
					{Array.from({ length }, (_, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: OTP slots are positional and never reorder.
						<InputOTPSlot index={index} key={index} />
					))}
				</InputOTPGroup>
			</InputOTP>
		);
	};
}
