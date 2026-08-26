import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";
import type { ExternalEvent } from "../../types";
import { getEventExternalUrl } from "../../utils/luma";
import { LumaCheckoutButton } from "../../components/LumaCheckoutButton";
import { formatEventDate, isEventUpcoming, getEventCategory } from "./eventsUtils";

interface EventCardProps {
  event: ExternalEvent;
}

export function EventCard({ event }: EventCardProps) {
  const externalUrl = getEventExternalUrl(event.urlOrId);
  const isUpcoming = isEventUpcoming(event.date);
  const category = getEventCategory(event);

  return (
    <article
      className={`bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs flex flex-col hover:shadow-md transition-shadow ${
        !isUpcoming ? "opacity-70 bg-gray-50" : ""
      }`}
    >
      {event.image ? (
        <img src={event.image} alt={event.title} className="h-44 w-full object-cover" loading="lazy" />
      ) : (
        <div className="h-44 bg-brand-coral/10 flex items-center justify-center text-brand-coral font-semibold">
          Event
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[0.7rem] uppercase font-extrabold px-2.5 py-1 rounded-full ${
              category === "practical"
                ? "bg-blue-50 text-brand-blue"
                : "bg-pink-50 text-brand-coral"
            }`}
          >
            {category === "practical" ? "💻 Practical / Coding" : "🎙️ Talk / Social"}
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

        <h3 className="text-xl font-extrabold text-gray-900 mb-3">{event.title}</h3>
        <p className="text-sm text-gray-600 mb-6">{formatEventDate(event.date)}</p>

        {isUpcoming ? (
          event.platform === "Luma" ? (
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
              <span>Open event</span>
              <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
            </a>
          )
        ) : (
          <div className="mt-auto text-xs font-semibold text-gray-400 py-2 text-center bg-gray-100 rounded-full">
            Session Concluded
          </div>
        )}
      </div>
    </article>
  );
}
