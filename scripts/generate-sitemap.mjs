import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const BASE_URL = "https://unlockhertech.com";
const TODAY = new Date().toISOString().split("T")[0];

function getFeatureFlags() {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || "").trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }

  return {
    enableBlog: process.env.VITE_ENABLE_BLOG === "true",
    enableEvents: process.env.VITE_ENABLE_EVENTS === "true",
    enableResources: process.env.VITE_ENABLE_RESOURCES === "true",
    enableAssessment: process.env.VITE_ENABLE_ASSESSMENT === "true",
    enableGetInvolved: process.env.VITE_ENABLE_GET_INVOLVED === "true",
    enableJobs: process.env.VITE_ENABLE_JOBS !== "false",
  };
}

function getStaticRoutes(flags) {
  const routes = [
    { path: "/", priority: "1.0", changefreq: "weekly", lastmod: TODAY },
    { path: "/practices", priority: "0.95", changefreq: "weekly", lastmod: TODAY },
    { path: "/episodes", priority: "0.90", changefreq: "weekly", lastmod: TODAY },
    { path: "/about", priority: "0.75", changefreq: "monthly", lastmod: TODAY },
    { path: "/team", priority: "0.70", changefreq: "monthly", lastmod: TODAY },
    { path: "/links", priority: "0.70", changefreq: "monthly", lastmod: TODAY },
    { path: "/bio", priority: "0.70", changefreq: "monthly", lastmod: TODAY },
    { path: "/linktree", priority: "0.70", changefreq: "monthly", lastmod: TODAY },
    { path: "/privacy-policy", priority: "0.60", changefreq: "monthly", lastmod: TODAY },
    { path: "/community-guidelines", priority: "0.60", changefreq: "monthly", lastmod: TODAY },
    { path: "/code-of-conduct", priority: "0.60", changefreq: "monthly", lastmod: TODAY },
    { path: "/cookie-policy", priority: "0.30", changefreq: "yearly", lastmod: TODAY },
  ];

  if (flags.enableJobs) {
    routes.push(
      { path: "/jobs", priority: "0.95", changefreq: "daily", lastmod: TODAY },
      { path: "/careers", priority: "0.90", changefreq: "daily", lastmod: TODAY }
    );
  }

  if (flags.enableEvents) {
    routes.push({ path: "/events", priority: "0.85", changefreq: "weekly", lastmod: TODAY });
  }

  if (flags.enableBlog) {
    routes.push({ path: "/blog", priority: "0.85", changefreq: "weekly", lastmod: TODAY });
  }

  if (flags.enableResources) {
    routes.push({ path: "/resources", priority: "0.85", changefreq: "weekly", lastmod: TODAY });
  }

  if (flags.enableAssessment) {
    routes.push({ path: "/assessment", priority: "0.80", changefreq: "monthly", lastmod: TODAY });
  }

  if (flags.enableGetInvolved) {
    routes.push(
      { path: "/get-involved", priority: "0.80", changefreq: "monthly", lastmod: TODAY },
      { path: "/collaborate", priority: "0.75", changefreq: "monthly", lastmod: TODAY },
      { path: "/become-a-guest", priority: "0.75", changefreq: "monthly", lastmod: TODAY },
      { path: "/mentor", priority: "0.75", changefreq: "monthly", lastmod: TODAY }
    );
  }

  return routes;
}

