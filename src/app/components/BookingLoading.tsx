import '@/app/styles/booking-loader.css';

/** Shared illustration for loading booking options and recovering from a failed load. */
export function BookingLoading({ failed = false }: Readonly<{ failed?: boolean }>) {
  return (
    <div className="uht-loading-screen">
      <div
        className={failed ? 'uht-loader uht-error-state' : 'uht-loader uht-moving uht-page-loader'}
        role={failed ? 'alert' : 'status'}
        aria-live={failed ? 'assertive' : 'polite'}
      >
    <div className="uht-brand">UNLOCK HER TECH <span>✳</span></div>
    <div className="uht-scene" aria-hidden="true">
      <div className="uht-traveller">
<div className="uht-walker uht-walker-0"><svg className="uht-person" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="151" rx="28" ry="4" fill="currentColor" opacity=".12"/>
          <g className="uht-body" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M38 110L36 142L27 146Q25 150 39 149L46 115" fill="var(--uht-paper)" className="uht-leg uht-leg-a"/>
            <path d="M51 114L59 143L68 146Q73 151 58 149L43 119" fill="var(--uht-paper)" className="uht-leg uht-leg-b"/>
            <path d="M36 65Q26 70 25 99L28 109Q32 111 33 104L33 87" fill="var(--uht-skin)"/>
            <path d="M61 66Q68 78 67 94L79 88Q85 88 82 94L66 104Q60 105 58 89" fill="var(--uht-skin)" className="uht-arm"/>
            <path d="M37 64L56 64L60 83L71 117Q48 124 25 117L33 83Z" fill="var(--uht-coral)"/>
            <path d="M42 55L41 65Q48 71 53 64L52 55" fill="var(--uht-skin)"/>
            <path d="M33 30Q12 16 15 42Q18 57 8 68Q31 69 28 45Z" fill="var(--uht-ink)"/>
            <path d="M31 37Q26 19 45 20Q68 17 66 44L62 54L32 51Z" fill="var(--uht-ink)"/>
            <path d="M33 36Q44 38 50 29Q53 38 61 37L61 46Q60 61 47 61Q34 60 33 46Z" fill="var(--uht-skin)"/>
            <path d="M40 44V45M54 44V45M44 53Q48 56 52 52"/>
            <path d="M29 29L33 34" stroke="var(--uht-blue)" strokeWidth="5"/>
          </g>
        </svg></div>
<div className="uht-walker uht-walker-2"><svg className="uht-person" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="151" rx="28" ry="4" fill="currentColor" opacity=".12"/>
          <g className="uht-body" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M38 110L36 142L27 146Q25 150 39 149L46 115" fill="var(--uht-paper)" className="uht-leg uht-leg-a"/>
            <path d="M51 114L59 143L68 146Q73 151 58 149L43 119" fill="var(--uht-paper)" className="uht-leg uht-leg-b"/>
            <path d="M36 65Q26 70 25 99L28 109Q32 111 33 104L33 87" fill="var(--uht-skin)"/>
            <path d="M61 66Q68 78 67 94L79 88Q85 88 82 94L66 104Q60 105 58 89" fill="var(--uht-skin)" className="uht-arm"/>
            <path d="M37 64L56 64Q64 72 60 108Q48 114 33 108L33 77Z" fill="var(--uht-lime)"/>
            <path d="M42 55L41 65Q48 71 53 64L52 55" fill="var(--uht-skin)"/>
            <circle cx="48" cy="19" r="12" fill="var(--uht-yellow)"/>
            <path d="M31 37Q26 19 45 20Q68 17 66 44L62 54L32 51Z" fill="var(--uht-yellow)"/>
            <path d="M33 36Q44 38 50 29Q53 38 61 37L61 46Q60 61 47 61Q34 60 33 46Z" fill="var(--uht-skin)"/>
            <path d="M40 44V45M54 44V45M44 53Q48 56 52 52"/>
            <path d="M39 18Q47 13 55 19" stroke="var(--uht-lime)"/>
          </g>
        </svg></div>
<div className="uht-walker uht-walker-1"><svg className="uht-person" viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="151" rx="28" ry="4" fill="currentColor" opacity=".12"/>
          <g className="uht-body" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M38 110L36 142L27 146Q25 150 39 149L46 115" fill="var(--uht-skin)" className="uht-leg uht-leg-a"/>
            <path d="M51 114L59 143L68 146Q73 151 58 149L43 119" fill="var(--uht-skin)" className="uht-leg uht-leg-b"/>
            <path d="M36 65Q26 70 25 99L28 109Q32 111 33 104L33 87" fill="var(--uht-skin)"/>
            <path d="M61 66Q68 78 67 94L79 88Q85 88 82 94L66 104Q60 105 58 89" fill="var(--uht-skin)" className="uht-arm"/>
            <path d="M37 64L56 64L60 83L71 117Q48 124 25 117L33 83Z" fill="var(--uht-pink)"/>
            <path d="M42 55L41 65Q48 71 53 64L52 55" fill="var(--uht-skin)"/>

            <path d="M24 46Q15 40 22 32Q18 22 29 20Q31 10 41 15Q49 7 56 15Q67 11 70 22Q81 25 75 35Q83 44 73 50Q73 62 62 61L33 61Q22 62 24 46Z" fill="var(--uht-ink)"/>
            <path d="M33 36Q44 38 50 29Q53 38 61 37L61 46Q60 61 47 61Q34 60 33 46Z" fill="var(--uht-skin)"/>
            <path d="M40 44V45M54 44V45M44 53Q48 56 52 52"/>
            <path d="M31 33Q43 20 61 31" stroke="var(--uht-coral)" strokeWidth="4"/>
            <path d="M60 29Q48 17 49 29Q51 35 60 31Q72 38 72 28Q70 23 60 29Z" fill="var(--uht-coral)"/>
          </g>
        </svg></div>

      </div>

    </div>
    <div className="uht-heading"><h2>{failed ? 'Let’s try that again' : 'Unlocking Booking Options'}</h2></div>
    {failed ? (
      <div className="uht-recovery">
        <p>We couldn’t load your booking options. Refresh the page to try again.</p>
        <button type="button" className="uht-refresh" onClick={() => window.location.reload()}>
          Refresh booking options
        </button>
        <p className="uht-recovery-note">Still having trouble? Please try again in a few minutes.</p>
      </div>
    ) : (
      <div className="uht-track" aria-hidden="true"><div className="uht-fill"></div></div>
    )}
      </div>
    </div>
  );
}
