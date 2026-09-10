import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { Layout } from '../app/components/Layout';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Layout Navbar Scroll-to-Top Behavior', () => {
  const scrollToMock = vi.fn();

  beforeEach(() => {
    scrollToMock.mockClear();
    window.scrollTo = scrollToMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderLayoutWithRoutes = (initialEntry = '/practices') => {
    const router = createMemoryRouter(
      [
        {
          element: <Layout />,
          children: [
            { path: '/', element: <div>Home Page Content</div> },
            { path: '/practices', element: <div>Practices Page Content</div> },
            { path: '/episodes', element: <div>Episodes Page Content</div> },
            { path: '/about', element: <div>About Page Content</div> },
            { path: '/team', element: <div>Team Page Content</div> },
            { path: '/resources', element: <div>Resources Page Content</div> },
            { path: '/assessment', element: <div>Assessment Page Content</div> },
          ],
        },
      ],
      {
        initialEntries: [initialEntry],
      }
    );

    return render(<RouterProvider router={router} />);
  };

  it('scrolls to top when clicking a desktop nav link', () => {
    renderLayoutWithRoutes();

    scrollToMock.mockClear();

    const episodesLink = screen.getAllByRole('link', { name: /episodes/i })[0];
    fireEvent.click(episodesLink);

    expect(scrollToMock).toHaveBeenCalledWith(
      expect.objectContaining({
        top: 0,
      })
    );
  });

  it('scrolls to top when clicking the brand logo link in navbar', () => {
    renderLayoutWithRoutes();

    scrollToMock.mockClear();

    const logoLinks = screen.getAllByRole('link', { name: /unlock her tech/i });
    const headerLogoLink = logoLinks[0];
    fireEvent.click(headerLogoLink);

    expect(scrollToMock).toHaveBeenCalledWith(
      expect.objectContaining({
        top: 0,
      })
    );
  });

  it('scrolls to top when clicking a link inside the resources dropdown', () => {
    renderLayoutWithRoutes();

    const resourcesButton = screen.queryByRole('button', { name: /resources menu/i });
    if (resourcesButton) {
      fireEvent.click(resourcesButton);
      const playbooksLink = screen.getByRole('link', { name: /career playbooks/i });

      scrollToMock.mockClear();
      fireEvent.click(playbooksLink);

      expect(scrollToMock).toHaveBeenCalledWith(
        expect.objectContaining({
          top: 0,
        })
      );
    }
  });

  it('scrolls to top when clicking a link inside the about dropdown', () => {
    renderLayoutWithRoutes();

    const aboutButton = screen.getByRole('button', { name: /about menu/i });
    fireEvent.click(aboutButton);

    const storyLinks = screen.getAllByRole('link', { name: /our mission & story/i });
    const dropdownStoryLink = storyLinks[0];
    scrollToMock.mockClear();
    fireEvent.click(dropdownStoryLink);

    expect(scrollToMock).toHaveBeenCalledWith(
      expect.objectContaining({
        top: 0,
      })
    );
  });

  it('scrolls to top when clicking a link in the mobile navigation menu', () => {
    renderLayoutWithRoutes();

    const mobileMenuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(mobileMenuButton);

    const episodesLinks = screen.getAllByRole('link', { name: /^episodes$/i });
    const mobileEpisodesLink = episodesLinks[episodesLinks.length - 1];

    scrollToMock.mockClear();
    fireEvent.click(mobileEpisodesLink);

    expect(scrollToMock).toHaveBeenCalledWith(
      expect.objectContaining({
        top: 0,
      })
    );
  });
});
