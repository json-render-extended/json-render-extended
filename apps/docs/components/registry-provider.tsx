"use client";

import { NextAppProvider } from "@json-render/next";
import type { ComponentRegistry } from "@json-render/react";
import type { ShadcnBase } from "@json-render-extended/shadcn";
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

import { registryByBase } from "@/lib/registries";

type RegistryContextValue = {
	base: ShadcnBase;
	registry: ComponentRegistry;
	selectBase: (base: ShadcnBase) => void;
};

const RegistryContext = createContext<RegistryContextValue | null>(null);

export function RegistryProvider({ children }: { children: ReactNode }) {
	const [base, setBase] = useState<ShadcnBase>("base-ui");
	const selectBase = useCallback((nextBase: ShadcnBase) => setBase(nextBase), []);
	const value = useMemo(
		() => ({ base, registry: registryByBase[base], selectBase }),
		[base, selectBase],
	);

	return <RegistryContext.Provider value={value}>{children}</RegistryContext.Provider>;
}

export function useRegistry() {
	const context = useContext(RegistryContext);

	if (!context) {
		throw new Error("useRegistry must be used inside RegistryProvider");
	}

	return context;
}

export function DocsAppProvider({ children }: { children: ReactNode }) {
	const { registry } = useRegistry();

	return <NextAppProvider registry={registry}>{children}</NextAppProvider>;
}
