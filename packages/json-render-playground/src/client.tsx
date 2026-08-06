import { registry } from "virtual:json-render-extended-playground/project";
import type { Spec } from "@json-render/core";
import { JSONUIProvider, Renderer } from "@json-render/react";
import { Component, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "virtual:json-render-extended-playground/project-styles";
import "virtual:json-render-extended-playground/shell.css";

import type { PlaygroundSessionState } from "./session";

type Pane = "editor" | "output";
type Output = "code" | "preview";

class PreviewBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
	state: { error: Error | null } = { error: null };

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	componentDidUpdate(previous: { children: ReactNode }) {
		if (previous.children !== this.props.children && this.state.error) {
			this.setState({ error: null });
		}
	}

	render() {
		return this.state.error ? (
			<div className="jr-error" role="alert">
				{this.state.error.message}
			</div>
		) : (
			this.props.children
		);
	}
}

function PlaygroundApp() {
	const token = new URLSearchParams(window.location.search).get("token") ?? "";
	const requestedSpec = new URLSearchParams(window.location.search).get("spec");
	const [state, setState] = useState<PlaygroundSessionState | null>(null);
	const [draft, setDraft] = useState("");
	const [mobilePane, setMobilePane] = useState<Pane>("editor");
	const [output, setOutput] = useState<Output>("preview");
	const revision = useRef(0);
	const saveTimer = useRef<number | null>(null);
	const localEdit = useRef(false);

	const accept = useCallback((next: PlaygroundSessionState, forceSource = false) => {
		if (next.revision < revision.current) return;
		revision.current = next.revision;
		setState(next);
		if (forceSource || !localEdit.current) setDraft(next.source);
	}, []);

	const request = useCallback(
		async (path: string, init?: RequestInit) => {
			const separator = path.includes("?") ? "&" : "?";
			const response = await fetch(`${path}${separator}token=${encodeURIComponent(token)}`, {
				...init,
				headers: { "Content-Type": "application/json", ...init?.headers },
			});
			const body = (await response.json()) as PlaygroundSessionState | { error: string };
			if (!response.ok && response.status !== 409) {
				throw new Error(
					"error" in body && typeof body.error === "string"
						? body.error
						: `Request failed with ${response.status}.`,
				);
			}
			return body as PlaygroundSessionState;
		},
		[token],
	);

	useEffect(() => {
		let cancelled = false;
		void (async () => {
			let initial = await request("/api/session");
			if (requestedSpec && requestedSpec !== initial.specId) {
				initial = await request("/api/session/open", {
					method: "POST",
					body: JSON.stringify({ specId: requestedSpec, revision: initial.revision }),
				});
			}
			if (!cancelled) accept(initial, true);
		})().catch((error) => {
			if (!cancelled)
				document.body.textContent = error instanceof Error ? error.message : String(error);
		});
		const events = new EventSource(`/api/session/events?token=${encodeURIComponent(token)}`);
		events.onmessage = (event) => {
			const next = JSON.parse(event.data) as PlaygroundSessionState;
			accept(next);
		};
		return () => {
			cancelled = true;
			events.close();
		};
	}, [accept, request, requestedSpec, token]);

	function edit(source: string) {
		localEdit.current = true;
		setDraft(source);
		if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
		saveTimer.current = window.setTimeout(() => {
			void request("/api/session", {
				method: "PUT",
				body: JSON.stringify({ source, revision: revision.current }),
			})
				.then((next) => {
					localEdit.current = false;
					accept(next, next.error === null);
				})
				.catch((error) => {
					localEdit.current = false;
					console.error(error);
				});
		}, 300);
	}

	async function openSpec(specId: string) {
		localEdit.current = false;
		accept(
			await request("/api/session/open", {
				method: "POST",
				body: JSON.stringify({ specId, revision: revision.current }),
			}),
			true,
		);
	}

	async function createSpec() {
		const specId = window.prompt("Spec name (folders are supported)", "new-surface");
		if (!specId) return;
		accept(
			await request("/api/session/specs", {
				method: "POST",
				body: JSON.stringify({ specId, revision: revision.current }),
			}),
			true,
		);
	}

	if (!state) return <main className="jr-playground">Loading playground…</main>;

	return (
		<main className="jr-playground" data-mobile-pane={mobilePane}>
			<header className="jr-header">
				<div className="jr-title">
					<strong>JSON Render Extended Playground</strong>
					<span>
						{state.project.name} · {state.provider.label}
					</span>
				</div>
				<div className="jr-toolbar">
					<select
						aria-label="Current spec"
						className="jr-control"
						onChange={(event) => void openSpec(event.currentTarget.value)}
						value={state.specId}
					>
						{state.specIds.map((id) => (
							<option key={id} value={id}>
								{id}
							</option>
						))}
					</select>
					<button className="jr-button jr-control" onClick={() => void createSpec()} type="button">
						New spec
					</button>
					<div className="jr-mobile-switch">
						<button
							aria-pressed={mobilePane === "editor"}
							className="jr-button jr-control"
							onClick={() => setMobilePane("editor")}
							type="button"
						>
							Editor
						</button>
						<button
							aria-pressed={mobilePane === "output"}
							className="jr-button jr-control"
							onClick={() => setMobilePane("output")}
							type="button"
						>
							Output
						</button>
					</div>
				</div>
			</header>
			<div className="jr-grid">
				<section className="jr-pane">
					<div className="jr-pane-header">
						<span>{state.specId}.json</span>
						<span>{state.error ? "Not saved · showing last valid output" : "Saved"}</span>
					</div>
					<div className="jr-editor">
						<textarea
							aria-label={`Editable JSON Render spec ${state.specId}`}
							onChange={(event) => edit(event.currentTarget.value)}
							spellCheck={false}
							value={draft}
						/>
					</div>
					{state.error ? (
						<div className="jr-error" role="alert">
							{state.error}
						</div>
					) : null}
				</section>
				<section className="jr-pane">
					<div className="jr-pane-header">
						<div className="jr-tabs" role="tablist">
							<button
								aria-selected={output === "preview"}
								className="jr-tab"
								onClick={() => setOutput("preview")}
								role="tab"
								type="button"
							>
								Live render
							</button>
							<button
								aria-selected={output === "code"}
								className="jr-tab"
								onClick={() => setOutput("code")}
								role="tab"
								type="button"
							>
								TypeScript
							</button>
						</div>
						<span>revision {state.revision}</span>
					</div>
					{output === "preview" ? (
						<div className="jr-stage">
							<div className="jr-stage-inner">
								<PreviewBoundary>
									<JSONUIProvider initialState={{}} registry={registry}>
										<Renderer registry={registry} spec={state.lastValidSpec as Spec} />
									</JSONUIProvider>
								</PreviewBoundary>
							</div>
						</div>
					) : (
						<pre className="jr-code">
							<code>{state.code}</code>
						</pre>
					)}
				</section>
			</div>
		</main>
	);
}

const root = document.getElementById("root");
if (!root) throw new Error("Playground root element is missing.");
createRoot(root).render(<PlaygroundApp />);
