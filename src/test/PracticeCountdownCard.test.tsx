import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import { PracticeCountdownCard } from "@/app/pages/sheleadstech/PracticeCountdownCard";
import {
  getNextPracticeSession,
  isSheLeadsTechEvent,
  extractSessionNumber,
  PRACTICE_ANCHOR_UTC,
} from "@/app/pages/sheleadstech/usePracticeCountdown";
import * as sanityUtils from "../app/utils/sanity";
import type { ExternalEvent } from "../app/types";

describe("PracticeCountdownCard & usePracticeCountdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderCard = (customDate?: Date, initialEvents?: ExternalEvent[], event?: ExternalEvent) => {
    return render(
      <MemoryRouter>
        <PracticeCountdownCard
          customTargetDate={customDate}
          initialEvents={initialEvents}
          event={event}
        />
      </MemoryRouter>
    );
  };

  it("calculates next practice session correctly when no events are supplied", () => {
    const session = getNextPracticeSession(new Date("2026-08-24T12:00:00Z").getTime());
    expect(session.topic).toBeDefined();
    expect(session.sessionNumber).toBeGreaterThanOrEqual(1);
    expect(session.targetDate.getTime()).toBeGreaterThanOrEqual(PRACTICE_ANCHOR_UTC);
    expect(session.googleCalendarUrl).toContain("calendar.google.com");
  });

  it("identifies She Leads Tech and practical workshop events accurately", () => {
    const sheLeadsTechEvent: ExternalEvent = {
      title: "She Leads Tech Theory: Dynamic Programming & Graphs",
      slug: "she-leads-tech-dp",
      date: "2026-10-04T17:30:00.000Z",
      platform: "Luma",
      urlOrId: "https://lu.ma/sheleadstechpractice",
    };
    const leetcodeEvent: ExternalEvent = {
      title: "Live LeetCode Two Pointers Workshop",
      slug: "leetcode-workshop",
      date: "2026-10-18T17:30:00.000Z",
      platform: "Luma",
      urlOrId: "https://lu.ma/leetcode-workshop",
    };
    const partnerConference: ExternalEvent = {
      title: "AI Builders Global Conference 2026",
      slug: "ai-builders",
      date: "2026-10-14T13:00:00.000Z",
      platform: "Conference",
      urlOrId: "https://aibuildersnetwork.org/tickets",
      isPartner: true,
    };

    expect(isSheLeadsTechEvent(sheLeadsTechEvent)).toBe(true);
    expect(isSheLeadsTechEvent(leetcodeEvent)).toBe(true);
    expect(isSheLeadsTechEvent(partnerConference)).toBe(false);
  });

  it("extracts session number from event title or calculates from anchor", () => {
    expect(extractSessionNumber("She Leads Tech: Session #9 - System Design", Date.now())).toBe(9);
    expect(extractSessionNumber("She Leads Tech #12 Advanced Caching", Date.now())).toBe(12);
    expect(extractSessionNumber("She Leads Tech Theory: Tree Traversals", PRACTICE_ANCHOR_UTC)).toBe(1);
  });

  it("picks up newly added events dynamically and updates the counter session info", () => {
    const futureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const mockEvents: ExternalEvent[] = [
      {
        title: "She Leads Tech Theory: Session #10 - Distributed Systems",
        slug: "she-leads-tech-s10",
        date: futureDate.toISOString(),
        platform: "Luma",
        urlOrId: "https://lu.ma/she-leads-tech-s10",
        description: "Deep dive into distributed consensus and event-driven patterns.",
      },
    ];

    const session = getNextPracticeSession(Date.now(), mockEvents);
    expect(session.topic).toBe("She Leads Tech Theory: Session #10 - Distributed Systems");
    expect(session.sessionNumber).toBe(10);
    expect(session.targetDate.toISOString()).toBe(futureDate.toISOString());
    expect(session.googleCalendarUrl).toContain("Distributed%20Systems");
    expect(session.rsvpUrl).toBe("https://lu.ma/she-leads-tech-s10");
  });

  it("renders countdown card with digits, topic spotlight, and action buttons", () => {
    // 3 days in the future
    const futureDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 5 * 3600 * 1000);
    renderCard(futureDate);

    expect(screen.getByTestId("practice-countdown-section")).toBeInTheDocument();
    expect(screen.getByTestId("countdown-digits-grid")).toBeInTheDocument();
    expect(screen.getAllByText(/She Leads Tech/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Theory Session/i)).toBeInTheDocument();
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

  it("displays newly added event topic when passed as event prop", () => {
    const futureDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
    const customEvent: ExternalEvent = {
      title: "She Leads Tech: Microservices Breakdown",
      slug: "she-leads-tech-microservices",
      date: futureDate.toISOString(),
      platform: "Luma",
      urlOrId: "https://lu.ma/microservices-event",
    };

    renderCard(undefined, undefined, customEvent);

    expect(screen.getByText(/Topic: She Leads Tech: Microservices Breakdown/i)).toBeInTheDocument();
    const rsvpLink = screen.getByRole("link", { name: /RSVP & Link/i });
    expect(rsvpLink).toHaveAttribute("href", "https://lu.ma/microservices-event");
  });

  it("fetches newly added external events asynchronously when none provided directly", async () => {
    const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const mockFetchedEvent: ExternalEvent = {
      title: "She Leads Tech: Live Algorithms Masterclass",
      slug: "live-algorithms",
      date: futureDate.toISOString(),
      platform: "Luma",
      urlOrId: "https://lu.ma/live-algorithms",
    };

    vi.spyOn(sanityUtils, "getAllExternalEvents").mockResolvedValue([mockFetchedEvent]);

    renderCard();

    await waitFor(() => {
      expect(screen.getByText(/Topic: She Leads Tech: Live Algorithms Masterclass/i)).toBeInTheDocument();
    });
  });

  it("displays live state when session is currently active", () => {
    // 10 minutes into a session
    const activeDate = new Date(Date.now() - 10 * 60 * 1000);
    renderCard(activeDate);

    expect(screen.getByText(/Workshop is Live in Progress!/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Join Live Workshop/i })).toBeInTheDocument();
  });
});
