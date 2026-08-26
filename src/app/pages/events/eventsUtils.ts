import type { ExternalEvent } from "../../types";
import { getEventExternalUrl } from "../../utils/luma";

export type EventCategory = "all" | "practical" | "community";

export function formatEventDate(dateValue: string): string {
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

export function isEventUpcoming(dateValue: string): boolean {
  const eventTime = new Date(dateValue).getTime();
  if (Number.isNaN(eventTime)) return true;
  const THREE_HOURS_MS = 3 * 60 * 60 * 1000; // Keep card visible for 3 hours after start time
  return eventTime + THREE_HOURS_MS >= Date.now();
}

export function getEventCategory(event: ExternalEvent): "practical" | "community" {
  const text = (event.title + " " + (event.slug || "")).toLowerCase();
  if (
    text.includes("leetcode") ||
    text.includes("practice") ||
    text.includes("coding") ||
    text.includes("workshop") ||
    text.includes("algorithm") ||
    text.includes("mentor") ||
    text.includes("technical") ||
    text.includes("engineer") ||
    text.includes("she leads tech")
  ) {
    return "practical";
  }
  return "community";
}

export function buildEventsJsonLd(upcomingEvents: ExternalEvent[]) {
  if (upcomingEvents.length === 0) return undefined;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": upcomingEvents.map((e, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "EducationEvent",
        "name": e.title,
        "startDate": e.date,
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
        "location": {
          "@type": "VirtualLocation",
          "url": getEventExternalUrl(e.urlOrId),
        },
        "image": e.image || "https://unlockhertech.com/logo.png",
        "description": `${e.title} hosted by Unlock Her Tech`,
        "organizer": {
          "@type": "Organization",
          "name": "Unlock Her Tech",
          "url": "https://unlockhertech.com",
        },
        "offers": {
          "@type": "Offer",
          "url": getEventExternalUrl(e.urlOrId),
          "price": "0",
          "priceCurrency": "GBP",
          "availability": "https://schema.org/InStock",
        },
      },
    })),
  };
}
