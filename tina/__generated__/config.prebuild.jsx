// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.TINA_BRANCH?.trim() || process.env.VERCEL_GIT_COMMIT_REF?.trim() || process.env.GITHUB_REF_NAME?.trim() || process.env.HEAD?.trim() || "main";
if (!/^[A-Za-z0-9._/-]+$/.test(branch)) {
  throw new Error(`Invalid branch name: ${branch}`);
}
var isLocal = true;
var config_default = defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID || process.env.VITE_TINA_CLIENT_ID || null,
  // Get this from tina.io
  token: process.env.TINA_TOKEN || process.env.VITE_TINA_TOKEN || null,
  // Get this from tina.io
  local: isLocal,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "assets",
      publicFolder: "public"
    }
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
            required: true
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true
          },
          {
            type: "string",
            name: "author",
            label: "Author",
            required: true
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true
          },
          {
            type: "string",
            name: "canonicalUrl",
            label: "Canonical URL"
          },
          {
            type: "image",
            name: "imageUrl",
            label: "Hero Image"
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
            required: true
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
