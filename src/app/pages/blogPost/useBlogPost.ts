import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
// Base languages
import "prismjs/components/prism-markup";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
// Extended languages
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
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
          setNextPost(
            currentIndex > 0
              ? { slug: postList[currentIndex - 1].slug, title: postList[currentIndex - 1].title }
              : null
          );
          setPrevPost(
            currentIndex < postList.length - 1
              ? { slug: postList[currentIndex + 1].slug, title: postList[currentIndex + 1].title }
              : null
          );
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
    if (!loading && post) {
      const container = document.querySelector(".blog-content");
      if (container) {
        Prism.highlightAllUnder(container);
      }
    }
  }, [loading, post]);

  return {
    slug,
    post,
    prevPost,
    nextPost,
    loading,
  };
}
