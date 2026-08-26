import { useState, useEffect, useMemo } from "react";

export interface PlaybookCountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLaunched: boolean;
  targetDate: Date;
  formattedTargetDate: string;
}

// Playbook Library Launch: September 7, 2026 at 09:00 BST (08:00 UTC)
export const PLAYBOOK_LAUNCH_UTC = new Date("2026-09-07T08:00:00Z").getTime();
export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function getNextPlaybookDropTime(currentTime: number = Date.now()): number {
  if (currentTime < PLAYBOOK_LAUNCH_UTC) {
    return PLAYBOOK_LAUNCH_UTC;
  }
  const elapsed = currentTime - PLAYBOOK_LAUNCH_UTC;
  const intervals = Math.floor(elapsed / SEVEN_DAYS_MS);
  return PLAYBOOK_LAUNCH_UTC + (intervals + 1) * SEVEN_DAYS_MS;
}

export function usePlaybookCountdown(): PlaybookCountdownState {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const targetTimestamp = useMemo(() => getNextPlaybookDropTime(now), [now]);
  const targetDate = useMemo(() => new Date(targetTimestamp), [targetTimestamp]);

  const diffMs = targetTimestamp - now;
  const isLaunched = now >= PLAYBOOK_LAUNCH_UTC;

  const totalRemainingSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalRemainingSeconds / 86400);
  const hours = Math.floor((totalRemainingSeconds % 86400) / 3600);
  const minutes = Math.floor((totalRemainingSeconds % 3600) / 60);
  const seconds = totalRemainingSeconds % 60;

  const formattedTargetDate = targetDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return {
    days,
    hours,
    minutes,
    seconds,
    isLaunched,
    targetDate,
    formattedTargetDate,
  };
}
