import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { CommunityGuidelinesPage } from '../app/pages/CommunityGuidelinesPage';

describe('CommunityGuidelinesPage', () => {
  const renderGuidelinesPage = () => {
    return render(
      <MemoryRouter>
        <CommunityGuidelinesPage />
      </MemoryRouter>
    );
  };

  it('renders page header and hero text', () => {
    renderGuidelinesPage();
    expect(screen.getByRole('heading', { level: 1, name: /Community Guidelines/i })).toBeInTheDocument();
    expect(screen.getByText(/Unlock Her Tech is dedicated to providing a safe, welcoming, and empowering environment/i)).toBeInTheDocument();
  });

  it('renders core inclusion pillars', () => {
    renderGuidelinesPage();
    expect(screen.getByText(/Radical Inclusion & Empathy/i)).toBeInTheDocument();
    expect(screen.getByText(/Active & Humble Allyship/i)).toBeInTheDocument();
    expect(screen.getByText(/Psychological Safety/i)).toBeInTheDocument();
  });

  it('renders reporting and enforcement guidelines', () => {
    renderGuidelinesPage();
    expect(screen.getByText(/Reporting & Enforcement/i)).toBeInTheDocument();
    expect(screen.getByText(/Unacceptable Behavior/i)).toBeInTheDocument();
  });
});
