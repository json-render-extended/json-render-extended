export const shadcnBases = ["base-ui", "react-aria", "radix"] as const;

export type ShadcnBase = (typeof shadcnBases)[number];

export const defaultShadcnBase = "base-ui" satisfies ShadcnBase;
