import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import { EventsPage } from '../app/pages/EventsPage';
import * as sanityUtils from '../app/utils/sanity';
import type { ExternalEvent } from '../app/types';

const MOCK_EVENTS: ExternalEvent[] = [
  {
    title: "Live LeetCode Two Pointers Workshop",
    slug: "leetcode-two-pointers",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    platform: "Luma",
    urlOrId: "https://lu.ma/example-event",
  },
  {
    title: "AI Builders Global Conference 2026",
    slug: "ai-builders-global-conference-2026",
    date: "2026-10-14T13:00:00.000Z",
    platform: "Conference",
    urlOrId: "https://aibuildersnetwork.org/conference/tickets",
    description: "The #1 Virtual AI Conference for Builders, Tech Leaders, and Operators.",
    discountCode: "UNLOCKHERTECH20-F056D5212AE7",
    discountPercentage: "20%",
    ctaLabel: "Get tickets (20% off)",
    isPartner: true,
  },
];

describe('EventsPage', () => {
  beforeEach(() => {
    vi.spyOn(sanityUtils, 'getAllExternalEvents').mockResolvedValue(MOCK_EVENTS);
  });

  it('renders page header, category filters, and event cards', async () => {
    render(
      <MemoryRouter>
        <EventsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Community Events/i })).toBeInTheDocument();
      expect(screen.getByText(/Hands-on LeetCode practices/i)).toBeInTheDocument();
      expect(screen.getByText(/Live LeetCode Two Pointers Workshop/i)).toBeInTheDocument();
      expect(screen.getByText(/Upcoming Sessions/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('renders partner conference card and opens claim discount modal', async () => {
    render(
      <MemoryRouter>
        <EventsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/AI Builders Global Conference 2026/i)).toBeInTheDocument();
      expect(screen.getByText(/20% Partner Discount/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Claim 20% Off/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Tickets/i })).toHaveAttribute(
        'href',
        'https://aibuildersnetwork.org/conference/tickets'
      );
    }, { timeout: 5000 });
  });
});
