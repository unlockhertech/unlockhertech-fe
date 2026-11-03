import '@testing-library/jest-dom';
import { vi } from 'vitest';

class LocalStorageMock implements Storage {
  private store: Record<string, string> = {};
  get length(): number {
    return Object.keys(this.store).length;
  }
  clear(): void {
    this.store = {};
  }
  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }
  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

const storageInstance = new LocalStorageMock();
Object.defineProperty(window, 'localStorage', { value: storageInstance, writable: true, configurable: true });
Object.defineProperty(globalThis, 'localStorage', { value: storageInstance, writable: true, configurable: true });

class IntersectionObserverMock {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});
Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

globalThis.HTMLMediaElement.prototype.load = () => { /* do nothing */ };
globalThis.HTMLMediaElement.prototype.play = () => Promise.resolve();
globalThis.HTMLMediaElement.prototype.pause = () => { /* do nothing */ };
globalThis.HTMLMediaElement.prototype.addTextTrack = () => ({}) as unknown as TextTrack;

if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

vi.mock('../app/utils/sanity', () => ({
  getAllBlogPosts: vi.fn(() => Promise.resolve([])),
  getBlogPostBySlug: vi.fn(() => Promise.resolve(null)),
  getAllExternalEvents: vi.fn(() => Promise.resolve([])),
  getAllResources: vi.fn(() => Promise.resolve([])),
  sanityClient: { fetch: vi.fn(() => Promise.resolve([])) },
  urlFor: vi.fn(() => ({ auto: vi.fn(() => ({ url: vi.fn(() => '') })) })),
  urlForOptimized: vi.fn(() => ''),
}));

vi.mock('../app/utils/jobsSanity', () => ({
  getAllJobs: vi.fn(() => Promise.resolve([])),
  getJobBySlug: vi.fn(() => Promise.resolve(null)),
  CURATED_SEED_JOBS: [],
}));
