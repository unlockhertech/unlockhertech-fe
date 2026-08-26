import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import { ResourcesPage } from '../app/pages/ResourcesPage';

describe('ResourcesPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderResourcesPage = () => {
    return render(
      <MemoryRouter>
        <ResourcesPage />
      </MemoryRouter>
    );
  };

  it('renders page header and hero text', () => {
    renderResourcesPage();
    expect(screen.getByRole('heading', { level: 1, name: /Career Transition Playbooks & Guides/i })).toBeInTheDocument();
    expect(screen.getByText(/Weekly uploads launch/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF 4\+ Community Access/i)).toBeInTheDocument();
  });

  it('renders weekly roadmap guides', async () => {
    renderResourcesPage();
    await waitFor(() => {
      expect(screen.getAllByText(/10 Things to Know When Transitioning into Tech/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/10 Myths About the Tech Industry/i).length).toBeGreaterThan(0);
    }, { timeout: 5000 });
  });

  it('renders the interactive curriculum roadmap and countdown clock', async () => {
    renderResourcesPage();
    await waitFor(() => {
      expect(screen.getByText(/Weekly Drop Roadmap/i)).toBeInTheDocument();
      expect(screen.getByTestId('playbook-countdown-grid')).toBeInTheDocument();
      expect(screen.getByText(/Upcoming Weekly Drop Schedule/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('opens download waitlist / community registration modal', async () => {
    renderResourcesPage();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Notify Me on September 7/i })).toBeInTheDocument();
    });

    const notifyBtn = screen.getByRole('button', { name: /Notify Me on September 7/i });
    fireEvent.click(notifyBtn);

    expect(screen.getByText(/Join the September 7 Launch Waitlist/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
  });
});
