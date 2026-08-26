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
});
