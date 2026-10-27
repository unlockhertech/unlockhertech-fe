import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SanityHealthCheck } from '../app/components/admin/SanityHealthCheck';
import { sanityClient } from '../app/utils/sanity';

vi.mock('../app/utils/sanity', () => ({
  sanityClient: {
    fetch: vi.fn(),
  },
}));

describe('SanityHealthCheck Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders top bar with Admin Hub title, website link and status badge', async () => {
    vi.mocked(sanityClient.fetch).mockImplementation(async (query: string) => {
      if (typeof query === 'string' && query.startsWith('count')) {
        return 5 as unknown as never;
      }
      return [{ title: 'Sample Post', date: '2026-10-01' }] as unknown as never;
    });

    render(
      <MemoryRouter>
        <SanityHealthCheck />
      </MemoryRouter>
    );

    expect(screen.getByText(/Admin Hub/i)).toBeInTheDocument();
    expect(screen.getByText(/Content Studio/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Return to Main Website/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Sanity Studio Connected & Synced/i)).toBeInTheDocument();
    });
  });

  it('expands diagnostics dashboard showing all 4 document schemas and counts', async () => {
    vi.mocked(sanityClient.fetch).mockImplementation(async (query: string) => {
      if (typeof query === 'string' && query.includes('post')) {
        if (query.startsWith('count')) return 12 as unknown as never;
        return [{ title: 'Latest Engineering Post', date: '2026-10-20T10:00:00Z' }] as unknown as never;
      }
      if (typeof query === 'string' && query.includes('event')) {
        if (query.startsWith('count')) return 3 as unknown as never;
        return [{ title: 'AI Workshop', date: '2026-11-01T14:00:00Z' }] as unknown as never;
      }
      if (typeof query === 'string' && query.includes('resource')) {
        if (query.startsWith('count')) return 10 as unknown as never;
        return [{ title: 'Resume Playbook', publishedAt: '2026-10-15T00:00:00Z' }] as unknown as never;
      }
      if (typeof query === 'string' && query.includes('job')) {
        if (query.startsWith('count')) return 8 as unknown as never;
        return [{ title: 'Staff Frontend Engineer', publishedAt: '2026-10-25T00:00:00Z' }] as unknown as never;
      }
      return 0 as unknown as never;
    });

    render(
      <MemoryRouter>
        <SanityHealthCheck />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Sanity Studio Connected & Synced/i)).toBeInTheDocument();
    });

    const toggleButton = screen.getByRole('button', { name: /Health Diagnostics/i });
    fireEvent.click(toggleButton);

    expect(screen.getByText(/Sanity CMS Real-Time Synchronization Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Blog Posts/i)).toBeInTheDocument();
    expect(screen.getByText(/Community Events/i)).toBeInTheDocument();
    expect(screen.getByText(/Career Resources/i)).toBeInTheDocument();
    expect(screen.getByText(/Inclusive Jobs/i)).toBeInTheDocument();

    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('displays warning when dataset responds with 0 total documents', async () => {
    vi.mocked(sanityClient.fetch).mockImplementation(async (query: string) => {
      if (typeof query === 'string' && query.startsWith('count')) {
        return 0 as unknown as never;
      }
      return [] as unknown as never;
    });

    render(
      <MemoryRouter>
        <SanityHealthCheck />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Connection Active · Content Empty or Stale/i)).toBeInTheDocument();
    });

    // Expand dashboard
    fireEvent.click(screen.getByRole('button', { name: /Health Diagnostics/i }));
    expect(screen.getByText(/Dataset Connected with Empty Content/i)).toBeInTheDocument();
  });

  it('displays error banner and diagnostics when Sanity query fails', async () => {
    vi.mocked(sanityClient.fetch).mockRejectedValue(new Error('CORS origin error'));

    render(
      <MemoryRouter>
        <SanityHealthCheck />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Sanity Synchronization Error/i)).toBeInTheDocument();
    });

    // Expand diagnostics
    fireEvent.click(screen.getByRole('button', { name: /Health Diagnostics/i }));
    expect(screen.getByText(/Sanity Synchronization Failed/i)).toBeInTheDocument();
    expect(screen.getByText(/CORS origin error/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open Sanity CORS Settings/i })).toBeInTheDocument();
  });

  it('triggers manual re-check when Check Sync button is clicked', async () => {
    vi.mocked(sanityClient.fetch).mockResolvedValue(2 as unknown as never);

    render(
      <MemoryRouter>
        <SanityHealthCheck />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Sanity Studio Connected & Synced/i)).toBeInTheDocument();
    });

    const checkSyncButton = screen.getByRole('button', { name: /Check Sync/i });
    fireEvent.click(checkSyncButton);

    expect(sanityClient.fetch).toHaveBeenCalled();
  });
});
