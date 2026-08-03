import { Studio, defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "../../../sanity/schemas";

const sanityConfig = defineConfig({
  name: "default",
  title: "Unlock Her Tech Content Studio",
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "placeholder",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  basePath: "/admin",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});

export function AdminPage() {
  if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
    return (
      <div className="max-w-2xl mx-auto my-20 p-8 bg-white border border-gray-200 rounded-3xl shadow-sm text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sanity Studio Setup Required</h2>
        <p className="text-gray-600 mb-6">
          To access the Sanity Studio content editor, please set your{" "}
          <code className="bg-gray-100 px-2 py-1 rounded text-brand-coral font-mono text-sm">VITE_SANITY_PROJECT_ID</code> in your{" "}
          <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">.env</code> file.
        </p>
        <a
          href="https://sanity.io/manage"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-brand-coral text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
        >
          Go to Sanity Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden">
      <Studio config={sanityConfig} />
    </div>
  );
}
