import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

let languagesLoaded = false;

export async function highlightCodeUnder(container: Element): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  // Ensure global Prism is available before loading legacy Prism component files
  (window as unknown as { Prism: typeof Prism }).Prism = Prism;
  (globalThis as unknown as { Prism: typeof Prism }).Prism = Prism;

  if (!languagesLoaded) {
    try {
      // Prism components have strict dependency chains:
      // markup & css -> javascript -> typescript -> jsx -> tsx
      await import("prismjs/components/prism-markup");
      await import("prismjs/components/prism-css");
      await import("prismjs/components/prism-javascript");
      await import("prismjs/components/prism-typescript");
      await import("prismjs/components/prism-jsx");
      await import("prismjs/components/prism-tsx");
      await import("prismjs/components/prism-markdown");
      await import("prismjs/components/prism-json");
      languagesLoaded = true;
    } catch (err) {
      console.warn("Failed to load Prism language definitions:", err);
    }
  }

  try {
    Prism.highlightAllUnder(container);
  } catch (err) {
    console.warn("Prism highlight execution failed:", err);
  }
}

export default Prism;
