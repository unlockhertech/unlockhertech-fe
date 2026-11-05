import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import confetti from 'canvas-confetti';
import { AssessmentPage } from '../app/pages/AssessmentPage';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('AssessmentPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const renderAssessmentPage = () => {
    return render(
      <MemoryRouter>
        <AssessmentPage />
      </MemoryRouter>
    );
  };

  it('renders page header and introductory value pitch', () => {
    renderAssessmentPage();
    expect(screen.getByRole('heading', { level: 1, name: /Tech Readiness & Career Fit Self-Assessment/i })).toBeInTheDocument();
    expect(screen.getByText(/Interactive Career Toolkit/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Discover Your Tech Transition Readiness & Concrete Next Steps/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Free Assessment \(3–5 Mins\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Preview or Print Blank Worksheet/i })).toBeInTheDocument();
  });

  it('renders value pillars and scoring guidance accordion on the intro screen', () => {
    renderAssessmentPage();
    expect(screen.getByText(/4-Pillar Visual Readiness Radar/i)).toBeInTheDocument();
    expect(screen.getByText(/Personalized 2-Page Action Plan \(PDF\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Tailored Resource & Track Matching/i)).toBeInTheDocument();

    const scoringToggle = screen.getByRole('button', { name: /Understanding the 1–5 Rating Scale & Scoring Guidance/i });
    expect(scoringToggle).toBeInTheDocument();
    expect(scoringToggle).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(scoringToggle);
    expect(scoringToggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/Brand new territory or an area where you have little to no previous exposure/i)).toBeInTheDocument();
    expect(screen.getByText(/Honest self-reflection unlocks the most accurate action steps/i)).toBeInTheDocument();
  });

  it('starts assessment into active step-by-step category flow with forward/back navigation', () => {
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    renderAssessmentPage();

    // Click Start Assessment
    const startBtn = screen.getByRole('button', { name: /Start Free Assessment \(3–5 Mins\)/i });
    fireEvent.click(startBtn);

    // Active Category 1 is shown
    expect(screen.getByText(/Category 1 Summary/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Step 1: Mindset/i })).toHaveAttribute('aria-current', 'step');

    // Next step navigation
    const nextBtn = screen.getByRole('button', { name: /Next: Step 2/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Category 2 Summary/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Step 2: Skills Translation/i })).toHaveAttribute('aria-current', 'step');

    // Previous step navigation
    const prevBtn = screen.getByRole('button', { name: /Previous Step/i });
    fireEvent.click(prevBtn);

    expect(screen.getByText(/Category 1 Summary/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Step 1: Mindset/i })).toHaveAttribute('aria-current', 'step');

    // On Step 1, Overview button is available to return to intro
    const overviewBtn = screen.getByRole('button', { name: /Overview/i });
    fireEvent.click(overviewBtn);
    expect(screen.getByRole('heading', { level: 2, name: /Discover Your Tech Transition Readiness & Concrete Next Steps/i })).toBeInTheDocument();
  });

  it('resumes assessment from intro when saved answers are present in localStorage', () => {
    localStorage.setItem('uht_assessment_answers', JSON.stringify({ m1_q1: 5, m1_q2: 4 }));
    renderAssessmentPage();

    const resumeBtn = screen.getByRole('button', { name: /Resume Assessment \(2\/16 Answered\)/i });
    expect(resumeBtn).toBeInTheDocument();

    fireEvent.click(resumeBtn);
    expect(screen.getByText(/2 of 4 answered/i)).toBeInTheDocument();
  });

  it('supports toggling between Focus Mode and Worksheet View in active stage', () => {
    renderAssessmentPage();

    // Start in worksheet mode via secondary button
    const previewWorksheetBtn = screen.getByRole('button', { name: /Preview or Print Blank Worksheet/i });
    fireEvent.click(previewWorksheetBtn);

    // Worksheet view is active
    const worksheetBtn = screen.getByRole('button', { name: /Worksheet View/i });
    const focusModeBtn = screen.getByRole('button', { name: /Focus Mode \(Step-by-Step\)/i });
    expect(worksheetBtn).toHaveAttribute('aria-pressed', 'true');
    expect(focusModeBtn).toHaveAttribute('aria-pressed', 'false');

    // All categories are present in worksheet view
    expect(screen.getAllByText(/Mindset & Resilience/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Transferable Skills Translation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Technical Literacy & Portfolio/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Networking & Execution Strategy/i).length).toBeGreaterThan(0);

    // Switch back to Focus Mode
    fireEvent.click(focusModeBtn);
    expect(focusModeBtn).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/Category 1 Summary/i)).toBeInTheDocument();
  });

  it('allows answering questions and navigating to the results dashboard with radar and action plan', () => {
    renderAssessmentPage();
    fireEvent.click(screen.getByRole('button', { name: /Start Free Assessment \(3–5 Mins\)/i }));

    // Answer category 1 questions
    const scoreButtons = screen.getAllByRole('radio', { name: /5 - Always/i });
    expect(scoreButtons.length).toBeGreaterThan(0);
    fireEvent.click(scoreButtons[0]);

    // Navigate to step 4
    fireEvent.click(screen.getByRole('button', { name: /Step 4: Networking/i }));
    expect(screen.getByText(/Category 4 Summary/i)).toBeInTheDocument();

    // Click View Full Results
    const viewResultsBtn = screen.getByRole('button', { name: /View Full Results/i });
    fireEvent.click(viewResultsBtn);

    // Results dashboard is rendered
    expect(screen.getByText(/Your Transition Score Summary/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Your Personalized Career Action Plan/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Visual Readiness Radar Chart/i })).toBeInTheDocument();
    expect(screen.getByText(/Personal Reflection & Next Actions/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Download My Career Plan \(PDF\)/i }).length).toBeGreaterThan(0);

    // Review / Edit Answers button transitions back to active questionnaire
    const editBtn = screen.getByRole('button', { name: /Review \/ Edit Answers/i });
    fireEvent.click(editBtn);
    expect(screen.getByText(/Assessment Completion Progress/i)).toBeInTheDocument();
  });

  it('triggers celebration confetti and displays completion milestone banner on 100% completion in results', () => {
    renderAssessmentPage();
    fireEvent.click(screen.getByRole('button', { name: /Preview or Print Blank Worksheet/i }));

    const scoreButtons = screen.getAllByRole('radio', { name: /5 - Always/i });
    expect(scoreButtons).toHaveLength(16);
    scoreButtons.forEach((btn) => fireEvent.click(btn));

    expect(confetti).toHaveBeenCalled();

    // Jump to results
    const viewResultsBtn = screen.getByRole('button', { name: /View Your Results & Action Plan/i });
    fireEvent.click(viewResultsBtn);

    const milestoneBanner = screen.getByTestId('completion-milestone-banner');
    expect(milestoneBanner).toBeInTheDocument();
    expect(within(milestoneBanner).getByText(/100% Assessment Completed! 🎉/i)).toBeInTheDocument();

    // Re-trigger confetti
    const celebrateBtn = within(milestoneBanner).getByRole('button', { name: /Celebrate again with confetti/i });
    fireEvent.click(celebrateBtn);
    expect(confetti).toHaveBeenCalledTimes(2);
  });

  it('displays sticky mini-progress bar in active mode upon scrolling', () => {
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    renderAssessmentPage();
    fireEvent.click(screen.getByRole('button', { name: /Start Free Assessment \(3–5 Mins\)/i }));

    // Initially when scrollY is 0, sticky bar should not be visible
    expect(screen.queryByTestId('sticky-progress-bar')).not.toBeInTheDocument();

    // Simulate scroll down
    Object.defineProperty(window, 'scrollY', { value: 350, writable: true });
    fireEvent.scroll(window);

    const stickyBar = screen.getByTestId('sticky-progress-bar');
    expect(stickyBar).toBeInTheDocument();
    expect(within(stickyBar).getByText(/0\/16 Answered/i)).toBeInTheDocument();

    // Click "Results" jump button
    const jumpButton = within(stickyBar).getByRole('button', { name: /Results/i });
    fireEvent.click(jumpButton);
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });
});
