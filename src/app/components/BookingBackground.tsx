import { BrandPatternOverlay } from './BrandPatternBackground';
import '@/app/styles/booking-background.css';

/** The homepage's decorative pattern, kept behind booking content. */
export function BookingBackground() {
  return (
    <div className="uht-booking-background" aria-hidden="true">
      <BrandPatternOverlay variant="light" />
    </div>
  );
}
