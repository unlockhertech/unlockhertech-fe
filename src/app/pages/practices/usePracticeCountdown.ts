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

// Fortnightly topics curriculum loop
export const PRACTICE_TOPICS = [
  "Two Pointers & In-Place Array Transformations",
  "Sliding Window & Substring Optimization",
  "Trees: DFS, BFS Level Order Traversal & Validation",
  "Hash Maps, Frequency Counters & Fast Lookups",
  "Graphs, Island Counts & Matrix Traversals",
  "Dynamic Programming, Memoization & Recurrence Relations",
  "Binary Search & Monotonic Condition Optimization",
  "Stacks, Queues & Monotonic Frameworks",
];

// Anchor epoch: Thursday, Aug 27, 2026 at 18:30 BST (17:30 UTC)
export const PRACTICE_ANCHOR_UTC = new Date("2026-08-27T17:30:00Z").getTime();
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
    0,
    Math.floor((targetTime - PRACTICE_ANCHOR_UTC) / FOURTEEN_DAYS_MS)
  );
  const sessionNumber = sessionIndex + 1;
  const topic = PRACTICE_TOPICS[sessionIndex % PRACTICE_TOPICS.length];

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

  const calTitle = encodeURIComponent(`She Leads Tech Practice: ${topic}`);
  const calDetails = encodeURIComponent(
    `Join our fortnightly interactive live problem-solving session for women & non-binary developers.\n\nTopic: ${topic}\nLocation: Live Online\nWebsite: https://unlockhertech.com/practices`
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
        topic: "Algorithmic Pattern Live Practice",
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
