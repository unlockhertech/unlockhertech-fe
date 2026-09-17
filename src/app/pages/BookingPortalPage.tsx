import { useEffect, useMemo, useRef, useState } from 'react';
import { useMetaData } from "@/app/hooks/useMetaData.ts";
import { bookingApi, type PublicConfig, type Slot, type MeetingType } from "@/app/lib/bookingApi";
import "@/app/styles/booking.css";
import { BookingLoading } from "@/app/components/BookingLoading";
import { BookingBackground } from "@/app/components/BookingBackground";

interface BookingResponse { bookingId: string; label: string; hosts: string[]; startMs: number; endMs: number; link?: string }

export function BookingPage() {
    useMetaData(
        "Booking Portal | Unlock Her Tech",
        "Book your spot with Unlock Her Tech today!",
        "https://unlockhertech.com/private-booking-portal",
        { image: "/logo.png", type: "website" }
    );

    // Prevent SEO indexing
    useEffect(() => {
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, nofollow';
        document.head.appendChild(meta);
        return () => meta.remove();
    }, []);

    const url = useMemo(() => new URL(window.location.href), []);
    const initialSection = (url.searchParams.get('section') || 'partnerships') as MeetingType['section'];

    const [cfg, setCfg] = useState<PublicConfig | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [section, setSection] = useState<MeetingType['section']>(initialSection);
    const [meeting, setMeeting] = useState<MeetingType | null>(null);
    const [month, setMonth] = useState<string>(''); // YYYY-MM
    const [selectedDate, setSelectedDate] = useState<string | null>(null); // YYYY-MM-DD
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [booking, setBooking] = useState(false);
    const loadingVersion = useRef(0);
    const requestId = useRef(crypto.randomUUID());
    const [confirmation, setConfirmation] = useState<BookingResponse | null>(null);
    // Session-scoped client cache for slots keyed by meeting|date
    const slotsCache = useRef<Map<string, Slot[]>>(new Map());

    const cacheKey = (meetingKey: string, date: string) => `${meetingKey}|${date}`;

    async function prefetchSlots(mKey: string, date: string) {
        if (!mKey || !date) return;
        const key = cacheKey(mKey, date);
        if (slotsCache.current.has(key)) return; // already cached
        try {
            const s = await bookingApi.getAvailableSlots(mKey, date);
            slotsCache.current.set(key, s);
        } catch {
            // ignore prefetch errors
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const c = await bookingApi.getPublicConfig();
                setError(null);
                setCfg(c);
                const first = c.meetingTypes.find(m => m.section === section) || c.meetingTypes[0] || null;
                setMeeting(first);
                const firstMonth = (c.dates?.[0]?.value || '').slice(0, 7) || new Date().toISOString().slice(0, 7);
                setMonth(firstMonth);
                // Prefetch the first likely available date for the default meeting
                if (first && c.dates?.length) {
                    const firstAvail = c.dates.find(d => first.days.includes(d.weekday))?.value;
                    if (firstAvail) prefetchSlots(first.key, firstAvail);
                }
            } catch (e: any) {
                setError(e?.message || 'Booking is temporarily unavailable');
            }
        })();
    }, []);

    useEffect(() => {
        if (!cfg || !meeting) return;
        document.documentElement.style.setProperty('--accent', sectionAccent(section));
    }, [cfg, meeting, section]);

    async function loadDate(value: string) {
        if (!meeting) return;
        setSelectedDate(value);
        setSelectedSlot(null);
        setError(null);
        // Instant populate from client cache if present
        const k = cacheKey(meeting.key, value);
        if (slotsCache.current.has(k)) {
            setSlots(slotsCache.current.get(k)!);
        }
        const version = ++loadingVersion.current;
        try {
            const s = await bookingApi.getAvailableSlots(meeting.key, value);
            if (version !== loadingVersion.current) return; // stale
            slotsCache.current.set(k, s);
            setSlots(s);
        } catch (e: any) {
            if (version !== loadingVersion.current) return;
            setError(e?.message || 'Could not load availability');
            setSlots([]);
        }
    }

    function handleSelectMeeting(m: MeetingType) {
        if (booking) return;
        setMeeting(m);
        setSelectedDate(null);
        setSlots([]);
        setConfirmation(null);
        // Prefetch the first visible/eligible date for this meeting
        if (cfg?.dates?.length) {
            const d = cfg.dates.find(d0 => m.days.includes(d0.weekday))?.value;
            if (d) prefetchSlots(m.key, d);
        }
    }

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!meeting || !selectedSlot) return;
        const form = new FormData(e.currentTarget);
        const name = String(form.get('name') || '').trim();
        const email = String(form.get('email') || '').trim();
        const notes = String(form.get('notes') || '').trim();
        setBooking(true);
        setError(null);
        try {
            const res = await bookingApi.bookMeeting({
                meetingKey: meeting.key,
                startMs: selectedSlot.startMs,
                name,
                email,
                notes,
                requestId: requestId.current,
            });
            setConfirmation(res);
        } catch (err: any) {
            setError(err?.message || 'Booking failed');
        } finally {
            setBooking(false);
        }
    }

    if (!cfg && !error) return <BookingLoading />;

    if (!cfg) return <BookingLoading failed />;

    const meetingsInSection = cfg.meetingTypes.filter(m => m.section === section);

    return (
        <div className="wrap-root">
            <BookingBackground />
            <div className="topline" aria-hidden="true" />
            <header>
                <a className="wordmark" href="https://www.unlockhertech.com">
                    <img
                      className="brand-logo"
                      src="/logo.png"
                      alt="Unlock Her Tech logo"
                      width={68}
                      height={68}
                      decoding="async"
                      fetchPriority="high"
                    />
                    Unlock Her Tech
                </a>
                <a href="https://www.unlockhertech.com">Back to our website ↗</a>
            </header>

            <div className="hero">
                <div className="eyebrow">Connection starts with a conversation</div>
                <h1>Make time for<br /><em>what comes next.</em></h1>
                <p>Partner with us, join our team, share your story, find support, or connect with our co-founders.</p>
                <div className="rings" aria-hidden="true" />
            </div>

            <div className="wrap">
                <nav className="tabs" aria-label="Booking categories" id="tabs">
                    {(['partnerships', 'careers', 'podcast', 'mentorship', 'meet'] as const).map(key => (
                        <button
                            key={key}
                            type="button"
                            className="tab"
                            aria-pressed={String(key === section)}
                            onClick={() => { if (!booking) { setSection(key); const first = cfg.meetingTypes.find(m => m.section === key) || null; setMeeting(first); setSelectedDate(null); setSlots([]); setConfirmation(null); } }}
                        >
                            <span className="dot" aria-hidden="true" style={{ ['--tabcolor' as any]: sectionAccent(key) }} />
                            {sectionTitle(key)}
                        </button>
                    ))}
                </nav>

                <div className="booking">
                    <aside className="sidebar">
                        <div className="small-label">Book with Unlock Her Tech</div>
                        <h2 id="sectionTitle">{sectionTitle(section)}</h2>
                        <p className="section-text" id="sectionText">{sectionText(section)}</p>
                        <div className="meeting-list" id="meetings">
                            {meetingsInSection.map(m => (
                                <button
                                    key={m.key}
                                    type="button"
                                    className="meeting"
                                    aria-pressed={String(meeting?.key === m.key)}
                                    onClick={() => handleSelectMeeting(m)}
                                >
                                    <b>{m.label}</b>
                                    <span>{m.duration} min · {m.hosts.join(' + ')}</span>
                                </button>
                            ))}
                        </div>
                        <div className="sidebar-note">
                            Your meeting link and preparation details will be included in your calendar invitation after booking.
                            <div className="decoration" aria-hidden="true"><i /><i /><i /><i /><i /></div>
                        </div>
                    </aside>

                    <main className="content" id="main">
                        {error && <div id="error" role="alert" className="error">{error}</div>}

                        {!confirmation && meeting && (
                            <div id="bookingContent">
                                <div className="step">01 Choose a time · 02 Your details</div>
                                <h2 id="meetingTitle">{meeting.label}</h2>
                                <p id="meetingSummary" className="summary">{meeting.summary}</p>
                                <div className="meta" id="meta">
                                    <span className="chip">{meeting.duration} minutes</span>
                                    <span className="chip">{meeting.hosts.join(' + ')}</span>
                                    <span className="chip">{meeting.key === 'podcast_recording' ? 'Riverside' : 'Google Meet'}</span>
                                </div>

                                <div className="choose">
                                    <div>
                                        <div className="calendar-head">
                                            <button type="button" id="prevMonth" aria-label="Previous month" onClick={() => setMonth(prevMonth(month))}>‹</button>
                                            <span id="monthTitle">{formatMonthTitle(month)}</span>
                                            <button type="button" id="nextMonth" aria-label="Next month" onClick={() => setMonth(nextMonth(month))}>›</button>
                                        </div>
                                        <div className="calendar-grid" id="calendar" aria-label="Choose a date">
                                            {renderWeekdayHeaders()}
                                            {renderCalendarDays(cfg.dates, month, meeting.days, selectedDate, d => loadDate(d))}
                                        </div>
                                        <p className="timezone">All times: London, UK · adjusts for GMT / BST</p>
                                    </div>

                                    <div>
                                        <div className="time-title" id="timeTitle">{selectedDate ? formatFullDate(selectedDate) : 'Choose a date'}</div>
                                        <div className="slots" id="slots" aria-live="polite">
                                            {selectedDate && slots.length === 0 && <div className="empty">No times available on this date. Please choose another highlighted day.</div>}
                                            {!selectedDate && <div className="empty">Select a highlighted date to see available times.</div>}
                                            {slots.map(s => (
                                                <button
                                                    key={`${s.startMs}-${s.endMs}`}
                                                    type="button"
                                                    className="slot"
                                                    aria-pressed={String(selectedSlot?.startMs === s.startMs)}
                                                    aria-label={`${formatTime(s.startMs)} to ${formatTime(s.endMs)}`}
                                                    onClick={() => setSelectedSlot(s)}
                                                >
                                                    {formatTime(s.startMs)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <form className="details" id="details" onSubmit={submit} hidden={!selectedSlot} noValidate>
                                    <div className="fields">
                                        <div>
                                            <label htmlFor="name">Your name</label>
                                            <input id="name" name="name" autoComplete="name" maxLength={100} required />
                                        </div>
                                        <div>
                                            <label htmlFor="email">Email address</label>
                                            <input id="email" name="email" type="email" autoComplete="email" maxLength={254} required />
                                        </div>
                                    </div>
                                    <div className="notes">
                                        <label htmlFor="notes">Anything you’d like us to know? <span style={{ fontWeight: 400 }}>(optional)</span></label>
                                        <textarea id="notes" name="notes" maxLength={2000} />
                                    </div>
                                    <div className="form-end">
                                        <p>We’ll use your details to arrange this meeting and send your invitation. <a href="/privacy-policy" target="_blank" rel="noopener">Privacy policy</a></p>
                                        <button type="submit" className="primary" id="submit" disabled={booking}>{booking ? 'Confirming…' : 'Confirm booking →'}</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {confirmation && (
                            <section id="confirmation" className="success" aria-live="polite">
                                <div className="check" aria-hidden="true">✓</div>
                                <div className="eyebrow">You’re booked in</div>
                                <h2>A conversation to look forward to.</h2>
                                <p>Your booking is confirmed. A calendar invitation with your meeting link and preparation details has been requested for you and the team.</p>
                                <div className="success-details">
                                    <strong>{confirmation.label}</strong>
                                    <div>{formatISODateForHuman(new Date(confirmation.startMs))}</div>
                                    <div>{formatTime(confirmation.startMs)} – {formatTime(confirmation.endMs)} · London time</div>
                                    <div>With {confirmation.hosts.join(', ')}</div>
                                </div>
                                {confirmation.link ? (
                                    <a id="join" className="primary join" target="_blank" rel="noopener" href={confirmation.link}>Open your meeting link ↗</a>
                                ) : (
                                    <p id="pending">Your Google Meet link is being prepared. It will appear in your calendar invitation.</p>
                                )}
                                <p id="confirmationContact">Need to make a change? <a href={`mailto:${cfg.contactEmail}`}>{cfg.contactEmail}</a></p>
                                <button type="button" className="tab" id="another" onClick={() => { setConfirmation(null); setSelectedDate(null); setSelectedSlot(null); requestId.current = crypto.randomUUID(); }}>Book another conversation</button>
                            </section>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

// --- helpers ---
function sectionTitle(s: MeetingType['section']) {
    switch (s) {
        case 'partnerships': return 'Partnerships';
        case 'careers': return 'Careers';
        case 'podcast': return 'Podcast';
        case 'mentorship': return 'Mentorship';
        case 'meet': return 'Meet';
    }
}
function sectionText(s: MeetingType['section']) {
    switch (s) {
        case 'partnerships': return 'Let’s create something meaningful together.';
        case 'careers': return 'Bring your skills. Be part of our volunteer team.';
        case 'podcast': return 'Your story belongs in the conversation.';
        case 'mentorship': return 'A little guidance. A world of possibilities.';
        case 'meet': return 'Connect one-to-one with our co-founders.';
    }
}
function sectionAccent(s: MeetingType['section']) {
    switch (s) {
        case 'partnerships': return 'var(--yellow)';
        case 'careers': return 'var(--pink)';
        case 'podcast': return 'var(--blue)';
        case 'mentorship': return 'var(--green)';
        case 'meet': return 'var(--coral)';
    }
}
function renderWeekdayHeaders() {
    const days = ['M','T','W','T','F','S','S'];
    return days.map(d => <div key={d} className="weekday">{d}</div>);
}
function renderCalendarDays(allDates: { value: string; weekday: number }[], month: string, allowedDays: number[], sel: string | null, onPick: (d: string) => void) {
    const first = new Date(month + '-01T12:00:00Z');
    const year = first.getUTCFullYear();
    const mo = first.getUTCMonth();
    const leading = (first.getUTCDay() + 6) % 7;
    const daysInMonth = new Date(Date.UTC(year, mo + 1, 0)).getUTCDate();
    const chunks: JSX.Element[] = [];
    for (let i = 0; i < leading; i++) chunks.push(<span key={'lead-' + i} />);
    for (let d = 1; d <= daysInMonth; d++) {
        const value = `${month}-${String(d).padStart(2, '0')}`;
        const info = allDates.find(x => x.value === value);
        const disabled = !info || !allowedDays.includes(info.weekday);
        chunks.push(
            <button
                key={value}
                type="button"
                className="day"
                disabled={disabled}
                aria-label={formatFullDate(value)}
                aria-pressed={String(value === sel)}
                onClick={() => !disabled && onPick(value)}
            >{d}</button>
        );
    }
    return chunks;
}
function prevMonth(ym: string) { const d = new Date(ym + '-01T12:00:00Z'); d.setUTCMonth(d.getUTCMonth() - 1); return d.toISOString().slice(0,7); }
function nextMonth(ym: string) { const d = new Date(ym + '-01T12:00:00Z'); d.setUTCMonth(d.getUTCMonth() + 1); return d.toISOString().slice(0,7); }
function formatMonthTitle(ym: string) { const d = new Date(ym + '-01T12:00:00Z'); return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d); }
function formatTime(ms: number) { return new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(ms)); }
function formatFullDate(value: string) { return new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(value + 'T12:00:00Z')); }
function formatISODateForHuman(d: Date) { return new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d); }
