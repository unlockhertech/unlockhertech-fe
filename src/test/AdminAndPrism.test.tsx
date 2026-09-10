import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageLoadingFallback } from "../app/components/PageLoadingFallback";
import { highlightCodeUnder } from "../app/utils/prism";
import { AdminPage } from "../app/pages/AdminPage";

describe("PageLoadingFallback", () => {
  it("renders accessible loading fallback indicator", () => {
    render(<PageLoadingFallback />);
    expect(screen.getByRole("status", { name: /loading page content/i })).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});

describe("AdminPage", () => {
  it("renders sanity studio when VITE_SANITY_PROJECT_ID is present", () => {
    const { container } = render(<AdminPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders setup required message when VITE_SANITY_PROJECT_ID is empty", () => {
    const originalEnv = import.meta.env.VITE_SANITY_PROJECT_ID;
    try {
      (import.meta.env as unknown as { VITE_SANITY_PROJECT_ID: string }).VITE_SANITY_PROJECT_ID = "";
      render(<AdminPage />);
      expect(screen.getByText("Sanity Studio Setup Required")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /go to sanity dashboard/i })).toHaveAttribute(
        "href",
        "https://sanity.io/manage"
      );
    } finally {
      (import.meta.env as unknown as { VITE_SANITY_PROJECT_ID: string }).VITE_SANITY_PROJECT_ID = originalEnv;
    }
  });
});

describe("Prism Syntax Loader", () => {
  it("loads languages in order and highlights elements safely without throwing", async () => {
    const container = document.createElement("div");
    container.innerHTML = '<pre><code class="language-typescript">const x: number = 42;</code></pre>';
    document.body.appendChild(container);

    await expect(highlightCodeUnder(container)).resolves.not.toThrow();

    document.body.removeChild(container);
  });
});
