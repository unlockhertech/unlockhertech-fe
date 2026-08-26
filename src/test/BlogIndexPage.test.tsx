import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';
import { BlogIndexPage } from '../app/pages/BlogIndexPage';
import * as sanityUtils from '../app/utils/sanity';
import type { BlogPost } from '../app/types';

const MOCK_POSTS: BlogPost[] = [
  {
    title: "Overcoming Imposter Syndrome in Tech",
    slug: "overcoming-imposter-syndrome",
    canonicalUrl: "https://unlockhertech.com/blog/overcoming-imposter-syndrome",
    content: "Full content of the article...",
    date: "2026-03-01",
    readingTime: "5 min read",
    author: "Pritanya Fritz",
    tags: ["Career", "Mindset"],
    imageUrl: "https://example.com/image.jpg",
  },
];

describe('BlogIndexPage', () => {
  beforeEach(() => {
    vi.spyOn(sanityUtils, 'getAllBlogPosts').mockResolvedValue(MOCK_POSTS);
  });

  const renderBlogIndexPage = () => {
    return render(
      <MemoryRouter>
        <BlogIndexPage />
      </MemoryRouter>
    );
  };

  it('renders page header and search input', async () => {
    renderBlogIndexPage();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Insights & Articles/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Search articles by title/i)).toBeInTheDocument();
      expect(screen.getByText(/Overcoming Imposter Syndrome in Tech/i)).toBeInTheDocument();
    }, { timeout: 4000 });
  });

  it('renders tag filter buttons', async () => {
    renderBlogIndexPage();
    await waitFor(() => {
      expect(screen.getAllByText(/Career/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Mindset/i).length).toBeGreaterThan(0);
    }, { timeout: 4000 });
  });
});
