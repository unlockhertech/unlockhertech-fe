import { useEffect, useState } from "react";
import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";
import type { ExternalEvent } from "../types";
import { useMetaData } from "../hooks/useMetaData";
import { getAllExternalEvents } from "../utils/markdown";
import { getEventExternalUrl } from "../utils/luma";
import { LumaCheckoutButton } from "../components/LumaCheckoutButton";

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

      <main className="max-w-7xl mx-auto px-4">
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
