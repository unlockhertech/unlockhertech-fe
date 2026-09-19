import { useState, useEffect, useMemo } from "react";
import type { ExternalEvent } from "../../types";
import { getAllExternalEvents } from "../../utils/sanity";
import { getEventExternalUrl } from "../../utils/luma";

export interface PracticeSessionInfo {
  targetDate: Date;
  topic: string;
  sessionNumber: number;
  formattedDate: string;
  formattedTime: string;
  googleCalendarUrl: string;
  event?: ExternalEvent;
  rsvpUrl: string;
}

export interface PracticeCountdownState extends PracticeSessionInfo {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
  totalRemainingSeconds: number;
}

// Weekly topics curriculum loop (currently live sessions are Theoretical)
export const PRACTICE_TOPICS = [
  "She Leads Tech Theory: Sliding Window & Substring Patterns",
  "She Leads Tech Theory: Scalable System Design & Microservices",
  "She Leads Tech Theory: Trees, DFS & BFS Level-Order Traversals",
  "She Leads Tech Theory: API Architecture & Resilient Backend Design",
  "She Leads Tech Theory: Hash Maps, Fast Lookups & Caching Strategies",
  "She Leads Tech Theory: Cloud & AWS Fundamentals for Engineers",
  "She Leads Tech Theory: Dynamic Programming & Memoization",
  "She Leads Tech Theory: Database Indexing & Query Optimization",
];

// Anchor epoch: Sunday, Aug 30, 2026 at 18:30 BST (17:30 UTC)
export const PRACTICE_ANCHOR_UTC = new Date("2026-08-30T10:00:00Z").getTime();
export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
export const FOURTEEN_DAYS_MS = SEVEN_DAYS_MS;
export const SESSION_DURATION_MS = 75 * 60 * 1000; // 75 mins live duration

export function isSheLeadsTechEvent(event: ExternalEvent): boolean {
  if (event.isPartner && !event.title.toLowerCase().includes("she leads tech")) {
    return false;
  }
  const text = `${event.title ?? ""} ${event.slug ?? ""} ${event.description ?? ""}`.toLowerCase();
  return (
    text.includes("she leads tech") ||
    text.includes("practice") ||
    text.includes("theory") ||
    text.includes("review") ||
    text.includes("workshop") ||
    text.includes("leetcode") ||
    text.includes("algorithm") ||
    text.includes("coding") ||
    text.includes("system design") ||
    event.platform === "Luma"
  );
}

