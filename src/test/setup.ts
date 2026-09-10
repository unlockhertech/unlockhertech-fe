import '@testing-library/jest-dom';
import { vi } from 'vitest';

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
