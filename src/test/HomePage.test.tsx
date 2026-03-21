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
    expect(screen.getByText(/Listen to the Latest Episode/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Subscribe Now/i).length).toBeGreaterThan(0);
  });

  it('renders secondary CTAs with correct text', () => {
    renderHomePage();
    expect(screen.getAllByText(/Browse All Episodes/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Learn More About Us/i).length).toBeGreaterThan(0);
  });
});