export function extractSessionNumber(title: string, targetTime: number): number {
  const match = /(?:session\s*#?|#)(\d+)/i.exec(title);
  if (match?.[1]) {
    const parsed = Number.parseInt(match[1], 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  const calculated = Math.floor((targetTime - PRACTICE_ANCHOR_UTC) / SEVEN_DAYS_MS) + 1;
  return Math.max(1, calculated);
}

export function buildGoogleCalendarUrl(
  title: string,
  targetDate: Date,
  description?: string,
  location?: string
): string {
  const startTimeUtc = targetDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const endDate = new Date(targetDate.getTime() + SESSION_DURATION_MS);
  const endTimeUtc = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

  const calTitle = encodeURIComponent(title || "She Leads Tech: Theory & Technical Workshop");
  const calDetails = encodeURIComponent(
    description ||
      `Join our interactive She Leads Tech session. Currently featuring instructor-led Theory workshops with step-by-step practical examples, architecture breakdowns, and Q&A.\n\nLocation: Live Online\nWebsite: https://unlockhertech.com/practices\nLuma: https://luma.com/sheleadstechpractice`
  );
  const calLocation = encodeURIComponent(location || "Online (Live Coding Workshop)");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&dates=${startTimeUtc}/${endTimeUtc}&details=${calDetails}&location=${calLocation}`;
}

export function getNextPracticeSession(
  currentTime: number = Date.now(),
  events?: ExternalEvent[]
): PracticeSessionInfo {
  if (events && events.length > 0) {
    const validEvents = events
      .filter((event) => {
        if (!event?.date) return false;
        const time = new Date(event.date).getTime();
        if (Number.isNaN(time)) return false;
        return time + SESSION_DURATION_MS >= currentTime && isSheLeadsTechEvent(event);
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const nextEvent = validEvents[0];
    if (nextEvent) {
      const targetDate = new Date(nextEvent.date);
      const targetTime = targetDate.getTime();
      const sessionNumber = extractSessionNumber(nextEvent.title, targetTime);
      const topic = nextEvent.title;

      const formattedDate = targetDate.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const formattedTime = targetDate.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });

      const eventUrl = nextEvent.urlOrId
        ? getEventExternalUrl(nextEvent.urlOrId)
        : "https://luma.com/sheleadstechpractice";
      const googleCalendarUrl = buildGoogleCalendarUrl(
        nextEvent.title,
        targetDate,
        nextEvent.description,
        eventUrl
      );

      const rsvpUrl = nextEvent.urlOrId ? getEventExternalUrl(nextEvent.urlOrId) : "/events";

      return {
        targetDate,
        topic,
        sessionNumber,
        formattedDate,
        formattedTime,
        googleCalendarUrl,
        event: nextEvent,
        rsvpUrl,
      };
    }
  }

  // Fallback to calculated schedule
  let targetTime = PRACTICE_ANCHOR_UTC;

  if (currentTime > PRACTICE_ANCHOR_UTC + SESSION_DURATION_MS) {
    const elapsed = currentTime - PRACTICE_ANCHOR_UTC;
    const intervalsPassed = Math.floor(elapsed / SEVEN_DAYS_MS);
    targetTime = PRACTICE_ANCHOR_UTC + (intervalsPassed + 1) * SEVEN_DAYS_MS;

    // If we are currently inside the active session
    const currentSessionStart = PRACTICE_ANCHOR_UTC + intervalsPassed * SEVEN_DAYS_MS;
    if (currentTime >= currentSessionStart && currentTime <= currentSessionStart + SESSION_DURATION_MS) {
      targetTime = currentSessionStart;
    }
  }

  const targetDate = new Date(targetTime);
  const sessionIndex = Math.max(
    4,
    Math.floor((targetTime - PRACTICE_ANCHOR_UTC) / SEVEN_DAYS_MS)
  );
  const sessionNumber = sessionIndex + 1;
  const topic = PRACTICE_TOPICS[sessionIndex % PRACTICE_TOPICS.length] ?? PRACTICE_TOPICS[0];

  const formattedDate = targetDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = targetDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const googleCalendarUrl = buildGoogleCalendarUrl(
    "She Leads Tech: Theory & Technical Workshop",
    targetDate
  );

  return {
    targetDate,
    topic,
    sessionNumber,
    formattedDate,
    formattedTime,
    googleCalendarUrl,
    rsvpUrl: "/events",
  };
}

export function usePracticeCountdown(
  customTargetDate?: Date,
  initialEvents?: ExternalEvent[]
): PracticeCountdownState {
  const [events, setEvents] = useState<ExternalEvent[]>(() => initialEvents ?? []);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (initialEvents && initialEvents.length > 0) {
      setEvents(initialEvents);
      return;
    }

    let isMounted = true;
    async function fetchEvents() {
      try {
        const fetched = await getAllExternalEvents(true);
        if (isMounted && fetched && fetched.length > 0) {
          setEvents(fetched);
        }
      } catch (err) {
        console.warn("Failed to fetch external events for practice countdown:", err);
      }
    }

    fetchEvents();
    return () => {
      isMounted = false;
    };
  }, [initialEvents]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sessionInfo = useMemo(() => {
    if (customTargetDate) {
      const formattedDate = customTargetDate.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const formattedTime = customTargetDate.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });
      return {
        targetDate: customTargetDate,
        topic: "She Leads Tech Theory: Live Workshop",
        sessionNumber: 1,
        formattedDate,
        formattedTime,
        googleCalendarUrl: "#",
        rsvpUrl: "/events",
      };
    }
    return getNextPracticeSession(now, events);
  }, [customTargetDate, events, now]);

  const targetTime = sessionInfo.targetDate.getTime();
  const diffMs = targetTime - now;
  const isLive = now >= targetTime && now <= targetTime + SESSION_DURATION_MS;

  const totalRemainingSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalRemainingSeconds / 86400);
  const hours = Math.floor((totalRemainingSeconds % 86400) / 3600);
  const minutes = Math.floor((totalRemainingSeconds % 3600) / 60);
  const seconds = totalRemainingSeconds % 60;

  return {
    ...sessionInfo,
    days,
    hours,
    minutes,
    seconds,
    isLive,
    totalRemainingSeconds,
  };
}
