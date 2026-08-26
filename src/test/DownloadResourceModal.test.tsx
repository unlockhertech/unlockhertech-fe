import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import { DownloadResourceModal } from "../app/components/DownloadResourceModal";
import type { Resource } from "../app/types";

describe("DownloadResourceModal", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const mockResource4: Resource = {
    id: "guide-4",
    title: "10 Non-Coding Roles in Tech to Explore",
    slug: "10-non-coding-roles-in-tech",
    description: "Discover high-impact software careers.",
    category: "Career Paths",
    isPublished: true,
    pdfUrl: "https://example.com/guide4.pdf",
    weekNumber: 4,
    requiresLogin: true,
  };

  it("renders community exclusive modal for Guides 4+", () => {
    render(
      <MemoryRouter>
        <DownloadResourceModal
          isOpen={true}
          onClose={vi.fn()}
          resource={mockResource4}
          isEarlyAccessMode={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/Community Exclusive • WhatsApp & Discord Access/i)).toBeInTheDocument();
    expect(screen.getByText(/Unlock 10 Non-Coding Roles in Tech to Explore: Join Our Community/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. \+44 7123\.\.\. or @alex_dev/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Join Community & Unlock Guides 4\+/i })).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
  });

  it("submits community membership, stores uht_community_member, and shows success state", () => {
    const handleSuccessUnlock = vi.fn();
    render(
      <MemoryRouter>
        <DownloadResourceModal
          isOpen={true}
          onClose={vi.fn()}
          resource={mockResource4}
          isEarlyAccessMode={false}
          onSuccessUnlock={handleSuccessUnlock}
        />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const channelInput = screen.getByPlaceholderText(/e\.g\. \+44 7123\.\.\. or @alex_dev/i);
    const submitBtn = screen.getByRole("button", { name: /Join Community & Unlock Guides 4\+/i });

    fireEvent.change(emailInput, { target: { value: "member@example.com" } });
    fireEvent.change(channelInput, { target: { value: "+447123456789" } });
    fireEvent.click(submitBtn);

    expect(localStorage.getItem("uht_user_email")).toBe("member@example.com");
    expect(localStorage.getItem("uht_community_member")).toBe("true");
  });
});
