import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSanityQuery, clearSanityQueryCache } from "../app/hooks/useSanityQuery";

describe("useSanityQuery", () => {
  beforeEach(() => {
    clearSanityQueryCache();
    vi.clearAllMocks();
  });

  it("fetches data and manages loading and success state", async () => {
    const mockFetcher = vi.fn().mockResolvedValue([{ id: "1", title: "Test Item" }]);

    const { result } = renderHook(() =>
      useSanityQuery("test_key_1", mockFetcher)
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual([{ id: "1", title: "Test Item" }]);
      expect(result.current.error).toBeNull();
    });

    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });

  it("serves cached data immediately on subsequent mount without re-fetching within TTL", async () => {
    const mockFetcher = vi.fn().mockResolvedValue(["alpha", "beta"]);

    // First mount
    const { unmount } = renderHook(() =>
      useSanityQuery("test_cached_key", mockFetcher, { ttlMs: 10000 })
    );

    await waitFor(() => {
      expect(mockFetcher).toHaveBeenCalledTimes(1);
    });

    unmount();

    // Second mount with same key within TTL
    const { result: secondResult } = renderHook(() =>
      useSanityQuery("test_cached_key", mockFetcher, { ttlMs: 10000 })
    );

    // Should return cached data synchronously with 0 extra network calls
    expect(secondResult.current.data).toEqual(["alpha", "beta"]);
    expect(secondResult.current.loading).toBe(false);
    expect(mockFetcher).toHaveBeenCalledTimes(1);
  });

  it("refetches fresh data and bypasses cache when refetch() is triggered", async () => {
    const mockFetcher = vi
      .fn()
      .mockResolvedValueOnce(["first_call"])
      .mockResolvedValueOnce(["second_call"]);

    const { result } = renderHook(() =>
      useSanityQuery("test_refetch_key", mockFetcher, { ttlMs: 10000 })
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(["first_call"]);
    });

    expect(mockFetcher).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.data).toEqual(["second_call"]);
    expect(mockFetcher).toHaveBeenCalledTimes(2);
  });

  it("captures fetch errors and sets error state gracefully", async () => {
    const errorFetcher = vi.fn().mockRejectedValue(new Error("Network timeout"));

    const { result } = renderHook(() =>
      useSanityQuery("test_error_key", errorFetcher)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("Network timeout");
    });
  });

  it("deduplicates concurrent fetches for the same query key", async () => {
    let resolvePromise: (val: string[]) => void = () => {};
    const deferredFetcher = vi.fn().mockImplementation(
      () =>
        new Promise<string[]>((res) => {
          resolvePromise = res;
        })
    );

    const hook1 = renderHook(() => useSanityQuery("concurrent_key", deferredFetcher));
    const hook2 = renderHook(() => useSanityQuery("concurrent_key", deferredFetcher));

    expect(deferredFetcher).toHaveBeenCalledTimes(1);

    act(() => {
      resolvePromise(["shared_result"]);
    });

    await waitFor(() => {
      expect(hook1.result.current.data).toEqual(["shared_result"]);
      expect(hook2.result.current.data).toEqual(["shared_result"]);
    });
  });
});
