import { BookingReadCache } from '../../lib/bookingReadCache';

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

const configCache = new BookingReadCache<PublicConfig>(1);
const slotsCache = new BookingReadCache<Slot[]>();

async function unwrap<T>(res: Response): Promise<T> {
  const text = await res.text();
  let json: { ok?: boolean; data?: T; error?: string } | null;
  try {
    json = JSON.parse(text);
  } catch (error) {
    console.warn('Booking API returned an invalid JSON response', error);
    throw new Error('The booking service could not respond. Please try again.');
  }
  if (!res.ok || json?.ok !== true) {
    throw new Error(json?.error || `Request failed (${res.status})`);
  }
  return json.data as T;
}

// One bounded attempt: nested browser/proxy retries used to keep loading for over a minute.
async function readBookingData<T>(url: string | URL): Promise<T> {
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(20000) });
  return unwrap<T>(response);
}

export const bookingApi = {
  async getPublicConfig(): Promise<PublicConfig> {
    return configCache.read('config', 60000, async () => {
      const response = await fetch(`${BASE}/api/public-config`, { signal: AbortSignal.timeout(20000) });
      return unwrap<PublicConfig>(response);
    });
  },
  async getAvailableSlots(meetingKey: string, date: string): Promise<Slot[]> {
    const u = new URL(`${BASE}/api/available-slots`, window.location.origin);
    u.searchParams.set('meetingKey', meetingKey);
    u.searchParams.set('date', date);
    return slotsCache.read(`${meetingKey}|${date}`, 15000, () => readBookingData<Slot[]>(u));
  },
  async bookMeeting(payload: { meetingKey: string; startMs: number; name: string; email: string; notes?: string; requestId: string; }) {
    // A failed/ambiguous response may still have created a booking upstream.
    slotsCache.clear();
    try {
      const r = await fetch(`${BASE}/api/book?action=bookMeeting`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000),
      });
      return await unwrap<{ bookingId: string; label: string; hosts: string[]; startMs: number; endMs: number; link?: string }>(r);
    } finally {
      slotsCache.clear();
    }
  },
};
