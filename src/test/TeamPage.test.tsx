import { render, screen } from '@testing-library/react';
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

  it('renders team members', () => {
    renderTeamPage();
    expect(screen.getByText(/Pritanya Fritz/i)).toBeInTheDocument();
    expect(screen.getByText(/Ellie Tahmasebi/i)).toBeInTheDocument();
    expect(screen.getByText(/Jen Carswell/i)).toBeInTheDocument();
    expect(screen.getByText(/Albert Duker/i)).toBeInTheDocument();
    expect(screen.getByText(/Sabrina Scollan/i)).toBeInTheDocument();
    expect(screen.getByText(/Shelly Chambers/i)).toBeInTheDocument();
    expect(screen.getByText(/Rupi Sagoo/i)).toBeInTheDocument();
    expect(screen.getByText(/Olha Danylevska/i)).toBeInTheDocument();
    expect(screen.getByText(/Tim Price/i)).toBeInTheDocument();
  });

  it('renders LinkedIn links for team members', () => {
    renderTeamPage();
    const linkedinLinks = screen.getAllByRole('link', { name: /LinkedIn/i });
    expect(linkedinLinks.length).toBeGreaterThan(0);
  });
});
