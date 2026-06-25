import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
    process.env.VITE_TINA_BRANCH ||
    process.env.TINA_BRANCH ||
    process.env.BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.GITHUB_REF_NAME ||
    "main";

if (!/^[A-Za-z0-9._/-]+$/.test(branch)) {
  throw new Error(`Invalid branch name: ${branch}`);
}

// Safely evaluate environment variables for both Vite (browser) and Node (build server)
const tinaClientId = import.meta.env?.VITE_TINA_CLIENT_ID || process.env.VITE_TINA_CLIENT_ID;
const tinaToken = import.meta.env?.VITE_TINA_TOKEN || process.env.VITE_TINA_TOKEN;

// Determine if we are running locally based on the presence of the Client ID
const isLocal =
    process.env.TINA_PUBLIC_IS_LOCAL === 'true' ||
    process.env.NODE_ENV === 'development' ||
    !tinaClientId;

export default defineConfig({
  branch,
  clientId: tinaClientId || null, // Pulled from the safe variables above
  token: tinaToken || null,       // Pulled from the safe variables above
  local: isLocal,
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
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "string",
            name: "author",
            label: "Author",
            required: true,
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
          },
          {
            type: "string",
            name: "canonicalUrl",
            label: "Canonical URL",
          },
          {
            type: "image",
            name: "imageUrl",
            label: "Hero Image",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
            required: true,
          },
        ],
      },
    ],
  },
});