async function fetchDynamicSanityRoutes(flags) {
  if (!flags.enableBlog) return [];

  const dynamicRoutes = [];
  const projectId = process.env.VITE_SANITY_PROJECT_ID || "pikesbla";
  const dataset = process.env.VITE_SANITY_DATASET || "production";

  if (projectId) {
    try {
      const client = createClient({
        projectId,
        dataset,
        apiVersion: "2024-03-01",
        useCdn: true,
      });

      const posts = await client.fetch(
        `*[_type == "post" && defined(slug.current)] { "slug": slug.current, date, _updatedAt }`
      );

      for (const post of posts) {
        const lastmod = post.date ? new Date(post.date).toISOString().split("T")[0] : TODAY;
        dynamicRoutes.push({
          path: `/blog/${post.slug}`,
          priority: "0.80",
          changefreq: "monthly",
          lastmod,
        });
      }

      console.log(`[Sitemap] Fetched ${posts.length} blog post slugs from Sanity.`);
    } catch (err) {
      console.warn("[Sitemap] Could not fetch remote Sanity routes, checking local fallbacks:", err.message);
    }
  }

  if (dynamicRoutes.length === 0) {
    const blogDir = path.join(process.cwd(), "src/content/blog");
    if (fs.existsSync(blogDir)) {
      const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md") && f !== "TEMPLATE.md");
      for (const file of files) {
        const slug = file.replace(".md", "");
        dynamicRoutes.push({
          path: `/blog/${slug}`,
          priority: "0.80",
          changefreq: "monthly",
          lastmod: TODAY,
        });
      }
      console.log(`[Sitemap] Added ${files.length} blog post slugs from local markdown files.`);
    }
  }

  return dynamicRoutes;
}

