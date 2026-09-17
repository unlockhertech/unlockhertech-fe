const APPS_SCRIPT_BASE = 'https://script.google.com/macros/s/AKfycby9D1NeJFq6gnfANBNecurO4kKukEYiFxt_EzvdWexgQI0HauKpCeP6hK2ujPB9ypTlFA/exec';

// Simple per-instance in-memory cache for small JSON responses.
// Note: Netlify may spin multiple instances; this is best-effort to shave latency.
type CacheEntry = { expiresAt: number; payload: string };
const memoryCache: Map<string, CacheEntry> = new Map();
const DEFAULT_TTL_MS = 30 * 1000; // 30 seconds for slots

function cacheGet(key: string): string | null {
  const hit = memoryCache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) { memoryCache.delete(key); return null; }
  return hit.payload;
}

function cacheSet(key: string, payload: string, ttlMs = DEFAULT_TTL_MS): void {
  memoryCache.set(key, { expiresAt: Date.now() + ttlMs, payload });
}

// ---- Resilient upstream fetch helpers (timeout + retry + content-type guard) ----
function delay(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const r = await fetch(url, { ...init, signal: controller.signal });
    return r;
  } finally {
    clearTimeout(id);
  }
}

async function fetchJsonWithRetry(
  url: string,
  init: RequestInit = {},
  retries = 1,
  timeoutMs = 10000
): Promise<{ ok: boolean; text: string; isJson: boolean; status: number }>
{
  let lastErr: any = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const resp = await fetchWithTimeout(url, init, timeoutMs);
      const ct = resp.headers.get('content-type') || '';
      const txt = await resp.text();
      const isJson = ct.includes('application/json') || (/^\s*\{/.test(txt) && txt.trim().endsWith('}'));
      return { ok: resp.ok, text: txt, isJson, status: resp.status };
    } catch (e) {
      lastErr = e;
      if (attempt < retries) await delay(250);
    }
  }
  throw lastErr;
}

