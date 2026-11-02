// Centralized feature flags for conditional UI/routes
// Defaults: Only Interview path is enabled by default. Others require explicit opt-in.

export const enablePathsFrontend = import.meta.env.VITE_ENABLE_PATHS_FRONTEND === 'true';
export const enablePathsBackend = import.meta.env.VITE_ENABLE_PATHS_BACKEND === 'true';
export const enablePathsMobile = import.meta.env.VITE_ENABLE_PATHS_MOBILE === 'true';
// Interview is live by default unless explicitly disabled
export const enablePathsInterview = import.meta.env.VITE_ENABLE_PATHS_INTERVIEW !== 'false';

// Discord launch announcement banner & homepage spotlight flag
export const isDiscordAnnouncementEnabled = (): boolean =>
  import.meta.env.VITE_ENABLE_DISCORD_ANNOUNCEMENT === 'true';
export const enableDiscordAnnouncement = isDiscordAnnouncementEnabled();

export function isPathEnabled(slug: string): boolean {
  switch (slug) {
    case 'frontend':
      return enablePathsFrontend;
    case 'backend':
      return enablePathsBackend;
    case 'mobile':
      return enablePathsMobile;
    case 'interview':
      return enablePathsInterview;
    default:
      return false;
  }
}
