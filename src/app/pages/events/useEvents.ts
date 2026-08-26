import { useState, useEffect, useMemo } from "react";
import type { ExternalEvent } from "../../types";
import { getAllExternalEvents } from "../../utils/sanity";
import {
  type EventCategory,
  isEventUpcoming,
  getEventCategory,
  buildEventsJsonLd,
} from "./eventsUtils";

export function useEvents() {
  const [allEvents, setAllEvents] = useState<ExternalEvent[]>([]);
  const [showPast, setShowPast] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const eventList = await getAllExternalEvents(true);
        setAllEvents(eventList);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

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
