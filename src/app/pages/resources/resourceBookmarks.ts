const BOOKMARKS_STORAGE_KEY = "uht_saved_resource_ids";
const BOOKMARKS_EVENT_NAME = "uht:bookmarks-updated";

/**
 * Retrieves all saved resource IDs from localStorage safely.
 */
export function getBookmarkedIds(): string[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
    return [];
  } catch (err) {
    console.warn("Failed to read bookmarks from localStorage:", err);
    return [];
  }
}

/**
 * Checks if a specific resource ID is saved in bookmarks.
 */
export function isBookmarked(id: string): boolean {
  if (!id) return false;
  const bookmarks = getBookmarkedIds();
  return bookmarks.includes(id);
}

/**
 * Saves bookmarked IDs to localStorage and dispatches a cross-component event.
 */
function saveBookmarkedIds(ids: string[]): void {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(
      new CustomEvent(BOOKMARKS_EVENT_NAME, {
        detail: { bookmarkedIds: ids },
      })
    );
  } catch (err) {
    console.warn("Failed to save bookmarks to localStorage:", err);
  }
}

/**
 * Toggles the bookmark status of a resource ID.
 * Returns true if the item is now bookmarked, false if removed.
 */
export function toggleBookmarkId(id: string): boolean {
  if (!id) return false;
  const current = getBookmarkedIds();
  const exists = current.includes(id);
  const updated = exists ? current.filter((item) => item !== id) : [...current, id];
  saveBookmarkedIds(updated);
  return !exists;
}

/**
 * Explicitly adds a resource ID to bookmarks.
 */
export function addBookmarkId(id: string): void {
  if (!id) return;
  const current = getBookmarkedIds();
  if (!current.includes(id)) {
    saveBookmarkedIds([...current, id]);
  }
}

/**
 * Explicitly removes a resource ID from bookmarks.
 */
export function removeBookmarkId(id: string): void {
  if (!id) return;
  const current = getBookmarkedIds();
  if (current.includes(id)) {
    saveBookmarkedIds(current.filter((item) => item !== id));
  }
}

/**
 * Subscribes to bookmark updates across components and window storage events.
 * Returns an cleanup unsubscribe function.
 */
export function subscribeBookmarks(callback: (ids: string[]) => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleCustomEvent = (event: Event) => {
    const customEvent = event as CustomEvent<{ bookmarkedIds?: string[] }>;
    if (customEvent.detail?.bookmarkedIds) {
      callback(customEvent.detail.bookmarkedIds);
    } else {
      callback(getBookmarkedIds());
    }
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === BOOKMARKS_STORAGE_KEY) {
      callback(getBookmarkedIds());
    }
  };

  window.addEventListener(BOOKMARKS_EVENT_NAME, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(BOOKMARKS_EVENT_NAME, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}
