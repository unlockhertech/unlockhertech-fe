import { BookingReadCache } from '../../src/lib/bookingReadCache';

const APPS_SCRIPT_BASE = 'https://script.google.com/macros/s/AKfycby9D1NeJFq6gnfANBNecurO4kKukEYiFxt_EzvdWexgQI0HauKpCeP6hK2ujPB9ypTlFA/exec';
const configCache = new BookingReadCache<string>(1);
const slotsCache = new BookingReadCache<string>();

function jsonResponse(payload: string, status = 200, cacheControl = 'no-store'): Response {
  return new Response(payload, {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': cacheControl },
  });
}

async function fetchJson(url: URL, init: RequestInit = {}): Promise<string> {
  // The deadline covers redirects AND reading the body. Do not retry writes.
  const response = await fetch(url, { ...init, redirect: 'follow', signal: AbortSignal.timeout(18000) });
  const text = await response.text();
  const result: { ok?: boolean } = JSON.parse(text);
  if (!response.ok || result?.ok !== true) throw new Error('Booking upstream request failed');
  return text;
}

async function proxyJson(request: Request): Promise<Response> {
  const incoming = new URL(request.url);
  const path = incoming.pathname;
  const base = new URL(APPS_SCRIPT_BASE);
  base.searchParams.set('token', process.env.BOOKING_PORTAL_TOKEN ?? '');

  if (request.method === 'GET' && path.endsWith('/api/public-config')) {
    base.searchParams.set('action', 'getPublicConfig');
    try {
      const text = await configCache.read('config', 60000, () => fetchJson(base));
      return jsonResponse(text, 200, 'public, max-age=60, s-maxage=300');
    } catch (error) {
      console.warn('Booking configuration unavailable', error);
      return jsonResponse(JSON.stringify({ ok: false, error: 'Configuration temporarily unavailable. Please try again.' }), 502);
    }
  }
  if (request.method === 'GET' && path.endsWith('/api/availability-summary')) {
    const meetingKey = incoming.searchParams.get('meetingKey') || '';
    if (!/^[a-z_]{1,80}$/.test(meetingKey)) {
      return jsonResponse(JSON.stringify({ ok: false, error: 'Invalid meeting' }), 400);
    }
    base.searchParams.set('action', 'getAvailabilitySummary');
    base.searchParams.set('meetingKey', meetingKey);
    try {
      return jsonResponse(await fetchJson(base));
    } catch (error) {
      console.warn('Booking dates unavailable', error);
      return jsonResponse(JSON.stringify({ ok: false, error: 'Available dates could not be loaded. Please try again.' }), 502);
    }
  }
  if (request.method === 'GET' && path.endsWith('/api/available-slots')) {
    const meetingKey = incoming.searchParams.get('meetingKey') || '';
    const date = incoming.searchParams.get('date') || '';
    if (!/^[a-z_]{1,80}$/.test(meetingKey) || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return jsonResponse(JSON.stringify({ ok: false, error: 'Invalid meeting or date' }), 400);
    }
    base.searchParams.set('action', 'getAvailableSlots');
    base.searchParams.set('meetingKey', meetingKey);
    base.searchParams.set('date', date);
    try {
      const text = await slotsCache.read(`${meetingKey}|${date}`, 0, () => fetchJson(base));
      // Share concurrent reads only; each later request checks the shared calendar again.
      return jsonResponse(text);
    } catch (error) {
      console.warn('Booking availability unavailable', error);
      return jsonResponse(JSON.stringify({ ok: false, error: 'Availability temporarily unavailable. Please try again.' }), 502);
    }
  }
  if (request.method === 'POST' && path.endsWith('/api/book')) {
    base.searchParams.set('action', 'bookMeeting');
    slotsCache.clear();
    try {
      // Preserve business errors (e.g. a slot just taken) for the caller.
      const response = await fetch(base, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: await request.text(), redirect: 'follow', signal: AbortSignal.timeout(18000),
      });
      const text = await response.text();
      JSON.parse(text);
      return jsonResponse(text, response.ok ? 200 : 502);
    } catch (error) {
      console.warn('Booking confirmation unavailable', error);
      return jsonResponse(JSON.stringify({ ok: false, error: 'Could not confirm the booking. Check your email before trying again.' }), 502);
    } finally {
      // Prevent an older in-flight read from repopulating this instance's cache.
      slotsCache.clear();
    }
  }
  return jsonResponse(JSON.stringify({ ok: false, error: 'Not Found' }), 404);
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