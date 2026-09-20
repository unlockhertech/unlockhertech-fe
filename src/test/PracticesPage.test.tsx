import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { PracticesPage } from '../app/pages/PracticesPage';

describe('PracticesPage', () => {
  const renderPracticesPage = (initialEntries: string[] = ['/she-leads-tech']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <PracticesPage />
      </MemoryRouter>
    );
  };

  it('renders page header and hero title', () => {
    renderPracticesPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/She Leads Tech/i);
    expect(screen.getAllByText(/Theory • Practice • Review/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Interactive technical workshops designed to build deep engineering understanding/i)).toBeInTheDocument();
    expect(screen.getByText(/Current sessions are/i)).toBeInTheDocument();
  });

  it('renders engineering curriculum topics section with active and pipeline tiers', () => {
    renderPracticesPage();
    expect(screen.getByText(/Engineering Topics & Domains We Cover/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Workshop Tracks/i)).toBeInTheDocument();
    expect(screen.getByText(/Live in Rotation Now/i)).toBeInTheDocument();
    expect(screen.getByText(/Curriculum Expansion Roadmap/i)).toBeInTheDocument();
    expect(screen.getByText(/In Pipeline · Coming Next Year/i)).toBeInTheDocument();

    expect(screen.getAllByText(/Data Structures & Algorithms/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/System Design/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Frontend Engineering/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Cloud & AWS/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Scheduled Next Year/i).length).toBeGreaterThan(0);
  });

  it('renders She Leads Tech learning formats and key differences', () => {
    renderPracticesPage();
    expect(screen.getByText(/She Leads Tech Learning Formats/i)).toBeInTheDocument();
    expect(screen.getAllByText(/She Leads Tech Theory/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/She Leads Tech Practice/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/She Leads Tech Review/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/The Key Difference/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Learn it → Understand it → See it applied/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Try it → Solve it → Discuss it → Improve it/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Remember it → Practise it again/i).length).toBeGreaterThan(0);
  });

  it('allows switching between format tabs interactively', () => {
    renderPracticesPage();

    // Click Theory tab
    const theoryTab = screen.getByRole('tab', { name: /Theory/i });
    fireEvent.click(theoryTab);
    expect(theoryTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/What the Instructor Does/i)).toBeInTheDocument();
    expect(screen.getByText(/Instructor-Led Teaching & Practical Examples/i)).toBeInTheDocument();

    // Click Practice tab
    const practiceTab = screen.getByRole('tab', { name: /Practice/i });
    fireEvent.click(practiceTab);
    expect(practiceTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Hands-On Experience & Problem Solving/i)).toBeInTheDocument();
    expect(screen.getByText(/Act more as a facilitator and guide rather than a lecturer/i)).toBeInTheDocument();

    // Click Review tab
    const reviewTab = screen.getByRole('tab', { name: /Review/i });
    fireEvent.click(reviewTab);
    expect(reviewTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Repetition & Long-Term Mastery/i)).toBeInTheDocument();
    expect(screen.getByText(/Give a short recap of the original concept/i)).toBeInTheDocument();

    // Click Back to Overview
    const overviewTab = screen.getByRole('tab', { name: /Overview & Compare/i });
    fireEvent.click(overviewTab);
    expect(overviewTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/The Key Difference/i)).toBeInTheDocument();
  });

  it('renders direct format tab when loaded with URL query param', () => {
    renderPracticesPage(['/she-leads-tech?format=practice']);
    const practiceTab = screen.getByRole('tab', { name: /Practice/i });
    expect(practiceTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Hands-On Experience & Problem Solving/i)).toBeInTheDocument();
  });

  it('renders RSVP / practice registration CTAs', () => {
    renderPracticesPage();
    const ctaLinks = screen.getAllByRole('link', { name: /View Upcoming Sessions|Subscribe on Luma/i });
    expect(ctaLinks.length).toBeGreaterThan(0);
  });

  it('renders live practice countdown clock section', () => {
    renderPracticesPage();
    expect(screen.getByTestId('practice-countdown-section')).toBeInTheDocument();
    expect(screen.getAllByText(/She Leads Tech/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId('countdown-digits-grid')).toBeInTheDocument();
  });
});
