import { render, screen } from '@testing-library/react';
import { HomePage } from '../app/pages/HomePage.tsx';
import { MemoryRouter } from 'react-router';
import { AudioPlayerProvider } from '../app/context/AudioPlayerContext.tsx';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('HomePage', () => {
  const originalEnv = import.meta.env.VITE_ENABLE_DISCORD_ANNOUNCEMENT;

  beforeEach(() => {
    (import.meta.env as unknown as Record<string, string>).VITE_ENABLE_DISCORD_ANNOUNCEMENT = 'false';
  });

  afterEach(() => {
    (import.meta.env as unknown as Record<string, string>).VITE_ENABLE_DISCORD_ANNOUNCEMENT = originalEnv;
  });

  const renderHomePage = () => {
    return render(
      <MemoryRouter>
        <AudioPlayerProvider>
          <HomePage />
        </AudioPlayerProvider>
      </MemoryRouter>
    );
  };

  it('renders primary CTAs with correct text', () => {
    renderHomePage();
    expect(screen.getByText(/Explore Live Practice/i)).toBeInTheDocument();
    expect(screen.getByText(/Listen to Podcast/i)).toBeInTheDocument();
    expect(screen.getByText(/Never Miss an Episode/i)).toBeInTheDocument();
  });

  it('renders hero and platform links', () => {
    renderHomePage();
    expect(screen.getByText(/Conversations That/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Spotify/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Apple Podcasts/i).length).toBeGreaterThan(0);
  });

  it('does not render Discord community launch banner when announcement flag is disabled', () => {
    (import.meta.env as unknown as Record<string, string>).VITE_ENABLE_DISCORD_ANNOUNCEMENT = 'false';
    renderHomePage();
    expect(screen.queryByText(/Official Community Launch • Now Live/i)).not.toBeInTheDocument();
  });

  it('renders live Discord community launch banner with channel cards and join CTA when announcement flag is enabled', () => {
    (import.meta.env as unknown as Record<string, string>).VITE_ENABLE_DISCORD_ANNOUNCEMENT = 'true';
    renderHomePage();
    expect(screen.getByText(/Official Community Launch • Now Live/i)).toBeInTheDocument();
    expect(screen.getByText(/Connect, Collaborate & Grow on/i)).toBeInTheDocument();
    expect(screen.getByText(/#she-leads-tech/i)).toBeInTheDocument();
    expect(screen.getByText(/#podcast-discussion/i)).toBeInTheDocument();
    expect(screen.getByText(/#job-opportunities/i)).toBeInTheDocument();
    expect(screen.getByText(/#intros-and-networking/i)).toBeInTheDocument();

    const joinBtn = screen.getByRole('link', { name: /Join Unlock Her Tech Discord Server/i });
    expect(joinBtn).toBeInTheDocument();
    expect(joinBtn).toHaveAttribute('href', 'https://discord.gg/7yC78Yhem6');
  });
});
