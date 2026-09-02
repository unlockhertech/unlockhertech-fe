import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

let languagesLoaded = false;

export async function highlightCodeUnder(container: Element): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  // Ensure global Prism is available before loading legacy Prism component files
  (window as unknown as { Prism: typeof Prism }).Prism = Prism;

  if (!languagesLoaded) {
    try {
      await Promise.all([
        import("prismjs/components/prism-markup"),
        import("prismjs/components/prism-javascript"),
        import("prismjs/components/prism-typescript"),
        import("prismjs/components/prism-jsx"),
        import("prismjs/components/prism-tsx"),
        import("prismjs/components/prism-markdown"),
        import("prismjs/components/prism-css"),
        import("prismjs/components/prism-json"),
      ]);
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
