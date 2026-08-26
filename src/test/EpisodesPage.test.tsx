import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { EpisodesPage } from '../app/pages/EpisodesPage';
import { AudioPlayerProvider } from '../app/context/AudioPlayerContext';

describe('EpisodesPage', () => {
  const renderEpisodesPage = () => {
    return render(
      <MemoryRouter>
        <AudioPlayerProvider>
          <EpisodesPage />
        </AudioPlayerProvider>
      </MemoryRouter>
    );
  };

  it('renders page header and search input', () => {
    renderEpisodesPage();
    expect(screen.getByRole('heading', { level: 1, name: /All Episodes/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search episodes…/i)).toBeInTheDocument();
  });

  it('renders sort controls and episode feed', () => {
    renderEpisodesPage();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Newest first/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Oldest first/i })).toBeInTheDocument();
  });

  it('renders subscription call to action', () => {
    renderEpisodesPage();
    expect(screen.getByText(/Subscribe & Never Miss a Drop/i)).toBeInTheDocument();
  });
});
