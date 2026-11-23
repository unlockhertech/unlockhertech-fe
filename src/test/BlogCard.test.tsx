import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router";
import { BlogCard } from "../app/components/BlogCard";
import type { BlogPost } from "../app/types";

describe("BlogCard", () => {
  const renderCard = (post: BlogPost) => {
    return render(
      <MemoryRouter>
        <BlogCard post={post} />
      </MemoryRouter>
    );
  };

  it("renders preview snippet for post with markdown content", () => {
    const post: BlogPost = {
      title: "How Male Allies Drive Real Culture and Diversity in Tech",
      slug: "how-male-allies-drive-real-culture",
      canonicalUrl: "https://unlockhertech.com/blog/how-male-allies",
      date: "2026-04-01",
      author: "Pritanya Fritz",
      tags: ["Diversity", "Leadership"],
      content: "Let's start with a simple exercise. Try naming 10 women currently in prominent leadership roles in the tech industry.",
    };

    renderCard(post);
    expect(screen.getByText(/How Male Allies Drive Real Culture/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Let's start with a simple exercise/i)
    ).toBeInTheDocument();
  });

  it("renders preview snippet from body when content is undefined (fixes Sanity Studio posts)", () => {
    const post: BlogPost = {
      title: "The Importance of Role Models for Women in Tech",
      slug: "the-importance-of-role-models-for-women-in-tech",
      canonicalUrl: "https://unlockhertech.com/blog/the-importance-of-role-models",
      date: "2026-04-10",
      author: "Sarah Connor",
      tags: ["Mentorship", "Representation"],
      content: undefined, // No raw markdown content
      body: [
        {
          _type: "block",
          children: [
            { text: "Role models are not just a 'nice to have' for women in the workforce. " },
            { text: "Let that sink in for a moment." },
          ],
        },
      ],
    };

    renderCard(post);
    expect(screen.getByText(/The Importance of Role Models for Women in Tech/i)).toBeInTheDocument();
    
    // Crucial check: It must NOT display just "..."
    expect(screen.queryByText(/^\.\.\.$/)).not.toBeInTheDocument();
    
    // It must display the preview text extracted from body
    expect(
      screen.getByText(/Role models are not just a 'nice to have' for women in the workforce/i)
    ).toBeInTheDocument();
  });

  it("renders custom excerpt when excerpt field is explicitly provided", () => {
    const post: BlogPost = {
      title: "Navigating Career Pivots",
      slug: "navigating-career-pivots",
      canonicalUrl: "https://unlockhertech.com/blog/navigating-career-pivots",
      date: "2026-05-01",
      author: "Jane Doe",
      tags: ["Career"],
      excerpt: "A concise executive summary of strategic career pivoting for women.",
      content: "Full lengthy article content here...",
    };

    renderCard(post);
    expect(
      screen.getByText("A concise executive summary of strategic career pivoting for women.")
    ).toBeInTheDocument();
  });

  it("does not render an orphan '...' paragraph when post has no preview text", () => {
    const post: BlogPost = {
      title: "Draft Post",
      slug: "draft-post",
      canonicalUrl: "https://unlockhertech.com/blog/draft-post",
      date: "2026-05-01",
      author: "Editor",
      tags: ["Draft"],
      content: "",
      body: [],
    };

    renderCard(post);
    expect(screen.getByText("Draft Post")).toBeInTheDocument();
    expect(screen.queryByText(/^\.\.\.$/)).not.toBeInTheDocument();
  });
});
