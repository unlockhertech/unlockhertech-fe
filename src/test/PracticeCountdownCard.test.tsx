import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import { PracticeCountdownCard } from "../app/pages/practices/PracticeCountdownCard";
import {
  getNextPracticeSession,
  PRACTICE_ANCHOR_UTC,
} from "../app/pages/practices/usePracticeCountdown";

describe("PracticeCountdownCard & usePracticeCountdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderCard = (customDate?: Date) => {
    return render(
      <MemoryRouter>
        <PracticeCountdownCard customTargetDate={customDate} />
      </MemoryRouter>
    );
  };

  it("calculates next fortnightly practice session correctly", () => {
    const session = getNextPracticeSession(new Date("2026-08-24T12:00:00Z").getTime());
    expect(session.topic).toBeDefined();
    expect(session.sessionNumber).toBeGreaterThanOrEqual(1);
    expect(session.targetDate.getTime()).toBeGreaterThanOrEqual(PRACTICE_ANCHOR_UTC);
    expect(session.googleCalendarUrl).toContain("calendar.google.com");
  });

  it("renders countdown card with digits, topic spotlight, and action buttons", () => {
    // 3 days in the future
    const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 5 * 3600 * 1000);
    renderCard(futureDate);

    expect(screen.getByTestId("practice-countdown-section")).toBeInTheDocument();
    expect(screen.getByTestId("countdown-digits-grid")).toBeInTheDocument();
    expect(screen.getAllByText(/She Leads Tech Practice/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Days/i)).toBeInTheDocument();
    expect(screen.getByText(/Hours/i)).toBeInTheDocument();
    expect(screen.getByText(/Mins/i)).toBeInTheDocument();
    expect(screen.getByText(/Secs/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /RSVP & Link/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Subscribe on Luma/i })).toHaveAttribute(
      "href",
      "https://luma.com/sheleadstechpractice"
    );
    expect(screen.getByRole("link", { name: /Google Cal/i })).toBeInTheDocument();
  });

  it("displays live state when session is currently active", () => {
    // 10 minutes into a session
    const activeDate = new Date(Date.now() - 10 * 60 * 1000);
    renderCard(activeDate);

    expect(screen.getByText(/Workshop is Live in Progress!/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Join Live Workshop/i })).toBeInTheDocument();
  });
});
