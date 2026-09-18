import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BookingReadCache } from '../lib/bookingReadCache';

const slots = [{ startMs: 1789989300000, endMs: 1789991100000 }];
const json = (data: unknown) => new Response(JSON.stringify({ ok: true, data }), {
  headers: { 'content-type': 'application/json' },
});
const url = 'https://example.com/api/booking-portal/api/available-slots?meetingKey=partnership_initial&date=2026-09-21';

beforeEach(() => { vi.resetModules(); vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('short-lived booking cache', () => {
  it('shares pending reads, reuses fresh results, and refreshes expired results', async () => {
    const cache = new BookingReadCache<number>();
    let finish!: (value: number) => void;
    const fetchValue = vi.fn(() => new Promise<number>(resolve => { finish = resolve; }));
    const first = cache.read('date', 15000, fetchValue);
    const second = cache.read('date', 15000, fetchValue);
    expect(fetchValue).toHaveBeenCalledTimes(1);
    finish(1);
    expect(await first).toBe(1);
    expect(await second).toBe(1);
    expect(await cache.read('date', 15000, fetchValue)).toBe(1);
    vi.advanceTimersByTime(15000);
    const next = cache.read('date', 15000, fetchValue);
    expect(fetchValue).toHaveBeenCalledTimes(2);
    finish(2);
    expect(await next).toBe(2);
  });

  it('does not retain failures or reads invalidated by a booking', async () => {
    const cache = new BookingReadCache<number>();
    await expect(cache.read('date', 15000, async () => { throw new Error('offline'); })).rejects.toThrow('offline');
    let finish!: (value: number) => void;
    const old = cache.read('date', 15000, () => new Promise(resolve => { finish = resolve; }));
    cache.clear();
    expect(await cache.read('date', 15000, async () => 2)).toBe(2);
    finish(1);
    await old;
    expect(await cache.read('date', 15000, async () => 3)).toBe(2);
  });

  it('bounds the number of stored results', async () => {
    const cache = new BookingReadCache<number>(1);
    await cache.read('a', 15000, async () => 1);
    await cache.read('b', 15000, async () => 2);
    expect(await cache.read('a', 15000, async () => 3)).toBe(3);
  });
});

describe('browser booking API', () => {
  it('reuses prefetched slots, keeps dates separate, and expires slots', async () => {
    const fetchMock = vi.fn(async () => json(slots));
    vi.stubGlobal('fetch', fetchMock);
    const { bookingApi } = await import('../app/lib/bookingApi');
    await Promise.all([
      bookingApi.getAvailableSlots('partnership_initial', '2026-09-21'),
      bookingApi.getAvailableSlots('partnership_initial', '2026-09-21'),
    ]);
    await bookingApi.getAvailableSlots('partnership_initial', '2026-09-21');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await bookingApi.getAvailableSlots('partnership_initial', '2026-09-22');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    vi.advanceTimersByTime(15000);
    await bookingApi.getAvailableSlots('partnership_initial', '2026-09-21');
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('reuses configuration and invalidates slots after an ambiguous booking failure', async () => {
    const fetchMock = vi.fn(async () => json(slots));
    vi.stubGlobal('fetch', fetchMock);
    const { bookingApi } = await import('../app/lib/bookingApi');
    await bookingApi.getPublicConfig();
    await bookingApi.getPublicConfig();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await bookingApi.getAvailableSlots('partnership_initial', '2026-09-21');
    fetchMock.mockRejectedValueOnce(new Error('timeout'));
    await expect(bookingApi.bookMeeting({ meetingKey: 'partnership_initial', startMs: 1, name: 'Test', email: 'test@example.com', requestId: 'test' })).rejects.toThrow('timeout');
    await bookingApi.getAvailableSlots('partnership_initial', '2026-09-21');
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it('does not automatically retry a failed read', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('timeout'));
    vi.stubGlobal('fetch', fetchMock);
    const { bookingApi } = await import('../app/lib/bookingApi');
    await expect(bookingApi.getAvailableSlots('partnership_initial', '2026-09-21')).rejects.toThrow('timeout');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('Netlify booking proxy', () => {
  it('serves fresh cached slots and config without another Google call', async () => {
    const fetchMock = vi.fn(async () => json(slots));
    vi.stubGlobal('fetch', fetchMock);
    const { default: handler } = await import('../../netlify/functions/booking-portal');
    await Promise.all([handler(new Request(url)), handler(new Request(url))]);
    const response = await handler(new Request(url));
    expect(await response.json()).toEqual({ ok: true, data: slots });
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const config = 'https://example.com/api/booking-portal/api/public-config';
    await handler(new Request(config));
    await handler(new Request(config));
    expect(fetchMock).toHaveBeenCalledTimes(2);
    vi.advanceTimersByTime(15000);
    await handler(new Request(url));
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('does not cache application errors and never retries booking writes', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const fetchMock = vi.fn(async () => new Response('{"ok":false,"error":"Unavailable"}'));
    vi.stubGlobal('fetch', fetchMock);
    const { default: handler } = await import('../../netlify/functions/booking-portal');
    expect((await handler(new Request(url))).status).toBe(502);
    expect((await handler(new Request(url))).status).toBe(502);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    fetchMock.mockRejectedValueOnce(new Error('timeout'));
    const response = await handler(new Request('https://example.com/api/booking-portal/api/book', { method: 'POST', body: '{}' }));
    expect(response.status).toBe(502);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('keeps the upstream deadline active while reading the response body', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.spyOn(AbortSignal, 'timeout').mockImplementation(ms => {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), ms);
      return controller.signal;
    });
    const fetchMock = vi.fn(async (_url: unknown, init?: RequestInit) => ({
      ok: true,
      text: () => new Promise<string>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new Error('timeout')), { once: true });
      }),
    }));
    vi.stubGlobal('fetch', fetchMock);
    const { default: handler } = await import('../../netlify/functions/booking-portal');
    const pending = handler(new Request(url));
    await vi.advanceTimersByTimeAsync(18000);
    expect((await pending).status).toBe(502);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('invalidates cached slots when a booking is submitted', async () => {
    const fetchMock = vi.fn(async () => json(slots));
    vi.stubGlobal('fetch', fetchMock);
    const { default: handler } = await import('../../netlify/functions/booking-portal');
    await handler(new Request(url));
    await handler(new Request('https://example.com/api/booking-portal/api/book', { method: 'POST', body: '{}' }));
    await handler(new Request(url));
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
