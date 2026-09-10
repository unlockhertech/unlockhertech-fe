import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { LinksPage } from '../app/pages/LinksPage';

describe('LinksPage', () => {
  const renderLinksPage = () => {
    return render(
      <MemoryRouter>
        <LinksPage />
      </MemoryRouter>
    );
  };

  it('renders header, title, and social handle', () => {
    renderLinksPage();
    expect(screen.getByText(/Links to Unlock Her Tech/i)).toBeInTheDocument();
    expect(screen.getByText(/@unlockhertech/i)).toBeInTheDocument();
    expect(screen.getByText(/Conversations that unlock careers in tech/i)).toBeInTheDocument();
  });

  it('renders core link buttons', () => {
    renderLinksPage();
    expect(screen.getByText(/She Leads Tech/i)).toBeInTheDocument();
    expect(screen.getByText(/Listen to the Podcast/i)).toBeInTheDocument();
    expect(screen.getByText(/Follow On LinkedIn/i)).toBeInTheDocument();
  });

  it('renders social icons and back to main website link', () => {
    renderLinksPage();
    expect(screen.getByLabelText(/Unlock Her Tech on Instagram/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Unlock Her Tech on Spotify/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Unlock Her Tech on Apple Podcasts/i)).toBeInTheDocument();
    expect(screen.getByText(/Visit unlockhertech.com/i)).toBeInTheDocument();
  });

  it('renders featured YouTube video embed', () => {
    renderLinksPage();
    const iframe = screen.getByTitle(/Unlock Her Tech Featured Episode/i);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', expect.stringContaining('5EFBQsGvlUs'));
  });
});
