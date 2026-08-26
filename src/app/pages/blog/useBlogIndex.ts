import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router";
import type { BlogPost } from "../../types";
import { getAllBlogPosts } from "../../utils/sanity";

export function useBlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTag = searchParams.get("tag");

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const postList = await getAllBlogPosts();
        const tagsSet = new Set(postList.flatMap((post) => post.tags ?? []));

        setPosts(postList);
        setAllTags(Array.from(tagsSet).sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesTag = activeTag ? post.tags?.includes(activeTag) : true;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        (post.content && post.content.toLowerCase().includes(q)) ||
        (post.author && post.author.toLowerCase().includes(q));
      return matchesTag && matchesSearch;
    });
  }, [posts, activeTag, searchQuery]);

  const handleSelectTag = useCallback((tag?: string) => {
    if (tag) {
      setSearchParams({ tag });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);

  const handleResetFilters = useCallback(() => {
    setSearchParams({});
    setSearchQuery("");
  }, [setSearchParams]);

  return {
    posts,
    allTags,
    searchQuery,
    setSearchQuery,
    loading,
    activeTag,
    filteredPosts,
    handleSelectTag,
    handleResetFilters,
  };
}
