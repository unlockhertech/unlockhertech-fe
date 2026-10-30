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

  const renderResourcesPage = (initialEntries: string[] = ['/resources']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <ResourcesPage />
      </MemoryRouter>
    );
  };

  it('renders page header, universal search bar, and hero text', async () => {
    renderResourcesPage();
    expect(screen.getByRole('heading', { level: 1, name: /Technical & Career/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by topic, keyword, or role/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF 4\+ Community Access/i)).toBeInTheDocument();
  });

  it('renders resources across the catalog in default state', async () => {
    renderResourcesPage();
    await waitFor(() => {
      expect(screen.getAllByText(/10 Things to Know When Transitioning into Tech/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/10 Myths About the Tech Industry/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/10 Non-Coding Roles in Tech to Explore/i).length).toBeGreaterThan(0);
    }, { timeout: 5000 });
  });

  it('renders the all-in-one bundle spotlight card', async () => {
    renderResourcesPage();
    await waitFor(() => {
      expect(screen.getByText(/Unlock the Complete 10-Guide Transition Suite/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Unlock 10-Pack \(PDF\)/i })).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('opens the bundle unlock modal when clicking the bundle CTA', async () => {
    renderResourcesPage();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Unlock 10-Pack \(PDF\)/i })).toBeInTheDocument();
    });

    const bundleBtn = screen.getByRole('button', { name: /Unlock 10-Pack \(PDF\)/i });
    fireEvent.click(bundleBtn);

    expect(screen.getByText(/Unlock: Complete 10-Guide Transition Suite/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
  });

  it('switches format using type tabs (Guides, Templates, Tools, Videos, Articles)', async () => {
    renderResourcesPage();
    await waitFor(() => {
      expect(screen.getAllByText(/10 Things to Know When Transitioning into Tech/i).length).toBeGreaterThan(0);
    });

    const templateTab = screen.getByRole('tab', { name: /Templates/i });
    fireEvent.click(templateTab);

    await waitFor(() => {
      expect(screen.getByText(/ATS-Optimized Tech Resume & Portfolio Markdown Template/i)).toBeInTheDocument();
      expect(screen.queryByText(/10 Things to Know When Transitioning into Tech/i)).not.toBeInTheDocument();
    });
  });

  it('filters resources by grouped topic dropdown', async () => {
    renderResourcesPage();
    await waitFor(() => {
      expect(screen.getAllByText(/10 Things to Know When Transitioning into Tech/i).length).toBeGreaterThan(0);
    });

    const topicSelect = screen.getByLabelText(/Filter resources by topic domain/i);
    fireEvent.change(topicSelect, { target: { value: 'Myth Busting' } });

    await waitFor(() => {
      expect(screen.getByText(/10 Myths About the Tech Industry \(Debunked\)/i)).toBeInTheDocument();
      expect(screen.queryByText(/10 Things to Know When Transitioning into Tech/i)).not.toBeInTheDocument();
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
      expect(screen.getByText(/10 Essential Tech Jargon Terms Decoded/i)).toBeInTheDocument();
      expect(screen.queryByText(/10 Myths About the Tech Industry/i)).not.toBeInTheDocument();
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
      expect(screen.getByText(/No resources match this filter/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset Filter/i })).toBeInTheDocument();
    });

    const resetBtn = screen.getByRole('button', { name: /Reset Filter/i });
    fireEvent.click(resetBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/10 Things to Know When Transitioning into Tech/i).length).toBeGreaterThan(0);
    });
  });

  it('navigates to curated collection sub-view with 4-stage roadmap', async () => {
    renderResourcesPage(['/resources?collection=career-toolkit']);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Career Transition Toolkit/i })).toBeInTheDocument();
      expect(screen.getByText(/4-Stage Transition Roadmap/i)).toBeInTheDocument();
    });

    // Test stage filter inside collection view
    const stage2Btn = screen.getByRole('tab', { name: /Stage 2/i });
    fireEvent.click(stage2Btn);

    await waitFor(() => {
      expect(screen.getByText(/10 Essential Tech Jargon Terms Decoded/i)).toBeInTheDocument();
      expect(screen.queryByText(/10 Things to Know When Transitioning into Tech/i)).not.toBeInTheDocument();
    });

    // Test back button
    const backBtn = screen.getByRole('button', { name: /Back to All Resources/i });
    fireEvent.click(backBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Technical & Career/i })).toBeInTheDocument();
    });
  });

  it('toggles bookmarking on a resource card', async () => {
    renderResourcesPage();
    await waitFor(() => {
      expect(screen.getAllByText(/10 Things to Know When Transitioning into Tech/i).length).toBeGreaterThan(0);
    });

    const bookmarkBtn = screen.getByLabelText(/Save 10 Things to Know When Transitioning into Tech to bookmarks/i);
    fireEvent.click(bookmarkBtn);

    expect(screen.getByLabelText(/Remove 10 Things to Know When Transitioning into Tech from bookmarks/i)).toBeInTheDocument();
  });

  it('updates aria-live announcement region on search', async () => {
    renderResourcesPage();
    const liveRegions = screen.getAllByRole('status');
    const srLiveRegion = liveRegions.find((r) => r.classList.contains('sr-only'));
    expect(srLiveRegion).toBeDefined();
    expect(srLiveRegion).toHaveAttribute('aria-live', 'polite');

    const searchInput = screen.getByPlaceholderText(/Search by topic, keyword, or role/i);
    fireEvent.change(searchInput, { target: { value: 'Jargon' } });

    await waitFor(() => {
      expect(srLiveRegion).toHaveTextContent(/matching "Jargon"/i);
    });
  });
});
