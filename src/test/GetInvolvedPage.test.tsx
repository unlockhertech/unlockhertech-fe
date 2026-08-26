import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { GetInvolvedPage } from '../app/pages/GetInvolvedPage';

describe('GetInvolvedPage', () => {
  const renderGetInvolvedPage = (initialEntries: string[] = ['/get-involved']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <GetInvolvedPage />
      </MemoryRouter>
    );
  };

  it('renders page header and introduction', () => {
    renderGetInvolvedPage();
    expect(screen.getByRole('heading', { level: 1, name: /Get Involved/i })).toBeInTheDocument();
    expect(screen.getByText(/Whether you want to mentor aspiring engineers/i)).toBeInTheDocument();
  });

  it('allows switching between involvement tabs including Submit a Role', () => {
    renderGetInvolvedPage();
    const jobTab = screen.getByRole('button', { name: /Submit a Role/i });
    fireEvent.click(jobTab);
    expect(screen.getByText(/Submit a Transparent Tech Role/i)).toBeInTheDocument();

    const guestTab = screen.getByRole('button', { name: /Podcast Speaker/i });
    fireEvent.click(guestTab);
    expect(screen.getByText(/Request to Be a Podcast Guest or Speaker/i)).toBeInTheDocument();

    const partnerTab = screen.getByRole('button', { name: /Partner \/ Sponsor/i });
    fireEvent.click(partnerTab);
    expect(screen.getByText(/Partner & Sponsor Opportunities/i)).toBeInTheDocument();

    const mentorTab = screen.getByRole('button', { name: /Become a Mentor/i });
    fireEvent.click(mentorTab);
    expect(screen.getByText(/Mentor & Practice Leaders/i)).toBeInTheDocument();
  });

  it('opens job submission tab directly when linked with ?tab=job or via /collaborate', () => {
    renderGetInvolvedPage(['/collaborate?tab=job']);
    expect(screen.getByText(/Submit a Transparent Tech Role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact \/ Hiring Lead Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Transparent Salary Range/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Direct Application \/ ATS Requisition URL/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Role for Review/i })).toBeInTheDocument();
  });

  it('handles job submission and displays confirmation banner', () => {
    renderGetInvolvedPage(['/collaborate?tab=job']);
    fireEvent.change(screen.getByLabelText(/Contact \/ Hiring Lead Name/i), {
      target: { value: 'Jane Lead' },
    });
    fireEvent.change(screen.getByLabelText(/Work \/ Recruiting Email/i), {
      target: { value: 'lead@techco.com' },
    });
    fireEvent.change(screen.getByLabelText(/Company \/ Organization/i), {
      target: { value: 'TechCo' },
    });
    fireEvent.change(screen.getByLabelText(/Role Title/i), {
      target: { value: 'Staff Frontend Engineer' },
    });
    fireEvent.change(screen.getByLabelText(/Transparent Salary Range/i), {
      target: { value: '$160k - $180k USD' },
    });
    fireEvent.change(screen.getByLabelText(/Direct Application \/ ATS Requisition URL/i), {
      target: { value: 'https://techco.com/jobs/123' },
    });

    const submitBtn = screen.getByRole('button', { name: /Submit Role for Review/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Thank you for submitting your transparent role!/i)).toBeInTheDocument();
    expect(screen.getByText(/reviews all listings against our 4 vetting standards/i)).toBeInTheDocument();
  });
});
