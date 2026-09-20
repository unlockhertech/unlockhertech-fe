import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { BookingPage } from '../app/pages/BookingPortalPage';
import { bookingApi, type PublicConfig } from '../app/lib/bookingApi';

vi.mock('../app/lib/bookingApi', () => ({ bookingApi: { getPublicConfig: vi.fn(), getAvailableSlots: vi.fn(), getAvailabilitySummary: vi.fn(), bookMeeting: vi.fn() } }));
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


const config: PublicConfig = {
  timeZone: 'Europe/London', contactEmail: 'test@example.com',
  dates: [{ value: '2026-09-23', weekday: 3 }, { value: '2026-09-24', weekday: 4 }],
  meetingTypes: [
    { key: 'partnership_strategy', section: 'partnerships', label: 'Strategy', duration: 60, summary: '', hosts: ['Ellie', 'Pritanya'], days: [3,4], schedule: '' },
    { key: 'partnership_initial', section: 'partnerships', label: 'Initial', duration: 30, summary: '', hosts: ['Albert'], days: [3,4], schedule: '' },
  ],
};
const day = () => screen.getByRole('button', { name: /Wednesday,? 23 September/ });

it('disables dates while loading and when a required host has no available slot', async () => {
  vi.mocked(bookingApi.getPublicConfig).mockResolvedValue(config);
  let finish!: (summary: Record<string, boolean>) => void;
  vi.mocked(bookingApi.getAvailabilitySummary).mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  render(<BookingPage />);
  await screen.findByRole('button', { name: /Strategy/ });
  expect(day()).toBeDisabled();
  await act(async () => finish({ '2026-09-23': false, '2026-09-24': true }));
  expect(day()).toBeDisabled();
  expect(screen.getByRole('button', { name: /Thursday,? 24 September/ })).toBeEnabled();
});

it('ignores a late result for a previous meeting', async () => {
  vi.mocked(bookingApi.getPublicConfig).mockResolvedValue(config);
  let finishOld!: (summary: Record<string, boolean>) => void;
  vi.mocked(bookingApi.getAvailabilitySummary).mockImplementation(key => key === 'partnership_strategy'
    ? new Promise(resolve => { finishOld = resolve; }) : Promise.resolve({ '2026-09-23': true }));
  render(<BookingPage />);
  fireEvent.click(await screen.findByRole('button', { name: /Initial/ }));
  await waitFor(() => expect(day()).toBeEnabled());
  await act(async () => finishOld({ '2026-09-23': false }));
  expect(day()).toBeEnabled();
});

it('keeps dates disabled on errors and supports retry', async () => {
  vi.mocked(bookingApi.getPublicConfig).mockResolvedValue(config);
  vi.mocked(bookingApi.getAvailabilitySummary).mockRejectedValueOnce(new Error('Calendar unavailable'))
    .mockResolvedValue({ '2026-09-23': true });
  render(<BookingPage />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Calendar unavailable');
  expect(day()).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Retry available dates' }));
  await waitFor(() => expect(day()).toBeEnabled());
});

it('refreshes dates and clears the selected slot after an ambiguous booking failure', async () => {
  vi.mocked(bookingApi.getPublicConfig).mockResolvedValue(config);
  vi.mocked(bookingApi.getAvailabilitySummary).mockResolvedValueOnce({ '2026-09-23': true })
    .mockResolvedValue({ '2026-09-23': false });
  vi.mocked(bookingApi.getAvailableSlots).mockResolvedValue([{ startMs: Date.parse('2026-09-23T11:00:00Z'), endMs: Date.parse('2026-09-23T12:00:00Z') }]);
  vi.mocked(bookingApi.bookMeeting).mockRejectedValue(new Error('Check your email before trying again.'));
  render(<BookingPage />);
  await waitFor(() => expect(day()).toBeEnabled());
  fireEvent.click(day());
  fireEvent.click(await screen.findByRole('button', { name: '12:00 pm to 1:00 pm' }));
  fireEvent.click(screen.getByRole('button', { name: /Confirm booking/ }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Check your email');
  await waitFor(() => expect(day()).toBeDisabled());
  expect(screen.queryByRole('button', { name: /Confirm booking/ })).not.toBeInTheDocument();
});