function generateXml(routes) {
  const urlsXml = routes
    .map((route) => {
      const fullUrl = `${BASE_URL}${route.path}`;
      return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;
}

function generateLlmsTxt(flags) {
  const offerings = [
    "- **Podcast Episodes**: Honest, insightful conversations with women engineers, leaders, and founders breaking barriers in tech. Available on Apple Podcasts, Spotify, YouTube, and Amazon Music.",
    "- **She Leads Tech Practices**: Fortnightly interactive live problem-solving and coding practice sessions covering LeetCode data structures, algorithmic patterns, and technical interview frameworks.",
  ];

  if (flags.enableJobs) {
    offerings.push("- **Inclusive Job Board**: Curated tech roles with mandatory salary transparency, remote flexibility signals, and inclusive team cultures.");
  }
  if (flags.enableResources) {
    offerings.push("- **Career Playbooks & PDF Guides**: Free downloadable career roadmap and technical interview playbooks.");
  }
  if (flags.enableAssessment) {
    offerings.push("- **Career Readiness Self-Assessment**: Interactive 16-question worksheet evaluating Mindset, Transferable Skills, Technical Literacy, and Networking Strategy with instant PDF export.");
  }
  if (flags.enableEvents) {
    offerings.push("- **Community Events & Coding Workshops**: Virtual coding workshops, panel discussions, and career Q&A sessions.");
  }
  if (flags.enableBlog) {
    offerings.push("- **Blog & Technical Articles**: Deep dives on engineering practices, career transitions, and industry insights.");
  }

  const urls = [
    "- [Home](https://unlockhertech.com/): Official platform overview, latest episode player, and mission pillars.",
    "- [Podcast Episodes](https://unlockhertech.com/episodes): Full archive of podcast episodes with show notes and transcripts.",
    "- [Live Coding Practices](https://unlockhertech.com/practices): Fortnightly She Leads Tech algorithmic workshop schedule, problem sets, and Google Calendar sync.",
  ];

  if (flags.enableEvents) {
    urls.push("- [Events Calendar](https://unlockhertech.com/events): Upcoming workshops, community meetups, and live Q&A sessions.");
  }
  if (flags.enableBlog) {
    urls.push("- [Blog & Articles](https://unlockhertech.com/blog): Stories, engineering tutorials, and career transition guides.");
  }
  if (flags.enableResources) {
    urls.push("- [Career Resources & Guides](https://unlockhertech.com/resources): Downloadable PDF career guides and interview playbooks.");
  }
  if (flags.enableAssessment) {
    urls.push("- [Career Fit Assessment](https://unlockhertech.com/assessment): 5-minute interactive readiness worksheet with personalized action plan.");
  }
  if (flags.enableJobs) {
    urls.push("- [Inclusive Jobs](https://unlockhertech.com/jobs): Curated engineering, product, and tech roles with transparent compensation.");
  }
  if (flags.enableGetInvolved) {
    urls.push("- [Get Involved](https://unlockhertech.com/get-involved): Volunteer as a mentor, apply as a podcast speaker, or partner with us.");
  }

  urls.push(
    "- [About Us & Mission](https://unlockhertech.com/about): Our founding story, mission, and community values.",
    "- [Meet the Team](https://unlockhertech.com/team): Leadership, hosts, and contributors behind Unlock Her Tech.",
    "- [Community Guidelines & Code of Conduct](https://unlockhertech.com/community-guidelines): Our safe, inclusive, and harassment-free community standards.",
    "- [Privacy Policy](https://unlockhertech.com/privacy-policy): Transparent data handling and user privacy commitments.",
    "- [Cookie Policy](https://unlockhertech.com/cookie-policy): Analytics and cookie preference management."
  );

  return `# Unlock Her Tech

> Unlock Her Tech is an inclusive tech community, storytelling podcast, and hands-on algorithmic workshop platform for women, non-binary people, and allies in technology.

## Core Platform Offerings

${offerings.join("\n")}

## Key Canonical URLs & Resources

${urls.join("\n")}

## Podcast Streaming Links

- Apple Podcasts: https://podcasts.apple.com/us/podcast/unlock-her-tech/id1800087284
- Spotify: https://open.spotify.com/show/5I2RiIZwjv8YbuwhlHTAPc
- YouTube: https://www.youtube.com/channel/UChhVCKvYVmZovXQmpxdafpg
- Amazon Music: https://music.amazon.com/podcasts/69812754-839d-4b8b-a878-058014c1946d/unlock-her-tech-podcast

## Contact & Socials

- Email: info@unlockhertech.com
- Social Links: https://unlockhertech.com/links
- Full LLM Knowledge Base: https://unlockhertech.com/llms-full.txt
`;
}

function generateLlmsFullTxt(flags) {
  let content = `# Unlock Her Tech — Full LLM Knowledge Base

## Organization & Mission

Unlock Her Tech is a digital community platform and podcast designed to empower women, non-binary people, and underrepresented talent in the technology industry. We provide a blend of honest storytelling, career frameworks, and live technical practice to bridge the gender gap and help technologists grow into leadership.

Website: https://unlockhertech.com
Contact: info@unlockhertech.com

---

## 1. Podcast Series: Unlock Her Tech

The podcast amplifies the authentic stories, career pivots, leadership triumphs, and technical expertise of women in software engineering, product design, engineering management, and startup founders.

- Primary Platforms:
  - Apple Podcasts: https://podcasts.apple.com/us/podcast/unlock-her-tech/id1800087284
  - Spotify: https://open.spotify.com/show/5I2RiIZwjv8YbuwhlHTAPc
  - YouTube: https://www.youtube.com/channel/UChhVCKvYVmZovXQmpxdafpg
  - Amazon Music: https://music.amazon.com/podcasts/69812754-839d-4b8b-a878-058014c1946d/unlock-her-tech-podcast
- Format: Deep-dive interviews, 30–60 minutes, covering both technical mastery and lived workplace experiences.
- All Episodes Archive: https://unlockhertech.com/episodes

---

## 2. She Leads Tech: Fortnightly Algorithmic Practices

A hands-on, live technical problem-solving series held every two weeks. The practice creates a high-trust, safe space where participants can practice coding, dissect data structures, and discuss interview strategies without judgment.

- Cadence: Fortnightly on Sundays at 18:30 BST (17:30 UTC).
- Next Anchor Session: Sunday, August 30, 2026.
- Three-Phase Learning Arc:
  - Phase 1: Foundational warmups and algorithmic intuition.
  - Phase 2: Medium-level core interview patterns (Two Pointers, Sliding Window, DFS/BFS, Dynamic Programming).
  - Phase 3: Advanced problem-solving, trade-off analysis, and mock interviews.
- Curriculum Topics:
  1. Two Pointers & In-Place Array Transformations
  2. Sliding Window & Substring Optimization
  3. Trees: DFS, BFS Level Order Traversal & Validation
  4. Hash Maps, Frequency Counters & Fast Lookups
  5. Graphs, Island Counts & Matrix Traversals
  6. Dynamic Programming, Memoization & Recurrence Relations
  7. Binary Search & Monotonic Condition Optimization
  8. Stacks, Queues & Monotonic Frameworks
- Practice Details & Google Calendar Sync: https://unlockhertech.com/practices
`;

  if (flags.enableAssessment) {
    content += `
---

## 3. Career Fit Self-Assessment

An interactive 16-question worksheet evaluating readiness across 4 core dimensions:
1. Mindset & Confidence (imposter syndrome, psychological readiness, self-advocacy).
2. Transferable & Leadership Skills (communication, stakeholder alignment, domain translation).
3. Technical Literacy & Depth (code fluency, system design fundamentals, problem decomposition).
4. Networking & Job Search Strategy (strategic visibility, outreach, interview preparation).

- Output: Real-time scoring, tailored recommendations, and an instant downloadable PDF Career Plan.
- URL: https://unlockhertech.com/assessment
`;
  }

  if (flags.enableJobs) {
    content += `
---

## 4. Curated Inclusive Job Board

A community job directory prioritizing roles with verified salary transparency, remote flexibility, equal parental leave, and supportive cultures.

- URL: https://unlockhertech.com/jobs
`;
  }

  if (flags.enableResources) {
    content += `
---

## 5. Free Career Playbooks & PDF Guides

Weekly downloadable guides covering tech career roadmaps, portfolio building, technical interview prep, and salary negotiation.

- URL: https://unlockhertech.com/resources
`;
  }

  if (flags.enableGetInvolved) {
    content += `
---

## 6. Community Involvement & Mentorship

- Mentor With Us: Guide breakout rooms in live algorithmic problem-solving practices.
- Request to be a Guest: Share your tech career journey and lessons learned on the podcast.
- Partner With Us: Collaborate with engineering teams and sponsors on inclusive hiring.
- URL: https://unlockhertech.com/get-involved
`;
  }

  content += `
---

## 7. Community Standards & Policies

- Community Guidelines & Code of Conduct: https://unlockhertech.com/community-guidelines
- Privacy Policy: https://unlockhertech.com/privacy-policy
- Cookie Policy: https://unlockhertech.com/cookie-policy
`;

  return content;
}

async function run() {
  const flags = getFeatureFlags();
  console.log("[Sitemap] Active Feature Flags:", flags);
  console.log("[Sitemap] Generating sitemap.xml, llms.txt, and llms-full.txt...");

  const staticRoutes = getStaticRoutes(flags);
  const dynamicRoutes = await fetchDynamicSanityRoutes(flags);
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  // Remove duplicates by path
  const uniqueRoutesMap = new Map();
  for (const r of allRoutes) {
    uniqueRoutesMap.set(r.path, r);
  }
  const uniqueRoutes = Array.from(uniqueRoutesMap.values());

  const xml = generateXml(uniqueRoutes);
  const llms = generateLlmsTxt(flags);
  const llmsFull = generateLlmsFullTxt(flags);

  // Write to public/
  const publicPath = path.join(process.cwd(), "public/sitemap.xml");
  fs.writeFileSync(publicPath, xml, "utf-8");
  fs.writeFileSync(path.join(process.cwd(), "public/llms.txt"), llms, "utf-8");
  fs.writeFileSync(path.join(process.cwd(), "public/llms-full.txt"), llmsFull, "utf-8");
  console.log(`[Sitemap] Successfully wrote ${uniqueRoutes.length} URLs to ${publicPath}`);
  console.log("[Sitemap] Successfully wrote public/llms.txt and public/llms-full.txt");

  // Write to dist/ if dist exists
  const distDir = path.join(process.cwd(), "dist");
  if (fs.existsSync(distDir)) {
    const distPath = path.join(distDir, "sitemap.xml");
    fs.writeFileSync(distPath, xml, "utf-8");
    fs.writeFileSync(path.join(distDir, "llms.txt"), llms, "utf-8");
    fs.writeFileSync(path.join(distDir, "llms-full.txt"), llmsFull, "utf-8");
    console.log(`[Sitemap] Successfully wrote ${uniqueRoutes.length} URLs to ${distPath}`);
    console.log("[Sitemap] Successfully wrote dist/llms.txt and dist/llms-full.txt");
  }
}

run().catch((err) => {
  console.error("[Sitemap] Failed to generate sitemap & LLM files:", err);
  process.exit(1);
});
