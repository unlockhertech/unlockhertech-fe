import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ClaimDiscountModal } from "../app/components/ClaimDiscountModal";
import type { ExternalEvent } from "../app/types";

describe("ClaimDiscountModal", () => {
  const mockEvent: ExternalEvent = {
    title: "AI Builders Global Conference 2026",
    slug: "ai-builders-global-conference-2026",
    date: "2026-10-14T13:00:00.000Z",
    platform: "Conference",
    urlOrId: "https://aibuildersnetwork.org/conference/tickets",
    discountCode: "UNLOCKHERTECH20-F056D5212AE7",
    discountPercentage: "20%",
    ctaLabel: "Get tickets (20% off)",
    isPartner: true,
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <ClaimDiscountModal
        isOpen={false}
        onClose={vi.fn()}
        event={mockEvent}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders event title, percentage badge, and input fields", () => {
    render(
      <ClaimDiscountModal
        isOpen={true}
        onClose={vi.fn()}
        event={mockEvent}
      />
    );

    expect(screen.getByText(/Unlock 20% Off Tickets/i)).toBeInTheDocument();
    expect(screen.getByText(/20% Community Partner Perk/i)).toBeInTheDocument();
    expect(screen.getByText("AI Builders Global Conference 2026")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. Maya Chen/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example\.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Unlock 20% Discount Code/i })).toBeInTheDocument();
  });

  it("validates empty name or invalid email", () => {
    render(
      <ClaimDiscountModal
        isOpen={true}
        onClose={vi.fn()}
        event={mockEvent}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /Unlock 20% Discount Code/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Please enter your full name\./i)).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText(/e\.g\. Maya Chen/i);
    fireEvent.change(nameInput, { target: { value: "Maya Chen" } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Please enter a valid email address\./i)).toBeInTheDocument();
  });

  it("posts to /api/claim-discount and reveals the promo code upon successful submission", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(
      <ClaimDiscountModal
        isOpen={true}
        onClose={vi.fn()}
        event={mockEvent}
      />
    );

    const nameInput = screen.getByPlaceholderText(/e\.g\. Maya Chen/i);
    const emailInput = screen.getByPlaceholderText(/you@example\.com/i);
    const submitBtn = screen.getByRole("button", { name: /Unlock 20% Discount Code/i });

    fireEvent.change(nameInput, { target: { value: "Maya Chen" } });
    fireEvent.change(emailInput, { target: { value: "maya@example.com" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/claim-discount",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "maya@example.com",
            fullName: "Maya Chen",
            eventTitle: "AI Builders Global Conference 2026",
            discountCode: "UNLOCKHERTECH20-F056D5212AE7",
            discountPercentage: "20%",
            ticketUrl: "https://aibuildersnetwork.org/conference/tickets",
          }),
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/Discount Code Unlocked!/i)).toBeInTheDocument();
      expect(screen.getByText("UNLOCKHERTECH20-F056D5212AE7")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Copy Code/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Go to Ticket Checkout/i })).toBeInTheDocument();
    });

    expect(localStorage.getItem("uht_user_name")).toBe("Maya Chen");
    expect(localStorage.getItem("uht_user_email")).toBe("maya@example.com");
    expect(localStorage.getItem("uht_partner_discount_unlocked")).toBe("true");
  });
});
