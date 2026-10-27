import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { ResourcesPage } from '../app/pages/ResourcesPage';
import { DEFAULT_RESOURCES } from '../app/pages/resources/resourceData';
import * as sanityUtils from '../app/utils/sanity';

describe('ResourcesPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(sanityUtils, 'getAllResources').mockResolvedValue(DEFAULT_RESOURCES);
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
    expect(screen.getByRole('heading', { level: 1, name: /Technical & Career Resources Hub/i })).toBeInTheDocument();
    expect(screen.getByText(/Free Community Library • Playbooks & Cheatsheets/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF 4\+ Community Access/i)).toBeInTheDocument();
  });

  it('renders all 10 guides across the 4-stage roadmap', async () => {
    renderResourcesPage();
    await waitFor(() => {
      expect(screen.getAllByText(/10 Things to Know When Transitioning into Tech/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/10 Myths About the Tech Industry/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/10 Pet Peeves & Unspoken Realities of Tech/i).length).toBeGreaterThan(0);
    }, { timeout: 5000 });
  });

  it('renders the all-in-one bundle banner without a countdown', async () => {
    renderResourcesPage();
    await waitFor(() => {
      expect(screen.getByText(/Unlock the Complete 10-Guide Suite/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Unlock 10-Pack \(PDF\)/i })).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('opens the bundle unlock modal', async () => {
    renderResourcesPage();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Unlock 10-Pack \(PDF\)/i })).toBeInTheDocument();
    });

    const bundleBtn = screen.getByRole('button', { name: /Unlock 10-Pack \(PDF\)/i });
    fireEvent.click(bundleBtn);

    expect(screen.getByText(/Unlock: Complete 10-Guide Transition Suite/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
  });

  it('renders track switcher pills and allows switching to another track', async () => {
    renderResourcesPage();
    await waitFor(() => {
      expect(screen.getAllByText(/10 Things to Know When Transitioning into Tech/i).length).toBeGreaterThan(0);
    });

    const techTrackBtn = screen.getByRole('button', { name: /Technical & Engineering/i });
    fireEvent.click(techTrackBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/Modern Frontend Architecture & System Design Primer/i).length).toBeGreaterThan(0);
    });
  });

  it('filters resources based on keyword search query', async () => {
    renderResourcesPage();
    await waitFor(() => {
      expect(screen.getAllByText(/10 Things to Know When Transitioning into Tech/i).length).toBeGreaterThan(0);
    });

    const searchInput = screen.getByPlaceholderText(/Search by topic, keyword, or role/i);
    fireEvent.change(searchInput, { target: { value: 'Jargon' } });

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 3, name: /10 Essential Tech Jargon Terms Decoded/i })).toBeInTheDocument();
      expect(screen.queryByRole('heading', { level: 3, name: /10 Myths About the Tech Industry/i })).not.toBeInTheDocument();
    });
  });

  it('handles empty results and allows resetting filter', async () => {
    renderResourcesPage();
    await waitFor(() => {
      expect(screen.getAllByText(/10 Things to Know When Transitioning into Tech/i).length).toBeGreaterThan(0);
    });

    const searchInput = screen.getByPlaceholderText(/Search by topic, keyword, or role/i);
    fireEvent.change(searchInput, { target: { value: 'nonexistentquery123xyz' } });

    await waitFor(() => {
      expect(screen.getByText(/No guides match this filter/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset Filter/i })).toBeInTheDocument();
    });

    const resetBtn = screen.getByRole('button', { name: /Reset Filter/i });
    fireEvent.click(resetBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/10 Things to Know When Transitioning into Tech/i).length).toBeGreaterThan(0);
    });
  });

  it('filters resources by category pill', async () => {
    renderResourcesPage();
    await waitFor(() => {
      expect(screen.getAllByText(/10 Things to Know When Transitioning into Tech/i).length).toBeGreaterThan(0);
    });

    const categoryBtn = screen.getByRole('button', { name: /Myth Busting/i });
    fireEvent.click(categoryBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 3, name: /10 Myths About the Tech Industry/i })).toBeInTheDocument();
      expect(screen.queryByRole('heading', { level: 3, name: /10 Things to Know When Transitioning into Tech/i })).not.toBeInTheDocument();
    });
  });

  it('filters resources by format pill', async () => {
    renderResourcesPage();
    await waitFor(() => {
      expect(screen.getAllByText(/10 Things to Know When Transitioning into Tech/i).length).toBeGreaterThan(0);
    });

    const formatBtn = screen.getByRole('button', { name: /Playbooks/i });
    fireEvent.click(formatBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/10 Things to Know When Transitioning into Tech/i).length).toBeGreaterThan(0);
    });
  });
});
