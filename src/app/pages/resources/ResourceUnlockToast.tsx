import { useEffect } from "react";
import { HiCheckCircle, HiXMark } from "react-icons/hi2";

interface ResourceUnlockToastProps {
  email: string | null;
  onDismiss: () => void;
}

const AUTO_DISMISS_MS = 6000;

/**
 * Lightweight confirmation toast shown right after a user unlocks access.
 * Reinforces that identity/access is active (backed by the Brevo-confirmed
 * email) without requiring the user to re-check the hero banner.
 */
export function ResourceUnlockToast({ email, onDismiss }: Readonly<ResourceUnlockToastProps>) {
  useEffect(() => {
    if (!email) return undefined;
    const timer = window.setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [email, onDismiss]);

  if (!email) return null;

  return (
    <div className="fixed bottom-5 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3 bg-stone-900 text-white rounded-2xl shadow-2xl px-5 py-3.5 max-w-md w-full sm:w-auto motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 duration-300">
        <HiCheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
        <p className="text-sm leading-snug">
          Access granted for <strong>{email}</strong>. All eligible guides are now unlocked.
        </p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss unlock confirmation"
          className="ml-auto shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
        >
          <HiXMark className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
