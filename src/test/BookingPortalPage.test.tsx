import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { BookingPage } from '../app/pages/BookingPortalPage';
import { bookingApi, type PublicConfig } from '../app/lib/bookingApi';

vi.mock('../app/lib/bookingApi', () => ({ bookingApi: { getPublicConfig: vi.fn(), getAvailableSlots: vi.fn() } }));
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it('shows the portal heading and return link while configuration is pending', async () => {
  let finish!: (config: PublicConfig) => void;
  vi.mocked(bookingApi.getPublicConfig).mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  vi.mocked(bookingApi.getAvailableSlots).mockResolvedValue([]);
  render(<BookingPage />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Make time for');
  expect(screen.getByRole('link', { name: /Back to our website/ })).toBeVisible();
  expect(screen.getByRole('status')).toBeVisible();
  await act(async () => {
    finish({ timeZone: 'Europe/London', contactEmail: 'test@example.com', dates: [], meetingTypes: [] });
  });
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: 'Booking categories' })).toBeVisible();
});
