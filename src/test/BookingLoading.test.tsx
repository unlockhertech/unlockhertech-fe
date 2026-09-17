import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BookingPage } from '../app/pages/BookingPortalPage';
import { bookingApi, type PublicConfig } from '../app/lib/bookingApi';

vi.mock('../app/hooks/useMetaData.ts', () => ({ useMetaData: vi.fn() }));
vi.mock('../app/lib/bookingApi', () => ({
  bookingApi: { getPublicConfig: vi.fn(), getAvailableSlots: vi.fn() },
}));

function deferredConfig() {
  let resolve!: (value: PublicConfig) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<PublicConfig>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

describe('booking page loading lifecycle', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows the continuous loader without controls until booking options arrive', async () => {
    const request = deferredConfig();
    vi.mocked(bookingApi.getPublicConfig).mockReturnValue(request.promise);
    render(<BookingPage />);
    expect(screen.getByRole('status')).toHaveTextContent('Unlocking Booking Options');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('slider')).not.toBeInTheDocument();
    await act(async () => {
      request.resolve({ timeZone: 'Europe/London', contactEmail: 'hello@example.com', meetingTypes: [], dates: [] });
      await request.promise;
    });
    expect(screen.queryByText('Unlocking Booking Options')).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Booking categories' })).toBeInTheDocument();
  });

  it('replaces the animation with an error if booking options fail to load', async () => {
    const request = deferredConfig();
    vi.mocked(bookingApi.getPublicConfig).mockReturnValue(request.promise);
    render(<BookingPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    await act(async () => { request.reject(new Error('Please try again later')); });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Please try again later');
  });
});
