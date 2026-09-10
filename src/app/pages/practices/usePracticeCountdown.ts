import { useState, useEffect, useMemo } from "react";

export interface PracticeSessionInfo {
  targetDate: Date;
  topic: string;
  sessionNumber: number;
  formattedDate: string;
  formattedTime: string;
  googleCalendarUrl: string;
}

export interface PracticeCountdownState extends PracticeSessionInfo {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
  totalRemainingSeconds: number;
}

// Fortnightly topics curriculum loop (currently live sessions are Theoretical)
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
export const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;
export const SESSION_DURATION_MS = 75 * 60 * 1000; // 75 mins live duration

export function getNextPracticeSession(currentTime: number = Date.now()): PracticeSessionInfo {
  let targetTime = PRACTICE_ANCHOR_UTC;

  if (currentTime > PRACTICE_ANCHOR_UTC + SESSION_DURATION_MS) {
    const elapsed = currentTime - PRACTICE_ANCHOR_UTC;
    const intervalsPassed = Math.floor(elapsed / FOURTEEN_DAYS_MS);
    targetTime = PRACTICE_ANCHOR_UTC + (intervalsPassed + 1) * FOURTEEN_DAYS_MS;

    // If we are currently inside the active session
    const currentSessionStart = PRACTICE_ANCHOR_UTC + intervalsPassed * FOURTEEN_DAYS_MS;
    if (currentTime >= currentSessionStart && currentTime <= currentSessionStart + SESSION_DURATION_MS) {
      targetTime = currentSessionStart;
    }
  }

  const targetDate = new Date(targetTime);
  const sessionIndex = Math.max(
    4,
    Math.floor((targetTime - PRACTICE_ANCHOR_UTC) / FOURTEEN_DAYS_MS)
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

  // Build Google Calendar Link
  const startTimeUtc = targetDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const endDate = new Date(targetDate.getTime() + SESSION_DURATION_MS);
  const endTimeUtc = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");

  const calTitle = encodeURIComponent("She Leads Tech: Theory & Technical Workshop");
  const calDetails = encodeURIComponent(
    `Join our fortnightly interactive She Leads Tech session. Currently featuring instructor-led Theory workshops with step-by-step practical examples, architecture breakdowns, and Q&A.\n\nLocation: Live Online\nWebsite: https://unlockhertech.com/practices\nLuma: https://luma.com/sheleadstechpractice`
  );
  const calLocation = encodeURIComponent("Online (Live Coding Workshop)");
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&dates=${startTimeUtc}/${endTimeUtc}&details=${calDetails}&location=${calLocation}`;

  return {
    targetDate,
    topic,
    sessionNumber,
    formattedDate,
    formattedTime,
    googleCalendarUrl,
  };
}

export function usePracticeCountdown(customTargetDate?: Date): PracticeCountdownState {
  const [now, setNow] = useState(() => Date.now());

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
      };
    }
    return getNextPracticeSession(now);
  }, [customTargetDate, now]);

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
