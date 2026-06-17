/**
 * Formats a duration in seconds into a "m:ss" string.
 * @param s - Duration in seconds.
 * @returns Formatted time string (e.g., "3:45").
 */
export const formatTime = (s: number): string => {
  if (!s || Number.isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const seconds = Math.floor(s % 60);
  return `${m}:${seconds.toString().padStart(2, "0")}`;
};
