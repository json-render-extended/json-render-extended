import { AiRegistryPreview } from "@/components/ai-registry-preview";

export default function Page() {
	return (
		<main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
			<header className="space-y-2">
				<p className="font-medium text-primary text-sm">AI-generated JSON spec</p>
				<h1 className="font-semibold text-3xl tracking-tight">
					One generated spec, three shadcn bases
				</h1>
				<p className="max-w-2xl text-muted-foreground">
					The model generates the JSON Render tree. Change the active registry without asking it to
					generate the UI again.
				</p>
			</header>
			<AiRegistryPreview />
		</main>
	);
}
