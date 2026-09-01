import ReactMarkdown from "react-markdown";
import { PortableText, type PortableTextProps } from "@portabletext/react";
import type { BlogPost } from "../../types";

interface BlogPostContentProps {
  post: BlogPost;
}

export function BlogPostContent({ post }: Readonly<BlogPostContentProps>) {
  return (
    <div className="prose prose-lg prose-rose max-w-none mb-16 blog-content bg-white p-8 sm:p-12 rounded-3xl border border-gray-200/80 shadow-xs">
      {post.body && Array.isArray(post.body) && post.body.length > 0 ? (
        <PortableText value={post.body as PortableTextProps["value"]} />
      ) : (
        <ReactMarkdown>{post.content || ""}</ReactMarkdown>
      )}
    </div>
  );
}
