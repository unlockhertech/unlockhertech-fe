import { useState, useEffect, type SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import {
  HiXMark,
  HiCheckCircle,
  HiEnvelope,
  HiOutlineClipboardDocumentCheck,
  HiOutlineClipboardDocument,
  HiArrowTopRightOnSquare,
} from "react-icons/hi2";
import type { ExternalEvent } from "../types";
import { getEventExternalUrl } from "../utils/luma";

interface ClaimDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ExternalEvent | null;
}

interface ClaimDiscountFormProps {
  event: ExternalEvent;
  discountPercentage: string;
  fullName: string;
  email: string;
  error: string;
  isSubmitting: boolean;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: (e: SyntheticEvent) => void;
}

function ClaimDiscountForm({
  event,
  discountPercentage,
  fullName,
  email,
  error,
  isSubmitting,
  onFullNameChange,
  onEmailChange,
  onSubmit,
}: Readonly<ClaimDiscountFormProps>) {
  return (
    <>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-brand-pink/40 text-brand-berry text-xs font-extrabold uppercase tracking-wider mb-4">
        <span>🎟️</span>
        <span>{discountPercentage} Community Partner Perk</span>
      </div>

      <h3 id="discount-modal-title" className="text-2xl font-extrabold text-stone-900 leading-snug mb-2">
        Unlock {discountPercentage} Off Tickets
      </h3>
      <p className="text-sm font-semibold text-brand-coral mb-3">
        {event.title}
      </p>

      <p className="text-sm text-stone-600 leading-relaxed mb-6">
        Enter your email below to <strong>instantly reveal your promo code</strong> for {discountPercentage} off all ticket tiers, and stay connected with upcoming Unlock Her Tech workshops.
      </p>

      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-4"
      >

        <div>
          <label htmlFor="discount-fullName" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
            Your Full Name <span className="text-brand-coral">*</span>
          </label>
          <input
            id="discount-fullName"
            type="text"
            name="fullName"
            required
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            placeholder="e.g. Maya Chen"
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-coral text-sm bg-stone-50 text-stone-900"
          />
        </div>

        <div>
          <label htmlFor="discount-email" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
            Email Address <span className="text-brand-coral">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <HiEnvelope className="w-5 h-5" />
            </div>
            <input
              id="discount-email"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-coral text-sm bg-stone-50 text-stone-900"
            />
          </div>
          {error && <p className="text-xs text-red-600 mt-1 font-semibold">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-full bg-brand-coral text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span>Unlock {discountPercentage} Discount Code ➔</span>
          )}
        </button>

        <p className="text-[0.72rem] text-center text-stone-400 leading-relaxed mt-2">
          🔒 We respect your privacy. No spam, ever. Unsubscribe anytime.
        </p>
      </form>
    </>
  );
}

interface ClaimDiscountSuccessViewProps {
  discountPercentage: string;
  discountCode: string;
  copied: boolean;
  externalUrl: string;
  onCopyCode: () => void;
  onClose: () => void;
}

function ClaimDiscountSuccessView({
  discountPercentage,
  discountCode,
  copied,
  externalUrl,
  onCopyCode,
  onClose,
}: Readonly<ClaimDiscountSuccessViewProps>) {
  const copyButtonClass = copied
    ? "bg-emerald-600 text-white shadow-xs"
    : "bg-brand-coral text-white hover:opacity-90 shadow-xs";

  return (
    <div className="text-center py-2">
      <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
        <HiCheckCircle className="w-8 h-8" />
      </div>

      <h3 className="text-2xl font-extrabold text-stone-900 mb-1">
        Discount Code Unlocked!
      </h3>
      <p className="text-sm text-stone-600 mb-6">
        Use this exclusive community promo code at ticket checkout to apply your <strong>{discountPercentage} savings</strong>:
      </p>

      <div className="p-4 rounded-2xl bg-stone-50 border-2 border-dashed border-brand-coral/40 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left min-w-0">
          <span className="text-[0.65rem] font-extrabold uppercase tracking-widest text-brand-berry block">
            Promo Code
          </span>
          <code className="text-base sm:text-lg font-mono font-black text-stone-900 select-all block mt-0.5">
            {discountCode}
          </code>
        </div>

        <button
          type="button"
          onClick={onCopyCode}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${copyButtonClass}`}
        >
          {copied ? (
            <>
              <HiOutlineClipboardDocumentCheck className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <HiOutlineClipboardDocument className="w-4 h-4" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-brand-coral text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-md"
        >
          <span>Go to Ticket Checkout</span>
          <HiArrowTopRightOnSquare className="w-4 h-4" />
        </a>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-full text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
        >
          Close Window
        </button>
      </div>
    </div>
  );
}

export function ClaimDiscountModal({
  isOpen,
  onClose,
  event,
}: Readonly<ClaimDiscountModalProps>) {
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem("uht_user_email") || "";
    } catch (err) {
      console.warn("Failed to read user email from localStorage:", err);
      return "";
    }
  });
  const [fullName, setFullName] = useState(() => {
    try {
      return localStorage.getItem("uht_user_name") || "";
    } catch (err) {
      console.warn("Failed to read user name from localStorage:", err);
      return "";
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(() => {
    try {
      return Boolean(localStorage.getItem("uht_partner_discount_unlocked"));
    } catch (err) {
      console.warn("Failed to read discount status from localStorage:", err);
      return false;
    }
  });
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  const discountPercentage = event.discountPercentage || "20%";
  const discountCode = event.discountCode || "UNLOCKHERTECH20-F056D5212AE7";
  const externalUrl = getEventExternalUrl(event.urlOrId);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email?.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      localStorage.setItem("uht_user_name", fullName.trim());
      localStorage.setItem("uht_user_email", email.trim());
      localStorage.setItem("uht_partner_discount_unlocked", "true");

      await fetch("/api/claim-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          fullName: fullName.trim(),
          eventTitle: event.title,
          discountCode,
          discountPercentage,
          ticketUrl: externalUrl,
        }),
      });
    } catch (err) {
      console.warn("Discount claim API error:", err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  const handleCopyCode = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(discountCode);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn("Copy error:", err);
    }
  };

  return createPortal(
    <dialog
      className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in bg-transparent border-none w-full h-full"
      open
      aria-labelledby="discount-modal-title"
    >
      {/* Dark backdrop overlay with click-to-close */}
      <button
        type="button"
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity cursor-pointer border-none"
        onClick={onClose}
        aria-label="Close discount modal backdrop"
      />

      {/* Modal card container with solid opaque white background */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-auto">
        {/* Header decoration gradient band */}
        <div className="h-3 bg-linear-to-r from-brand-berry via-brand-coral to-brand-pink" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors z-10 cursor-pointer"
          aria-label="Close modal"
        >
          <HiXMark className="w-6 h-6" />
        </button>

        <div className="p-6 sm:p-8 bg-white">
          {!isSubmitted ? (
            <ClaimDiscountForm
              event={event}
              discountPercentage={discountPercentage}
              fullName={fullName}
              email={email}
              error={error}
              isSubmitting={isSubmitting}
              onFullNameChange={setFullName}
              onEmailChange={setEmail}
              onSubmit={handleSubmit}
            />
          ) : (
            <ClaimDiscountSuccessView
              discountPercentage={discountPercentage}
              discountCode={discountCode}
              copied={copied}
              externalUrl={externalUrl}
              onCopyCode={handleCopyCode}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </dialog>,
    document.body
  );
}


