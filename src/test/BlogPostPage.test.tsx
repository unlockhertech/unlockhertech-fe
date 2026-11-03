import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import { BlogPostPage } from "../app/pages/BlogPostPage";
import { BlogCallout } from "../app/components/blog/BlogCallout";
import { BlogPullQuote } from "../app/components/blog/BlogPullQuote";
import { BlogAuthorBio } from "../app/components/blog/BlogAuthorBio";
import { BlogShareBar } from "../app/components/blog/BlogShareBar";
import { BlogRelatedPosts } from "../app/components/blog/BlogRelatedPosts";
import * as sanityUtils from "../app/utils/sanity";
import type { BlogPost } from "../app/types";

const MOCK_POST_RICH: BlogPost = {
  title: "From Mentorship to Sponsorship: Supporting Women into Leadership",
  slug: "mentorship-to-sponsorship",
  canonicalUrl: "https://unlockhertech.com/blog/mentorship-to-sponsorship",
  date: "2026-04-15",
  readingTime: "6 min read",
  author: "Pritanya Fritz",
  authorRole: "Founder & Community Lead",
  authorAvatar: "https://example.com/avatar.jpg",
  authorBio: "Pritanya is building inclusive pathways for women and underrepresented technologists.",
  authorLinkedin: "https://linkedin.com/in/pritanyafritz",
  tags: ["Leadership", "Mentorship", "Career"],
  imageUrl: "https://example.com/hero.jpg",
  body: [
    {
      _key: "block1",
      _type: "block",
      children: [
        {
          _key: "span1",
          _type: "span",
          text: "Mentorship provides advice, but sponsorship opens doors to executive boardrooms.",
        },
      ],
    },
    {
      _key: "callout1",
      _type: "callout",
      variant: "didYouKnow",
      title: "Did You Know?",
      content: "Women with active sponsors are 22% more likely to ask for stretch assignments.",
    },
    {
      _key: "pullquote1",
      _type: "pullQuote",
      quote: "A mentor speaks with you; a sponsor speaks about you in rooms you have not yet entered.",
      attribution: "Carla Harris",
      role: "Vice Chairman, Morgan Stanley",
    },
    {
      _key: "callout2",
      _type: "callout",
      variant: "keyTakeaway",
      title: "Key Takeaway",
      content: "Identify 3 key sponsors who have direct influence over talent calibration tables.",
      points: [
        "Executive sponsors advocate during closed-door promotion cycles.",
        "Cross-functional sponsorship increases leadership visibility.",
      ],
      referenceText: "SheCanCode Leadership Study 2026",
      referenceUrl: "https://shecancode.io/mentorship-study",
    },
  ],
};

const MOCK_POST_MARKDOWN: BlogPost = {
  title: "Engineering Management 101",
  slug: "engineering-management-101",
  canonicalUrl: "https://unlockhertech.com/blog/engineering-management-101",
  date: "2026-03-20",
  readingTime: "4 min read",
  author: "Elena Rostova",
  authorRole: "Principal Systems Architect",
  tags: ["Engineering", "Leadership"],
  content: `
# Transitioning to Engineering Management

Leading teams requires emotional intelligence and strong communication skills.

> **Did You Know?**
> - Over 60% of new engineering managers receive no formal transition training.
> - Peer mentorship boosts retention by 40% according to [TechLeaders](https://techleaders.io).
> Reference: [Global Tech Report 2026](https://globaltechreport.org)

> [!TIP]
> Schedule weekly 1:1 meetings focused purely on personal growth and career alignment.

> "True leadership is about making others better as a result of your presence." — Sheryl Sandberg
  `,
};

const ALL_MOCK_POSTS: BlogPost[] = [
  MOCK_POST_RICH,
  MOCK_POST_MARKDOWN,
  {
    title: "System Design for Inclusive Scale",
    slug: "system-design-scale",
    canonicalUrl: "https://unlockhertech.com/blog/system-design-scale",
    date: "2026-02-10",
    readingTime: "7 min read",
    author: "Amara Chen",
    tags: ["Engineering", "System Design"],
    imageUrl: "https://example.com/sys.jpg",
  },
];