async function proxyJson(request: Request): Promise<Response> {
  const incoming = new URL(request.url);
  const path = incoming.pathname;
  const token = process.env.BOOKING_PORTAL_TOKEN ?? '';
  const base = new URL(APPS_SCRIPT_BASE);
  base.searchParams.set('token', token);

  // Route mapping: three JSON endpoints
  if (path.endsWith('/api/public-config')) {
    base.searchParams.set('action', 'getPublicConfig');
    const cacheKey = 'public-config';
    const cached = cacheGet(cacheKey);
    try {
      const r = await fetchJsonWithRetry(base.toString(), { redirect: 'follow' }, 1, 10000);
      if (!r.isJson) throw new Error('non-json');
      try { cacheSet(cacheKey, r.text, 60 * 1000); } catch {}
      return new Response(r.text, {
        status: r.ok ? 200 : 502,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          // Short CDN cache for fast first-view; allow shared caches longer
          'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
        },
      });
    } catch (e) {
      if (cached) {
        return new Response(cached, {
          status: 200,
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'public, max-age=30, s-maxage=120, stale-while-revalidate=300',
          },
        });
      }
      return new Response(JSON.stringify({ ok: false, error: 'Configuration temporarily unavailable' }), {
        status: 502,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }
  }
  if (path.endsWith('/api/available-slots')) {
    base.searchParams.set('action', 'getAvailableSlots');
    const mk = incoming.searchParams.get('meetingKey') || '';
    const dt = incoming.searchParams.get('date') || '';
    base.searchParams.set('meetingKey', mk);
    base.searchParams.set('date', dt);
    const cacheKey = `slots:${mk}|${dt}`;

    // Try to fetch fresh; on failure, serve stale cache if available
    const cached = cacheGet(cacheKey);
    try {
      const r = await fetchJsonWithRetry(base.toString(), { redirect: 'follow' }, 1, 10000);
      if (!r.isJson) throw new Error('non-json');
      try { cacheSet(cacheKey, r.text, DEFAULT_TTL_MS); } catch {}
      return new Response(r.text, {
        status: 200,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'public, max-age=30, s-maxage=60',
        },
      });
    } catch (e) {
      if (cached) {
        return new Response(cached, {
          status: 200,
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'public, max-age=15, s-maxage=30',
          },
        });
      }
      return new Response(JSON.stringify({ ok: false, error: 'Availability service temporarily unavailable' }), {
        status: 502,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }
  }
  if (path.endsWith('/api/book')) {
    const u = new URL(APPS_SCRIPT_BASE);
    u.searchParams.set('token', token);
    u.searchParams.set('action', 'bookMeeting');
    const body = await request.text();
    const r = await fetchJsonWithRetry(
      u.toString(),
      { method: 'POST', headers: { 'content-type': 'application/json' }, body, redirect: 'follow' },
      1,
      10000
    );
    if (!r.isJson) {
      return new Response(JSON.stringify({ ok: false, error: 'Booking service returned non-JSON' }), {
        status: 502,
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
      });
    }
    return new Response(r.text, {
      status: r.ok ? 200 : 502,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  }

  // Fallback 404 for unknown API route
  return new Response(JSON.stringify({ ok: false, error: 'Not Found' }), { status: 404, headers: { 'content-type': 'application/json; charset=utf-8' } });
}

export default async function handler(request: Request): Promise<Response> {
  try {
    const urlObj = new URL(request.url);
    // If hitting JSON API under /api/booking-portal/api/*, go through JSON proxy
    if (/\/api\/booking-portal\/api\//.test(urlObj.pathname)) {
      return await proxyJson(request);
    }

    // Compose upstream URL with token and forwarded query params
    const url = new URL(APPS_SCRIPT_BASE);
    const incoming = new URL(request.url);
    for (const [k, v] of incoming.searchParams) {
      url.searchParams.set(k, v);
    }
    const token = process.env.BOOKING_PORTAL_TOKEN ?? '';
    url.searchParams.set('token', token);

    const upstream = await fetch(url.toString(), {
      headers: {
        'user-agent': request.headers.get('user-agent') ?? 'Mozilla/5.0',
        'accept': request.headers.get('accept') ?? 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'accept-language': request.headers.get('accept-language') ?? 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    // Raw HTML from upstream
    let body = await upstream.text();

    // --- Sanitize upstream HTML for embedded, sandboxed iframe context ---
    // 1) Strip development-only assets that cause CORS errors (Vite/React Refresh/localhost)
    try {
      // Remove any <script src="http(s)://localhost:5173/..."> or 127.0.0.1 (quotes optional)
      body = body.replace(/<script\b[^>]*src=\s*["']?https?:\/\/(?:localhost|127\.0\.0\.1):5173\/[^\s"'>]+[^>]*><\/script>/gi, '');
      // Remove Vite client & React Refresh helper scripts (with or without leading slash, quotes optional)
      body = body.replace(/<script\b[^>]*src=\s*["']?\/?(?:@vite\/client|@react-refresh(?:\/runtime)?)\/?[^\s"'>]*[^>]*><\/script>/gi, '');
      // Remove direct dev entry points like /src/main.(tsx|ts|js)?... (quotes optional)
      body = body.replace(/<script\b[^>]*src=\s*["']?\/?src\/main\.(?:tsx|ts|js)[^\s"'>]*[^>]*><\/script>/gi, '');
      // Remove any script tag that points to an explicit http:// (non-https) dev server
      body = body.replace(/<script\b[^>]*src=\s*["']?http:\/\/[^[>\s"']+[^>]*><\/script>/gi, '');
      // Remove modulepreload links that point to localhost dev server or vite helpers (quotes optional, rel may appear in any order)
      body = body.replace(/<link\b([^>]*rel=\s*["']?modulepreload["']?[^>]*)?[^>]*href=\s*["']?(?:https?:\/\/(?:localhost|127\.0\.0\.1):5173\/?|\/?(?:@vite\/client|@react-refresh(?:\/runtime)?|src\/main\.(?:tsx|ts|js)))[^\s"'>]*[^>]*>/gi, '');
      // Remove inline scripts that reference vite/dev helpers
      body = body.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (m, inner) => {
        const s = String(inner || '');
        return /localhost:5173|@vite|@react-refresh|react-refresh|vite\s*\./i.test(s) ? '' : m;
      });
    } catch (_) {
      // If sanitization fails for some reason, proceed with the original body.
    }

    // 2) Proactively suppress service worker access/registration errors inside the embedded iframe.
    //    In sandbox without allow-same-origin, merely reading navigator.serviceWorker can throw.
    //    Install early handlers and try to stub the property to reduce console noise.
    try {
      const disableSwSnippet = (
        "<script>(function(){try{\n" +
        "  var g = (typeof window!=='undefined') ? window : self;\n" +
        "  try { var nav = g.navigator; if(nav){ try{ Object.defineProperty(nav,'serviceWorker',{ get:function(){ return void 0; }, configurable:true }); }catch(_){} } } catch(_){}\n" +
        "  g.addEventListener('error', function(e){ try{ var m = e && (e.message||''); if(typeof m==='string' && m.indexOf('Service worker is disabled because the context is sandboxed')!==-1){ e.preventDefault&&e.preventDefault(); e.stopImmediatePropagation&&e.stopImmediatePropagation(); return false; } }catch(_){} }, true);\n" +
        "  g.addEventListener('unhandledrejection', function(e){ try{ var r = e && (e.reason||{}); var m = (r && (r.message||r))+''; if(m.indexOf('Service worker is disabled because the context is sandboxed')!==-1){ e.preventDefault&&e.preventDefault(); e.stopImmediatePropagation&&e.stopImmediatePropagation(); return false; } }catch(_){} }, true);\n" +
        "}catch(_){}})();<\/script>"
      );
      if (/<head[^>]*>/i.test(body)) {
        body = body.replace(/<head[^>]*>/i, (m) => m + "\n" + disableSwSnippet);
      } else if (/<body[^>]*>/i.test(body)) {
        // Fallback: inject at the start of <body>
        body = body.replace(/<body[^>]*>/i, (m) => m + "\n" + disableSwSnippet);
      } else {
        // Last resort: prepend to document
        body = disableSwSnippet + body;
      }
    } catch (_) {
      // Non-fatal if injection fails; the page will still render.
    }

    const headers = new Headers();
    const contentType = upstream.headers.get('content-type');
    headers.set('content-type', contentType && contentType.includes('text/html') ? contentType : 'text/html; charset=utf-8');
    headers.set('x-content-type-options', 'nosniff');
    headers.set('referrer-policy', 'no-referrer');
    headers.set('cache-control', 'no-store');
    headers.set(
      'content-security-policy',
      [
        "default-src 'self' https: data: blob:",
        // Note: we keep 'unsafe-inline' to allow our small SW-disabling snippet and upstream inline scripts.
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
        "style-src 'self' 'unsafe-inline' https:",
        "img-src 'self' data: https:",
        // Block workers/sw entirely in this embedded context and disallow any http connections
        "worker-src 'none'",
        "connect-src 'self' https:",
        'block-all-mixed-content',
        // Allow embedding on prod, local, and Netlify preview sites
        "frame-ancestors 'self' https://unlockhertech.com https://www.unlockhertech.com http://localhost:5173 http://127.0.0.1:5173 https://*.netlify.app",
      ].join('; ')
    );

    return new Response(body, { status: upstream.status, headers });
  } catch (err) {
    console.error('booking-portal proxy error', err);
    return new Response('Booking portal is temporarily unavailable.', {
      status: 502,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }
}