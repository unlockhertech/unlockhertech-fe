import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { Link } from "react-router";
import { HiXMark, HiCheckCircle, HiEnvelope, HiShieldCheck, HiBell, HiSparkles } from "react-icons/hi2";
import type { Resource } from "../types";

interface DownloadResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
  isEarlyAccessMode?: boolean;
  onSuccessUnlock?: (email: string) => void;
}

interface DownloadLeadFormProps {
  isCommunityGuide: boolean;
  modalTitle: string;
  resourceTitle: string;
  fullName: string;
  email: string;
  discordHandle: string;
  roleInterest: string;
  error: string;
  isSubmitting: boolean;
  onFullNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onDiscordHandleChange: (val: string) => void;
  onRoleInterestChange: (val: string) => void;
  onClose: () => void;
  onSubmit: (e: SyntheticEvent) => void;
}

function renderSubmitButtonContent(isSubmitting: boolean, isCommunityGuide: boolean) {
  if (isSubmitting) {
    return <span>Unlocking...</span>;
  }
  if (isCommunityGuide) {
    return (
      <>
        <HiShieldCheck className="w-5 h-5 text-brand-yellow" />
        <span>Join Community & Unlock Guides</span>
      </>
    );
  }
  return (
    <>
      <HiBell className="w-5 h-5" />
      <span>Download Free PDF Guide</span>
    </>
  );
}

