import { useState } from "react";
import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";
import type { ExternalEvent } from "../../types";
import { getEventExternalUrl } from "../../utils/luma";
import { LumaCheckoutButton } from "../../components/LumaCheckoutButton";
import { ClaimDiscountModal } from "../../components/ClaimDiscountModal";
import { formatEventDate, isEventUpcoming, getEventCategory } from "./eventsUtils";

interface EventCardProps {
  event: ExternalEvent;
}

function getEventEmoji(isPartner: boolean, category: string): string {
  if (isPartner) return "🤝";
  if (category === "practical") return "💻";
  return "🎙️";
}

function getCategoryBadgeClasses(isPartner: boolean, category: string): string {
  if (isPartner) return "bg-purple-50 text-purple-700 border border-purple-200/60";
  if (category === "practical") return "bg-blue-50 text-brand-blue";
  return "bg-pink-50 text-brand-coral";
}

function getCategoryBadgeLabel(isPartner: boolean, category: string): string {
  if (isPartner) return "🤝 Partner Conference";
  if (category === "practical") return "💻 Practical / Coding";
  return "🎙️ Talk / Social";
}

interface EventImageHeaderProps {
  image?: string;
  title: string;
  isConferenceOrPartner: boolean;
  category: string;
}

function EventImageHeader({ image, title, isConferenceOrPartner, category }: Readonly<EventImageHeaderProps>) {
  if (image) {
    const isSpecialVisual = image.includes(".svg") || image.includes("lockup") || isConferenceOrPartner;
    const containerClasses = isSpecialVisual
      ? "bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 p-6 border-b border-slate-800"
      : "bg-gray-100";
    const imageClasses = isSpecialVisual
      ? "h-auto max-h-full object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
      : "h-full object-cover";

    return (
      <div className={`h-44 w-full flex items-center justify-center overflow-hidden ${containerClasses}`}>
        <img
          src={image}
          alt={title}
          className={`w-full ${imageClasses}`}
          loading="lazy"
        />
      </div>
    );
  }

  const partnerLabel = isConferenceOrPartner ? "Community Partner Event" : "Unlock Her Tech Event";

  return (
    <div className="h-44 bg-linear-to-br from-brand-coral/10 via-brand-pink/15 to-brand-berry/10 flex flex-col items-center justify-center text-center p-6">
      <span className="text-2xl mb-1">
        {getEventEmoji(isConferenceOrPartner, category)}
      </span>
      <span className="text-brand-coral font-bold text-sm tracking-wide uppercase">
        {partnerLabel}
      </span>
    </div>
  );
}

export function EventCard({ event }: Readonly<EventCardProps>) {
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const externalUrl = getEventExternalUrl(event.urlOrId);
  const isUpcoming = isEventUpcoming(event.date);
  const category = getEventCategory(event);

  const isConferenceOrPartner = event.isPartner || event.platform === "Conference";
  const ctaText = event.ctaLabel || "Get tickets";

  const renderCtaButton = () => {
    if (!isUpcoming) {
      return (
        <div className="mt-auto text-xs font-semibold text-gray-400 py-2 text-center bg-gray-100 rounded-full">
          Session Concluded
        </div>
      );
    }

    if (event.platform === "Luma") {
      return (
        <LumaCheckoutButton
          urlOrId={event.urlOrId}
          className="mt-auto px-5 py-2.5 rounded-full bg-brand-coral text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
        >
          {ctaText}
        </LumaCheckoutButton>
      );
    }

    if (event.discountCode) {
      return (
        <div className="mt-auto flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => setIsDiscountModalOpen(true)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-brand-coral text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
          >
            <span>Claim {event.discountPercentage || "20%"} Off</span>
          </button>
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-full border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
          >
            <span>Tickets</span>
            <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5" />
          </a>
        </div>
      );
    }

    return (
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
      >
        <span>{ctaText}</span>
        <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
      </a>
    );
  };

  return (
    <>
      <article
        className={`bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs flex flex-col hover:shadow-md transition-shadow ${
          !isUpcoming ? "opacity-70 bg-gray-50" : ""
        }`}
      >
        <EventImageHeader
          image={event.image}
          title={event.title}
          isConferenceOrPartner={isConferenceOrPartner}
          category={category}
        />

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span
              className={`text-[0.7rem] uppercase font-extrabold px-2.5 py-1 rounded-full ${getCategoryBadgeClasses(
                isConferenceOrPartner,
                category
              )}`}
            >
              {getCategoryBadgeLabel(isConferenceOrPartner, category)}
            </span>

            {!isUpcoming ? (
              <span className="text-[0.65rem] uppercase font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                Past
              </span>
            ) : (
              <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                {event.platform}
              </span>
            )}
          </div>

          <h3 className="text-xl font-extrabold text-gray-900 mb-2 leading-snug">{event.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{formatEventDate(event.date)}</p>

          {event.description && (
            <p className="text-xs text-gray-600 mb-4 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          )}

          {event.discountCode && (
            <div className="mb-5 p-3.5 rounded-2xl bg-pink-50/80 border border-brand-pink/50 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[0.68rem] font-bold uppercase tracking-wider text-brand-berry block">
                  🎟️ {event.discountPercentage || "20%"} Partner Discount
                </span>
                <span className="text-xs text-stone-600 font-medium block mt-0.5">
                  Exclusive promo code for community
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsDiscountModalOpen(true)}
                className="shrink-0 px-3 py-1.5 text-xs font-bold rounded-xl bg-brand-coral text-white hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
              >
                Claim Code
              </button>
            </div>
          )}

          {renderCtaButton()}
        </div>
      </article>

      {event.discountCode && (
        <ClaimDiscountModal
          isOpen={isDiscountModalOpen}
          onClose={() => setIsDiscountModalOpen(false)}
          event={event}
        />
      )}
    </>
  );
}


