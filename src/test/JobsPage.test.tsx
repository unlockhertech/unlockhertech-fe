import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import { JobsPage } from '../app/pages/JobsPage';
import * as jobsSanityUtils from '../app/utils/jobsSanity';
import type { Job } from '../app/types';

const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior Full Stack Engineer (Growth)",
    slug: "gitlab-senior-full-stack",
    company: "GitLab",
    category: "Engineering & Dev",
    location: "Remote (Global)",
    remoteStatus: "Remote (Global)",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    salaryRange: "$142,000 – $185,000 USD",
    minSalary: 142000,
    currency: "USD",
    techStack: ["React", "Ruby on Rails", "GraphQL"],
    whyApply: "100% all-remote organization with public compensation bands and flexible asynchronous workflows.",
    description: "GitLab is seeking a Senior Full Stack Engineer to lead user onboarding workflows.",
    inclusiveHighlights: ["Verified Inclusive", "Salary Transparent", "Flexible Hours", "Parental Leave"],
    applyUrl: "https://about.gitlab.com/jobs/",
    source: "GitLab Careers",
    featured: true,
    verifiedInclusive: true,
    publishedAt: new Date().toISOString(),
  },
  {
    id: "job-2",
    title: "Lead Product Designer &amp; Researcher",
    slug: "buffer-lead-product-designer",
    company: "Work &amp; Co",
    category: "Product & Design",
    location: "Remote (Global)",
    remoteStatus: "Remote (Global)",
    employmentType: "Full-time",
    experienceLevel: "Lead / Staff",
    salaryRange: "$130,000 – $160,000 USD",
    minSalary: 130000,
    currency: "USD",
    techStack: ["Figma", "Design Systems", "User Research"],
    whyApply: "",
    description: "<p>Shape intuitive publishing experiences with high accessibility standards.</p><br/><br/><p>Responsibilities &ndash; full transparency.</p>",
    inclusiveHighlights: ["Verified Inclusive", "Salary Transparent", "Flexible Hours"],
    applyUrl: "https://buffer.com/journey",
    source: "Buffer Careers",
    featured: false,
    verifiedInclusive: true,
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

describe('JobsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(jobsSanityUtils, 'getAllJobs').mockResolvedValue(MOCK_JOBS);
  });

  const renderJobsPage = () => {
    return render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    );
  };

  it('renders page header, hero text, and vetting badges', async () => {
    renderJobsPage();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Tech Jobs with Inclusive Cultures/i })).toBeInTheDocument();
      expect(screen.getByText(/100% Salary Transparent/i)).toBeInTheDocument();
      expect(screen.getByText(/Curated technical and product opportunities/i)).toBeInTheDocument();
      const submitRoleBtn = screen.getByRole('link', { name: /Submit a Transparent Role/i });
      expect(submitRoleBtn).toBeInTheDocument();
      expect(submitRoleBtn).toHaveAttribute('href', '/collaborate?tab=job');
    });
  });

  it('renders job cards with transparent compensation and why apply blurb', async () => {
    renderJobsPage();
    await waitFor(() => {
      expect(screen.getByText(/Senior Full Stack Engineer \(Growth\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Lead Product Designer/i)).toBeInTheDocument();
      expect(screen.getByText(/\$142,000 – \$185,000 USD/i)).toBeInTheDocument();
      expect(screen.getByText(/100% all-remote organization with public compensation bands/i)).toBeInTheDocument();
      expect(screen.getByText(/Verified for compensation transparency, flexible working arrangements/i)).toBeInTheDocument();
    });
  });

  it('filters job cards by keyword search', async () => {
    renderJobsPage();
    await waitFor(() => {
      expect(screen.getByText(/Senior Full Stack Engineer \(Growth\)/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search by role title, company, skills/i);
    fireEvent.change(searchInput, { target: { value: 'Designer' } });

    await waitFor(() => {
      expect(screen.getByText(/Lead Product Designer/i)).toBeInTheDocument();
      expect(screen.queryByText(/Senior Full Stack Engineer \(Growth\)/i)).not.toBeInTheDocument();
    });
  });

  it('allows saving and unsaving jobs', async () => {
    renderJobsPage();
    await waitFor(() => {
      expect(screen.getByText(/Senior Full Stack Engineer \(Growth\)/i)).toBeInTheDocument();
    });

    const saveButtons = screen.getAllByTitle(/Save this role/i);
    expect(saveButtons.length).toBeGreaterThan(0);
    fireEvent.click(saveButtons[0]);

    expect(screen.getByText(/Saved Roles \(1\)/i)).toBeInTheDocument();
  });

  it('opens job detail modal upon clicking a card', async () => {
    renderJobsPage();
    await waitFor(() => {
      expect(screen.getByText(/Senior Full Stack Engineer \(Growth\)/i)).toBeInTheDocument();
    });

    const viewDetailButtons = screen.getAllByText(/View Full Details/i);
    fireEvent.click(viewDetailButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Why This Role Passed Our Vetting/i)).toBeInTheDocument();
      expect(screen.getByText(/Role Overview/i)).toBeInTheDocument();
    });

    // Close modal
    const closeBtn = screen.getByRole('button', { name: 'Close modal' });
    fireEvent.click(closeBtn);

    // Open second job modal (which has empty whyApply and HTML in description)
    fireEvent.click(viewDetailButtons[1]);
    await waitFor(() => {
      expect(screen.getAllByText(/Verified for compensation transparency, flexible working arrangements/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText(/Responsibilities.*full transparency/i)).toBeInTheDocument();
    });
  });

  it('allows reporting an expired or closed role and removes it from view', async () => {
    renderJobsPage();
    await waitFor(() => {
      expect(screen.getByText(/Senior Full Stack Engineer \(Growth\)/i)).toBeInTheDocument();
    });

    const reportButtons = screen.getAllByTitle(/Report job as expired or closed/i);
    expect(reportButtons.length).toBeGreaterThan(0);
    fireEvent.click(reportButtons[0]);

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Senior Full Stack Engineer \(Growth\)/i })).not.toBeInTheDocument();
      expect(screen.getByText(/has been flagged for removal/i)).toBeInTheDocument();
    });
  });

  it('renders inclusivity & transparency vetting standards section', async () => {
    renderJobsPage();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: /How We Protect Job Seekers & Foster Inclusion/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: /Mandatory Salary Transparency/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3, name: /Remote & Flexibility Clarity/i })).toBeInTheDocument();
      expect(screen.getAllByText(/Centered on Women & Open to Allies/i).length).toBeGreaterThan(0);
    });
  });
});
