import { render, screen } from '@testing-library/react';
import { HomePage } from '../app/pages/HomePage.tsx';
import { MemoryRouter } from 'react-router';
import { AudioPlayerProvider } from '../app/context/AudioPlayerContext.tsx';
import { describe, it, expect } from 'vitest';

describe('HomePage', () => {
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
});
