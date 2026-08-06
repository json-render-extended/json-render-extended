import { createHash, randomUUID } from "node:crypto";

import type { AuthoringCodegenResult, ResolvedAuthoringProvider } from "@json-render-extended/core";

import { componentNameFromSpecId } from "./component-name";
import { extractSpecComponentProps } from "./spec-props";
import { normalizeSpecId, type ProjectSpecStore } from "./spec-store";

export interface PlaygroundSessionState {
	id: string;
	revision: number;
	project: {
		name: string;
		root: string;
		specDirectory: string;
	};
	provider: { id: string; label: string };
	presets: Array<{ id: string; label: string; description?: string }>;
	specIds: string[];
	specId: string;
	source: string;
	lastValidSpec: unknown;
	code: string;
	language: string;
	diagnostics: AuthoringCodegenResult["diagnostics"];
	error: string | null;
	updatedAt: string;
}

export class RevisionConflictError extends Error {
	constructor(readonly state: PlaygroundSessionState) {
		super(`Expected revision does not match current revision ${state.revision}.`);
	}
}

export class PlaygroundSession {
	readonly id = randomUUID();
	private listeners = new Set<(state: PlaygroundSessionState) => void>();
	private stateValue!: PlaygroundSessionState;

	private constructor(
		private readonly store: ProjectSpecStore,
		private readonly provider: ResolvedAuthoringProvider,
	) {}

	static async create(options: {
		store: ProjectSpecStore;
		provider: ResolvedAuthoringProvider;
		specId?: string;
		presetId?: string;
	}) {
		const session = new PlaygroundSession(options.store, options.provider);
		await session.initialize(options.specId, options.presetId);
		return session;
	}

	get state() {
		return this.stateValue;
	}

	subscribe(listener: (state: PlaygroundSessionState) => void) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	async update(source: string, expectedRevision: number) {
		this.assertRevision(expectedRevision);
		const nextRevision = this.stateValue.revision + 1;
		let value: unknown;
		try {
			value = JSON.parse(source) as unknown;
			const generated = await this.generate(value, this.stateValue.specId);
			const persistedSource = await this.store.write(this.stateValue.specId, value);
			this.stateValue = {
				...this.stateValue,
				revision: nextRevision,
				source: persistedSource,
				lastValidSpec: value,
				code: generated.code,
				language: generated.language,
				diagnostics: generated.diagnostics,
				error: null,
				updatedAt: new Date().toISOString(),
			};
		} catch (error) {
			this.stateValue = {
				...this.stateValue,
				revision: nextRevision,
				source,
				error: error instanceof Error ? error.message : String(error),
				updatedAt: new Date().toISOString(),
			};
		}
		this.emit();
		return this.stateValue;
	}

	async open(specId: string, expectedRevision: number) {
		this.assertRevision(expectedRevision);
		const normalized = normalizeSpecId(specId);
		if (!(await this.store.has(normalized))) throw new Error(`Spec ${normalized} does not exist.`);
		const current = await this.store.read(normalized);
		await this.replaceValidState(normalized, current.value, current.source);
		return this.stateValue;
	}

	async createSpec(specId: string, presetId: string | undefined, expectedRevision: number) {
		this.assertRevision(expectedRevision);
		const normalized = normalizeSpecId(specId);
		if (await this.store.has(normalized)) throw new Error(`Spec ${normalized} already exists.`);
		const preset = this.findPreset(presetId);
		const source = await this.store.write(normalized, preset.spec);
		await this.replaceValidState(normalized, preset.spec, source);
		return this.stateValue;
	}

	private async initialize(specId?: string, presetId?: string) {
		await this.store.ensure();
		const existing = await this.store.list();
		const requested = specId ? normalizeSpecId(specId) : undefined;
		const selected = requested ?? existing[0];
		if (selected && (await this.store.has(selected))) {
			const current = await this.store.read(selected);
			const generated = await this.generate(current.value, selected);
			this.stateValue = this.createState(
				selected,
				current.source,
				current.value,
				generated,
				existing,
			);
			return;
		}
		const preset = this.findPreset(presetId);
		const createdId = requested ?? preset.id;
		const source = await this.store.write(createdId, preset.spec);
		const generated = await this.generate(preset.spec, createdId);
		this.stateValue = this.createState(createdId, source, preset.spec, generated, [createdId]);
	}

	private async replaceValidState(specId: string, value: unknown, source: string) {
		const generated = await this.generate(value, specId);
		this.stateValue = {
			...this.createState(specId, source, value, generated, await this.store.list()),
			revision: this.stateValue.revision + 1,
		};
		this.emit();
	}

	private createState(
		specId: string,
		source: string,
		value: unknown,
		generated: AuthoringCodegenResult,
		specIds: string[],
	): PlaygroundSessionState {
		return {
			id: this.id,
			revision: 0,
			project: {
				name: this.store.project.projectName,
				root: this.store.project.projectRoot,
				specDirectory: this.store.directory,
			},
			provider: { id: this.provider.id, label: this.provider.label },
			presets: this.provider.presets.map(({ id, label, description }) => ({
				id,
				label,
				...(description ? { description } : {}),
			})),
			specIds,
			specId,
			source,
			lastValidSpec: value,
			code: generated.code,
			language: generated.language,
			diagnostics: generated.diagnostics,
			error: null,
			updatedAt: new Date().toISOString(),
		};
	}

	private findPreset(id?: string) {
		const preset = id
			? this.provider.presets.find((entry) => entry.id === id)
			: this.provider.presets[0];
		if (!preset) throw new Error(`Authoring provider ${this.provider.id} has no usable preset.`);
		return preset;
	}

	private generate(value: unknown, specId: string) {
		return this.provider.generateCode(value, {
			componentName: componentNameFromSpecId(specId),
			componentProps: extractSpecComponentProps(value),
			specId,
			sourceDigest: digestSpec(value),
		});
	}

	private assertRevision(expected: number) {
		if (expected !== this.stateValue.revision) {
			throw new RevisionConflictError(this.stateValue);
		}
	}

	private emit() {
		for (const listener of this.listeners) listener(this.stateValue);
	}
}

export function digestSpec(value: unknown) {
	return `sha256:${createHash("sha256").update(JSON.stringify(value)).digest("hex")}`;
}
