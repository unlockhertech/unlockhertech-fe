import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { createClient } from "@sanity/client";

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Error: Please set VITE_SANITY_PROJECT_ID and SANITY_WRITE_TOKEN environment variables before running the migration.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-03-01",
  useCdn: false,
});

async function migrateBlogPosts() {
  const dir = path.join(process.cwd(), "src/content/blog");
  if (!fs.existsSync(dir)) {
    console.log("No blog content directory found at", dir);
    return;
  }

  const files = fs.readdirSync(dir);
  console.log(`Found ${files.length} blog files to check.`);

  for (const file of files) {
    if (!file.endsWith(".md") || file === "TEMPLATE.md") continue;

    const filePath = path.join(dir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const slug = file.replaceAll(".md", "");

    const doc = {
      _type: "post",
      _id: `post-${slug.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      title: data.title || slug,
      slug: { _type: "slug", current: slug },
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      author: data.author || "Unlock Her Tech",
      tags: Array.isArray(data.tags) ? data.tags : [],
      canonicalUrl: data.canonicalUrl || undefined,
      content: content,
    };

    await client.createOrReplace(doc);
    console.log(`✓ Uploaded blog post: "${doc.title}" (slug: ${slug})`);
  }
}

async function migrateEvents() {
  const dir = path.join(process.cwd(), "src/content/events");
  if (!fs.existsSync(dir)) {
    console.log("No events content directory found at", dir);
    return;
  }

  const files = fs.readdirSync(dir);
  console.log(`Found ${files.length} event files to check.`);

  for (const file of files) {
    if (!file.endsWith(".md") || file === "TEMPLATE.md") continue;

    const filePath = path.join(dir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    const slug = file.replaceAll(".md", "");

    const doc = {
      _type: "event",
      _id: `event-${slug.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      title: data.title || slug,
      slug: { _type: "slug", current: slug },
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      platform: data.platform || "Luma",
      urlOrId: data.urlOrId || "",
      discountCode: data.discountCode || undefined,
      description: data.description || undefined,
      ctaLabel: data.ctaLabel || undefined,
      isPartner: Boolean(data.isPartner),
    };

    await client.createOrReplace(doc);
    console.log(`✓ Uploaded event: "${doc.title}" (slug: ${slug})`);
  }
}

async function run() {
  console.log("Starting Sanity Content Migration...");
  await migrateBlogPosts();
  await migrateEvents();
  console.log("Migration completed successfully!");
}

try {
  await run();
} catch (err) {
  console.error("Migration failed:", err);
  process.exit(1);
}