function DownloadLeadForm({
  isCommunityGuide,
  modalTitle,
  resourceTitle,
  fullName,
  email,
  discordHandle,
  roleInterest,
  error,
  isSubmitting,
  onFullNameChange,
  onEmailChange,
  onDiscordHandleChange,
  onRoleInterestChange,
  onClose,
  onSubmit,
}: Readonly<DownloadLeadFormProps>) {
  const pillText = isCommunityGuide
    ? "Free Community Access · Unlock Instant PDF Download"
    : "Free Career Guide Download";

  return (
    <>
      {/* Top Tag Pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-brand-coral text-xs font-bold uppercase tracking-wider mb-4 border border-pink-100">
        <HiSparkles className="w-3.5 h-3.5" />
        <span>{pillText}</span>
      </div>

      {/* Title & Subtitle */}
      <h3 id="modal-headline" className="text-xl font-extrabold text-stone-900 leading-snug mb-2">
        {modalTitle}
      </h3>

      <p className="text-sm text-stone-600 leading-relaxed mb-6">
        {isCommunityGuide ? (
          <>
            Unlock our complete library of career guides for free by joining our WhatsApp & Discord community circles. Get direct access to playbooks, workshop alerts, and peer support.
          </>
        ) : (
          <>
            Download your free copy of <em>"{resourceTitle}"</em>. Enter your email below to receive the direct printable PDF download immediately.
          </>
        )}
      </p>

      {/* Form */}
      <form
        name="resources-lead-magnet"
        method="POST"
        data-netlify="true"
        onSubmit={onSubmit}
        className="space-y-4"
      >
        <input type="hidden" name="form-name" value="resources-lead-magnet" />
        <input type="hidden" name="resourceTitle" value={resourceTitle} />

        <div>
          <label htmlFor="modal-name-input" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
            Your Full Name <span className="text-brand-coral">*</span>
          </label>
          <input
            id="modal-name-input"
            type="text"
            name="fullName"
            required
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            placeholder="e.g. Alex Morgan"
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-coral/20 text-stone-900 text-sm outline-none transition-all"
          />
        </div>

        <div>
          <label htmlFor="modal-email-input" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
            Email Address <span className="text-brand-coral">*</span>
          </label>
          <div className="relative">
            <HiEnvelope className="absolute left-3.5 top-3.5 w-5 h-5 text-stone-400" />
            <input
              id="modal-email-input"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-coral/20 text-stone-900 text-sm outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="modal-discord-input" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
            WhatsApp Phone or Discord Handle <span className="text-stone-400 font-normal lowercase">(optional)</span>
          </label>
          <input
            id="modal-discord-input"
            type="text"
            name="discordHandle"
            value={discordHandle}
            onChange={(e) => onDiscordHandleChange(e.target.value)}
            placeholder="e.g. +44 7123... or @alex_dev"
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-coral/20 text-stone-900 text-sm outline-none transition-all"
          />
        </div>

        <div>
          <label htmlFor="modal-role-select" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
            What best describes your tech transition goal?
          </label>
          <select
            id="modal-role-select"
            name="roleInterest"
            value={roleInterest}
            onChange={(e) => onRoleInterestChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-brand-coral/20 text-stone-800 text-sm outline-none bg-white transition-all"
          >
            <option value="Non-tech to Tech Switcher">Non-tech to Tech Switcher</option>
            <option value="Software / Data Engineer">Software / Data Engineering</option>
            <option value="Product & UX Design">Product Management & UX</option>
            <option value="Tech Leadership / Management">Tech Leadership & Management</option>
            <option value="Other Career Transition">Other Career Goal</option>
          </select>
        </div>

        {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-full bg-brand-coral text-white font-extrabold text-sm hover:bg-brand-coral/90 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {renderSubmitButtonContent(isSubmitting, isCommunityGuide)}
        </button>

        <div className="text-[11px] text-stone-500 text-center leading-relaxed">
          By submitting, you agree to receive community notifications and updates. You can unsubscribe at any time. View our{" "}
          <Link to="/privacy-policy" onClick={onClose} className="text-brand-coral underline hover:text-brand-coral/80 font-medium">
            Privacy Policy
          </Link>.
        </div>

        <div className="flex items-center justify-center gap-1.5 text-stone-400 text-xs pt-1">
          <HiShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>100% Free • Direct WhatsApp / Discord & Email Notification • Zero Spam</span>
        </div>
      </form>
    </>
  );
}

interface DownloadSuccessStateProps {
  isCommunityGuide: boolean;
  email: string;
  onClose: () => void;
}

function DownloadSuccessState({ isCommunityGuide, email, onClose }: Readonly<DownloadSuccessStateProps>) {
  const heading = isCommunityGuide ? "Welcome to the Community! 🎉" : "You're on the VIP List! 🎉";

  return (
    <div className="text-center py-4 space-y-4">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
        <HiCheckCircle className="w-10 h-10" />
      </div>

      <h3 id="modal-headline" className="text-2xl font-extrabold text-stone-900">
        {heading}
      </h3>

      <p className="text-stone-600 text-sm leading-relaxed max-w-xs mx-auto">
        {isCommunityGuide ? (
          <>
            Thank you! We've registered <strong>{email}</strong> as a community member. Guides are now unlocked on your device, and we'll send your WhatsApp & Discord community invitations directly to your inbox.
          </>
        ) : (
          <>
            Thank you! We've registered <strong>{email}</strong>. Your download is ready and we have also sent a copy directly to your inbox.
          </>
        )}
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-4 px-6 py-2.5 rounded-full bg-brand-coral text-white font-bold text-sm hover:bg-brand-coral/90 transition-colors shadow-sm cursor-pointer"
      >
        Close & Download Resource
      </button>
    </div>
  );
}

export function DownloadResourceModal({
  isOpen,
  onClose,
  resource,
  isEarlyAccessMode = false,
  onSuccessUnlock,
}: Readonly<DownloadResourceModalProps>) {
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem("uht_user_email") || "";
    } catch (err) {
      console.warn("Failed to read user email from localStorage:", err);
      return "";
    }
  });
  const [fullName, setFullName] = useState("");
  const [discordHandle, setDiscordHandle] = useState("");
  const [roleInterest, setRoleInterest] = useState("Non-tech to Tech Switcher");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;

    const focusTimer = window.setTimeout(() => {
      const firstField = dialogRef.current?.querySelector<HTMLElement>("input, select, textarea, button");
      firstField?.focus();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElementRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isCommunityGuide = !isEarlyAccessMode && (resource?.requiresLogin || (resource?.weekNumber && resource.weekNumber > 3));

  const fallbackTitle = isCommunityGuide ? "Community Guide 4+ Unlock" : "Complete 10-Guide Transition Suite";
  const resourceTitle = resource?.title || fallbackTitle;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");

    if (!email?.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    localStorage.setItem("uht_user_email", email);
    localStorage.setItem("uht_community_member", "true");

    try {
      const formData = new FormData();
      formData.append("form-name", "resources-lead-magnet");
      formData.append("email", email);
      formData.append("fullName", fullName);
      formData.append("discordHandle", discordHandle);
      formData.append("roleInterest", roleInterest);
      formData.append("resourceTitle", resourceTitle);
      formData.append("mode", isCommunityGuide ? "Community Member Access (WhatsApp & Discord)" : "Complete 10-Guide Bundle Request");

      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });
    } catch (err) {
      console.warn("Netlify form submission error:", err);
    }

    try {
      await fetch("/.netlify/functions/subscribe-resource", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          fullName,
          discordHandle,
          roleInterest,
          resourceTitle,
        }),
      });
    } catch (err) {
      console.warn("Brevo subscribe-resource request error:", err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccessUnlock) {
        onSuccessUnlock(email);
      }
    }, 500);
  };

  const getModalTitle = () => {
    if (isCommunityGuide) {
      return `Unlock ${resource?.title || "Guide 4+"}: Join Our Community`;
    }
    if (resource) {
      return `Unlock: ${resource.title}`;
    }
    return "Unlock: Complete 10-Guide Transition Suite";
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-transparent border-none w-full h-full flex items-center justify-center p-4 sm:p-6"
      open
      aria-labelledby="modal-headline"
    >
      {/* Dark backdrop overlay with click-to-close */}
      <button
        type="button"
        className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer border-none"
        onClick={onClose}
        aria-label="Close download modal backdrop"
      />
      <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 duration-200 z-10">
        
        {/* Header decoration band */}
        <div className="h-3 bg-linear-to-r from-brand-pink via-brand-coral to-brand-blue" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors z-10 cursor-pointer"
          aria-label="Close modal"
        >
          <HiXMark className="w-6 h-6" />
        </button>

        <div className="p-6 sm:p-8">
          {!isSubmitted ? (
            <DownloadLeadForm
              isCommunityGuide={Boolean(isCommunityGuide)}
              modalTitle={getModalTitle()}
              resourceTitle={resourceTitle}
              fullName={fullName}
              email={email}
              discordHandle={discordHandle}
              roleInterest={roleInterest}
              error={error}
              isSubmitting={isSubmitting}
              onFullNameChange={setFullName}
              onEmailChange={setEmail}
              onDiscordHandleChange={setDiscordHandle}
              onRoleInterestChange={setRoleInterest}
              onClose={onClose}
              onSubmit={handleSubmit}
            />
          ) : (
            <DownloadSuccessState
              isCommunityGuide={Boolean(isCommunityGuide)}
              email={email}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </dialog>
  );
}


