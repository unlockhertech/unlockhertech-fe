import { Link } from "react-router";
import { HiArrowRight } from "react-icons/hi2";
import { LumaCheckoutButton } from "../../components/LumaCheckoutButton";
import { getEventExternalUrl } from "../../utils/luma";
import type { ExternalEvent } from "../../types";

interface HomeFeaturedEventsProps {
  events: ExternalEvent[];
}

export function HomeFeaturedEvents({ events }: HomeFeaturedEventsProps) {
  if (events.length === 0) return null;

  return (
    <section className="py-20 bg-stone-50 border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs mb-2 uppercase tracking-widest text-brand-coral font-bold">Upcoming Events</p>
            <h2 className="text-3xl font-black text-gray-900">Join Us Live</h2>
          </div>
          <Link
            to="/events"
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-brand-coral hover:underline"
          >
            View all events <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event) => {
            const externalUrl = getEventExternalUrl(event.urlOrId);

            return (
              <article
                key={event.slug}
                className="rounded-3xl border border-gray-200 bg-white p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[0.7rem] uppercase tracking-wider text-brand-coral font-extrabold px-2.5 py-0.5 rounded-full bg-pink-50">
                      {event.platform}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-xs text-gray-500 mb-6">
                    {new Date(event.date).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>

                {event.platform === "Luma" ? (
                  <LumaCheckoutButton
                    urlOrId={event.urlOrId}
                    className="w-full px-5 py-2.5 rounded-full bg-brand-coral text-white text-xs font-bold hover:opacity-90 transition-opacity text-center"
                  >
                    Reserve Spot
                  </LumaCheckoutButton>
                ) : (
                  <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 text-xs font-bold hover:bg-stone-50 transition-colors"
                  >
                    View Event
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
