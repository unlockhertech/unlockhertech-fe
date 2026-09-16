export type Slot = { startMs: number; endMs: number };
export type MeetingType = {
  key: string;
  section: 'partnerships' | 'careers' | 'podcast' | 'mentorship' | 'meet';
  label: string;
  duration: number;
  summary: string;
  hosts: string[];
  days: number[];
  schedule: string;
};
export type PublicConfig = {
  timeZone: string;
  contactEmail: string;
  meetingTypes: MeetingType[];
  dates: { value: string; weekday: number }[];
};

const BASE = '/api/booking-portal';

async function unwrap<T>(res: Response): Promise<T> {
  const ct = res.headers.get('content-type') || '';
  try {
    const json = await res.json();
    if (!json || json.ok !== true) {
      const msg = (json && json.error) || `Request failed (${res.status})`;
      throw new Error(String(msg));
    }
    return json.data as T;
  } catch {
    // Fall back to reading plain text for clearer diagnostics when upstream returns HTML or bad JSON
    const txt = await res.text().catch(() => '');
    const firstLine = (txt || '').split('\n')[0].slice(0, 180);
    const suffix = firstLine ? `: ${firstLine}` : '';
    throw new Error(`Request failed (${res.status})${suffix}`);
  }
}

export const bookingApi = {
  async getPublicConfig(): Promise<PublicConfig> {
    const r = await fetch(`${BASE}/api/public-config`, { cache: 'no-store' });
    return unwrap<PublicConfig>(r);
  },
  async getAvailableSlots(meetingKey: string, date: string): Promise<Slot[]> {
    const u = new URL(`${BASE}/api/available-slots`, window.location.origin);
    u.searchParams.set('meetingKey', meetingKey);
    u.searchParams.set('date', date);
    const r = await fetch(u.toString(), { cache: 'no-store' });
    return unwrap<Slot[]>(r);
  },
  async bookMeeting(payload: { meetingKey: string; startMs: number; name: string; email: string; notes?: string; requestId: string; }) {
    const r = await fetch(`${BASE}/api/book?action=bookMeeting`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return unwrap<{ bookingId: string; label: string; hosts: string[]; startMs: number; endMs: number; link?: string }>(r);
  },
};
