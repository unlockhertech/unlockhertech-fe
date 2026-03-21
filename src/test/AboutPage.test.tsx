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
    expect(screen.getByText(/About Our Initiative/i)).toBeInTheDocument();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    // Use a more specific selector for the "About" breadcrumb
    expect(screen.getByText('About', { selector: 'span.text-white' })).toBeInTheDocument();
  });

  it('renders the "Why We Started" section', () => {
    renderWithRouter();
    expect(screen.getByText(/Why We Started/i)).toBeInTheDocument();
    expect(screen.getByText(/Our story/i)).toBeInTheDocument();
    expect(screen.getByText(/We started Unlock Her Tech with a simple belief/i)).toBeInTheDocument();
  });

  it('renders the "For Every Woman in Tech" section', () => {
    renderWithRouter();
    expect(screen.getByText(/For Every Woman in Tech/i)).toBeInTheDocument();
    expect(screen.getByText(/Inclusion at our core/i)).toBeInTheDocument();
    
    // Check for some of the labels
    expect(screen.getByText(/Engineers/i)).toBeInTheDocument();
    expect(screen.getByText(/Founders/i)).toBeInTheDocument();
  });

  it('renders the "Our Values" section with all values', () => {
    renderWithRouter();
    expect(screen.getByText(/Our Values/i)).toBeInTheDocument();
    expect(screen.getByText(/What drives us/i)).toBeInTheDocument();
    
    expect(screen.getByText(/Authentic Storytelling/i)).toBeInTheDocument();
    expect(screen.getByText(/Radical Inclusion/i)).toBeInTheDocument();
    expect(screen.getByText(/Actionable Insight/i)).toBeInTheDocument();
    expect(screen.getByText(/Community First/i)).toBeInTheDocument();
  });

  it('renders the call to action buttons', () => {
    renderWithRouter();
    const browseLinks = screen.getAllByRole('link', { name: /Browse (All )?Episodes/i });
    expect(browseLinks.length).toBeGreaterThan(0);
    
    const teamLinks = screen.getAllByRole('link', { name: /Meet the Team/i });
    expect(teamLinks.length).toBeGreaterThan(0);
  });
});
