/**
 * Google Analytics & Event Tracking Utility
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Tracks a custom event in Google Analytics
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
      console.info(`[Analytics] Event tracked: ${action} (${category} - ${label || ""})`);
    }
  } catch (err) {
    console.warn("Analytics error:", err);
  }
}

/**
 * Convenience helper for PDF Resource Downloads
 */
export function trackPdfDownload(resourceTitle: string) {
  trackEvent("download_pdf", "Resource", resourceTitle);
}

/**
 * Convenience helper for Episode Play triggers
 */
export function trackEpisodePlay(episodeTitle: string) {
  trackEvent("play_episode", "AudioPlayer", episodeTitle);
}

/**
 * Convenience helper for Assessment Completion
 */
export function trackAssessmentComplete(score: number) {
  trackEvent("complete_assessment", "Assessment", "Readiness Score", score);
}

/**
 * Convenience helper for Job Board Outbound Application Clicks
 */
export function trackJobApplyClick(company: string, title: string, applyUrl: string) {
  trackEvent("click_job_apply", "JobBoard", `${company} - ${title} -> ${applyUrl}`);
}

/**
 * Convenience helper for Job Save / Bookmark Toggles
 */
export function trackJobSave(company: string, title: string, isSaved: boolean) {
  trackEvent(isSaved ? "save_job" : "unsave_job", "JobBoard", `${company} - ${title}`);
}

/**
 * Convenience helper for Job Share Actions
 */
export function trackJobShare(company: string, title: string) {
  trackEvent("share_job", "JobBoard", `${company} - ${title}`);
}

