import { Link } from "react-router";
import { HiClock, HiArrowRight } from "react-icons/hi2";
import { useMetaData } from "../hooks/useMetaData";
import { SubscribeCTA } from "../components/SubscribeCTA";
import { imgSheLeadsTech, IMG_AUDIO_EQ } from "../data";
import { useEvents } from "./events/useEvents";
import { EventsHeroHeader } from "./events/EventsHeroHeader";
import { EventsFeaturedBanner } from "./events/EventsFeaturedBanner";
import { EventsFilterBar } from "./events/EventsFilterBar";
import { EventCard } from "./events/EventCard";
import { BrandPatternOverlay } from "../components/BrandPatternBackground";

interface EventsEmptyStateProps {
  onClearFilter: () => void;
}

function EventsEmptyState({ onClearFilter }: Readonly<EventsEmptyStateProps>) {
  return (
    <div className="py-20 text-center bg-white rounded-3xl border border-gray-200 shadow-xs">
      <div className="w-12 h-12 rounded-full bg-brand-pink/20 text-brand-coral flex items-center justify-center mx-auto mb-4">
        <HiClock className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">No events match this filter</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Check back soon for new sessions or explore our ongoing fortnightly She Leads Tech series!
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={onClearFilter}
          className="px-6 py-2.5 rounded-full bg-stone-200 text-gray-800 font-bold text-sm hover:bg-stone-300 transition-colors cursor-pointer"
        >
          Clear filter
        </button>
        <Link
          to="/practices"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-coral text-white font-bold text-sm hover:opacity-90 transition-opacity"
        >
          <span>Explore She Leads Tech</span>
          <HiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

interface EventsGridSectionProps {
  showPast: boolean;
  displayedEvents: ReturnType<typeof useEvents>["displayedEvents"];
}

function EventsGridSection({ showPast, displayedEvents }: Readonly<EventsGridSectionProps>) {
  const sectionHeading = showPast ? "All Events" : "Upcoming Sessions";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{sectionHeading}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedEvents.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>
    </div>
  );
}

export function EventsPage() {
  const {
    upcomingEvents,
    pastEvents,
    timelineEvents,
    displayedEvents,
    showPast,
    setShowPast,
    selectedCategory,
    setSelectedCategory,
    loading,
    countPractical,
    countCommunity,
    eventJsonLd,
  } = useEvents();

  useMetaData(
    "Community Events & Coding Workshops | Unlock Her Tech",
    "Join upcoming Unlock Her Tech events, hands-on LeetCode practices, technical workshops, and inspiring community sessions for women and allies in tech.",
    undefined,
    {
      image: imgSheLeadsTech,
      type: "website",
      jsonLd: eventJsonLd,
    }
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-coral border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-500">Loading community events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── 1. Hero Header ──────────────────────────────────────────────── */}
      <EventsHeroHeader totalCount={timelineEvents.length} />

      {/* ── 2. Featured Spotlight (Next Upcoming) ────────────────────────── */}
      {upcomingEvents[0] && <EventsFeaturedBanner event={upcomingEvents[0]} />}

      {/* ── 3. Filter Navigation Bar ────────────────────────────────────── */}
      <div className="relative bg-stone-50 border-t border-gray-200">
        <BrandPatternOverlay variant="watermark" />
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EventsFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          countAll={timelineEvents.length}
          countPractical={countPractical}
          countCommunity={countCommunity}
          pastCount={pastEvents.length}
          showPast={showPast}
          onToggleShowPast={() => setShowPast(!showPast)}
        />

        {/* ── 4. Events Grid ──────────────────────────────────────────────── */}
        {displayedEvents.length === 0 ? (
          <EventsEmptyState onClearFilter={() => setSelectedCategory("all")} />
        ) : (
          <EventsGridSection showPast={showPast} displayedEvents={displayedEvents} />
        )}
        </main>
      </div>

      {/* ── 5. Subscribe CTA ──────────────────────────────────────────────── */}
      <SubscribeCTA
        bgImage={IMG_AUDIO_EQ}
        title="Stay Connected With Our Events"
        subtitle="Never miss an upcoming LeetCode practice, guest panel, or community meetup."
      />
    </div>
  );
}
