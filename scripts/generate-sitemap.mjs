import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const BASE_URL = "https://unlockhertech.com";
const TODAY = new Date().toISOString().split("T")[0];

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly", lastmod: TODAY },
  { path: "/practices", priority: "0.95", changefreq: "weekly", lastmod: TODAY },
  { path: "/jobs", priority: "0.95", changefreq: "daily", lastmod: TODAY },
  { path: "/careers", priority: "0.90", changefreq: "daily", lastmod: TODAY },
  { path: "/episodes", priority: "0.90", changefreq: "weekly", lastmod: TODAY },
  { path: "/events", priority: "0.85", changefreq: "weekly", lastmod: TODAY },
  { path: "/blog", priority: "0.85", changefreq: "weekly", lastmod: TODAY },
  { path: "/resources", priority: "0.85", changefreq: "weekly", lastmod: TODAY },
  { path: "/assessment", priority: "0.80", changefreq: "monthly", lastmod: TODAY },
  { path: "/get-involved", priority: "0.80", changefreq: "monthly", lastmod: TODAY },
  { path: "/collaborate", priority: "0.75", changefreq: "monthly", lastmod: TODAY },
  { path: "/become-a-guest", priority: "0.75", changefreq: "monthly", lastmod: TODAY },
  { path: "/mentor", priority: "0.75", changefreq: "monthly", lastmod: TODAY },
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

async function fetchDynamicSanityRoutes() {
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

      // 1. Fetch Blog Posts
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

  // Local fallback for blog posts if offline / during local builds
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

async function run() {
  console.log("[Sitemap] Generating sitemap.xml...");
  const dynamicRoutes = await fetchDynamicSanityRoutes();
  const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];

  // Remove duplicates by path
  const uniqueRoutesMap = new Map();
  for (const r of allRoutes) {
    uniqueRoutesMap.set(r.path, r);
  }
  const uniqueRoutes = Array.from(uniqueRoutesMap.values());

  const xml = generateXml(uniqueRoutes);

  // Write to public/sitemap.xml
  const publicPath = path.join(process.cwd(), "public/sitemap.xml");
  fs.writeFileSync(publicPath, xml, "utf-8");
  console.log(`[Sitemap] Successfully wrote ${uniqueRoutes.length} URLs to ${publicPath}`);

  // Write to dist/sitemap.xml if dist exists
  const distDir = path.join(process.cwd(), "dist");
  if (fs.existsSync(distDir)) {
    const distPath = path.join(distDir, "sitemap.xml");
    fs.writeFileSync(distPath, xml, "utf-8");
    console.log(`[Sitemap] Successfully wrote ${uniqueRoutes.length} URLs to ${distPath}`);
  }
}

run().catch((err) => {
  console.error("[Sitemap] Failed to generate sitemap:", err);
  process.exit(1);
});
