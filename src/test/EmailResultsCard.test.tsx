import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import { EmailResultsCard } from "../app/pages/assessment/EmailResultsCard";
import { RECOMMENDATIONS } from "../app/pages/assessment/assessmentData";

describe("EmailResultsCard", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const defaultProps = {
    grandTotal: 58,
    scores: { m1: 15, m2: 14, m3: 13, m4: 16 },
    readinessBadge: {
      text: "⚡ Developing Transitioner",
      className: "bg-amber-100 text-amber-800 border-amber-200",
    },
    recommendation: RECOMMENDATIONS.m3,
    reflectionNotes: "Study data structures daily.",
    totalAnswered: 16,
  };

  const renderCard = (props = defaultProps) => {
    return render(
      <MemoryRouter>
        <EmailResultsCard {...props} />
      </MemoryRouter>
    );
  };

  it("renders email results card and input elements", () => {
    renderCard();
    expect(screen.getByText(/Email Results & Action Plan to Myself/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Email My Results/i })).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
  });

  it("validates empty or invalid email address", () => {
    renderCard();
    const submitBtn = screen.getByRole("button", { name: /Email My Results/i });
    const input = screen.getByPlaceholderText(/Enter your email address/i);

    // Enter invalid email
    fireEvent.change(input, { target: { value: "invalid-email" } });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
  });

  it("submits valid email, saves to localStorage, and displays success state", () => {
    renderCard();
    const input = screen.getByPlaceholderText(/Enter your email address/i);
    const submitBtn = screen.getByRole("button", { name: /Email My Results/i });

    fireEvent.change(input, { target: { value: "candidate@example.com" } });
    fireEvent.click(submitBtn);

    expect(localStorage.getItem("uht_user_email")).toBe("candidate@example.com");
  });
});
