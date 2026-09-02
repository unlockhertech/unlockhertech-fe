import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { highlightCodeUnder } from "../../utils/prism";
import type { BlogPost } from "../../types";
import { getAllBlogPosts, getBlogPostBySlug } from "../../utils/sanity";

export interface AdjacentPost {
  slug: string;
  title: string;
}

export function useBlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [prevPost, setPrevPost] = useState<AdjacentPost | null>(null);
  const [nextPost, setNextPost] = useState<AdjacentPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      if (!slug) return;

      try {
        const postData = await getBlogPostBySlug(slug);
        if (!postData) {
          setPost(null);
          return;
        }

        const postList = await getAllBlogPosts();
        const currentIndex = postList.findIndex((p) => p.slug === slug);

        setPost(postData);
        if (currentIndex !== -1) {
          const prevItem = currentIndex > 0 ? postList[currentIndex - 1] : undefined;
          const nextItem = currentIndex >= 0 && currentIndex < postList.length - 1 ? postList[currentIndex + 1] : undefined;

          setNextPost(prevItem ? { slug: prevItem.slug, title: prevItem.title } : null);
          setPrevPost(nextItem ? { slug: nextItem.slug, title: nextItem.title } : null);
        }
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [slug]);

  useEffect(() => {
    async function highlight() {
      if (!loading && post) {
        const container = document.querySelector(".blog-content");
        if (container) {
          try {
            await highlightCodeUnder(container);
          } catch (err) {
            console.warn("Error highlighting code in blog post:", err);
          }
        }
      }
    }
    highlight();
  }, [loading, post]);

  return {
    slug,
    post,
    prevPost,
    nextPost,
    loading,
  };
}
