import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { TeamPage } from '../app/pages/TeamPage';

describe('TeamPage', () => {
  const renderTeamPage = () => {
    return render(
      <MemoryRouter>
        <TeamPage />
      </MemoryRouter>
    );
  };

  it('renders page header and title', () => {
    renderTeamPage();
    expect(screen.getByRole('heading', { level: 1, name: /Meet the Team/i })).toBeInTheDocument();
    expect(screen.getByText(/The passionate minds united by one mission/i)).toBeInTheDocument();
  });

  it('renders all team members including new members and updated roles', () => {
    renderTeamPage();
    // Co-founders
    expect(screen.getByText(/Pritanya Fritz/i)).toBeInTheDocument();
    expect(screen.getByText(/Chief Product & Technology Officer/i)).toBeInTheDocument();
    expect(screen.getByText(/Ellie Tahmasebi/i)).toBeInTheDocument();

    // Research & Editorial (including new members & Rupi promotion)
    expect(screen.getByText(/Rupi Sagoo/i)).toBeInTheDocument();
    expect(screen.getByText(/Lead Researcher/i)).toBeInTheDocument();
    expect(screen.getByText(/Nina Vorobeva/i)).toBeInTheDocument();
    expect(screen.getByText(/Lorraine Muchingaguyo/i)).toBeInTheDocument();

    // Podcast & Production
    expect(screen.getByText(/Jen Carswell/i)).toBeInTheDocument();
    expect(screen.getByText(/Claudia Tiller/i)).toBeInTheDocument();
    expect(screen.getByText(/Tim Price/i)).toBeInTheDocument();
    expect(screen.getByText(/Rufus Hainge/i)).toBeInTheDocument();

    // Partnerships, Community & Design
    expect(screen.getByText(/Albert Duker/i)).toBeInTheDocument();
    expect(screen.getByText(/Shelly Chambers/i)).toBeInTheDocument();
    expect(screen.getByText(/Olha Danylevska/i)).toBeInTheDocument();
  });

  it('renders department filter tabs and allows filtering', () => {
    renderTeamPage();
    expect(screen.getByRole('tab', { name: /All Team/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Research/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Production/i })).toBeInTheDocument();

    // Switch to Research tab
    const researchTab = screen.getByRole('tab', { name: /Research/i });
    fireEvent.click(researchTab);
    expect(screen.getByText(/Research & Editorial/i)).toBeInTheDocument();
    expect(screen.getByText(/Nina Vorobeva/i)).toBeInTheDocument();
    expect(screen.queryByText(/Pritanya Fritz/i)).not.toBeInTheDocument();

    // Switch back to All
    const allTab = screen.getByRole('tab', { name: /All Team/i });
    fireEvent.click(allTab);
    expect(screen.getByText(/Pritanya Fritz/i)).toBeInTheDocument();
  });

  it('allows collapsing and expanding individual department sections with accessible attributes', () => {
    renderTeamPage();
    const collapseLeadershipBtn = screen.getByRole('button', { name: /Collapse Co-Founders & Leadership/i });
    expect(collapseLeadershipBtn).toHaveAttribute('aria-expanded', 'true');
    expect(collapseLeadershipBtn).toHaveAttribute('aria-controls', 'dept-content-leadership');
    
    // Collapse leadership
    fireEvent.click(collapseLeadershipBtn);
    expect(screen.queryByText(/Pritanya Fritz/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Expand Co-Founders & Leadership/i })).toHaveAttribute('aria-expanded', 'false');

    // Collapse research department as well
    const collapseResearchBtn = screen.getByRole('button', { name: /Collapse Research & Editorial/i });
    fireEvent.click(collapseResearchBtn);
    expect(screen.queryByText(/Nina Vorobeva/i)).not.toBeInTheDocument();

    // Expand leadership section again
    const expandLeadershipBtn = screen.getByRole('button', { name: /Expand Co-Founders & Leadership/i });
    fireEvent.click(expandLeadershipBtn);
    expect(screen.getByText(/Pritanya Fritz/i)).toBeInTheDocument();
    expect(expandLeadershipBtn).toHaveAttribute('aria-expanded', 'true');

    // Research should still be collapsed
    expect(screen.queryByText(/Nina Vorobeva/i)).not.toBeInTheDocument();

    // Expand research section
    const expandResearchBtn = screen.getByRole('button', { name: /Expand Research & Editorial/i });
    fireEvent.click(expandResearchBtn);
    expect(screen.getByText(/Nina Vorobeva/i)).toBeInTheDocument();
  });

  it('toggles all sections via the global Expand/Collapse All button', () => {
    renderTeamPage();
    const toggleAllBtn = screen.getByRole('button', { name: /Collapse All Sections/i });
    expect(toggleAllBtn).toBeInTheDocument();

    // Click collapse all
    fireEvent.click(toggleAllBtn);

    // Verify all department members are collapsed
    expect(screen.queryByText(/Pritanya Fritz/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Nina Vorobeva/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Jen Carswell/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Albert Duker/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Olha Danylevska/i)).not.toBeInTheDocument();

    // Verify button text changed to Expand All Sections
    const expandAllBtn = screen.getByRole('button', { name: /Expand All Sections/i });
    expect(expandAllBtn).toBeInTheDocument();

    // Click expand all
    fireEvent.click(expandAllBtn);

    // Verify all members are visible again
    expect(screen.getByText(/Pritanya Fritz/i)).toBeInTheDocument();
    expect(screen.getByText(/Nina Vorobeva/i)).toBeInTheDocument();
    expect(screen.getByText(/Jen Carswell/i)).toBeInTheDocument();
    expect(screen.getByText(/Albert Duker/i)).toBeInTheDocument();
    expect(screen.getByText(/Olha Danylevska/i)).toBeInTheDocument();
  });

  it('hides the global collapse toggle when a specific department tab is selected', () => {
    renderTeamPage();
    expect(screen.getByRole('button', { name: /Collapse All Sections/i })).toBeInTheDocument();

    // Switch to Design tab
    const designTab = screen.getByRole('tab', { name: /Design/i });
    fireEvent.click(designTab);

    // Global toggle should be hidden
    expect(screen.queryByRole('button', { name: /Collapse All Sections/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Expand All Sections/i })).not.toBeInTheDocument();

    // Only Design department section is rendered
    expect(screen.getByText(/Product & UX Design/i)).toBeInTheDocument();
    expect(screen.getByText(/Olha Danylevska/i)).toBeInTheDocument();
    expect(screen.queryByText(/Pritanya Fritz/i)).not.toBeInTheDocument();
  });

  it('renders LinkedIn links for team members', () => {
    renderTeamPage();
    const linkedinLinks = screen.getAllByRole('link', { name: /LinkedIn/i });
    expect(linkedinLinks.length).toBeGreaterThan(0);
  });
});
