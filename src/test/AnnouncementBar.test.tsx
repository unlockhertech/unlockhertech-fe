import { render, screen, fireEvent } from '@testing-library/react';
import { AnnouncementBar } from '../app/components/AnnouncementBar';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('AnnouncementBar', () => {
  const originalEnv = import.meta.env.VITE_ENABLE_DISCORD_ANNOUNCEMENT;

  beforeEach(() => {
    (import.meta.env as unknown as Record<string, string>).VITE_ENABLE_DISCORD_ANNOUNCEMENT = 'true';
  });

  afterEach(() => {
    (import.meta.env as unknown as Record<string, string>).VITE_ENABLE_DISCORD_ANNOUNCEMENT = originalEnv;
  });

  it('renders announcement bar when flag is true', () => {
    render(<AnnouncementBar />);
    expect(screen.getByText(/DISCORD LAUNCH/i)).toBeInTheDocument();
    expect(screen.getByText(/We are live on Discord!/i)).toBeInTheDocument();
    const discordLink = screen.getByRole('link', { name: /Join Discord Community/i });
    expect(discordLink).toBeInTheDocument();
    expect(discordLink).toHaveAttribute('href', 'https://discord.gg/7yC78Yhem6');
  });

  it('does not render when flag is false', () => {
    (import.meta.env as unknown as Record<string, string>).VITE_ENABLE_DISCORD_ANNOUNCEMENT = 'false';
    const { container } = render(<AnnouncementBar />);
    expect(container.firstChild).toBeNull();
    expect(screen.queryByText(/DISCORD LAUNCH/i)).not.toBeInTheDocument();
  });

  it('dismisses announcement bar when clicking the close button', () => {
    render(<AnnouncementBar />);
    expect(screen.getByText(/DISCORD LAUNCH/i)).toBeInTheDocument();

    const dismissBtn = screen.getByRole('button', { name: /Dismiss announcement/i });
    fireEvent.click(dismissBtn);

    expect(screen.queryByText(/DISCORD LAUNCH/i)).not.toBeInTheDocument();
  });
});
