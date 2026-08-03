import { useEffect, useState } from "react";
import { Link } from "react-router";
import { HiOutlineArrowTopRightOnSquare, HiSparkles, HiArrowRight } from "react-icons/hi2";
import type { ExternalEvent } from "../types";
import { useMetaData } from "../hooks/useMetaData";
import { getAllExternalEvents } from "../utils/sanity";
import { getEventExternalUrl } from "../utils/luma";
import { LumaCheckoutButton } from "../components/LumaCheckoutButton";
import { imgSheLeadsTech } from "../data";

function formatEventDate(dateValue: string): string {
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return "Date to be announced";

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

export function EventsPage() {
  useMetaData("Events", "Join upcoming Unlock Her Tech events and secure your spot in seconds.");

  const [events, setEvents] = useState<ExternalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const eventList = await getAllExternalEvents();
        setEvents(eventList);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-coral mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      <header className="bg-white border-b border-gray-100 mb-12">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Upcoming <span className="text-brand-coral">Events</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Book your place through a smooth in-page checkout and stay part of the Unlock Her Tech community.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Featured She Leads Tech Practices Banner */}
        <section className="bg-linear-to-br from-[#8a1f55] via-[#b42970] to-[#e8563a] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 overflow-hidden relative">
          {/* Background glow accents */}
          <div className="absolute -top-24 -left-20 w-80 h-80 bg-brand-pink/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-brand-blue/30 rounded-full blur-3xl pointer-events-none" />

          <div className="grid md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-4 flex justify-center">
              <div className="relative max-w-xs w-full">
                <div className="absolute -inset-1 bg-linear-to-r from-brand-pink via-brand-yellow to-brand-blue rounded-2xl blur-sm opacity-80" />
                <img
                  src={imgSheLeadsTech}
                  alt="She Leads Tech Practices"
                  className="relative w-full h-auto rounded-2xl border border-white/20 shadow-md object-cover aspect-video bg-white"
                />
              </div>
            </div>
            <div className="md:col-span-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-3">
                <HiSparkles className="w-3.5 h-3.5 text-brand-yellow" /> Community Initiative
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-white">
                She Leads Tech Practices: LeetCode & Problem Solving Series
              </h2>
              <p className="text-white/90 text-sm leading-relaxed mb-6 font-medium">
                Ongoing series held every two weeks. Join live interactive sessions to solve problems together, pair program, and master technical interview patterns in a supportive environment.
              </p>
              <Link
                to="/practices"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-brand-coral hover:bg-white/90 font-bold text-sm transition-all shadow-md hover:-translate-y-0.5"
              >
                Learn More & View Details <HiArrowRight className="w-4 h-4 text-brand-coral" />
              </Link>
            </div>
          </div>
        </section>
        {events.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No events published yet</h3>
            <p className="text-gray-600">Please check back soon for new sessions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const externalUrl = getEventExternalUrl(event.urlOrId);

              return (
                <article key={event.slug} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="h-44 w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-44 bg-brand-coral/10 flex items-center justify-center text-brand-coral font-semibold">Event</div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-xs uppercase tracking-wider text-brand-coral font-bold mb-2">{event.platform}</p>
                    <h2 className="text-xl font-extrabold text-gray-900 mb-3">{event.title}</h2>
                    <p className="text-sm text-gray-600 mb-6">{formatEventDate(event.date)}</p>

                    {event.platform === "Luma" ? (
                      <LumaCheckoutButton
                        urlOrId={event.urlOrId}
                        className="mt-auto px-5 py-2.5 rounded-full bg-brand-coral text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        Get tickets
                      </LumaCheckoutButton>
                    ) : (
                      <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Open event <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
