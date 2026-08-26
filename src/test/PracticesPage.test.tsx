import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { PracticesPage } from '../app/pages/PracticesPage';

describe('PracticesPage', () => {
  const renderPracticesPage = () => {
    return render(
      <MemoryRouter>
        <PracticesPage />
      </MemoryRouter>
    );
  };

  it('renders page header and hero title', () => {
    renderPracticesPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/She Leads Tech/i);
    expect(screen.getByText(/Fortnightly live LeetCode and problem-solving workshops/i)).toBeInTheDocument();
  });

  it('renders algorithmic patterns section', () => {
    renderPracticesPage();
    expect(screen.getByText(/Essential Interview Patterns We Cover/i)).toBeInTheDocument();
    expect(screen.getByText(/Two Pointers & Sliding Window/i)).toBeInTheDocument();
    expect(screen.getByText(/Trees & Binary Search Trees/i)).toBeInTheDocument();
  });

  it('renders how it works / format steps', () => {
    renderPracticesPage();
    expect(screen.getByText(/How a Typical 70-Minute Practice Runs/i)).toBeInTheDocument();
    expect(screen.getByText(/Problem Deconstruction/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Group Coding/i)).toBeInTheDocument();
    expect(screen.getByText(/Debrief & Tips/i)).toBeInTheDocument();
  });

  it('renders RSVP / practice registration CTAs', () => {
    renderPracticesPage();
    const ctaLinks = screen.getAllByRole('link', { name: /View Upcoming Sessions|Join Our Next Practice/i });
    expect(ctaLinks.length).toBeGreaterThan(0);
  });

  it('renders live fortnightly practice countdown clock section', () => {
    renderPracticesPage();
    expect(screen.getByTestId('practice-countdown-section')).toBeInTheDocument();
    expect(screen.getByText(/Next Topic Spotlight/i)).toBeInTheDocument();
    expect(screen.getByTestId('countdown-digits-grid')).toBeInTheDocument();
  });
});
