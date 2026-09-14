import { Link } from "react-router";
import { useState } from "react";
import { HiArrowRight } from "react-icons/hi2";
import { HiTicket } from "react-icons/hi2";
import { LumaCheckoutButton } from "../../components/LumaCheckoutButton";
import { getEventExternalUrl } from "../../utils/luma";
import type { ExternalEvent } from "../../types";
import { ClaimDiscountModal } from "../../components/ClaimDiscountModal";

interface HomeFeaturedEventsProps {
  events: ExternalEvent[];
}

function getFeaturedEventCtaLabel(event: ExternalEvent): string {
  if (event.ctaLabel) return event.ctaLabel;
  if (event.discountCode) return "Get Tickets (20% Off)";
  return "View Event";
}

function renderFeaturedEventActionButton(event: ExternalEvent, externalUrl: string) {
  if (event.platform === "Luma") {
    return (
      <LumaCheckoutButton
        urlOrId={event.urlOrId}
        className="w-full px-5 py-2.5 rounded-full bg-brand-coral text-white text-xs font-bold hover:opacity-90 transition-opacity text-center cursor-pointer"
      >
        {event.ctaLabel || "Reserve Spot"}
      </LumaCheckoutButton>
    );
  }

  const isHighlighted = event.isPartner || event.discountCode;
  const styleClasses = isHighlighted
    ? "bg-brand-coral text-white hover:opacity-90 shadow-xs"
    : "border border-gray-200 text-gray-700 hover:bg-stone-50";

  return (
    <a
      href={externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-bold transition-colors ${styleClasses}`}
    >
      {getFeaturedEventCtaLabel(event)}
    </a>
  );
}

export function HomeFeaturedEvents({ events }: Readonly<HomeFeaturedEventsProps>) {
  const [discountEvent, setDiscountEvent] = useState<ExternalEvent | null>(null);
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
                      {event.isPartner || event.platform === "Conference" ? "Partner Event" : event.platform}
                    </span>
                    {event.discountPercentage && (
                      <span className="text-[0.65rem] font-bold text-brand-berry bg-pink-100/70 px-2 py-0.5 rounded-full">
                        {event.discountPercentage} Off
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    {new Date(event.date).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                  {event.discountCode && (
                    <div className="mb-5 p-3 rounded-2xl bg-pink-50/80 border border-brand-pink/50 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-[0.68rem] font-bold uppercase tracking-wider text-brand-berry flex items-center gap-1">
                          <HiTicket className="w-3.5 h-3.5 text-brand-coral" />
                          <span>{event.discountPercentage || "20%"} Partner Discount</span>
                        </span>
                        <span className="text-xs text-stone-600 font-medium block mt-0.5">
                          Exclusive promo code for community
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDiscountEvent(event)}
                        className="shrink-0 px-3 py-1.5 text-xs font-bold rounded-xl bg-brand-coral text-white hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
                      >
                        Claim Code
                      </button>
                    </div>
                  )}
                </div>

                {renderFeaturedEventActionButton(event, externalUrl)}
              </article>
            );
          })}
        </div>
        {discountEvent && (
          <ClaimDiscountModal
            isOpen={Boolean(discountEvent)}
            onClose={() => setDiscountEvent(null)}
            event={discountEvent}
          />
        )}
      </div>
    </section>
  );
}
