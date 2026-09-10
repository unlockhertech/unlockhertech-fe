import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { AboutPage } from '../app/pages/AboutPage';

describe('AboutPage', () => {
  const renderWithRouter = () => {
    return render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
  };

  it('renders the page header with the correct title', () => {
    renderWithRouter();
    expect(screen.getByText(/About Unlock Her Tech/i)).toBeInTheDocument();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText('About', { selector: 'span.text-white' })).toBeInTheDocument();
  });

  it('renders the evolution and mission section', () => {
    renderWithRouter();
    expect(screen.getByText(/Our Evolution/i)).toBeInTheDocument();
    expect(screen.getByText(/Hands-On Technical Community/i)).toBeInTheDocument();
  });

  it('renders the two pillars section', () => {
    renderWithRouter();
    expect(screen.getByText(/Two Pillars, Unified Purpose/i)).toBeInTheDocument();
    expect(screen.getAllByText(/She Leads Tech/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/The Unlock Her Tech Podcast/i).length).toBeGreaterThan(0);
  });

  it('renders the "Our Values" section with core values', () => {
    renderWithRouter();
    expect(screen.getByText(/Our Community Values/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Technical Depth & Growth/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Authentic Storytelling/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Radical Inclusion & Safety/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Actionable Insights/i).length).toBeGreaterThan(0);
  });

  it('renders the call to action buttons', () => {
    renderWithRouter();
    const explorePractice = screen.getAllByRole('link', { name: /Explore She Leads Tech|Explore Practice/i });
    expect(explorePractice.length).toBeGreaterThan(0);
    
    const listenPodcast = screen.getAllByRole('link', { name: /Listen to Podcast/i });
    expect(listenPodcast.length).toBeGreaterThan(0);
  });
});