describe("BlogPostPage Integration", () => {
  beforeEach(() => {
    vi.spyOn(sanityUtils, "getAllBlogPosts").mockResolvedValue(ALL_MOCK_POSTS);
  });

  const renderBlogPostPage = (slug: string) => {
    return render(
      <MemoryRouter initialEntries={[`/blog/${slug}`]}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it("renders rich PortableText article with 'Did You Know?', Pull Quotes, and Author Bio", async () => {
    vi.spyOn(sanityUtils, "getBlogPostBySlug").mockResolvedValue(MOCK_POST_RICH);

    renderBlogPostPage("mentorship-to-sponsorship");

    await waitFor(() => {
      // Headline & category badge
      expect(
        screen.getByRole("heading", {
          level: 1,
          name: /From Mentorship to Sponsorship/i,
        })
      ).toBeInTheDocument();
      expect(screen.getAllByText(/Leadership/i).length).toBeGreaterThan(0);

      // Body text & callouts
      expect(
        screen.getByText(/Mentorship provides advice, but sponsorship opens doors/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Did You Know\?/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Women with active sponsors are 22% more likely/i)
      ).toBeInTheDocument();

      // Pull quote & attribution
      expect(
        screen.getByText(/A mentor speaks with you; a sponsor speaks about you/i)
      ).toBeInTheDocument();
      expect(screen.getByText("Carla Harris")).toBeInTheDocument();
      expect(screen.getByText("Vice Chairman, Morgan Stanley")).toBeInTheDocument();

      // Callout with bullet points and source reference
      expect(
        screen.getByText(/Executive sponsors advocate during closed-door promotion cycles/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Cross-functional sponsorship increases leadership visibility/i)
      ).toBeInTheDocument();
      const refLink = screen.getByRole("link", { name: /SheCanCode Leadership Study 2026/i });
      expect(refLink).toBeInTheDocument();
      expect(refLink).toHaveAttribute("href", "https://shecancode.io/mentorship-study");

      // Author Bio Spotlight
      expect(screen.getByText(/Author Spotlight/i)).toBeInTheDocument();
      expect(screen.getAllByText("Founder & Community Lead").length).toBeGreaterThan(0);
      expect(screen.getByText(/Pritanya is building inclusive pathways/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /LinkedIn Profile/i })).toBeInTheDocument();

      // Recommended Reading
      expect(screen.getByText(/Recommended Reading/i)).toBeInTheDocument();
    });
  });

  it("renders Markdown article with parsed callouts and pull quotes", async () => {
    vi.spyOn(sanityUtils, "getBlogPostBySlug").mockResolvedValue(MOCK_POST_MARKDOWN);

    renderBlogPostPage("engineering-management-101");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          level: 1,
          name: /Engineering Management 101/i,
        })
      ).toBeInTheDocument();

      // "Did You Know?" callout rendered from markdown with bullet points, inline link, and reference
      expect(
        screen.getByText(/Over 60% of new engineering managers receive no formal transition training/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Peer mentorship boosts retention by 40%/i)
      ).toBeInTheDocument();
      const inlineLink = screen.getByRole("link", { name: /TechLeaders/i });
      expect(inlineLink).toBeInTheDocument();
      expect(inlineLink).toHaveAttribute("href", "https://techleaders.io");
      const mdRefLink = screen.getByRole("link", { name: /Global Tech Report 2026/i });
      expect(mdRefLink).toBeInTheDocument();
      expect(mdRefLink).toHaveAttribute("href", "https://globaltechreport.org");

      // Tip callout from markdown alert
      expect(
        screen.getByText(/Schedule weekly 1:1 meetings focused purely on personal growth/i)
      ).toBeInTheDocument();

      // Pull quote attribution from markdown
      expect(
        screen.getByText(/True leadership is about making others better/i)
      ).toBeInTheDocument();
      expect(screen.getByText("Sheryl Sandberg")).toBeInTheDocument();
    });
  });

  it("shows 'Post not found' when slug does not exist", async () => {
    vi.spyOn(sanityUtils, "getBlogPostBySlug").mockResolvedValue(null);

    renderBlogPostPage("non-existent-slug");

    await waitFor(() => {
      expect(screen.getByText(/Post not found/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Return Home/i })).toBeInTheDocument();
    });
  });
});

