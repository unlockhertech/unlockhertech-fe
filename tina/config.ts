import { defineConfig } from "tinacms";

// 2. Identify the branch
const branch =
    process.env.HEAD ||
    process.env.VITE_TINA_BRANCH ||
    process.env.TINA_BRANCH ||
    process.env.BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.GITHUB_REF_NAME ||
    "main";

if (!/^[A-Za-z0-9._/-]+$/.test(branch)) {
  throw new Error(`Invalid branch name: ${branch}`);
}

// 3. Extract the final values (Prioritising the global constants injected by Vite)
const clientId = process.env.VITE_TINA_CLIENT_ID || "";
const tinaToken = process.env.VITE_TINA_TOKEN || "";

// 4. Determine if we are running locally
const isLocal =
    process.env.TINA_PUBLIC_IS_LOCAL === 'true' ||
    process.env.NODE_ENV === 'development' ||
    !clientId;

export default defineConfig({
  branch,
  clientId: isLocal ? null : clientId,
  token: isLocal ? null : tinaToken,
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "assets",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "src/content/blog",
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "datetime", name: "date", label: "Date", required: true },
          { type: "string", name: "author", label: "Author", required: true },
          { type: "string", name: "tags", label: "Tags", list: true },
          { type: "string", name: "canonicalUrl", label: "Canonical URL" },
          { type: "image", name: "imageUrl", label: "Hero Image" },
          { type: "rich-text", name: "body", label: "Body", isBody: true, required: true },
        ],
      },
      {
        name: "event",
        label: "External Events",
        path: "src/content/events",
        fields: [
          { type: "string", name: "title", label: "Event Title", isTitle: true, required: true },
          { type: "datetime", name: "date", label: "Event Date", required: true },
          {
            type: "string",
            name: "platform",
            label: "Platform",
            options: ["Luma", "Eventbrite"],
            required: true,
          },
          { type: "string", name: "urlOrId", label: "Event ID or Full URL", required: true },
          { type: "image", name: "image", label: "Event Banner" },
        ],
      },
    ],
  },
});