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

  it('renders page header and worksheet title', () => {
    renderAssessmentPage();
    expect(screen.getByRole('heading', { level: 1, name: /Tech Readiness & Career Fit Self-Assessment/i })).toBeInTheDocument();
    expect(screen.getByText(/Interactive Career Toolkit/i)).toBeInTheDocument();
  });

  it('renders all four assessment categories', () => {
    renderAssessmentPage();
    expect(screen.getAllByText(/Mindset & Resilience/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Transferable Skills Translation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Technical Literacy & Portfolio/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Networking & Execution Strategy/i).length).toBeGreaterThan(0);
  });

  it('allows answering questions and updates the score breakdown', () => {
    renderAssessmentPage();
    // Questions have ratings 1-5 buttons with radio roles and labels
    const scoreButtons = screen.getAllByRole('radio', { name: /5 - Always/i });
    expect(scoreButtons.length).toBeGreaterThan(0);
    fireEvent.click(scoreButtons[0]);
    // Progress or score card is updated
    expect(screen.getByText(/Your Transition Score Summary/i)).toBeInTheDocument();
  });

  it('renders rating scale legend in category sections with mobile clarity', () => {
    renderAssessmentPage();
    expect(screen.getAllByLabelText(/Rating Scale Legend/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Rarely \/ Never/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sometimes \/ Moderately/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Consistently \/ Confidently/i).length).toBeGreaterThan(0);
  });

  it('renders action plan and reflection sections', () => {
    renderAssessmentPage();
    expect(screen.getByText(/Personal Reflection & Next Actions/i)).toBeInTheDocument();
    expect(screen.getByText(/Print \/ Save PDF/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download My Career Plan \(PDF\)/i })).toBeInTheDocument();
    expect(screen.getByText(/Email Results & Action Plan to Myself/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your email address/i)).toBeInTheDocument();
  });

  it('renders auto-matched resources tailored to growth areas', () => {
    renderAssessmentPage();
    // Answer first question to trigger matching
    const scoreButtons = screen.getAllByRole('radio', { name: /5 - Always/i });
    fireEvent.click(scoreButtons[0]);

    expect(screen.getByTestId('auto-matched-resources-section')).toBeInTheDocument();
    expect(screen.getByText(/Tailored Resources for Your Growth Areas/i)).toBeInTheDocument();
  });

  it('renders the visual readiness radar chart and legend', () => {
    renderAssessmentPage();
    expect(screen.getByText(/Visual Readiness Radar/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Visual Readiness Radar Chart/i })).toBeInTheDocument();
    expect(screen.getByText(/4-dimensional readiness map/i)).toBeInTheDocument();
    expect(screen.getByText(/Spider Chart/i)).toBeInTheDocument();
  });

  it('displays sticky mini-progress bar on scroll and transforms to View Your Results upon 100% completion', () => {
    // Mock scrollIntoView
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    renderAssessmentPage();

    // Initially when scrollY is 0, sticky bar should not be visible
    expect(screen.queryByTestId('sticky-progress-bar')).not.toBeInTheDocument();

    // Simulate scrolling down
    Object.defineProperty(window, 'scrollY', { value: 350, writable: true });
    fireEvent.scroll(window);

    // Sticky progress bar should now appear
    const stickyBar = screen.getByTestId('sticky-progress-bar');
    expect(stickyBar).toBeInTheDocument();
    expect(within(stickyBar).getByText(/0\/16 Answered/i)).toBeInTheDocument();

    // Click "Results" jump button
    const jumpButton = within(stickyBar).getByRole('button', { name: /Results/i });
    fireEvent.click(jumpButton);
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    // Answer 1 question
    const scoreButtons = screen.getAllByRole('radio', { name: /5 - Always/i });
    expect(scoreButtons).toHaveLength(16);
    fireEvent.click(scoreButtons[0]);
    expect(within(stickyBar).getByText(/1\/16 Answered/i)).toBeInTheDocument();

    // Answer remaining 15 questions (total 16)
    scoreButtons.forEach((btn) => fireEvent.click(btn));

    // Sticky bar should now transform into the vibrant "16/16 Completed — View Your Results" button
    const viewResultsButton = screen.getByRole('button', { name: /16\/16 Completed — View Your Results/i });
    expect(viewResultsButton).toBeInTheDocument();

    // Clicking it should trigger smooth scrolling to results
    fireEvent.click(viewResultsButton);
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('supports toggling between Worksheet View and Focus Mode (Step-by-Step)', () => {
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    renderAssessmentPage();

    // Default is Worksheet View
    const worksheetBtn = screen.getByRole('button', { name: /Worksheet View/i });
    const focusModeBtn = screen.getByRole('button', { name: /Focus Mode \(Step-by-Step\)/i });
    expect(worksheetBtn).toHaveAttribute('aria-pressed', 'true');
    expect(focusModeBtn).toHaveAttribute('aria-pressed', 'false');

    // Switch to Focus Mode
    fireEvent.click(focusModeBtn);
    expect(focusModeBtn).toHaveAttribute('aria-pressed', 'true');
    expect(worksheetBtn).toHaveAttribute('aria-pressed', 'false');

    // Step indicators are visible
    expect(screen.getByRole('button', { name: /Step 1: Mindset/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Step 2: Skills Translation/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Step 3: Tech & Portfolio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Step 4: Networking/i })).toBeInTheDocument();

    // Summary for current step
    expect(screen.getByText(/Category 1 Summary/i)).toBeInTheDocument();

    // Navigate to Step 2 via Next button
    const nextBtn = screen.getByRole('button', { name: /Next: Step 2/i });
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Category 2 Summary/i)).toBeInTheDocument();

    // Navigate to Step 1 via Previous button
    const prevBtn = screen.getByRole('button', { name: /Previous/i });
    fireEvent.click(prevBtn);
    expect(screen.getByText(/Category 1 Summary/i)).toBeInTheDocument();

    // Jump directly to Step 4 via step pill button
    const step4Btn = screen.getByRole('button', { name: /Step 4: Networking/i });
    fireEvent.click(step4Btn);
    expect(screen.getByText(/Category 4 Summary/i)).toBeInTheDocument();

    // On step 4, View Full Results button is shown
    const viewResultsBtn = screen.getByRole('button', { name: /View Full Results/i });
    fireEvent.click(viewResultsBtn);
    expect(scrollIntoViewMock).toHaveBeenCalled();

    // Switch back to Worksheet View
    fireEvent.click(worksheetBtn);
    expect(worksheetBtn).toHaveAttribute('aria-pressed', 'true');
    expect(focusModeBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('triggers confetti celebration and renders the milestone achievement banner upon 100% completion', () => {
    renderAssessmentPage();

    // Initially milestone banner should not be present
    expect(screen.queryByTestId('completion-milestone-banner')).not.toBeInTheDocument();

    // Answer all 16 questions
    const scoreButtons = screen.getAllByRole('radio', { name: /5 - Always/i });
    expect(scoreButtons).toHaveLength(16);
    scoreButtons.forEach((btn) => fireEvent.click(btn));

    // Confetti should have been triggered
    expect(confetti).toHaveBeenCalled();

    // Celebratory milestone banner should now be visible
    const milestoneBanner = screen.getByTestId('completion-milestone-banner');
    expect(milestoneBanner).toBeInTheDocument();
    expect(within(milestoneBanner).getByText(/100% Assessment Completed! 🎉/i)).toBeInTheDocument();
    expect(within(milestoneBanner).getByText(/Milestone Achieved/i)).toBeInTheDocument();

    // Clicking "Celebrate Again" triggers confetti again
    const celebrateAgainBtn = within(milestoneBanner).getByRole('button', { name: /Celebrate again with confetti/i });
    fireEvent.click(celebrateAgainBtn);
    expect(confetti).toHaveBeenCalledTimes(2);
  });
});
