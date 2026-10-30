import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router";
import type { ExternalEvent } from "../../types";
import { getAllExternalEvents } from "../../utils/sanity";
import { useSanityQuery } from "../../hooks/useSanityQuery";
import {
  type EventCategory,
  isEventUpcoming,
  getEventCategory,
  buildEventsJsonLd,
} from "./eventsUtils";

function resolveCategoryParam(paramValue: string | null): EventCategory {
  if (!paramValue) return "all";
  const normalized = paramValue.toLowerCase().trim();
  if (
    normalized === "practical" ||
    normalized === "coding" ||
    normalized === "practice" ||
    normalized === "practices" ||
    normalized === "workshops"
  ) {
    return "practical";
  }
  if (
    normalized === "community" ||
    normalized === "talks" ||
    normalized === "panels" ||
    normalized === "socials"
  ) {
    return "community";
  }
  return "all";
}

export function useEvents() {
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchEvents = useCallback(async (): Promise<ExternalEvent[]> => {
    return await getAllExternalEvents(true);
  }, []);

  const { data: rawEvents, loading } = useSanityQuery<ExternalEvent[]>(
    "sanity_all_external_events",
    fetchEvents
  );

  const allEvents = useMemo(() => rawEvents ?? [], [rawEvents]);

  // URL-driven state
  const tagParam = searchParams.get("tag") ?? searchParams.get("category");
  const selectedCategory: EventCategory = useMemo(
    () => resolveCategoryParam(tagParam),
    [tagParam]
  );

  const showPast = searchParams.get("past") === "true";

  const setSelectedCategory = useCallback(
    (cat: EventCategory) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (cat === "all") {
            next.delete("tag");
            next.delete("category");
          } else {
            next.set("tag", cat);
            next.delete("category");
          }
          return next;
        },
        { replace: false }
      );
    },
    [setSearchParams]
  );

  const setShowPast = useCallback(
    (pastVal: boolean) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (pastVal) {
            next.set("past", "true");
          } else {
            next.delete("past");
          }
          return next;
        },
        { replace: false }
      );
    },
    [setSearchParams]
  );

  const upcomingEvents = useMemo(() => allEvents.filter((e) => isEventUpcoming(e.date)), [allEvents]);
  const pastEvents = useMemo(() => allEvents.filter((e) => !isEventUpcoming(e.date)), [allEvents]);
  const timelineEvents = useMemo(() => (showPast ? allEvents : upcomingEvents), [showPast, allEvents, upcomingEvents]);

  const countPractical = useMemo(
    () => timelineEvents.filter((e) => getEventCategory(e) === "practical").length,
    [timelineEvents]
  );
  const countCommunity = useMemo(
    () => timelineEvents.filter((e) => getEventCategory(e) === "community").length,
    [timelineEvents]
  );

  const displayedEvents = useMemo(() => {
    return timelineEvents.filter((e) => {
      if (selectedCategory === "all") return true;
      return getEventCategory(e) === selectedCategory;
    });
  }, [timelineEvents, selectedCategory]);

  const eventJsonLd = useMemo(() => buildEventsJsonLd(upcomingEvents), [upcomingEvents]);

  return {
    allEvents,
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
  };
}
