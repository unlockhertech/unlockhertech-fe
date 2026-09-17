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

class BookingApiError extends Error {
  readonly retryable: boolean;
  constructor(message: string, retryable = false) {
    super(message);
    this.retryable = retryable;
  }
}

async function unwrap<T>(res: Response): Promise<T> {
  const text = await res.text();
  let json: { ok?: boolean; data?: T; error?: string } | null;
  try {
    json = JSON.parse(text);
  } catch (error) {
    console.warn('Booking API returned an invalid JSON response', error);
    throw new BookingApiError('The booking service could not respond. Please try again.', res.status >= 500);
  }
  if (!res.ok || json?.ok !== true) {
    throw new BookingApiError(json?.error || `Request failed (${res.status})`, res.status >= 500 || res.status === 429);
  }
  return json.data as T;
}

// Retry reads only: never automatically resubmit a booking.
async function readBookingData<T>(url: string | URL): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(25000) });
      return await unwrap<T>(response);
    } catch (error) {
      const retryable = !(error instanceof BookingApiError) || error.retryable;
      if (attempt >= 2 || !retryable) throw error;
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
}

export const bookingApi = {
  async getPublicConfig(): Promise<PublicConfig> {
    return readBookingData<PublicConfig>(`${BASE}/api/public-config`);
  },
  async getAvailableSlots(meetingKey: string, date: string): Promise<Slot[]> {
    const u = new URL(`${BASE}/api/available-slots`, window.location.origin);
    u.searchParams.set('meetingKey', meetingKey);
    u.searchParams.set('date', date);
    return readBookingData<Slot[]>(u);
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
