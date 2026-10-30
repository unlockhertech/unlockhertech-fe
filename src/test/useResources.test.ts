import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter } from "react-router";
import type { PropsWithChildren } from "react";
import React from "react";
import { useResources } from "../app/pages/resources/useResources";
import { DEFAULT_RESOURCES } from "../app/pages/resources/resourceData";
import * as sanityUtils from "../app/utils/sanity";
import {
  getBookmarkedIds,
  toggleBookmarkId,
  addBookmarkId,
  removeBookmarkId,
} from "../app/pages/resources/resourceBookmarks";

describe("useResources and bookmark utilities", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(sanityUtils, "getAllResources").mockResolvedValue(DEFAULT_RESOURCES);
  });

  const createWrapper = (initialEntries = ["/resources"]) => {
    return function Wrapper({ children }: PropsWithChildren) {
      return React.createElement(MemoryRouter, { initialEntries }, children);
    };
  };

  it("loads and returns default resources", async () => {
    const { result } = renderHook(() => useResources(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.resources.length).toBeGreaterThan(0);
    });

    expect(result.current.filteredResources.length).toBeGreaterThan(0);
    expect(result.current.typeCounts.all).toBe(result.current.resources.length);
  });

  it("updates format/type filter and calculates type counts", async () => {
    const { result } = renderHook(() => useResources(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.resources.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.setActiveType("template");
    });

    expect(result.current.activeType).toBe("template");
    expect(result.current.filteredResources.every((r) => (r.type || r.format) === "template")).toBe(true);
  });

  it("updates topic filter", async () => {
    const { result } = renderHook(() => useResources(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.resources.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.setSelectedTopic("Myth Busting");
    });

    expect(result.current.selectedTopic).toBe("Myth Busting");
    expect(result.current.filteredResources.every((r) => r.category === "Myth Busting")).toBe(true);
  });

  it("updates search query filter", async () => {
    const { result } = renderHook(() => useResources(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.resources.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.setSearchQuery("Jargon");
    });

    expect(result.current.searchQuery).toBe("Jargon");
    expect(result.current.filteredResources.some((r) => r.title.includes("Jargon"))).toBe(true);
    expect(result.current.filteredResources.some((r) => r.title.includes("Myths"))).toBe(false);
  });

  it("handles resetting and clearing all filters", async () => {
    const { result } = renderHook(() => useResources(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.resources.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.setActiveType("tool");
      result.current.setSelectedTopic("Action Plan");
      result.current.setSearchQuery("Readiness");
    });

    expect(result.current.isFiltered).toBe(true);

    act(() => {
      result.current.handleResetFilters();
    });

    expect(result.current.activeType).toBe("all");
    expect(result.current.selectedTopic).toBe("All");
    expect(result.current.searchQuery).toBe("");
  });

  it("saves, toggles, and retrieves bookmarks in localStorage", async () => {
    expect(getBookmarkedIds()).toEqual([]);

    act(() => {
      addBookmarkId("guide-1");
    });
    expect(getBookmarkedIds()).toEqual(["guide-1"]);

    act(() => {
      toggleBookmarkId("guide-2");
    });
    expect(getBookmarkedIds()).toContain("guide-1");
    expect(getBookmarkedIds()).toContain("guide-2");

    act(() => {
      removeBookmarkId("guide-1");
    });
    expect(getBookmarkedIds()).toEqual(["guide-2"]);
  });
});
