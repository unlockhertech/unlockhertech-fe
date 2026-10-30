import { useState, useEffect, useCallback, useRef } from "react";

export interface QueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseSanityQueryOptions {
  ttlMs?: number;
  enabled?: boolean;
}

interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  inFlightPromise?: Promise<T>;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
export const DEFAULT_SANITY_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function clearSanityQueryCache(queryKey?: string): void {
  if (queryKey) {
    memoryCache.delete(queryKey);
  } else {
    memoryCache.clear();
  }
}

export function useSanityQuery<T>(
  queryKey: string,
  fetcher: () => Promise<T>,
  options: Readonly<UseSanityQueryOptions> = {}
): QueryResult<T> {
  const { ttlMs = DEFAULT_SANITY_TTL_MS, enabled = true } = options;

  const [data, setData] = useState<T | null>(() => {
    const entry = memoryCache.get(queryKey) as CacheEntry<T> | undefined;
    return entry ? entry.data : null;
  });

  const [loading, setLoading] = useState<boolean>(() => {
    if (!enabled) return false;
    const entry = memoryCache.get(queryKey) as CacheEntry<T> | undefined;
    if (!entry) return true;
    const isFresh = Date.now() - entry.timestamp < ttlMs;
    return !isFresh && !entry.data;
  });

  const [error, setError] = useState<string | null>(null);

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const performFetch = useCallback(
    async (bypassCache = false): Promise<void> => {
      if (!enabled) return;

      const now = Date.now();
      const existing = memoryCache.get(queryKey) as CacheEntry<T> | undefined;

      if (!bypassCache && existing) {
        const isFresh = now - existing.timestamp < ttlMs;
        if (isFresh) {
          setData(existing.data);
          setLoading(false);
          setError(null);
          return;
        }
      }

      const activePromise =
        !bypassCache && existing?.inFlightPromise
          ? existing.inFlightPromise
          : fetcherRef.current();

      if (!existing?.inFlightPromise || bypassCache) {
        memoryCache.set(queryKey, {
          data: existing?.data ?? (null as unknown as T),
          timestamp: existing?.timestamp ?? 0,
          inFlightPromise: activePromise,
        });
      }

      try {
        const freshData = await activePromise;
        memoryCache.set(queryKey, {
          data: freshData,
          timestamp: Date.now(),
          inFlightPromise: undefined,
        });
        setData(freshData);
        setError(null);
      } catch (err) {
        console.warn(`useSanityQuery fetch failed for [${queryKey}]:`, err);
        const errMsg = err instanceof Error ? err.message : "Failed to load data";
        setError(errMsg);

        if (existing?.data) {
          memoryCache.set(queryKey, {
            data: existing.data,
            timestamp: existing.timestamp,
            inFlightPromise: undefined,
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [enabled, queryKey, ttlMs]
  );

  useEffect(() => {
    let ignore = false;

    const existing = memoryCache.get(queryKey) as CacheEntry<T> | undefined;
    const isFresh = existing && Date.now() - existing.timestamp < ttlMs;

    if (!isFresh && enabled) {
      const activePromise = existing?.inFlightPromise ?? fetcherRef.current();

      if (!existing?.inFlightPromise) {
        memoryCache.set(queryKey, {
          data: existing?.data ?? (null as unknown as T),
          timestamp: existing?.timestamp ?? 0,
          inFlightPromise: activePromise,
        });
      }

      activePromise
        .then((freshData) => {
          if (!ignore) {
            memoryCache.set(queryKey, {
              data: freshData,
              timestamp: Date.now(),
              inFlightPromise: undefined,
            });
            setData(freshData);
            setError(null);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (!ignore) {
            console.warn(`useSanityQuery fetch failed for [${queryKey}]:`, err);
            const errMsg = err instanceof Error ? err.message : "Failed to load data";
            setError(errMsg);
            setLoading(false);
          }
        });
    }

    return () => {
      ignore = true;
    };
  }, [enabled, queryKey, ttlMs]);

  const refetch = useCallback(async () => {
    await performFetch(true);
  }, [performFetch]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