describe("Editorial Callout & Discovery Component Unit Tests", () => {
  it("renders BlogCallout with all theme variants, bullet points, and references", () => {
    const { rerender } = render(
      <BlogCallout
        variant="didYouKnow"
        title="Custom Fact"
        content="Women account for 28% of STEM workforce."
        points={[
          "Mentorship increases promotions by 25%.",
          "Check out the [Full Study](https://study.org) for details.",
        ]}
        referenceText="World Economic Forum 2026"
        referenceUrl="https://weforum.org/gender-gap"
      />
    );
    expect(screen.getByText("Custom Fact")).toBeInTheDocument();
    expect(screen.getByText(/28% of STEM workforce/i)).toBeInTheDocument();
    expect(screen.getByText(/Mentorship increases promotions by 25%/i)).toBeInTheDocument();
    const studyLink = screen.getByRole("link", { name: /Full Study/i });
    expect(studyLink).toBeInTheDocument();
    expect(studyLink).toHaveAttribute("href", "https://study.org");
    const wefLink = screen.getByRole("link", { name: /World Economic Forum 2026/i });
    expect(wefLink).toBeInTheDocument();
    expect(wefLink).toHaveAttribute("href", "https://weforum.org/gender-gap");

    rerender(
      <BlogCallout
        variant="keyTakeaway"
        content="Focus on high-impact projects."
      />
    );
    expect(screen.getByText("Key Takeaway")).toBeInTheDocument();
    expect(screen.getByText(/Focus on high-impact projects/i)).toBeInTheDocument();

    rerender(
      <BlogCallout
        variant="tip"
        content="Always write clean commit messages."
      />
    );
    expect(screen.getByText("Pro Tip")).toBeInTheDocument();

    rerender(
      <BlogCallout
        variant="highlight"
        content="Unlock Her Tech is expanding."
      />
    );
    expect(screen.getByText("Key Highlight")).toBeInTheDocument();
  });

  it("renders BlogPullQuote with decorative quote and attribution", () => {
    render(
      <BlogPullQuote
        quote="Never underestimate the power of community mentorship."
        attribution="Grace Hopper"
        role="Pioneer Computer Scientist"
      />
    );

    expect(
      screen.getByText(/Never underestimate the power of community mentorship/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Grace Hopper")).toBeInTheDocument();
    expect(screen.getByText("Pioneer Computer Scientist")).toBeInTheDocument();
  });

  it("renders BlogShareBar with social links and interactive copy button", async () => {
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    render(
      <BlogShareBar
        url="https://unlockhertech.com/blog/test"
        title="Test Article"
      />
    );

    expect(screen.getByRole("link", { name: /Share this post on LinkedIn/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Share this post on X/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Share this post on WhatsApp/i })).toBeInTheDocument();

    const copyBtn = screen.getByRole("button", { name: /Copy link to clipboard/i });
    expect(copyBtn).toBeInTheDocument();

    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("https://unlockhertech.com/blog/test");
  });

  it("renders BlogAuthorBio with fallback and provided bio", () => {
    render(
      <BlogAuthorBio
        author="Maya Lin"
        authorRole="Senior DevRel Engineer"
        authorBio="Maya is an advocate for developer education and open source."
      />
    );

    expect(screen.getByText("Maya Lin")).toBeInTheDocument();
    expect(screen.getByText("Senior DevRel Engineer")).toBeInTheDocument();
    expect(screen.getByText(/advocate for developer education/i)).toBeInTheDocument();
  });

  it("renders BlogRelatedPosts matching tags correctly", () => {
    render(
      <MemoryRouter>
        <BlogRelatedPosts
          currentSlug="mentorship-to-sponsorship"
          currentTags={["Leadership", "Career"]}
          posts={ALL_MOCK_POSTS}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Recommended Reading")).toBeInTheDocument();
    // Should show Engineering Management 101 because it shares Leadership tag
    expect(screen.getByText("Engineering Management 101")).toBeInTheDocument();
  });
});
