import { useState, type SyntheticEvent } from "react";
import { Link } from "react-router";
import {
  HiEnvelope,
  HiPaperAirplane,
  HiCheckCircle,
  HiArrowPath,
  HiExclamationCircle,
} from "react-icons/hi2";
import type { AssessmentScores, CategoryRecommendation } from "./assessmentData";
import type { ReadinessBadgeInfo } from "./useAssessment";
import { trackEvent } from "../../utils/analytics";

interface EmailResultsCardProps {
  grandTotal: number;
  scores: AssessmentScores;
  readinessBadge: ReadinessBadgeInfo;
  recommendation: CategoryRecommendation;
  reflectionNotes?: string;
  totalAnswered: number;
}

interface EmailResultsSuccessProps {
  email: string;
  onReset: () => void;
}

function EmailResultsSuccess({ email, onReset }: Readonly<EmailResultsSuccessProps>) {
  return (
    <div
      data-testid="email-results-success"
      className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300"
    >
      <div className="flex items-center gap-3">
        <HiCheckCircle className="w-6 h-6 text-brand-green shrink-0" />
        <div>
          <h4 className="font-extrabold text-sm text-emerald-900">
            Summary Prepared for {email}!
          </h4>
          <p className="text-xs text-emerald-800 mt-0.5">
            Your full breakdown and resource links have been generated. Check your inbox or email client.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="text-xs font-bold text-emerald-800 hover:text-emerald-900 underline cursor-pointer shrink-0"
      >
        Send to another email
      </button>
    </div>
  );
}

interface EmailResultsFormProps {
  email: string;
  isSending: boolean;
  error: string;
  onEmailChange: (value: string) => void;
  onSubmit: (e: SyntheticEvent) => void;
}

function EmailResultsForm({
  email,
  isSending,
  error,
  onEmailChange,
  onSubmit,
}: Readonly<EmailResultsFormProps>) {
  return (
    <form noValidate onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <label htmlFor="assessment-email-input" className="sr-only">
            Your Email Address
          </label>
          <input
            id="assessment-email-input"
            type="email"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Enter your email address (e.g. name@example.com)"
            className="w-full px-4 py-3.5 rounded-2xl bg-white border border-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 text-sm text-stone-900 shadow-xs"
          />
        </div>
        <button
          type="submit"
          disabled={isSending}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-75 shrink-0"
        >
          {isSending ? (
            <>
              <HiArrowPath className="w-4 h-4 animate-spin" />
              <span>Preparing...</span>
            </>
          ) : (
            <>
              <HiPaperAirplane className="w-4 h-4" />
              <span>Email My Results</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs font-bold text-red-600">
          <HiExclamationCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 font-medium pt-1 gap-2">
        <span>✓ 100% Free • Direct Inbox Delivery • Zero Spam</span>
        <span className="text-[11px] text-stone-500">
          Your scores remain confidential. View our{" "}
          <Link to="/privacy-policy" className="text-brand-blue underline hover:text-brand-blue/80 font-semibold">
            Privacy Policy
          </Link>.
        </span>
      </div>
    </form>
  );
}

export function EmailResultsCard({
  grandTotal,
  scores,
  readinessBadge,
  recommendation,
  reflectionNotes = "",
  totalAnswered,
}: Readonly<EmailResultsCardProps>) {
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem("uht_user_email") || "";
    } catch (err) {
      console.warn("Failed to read user email from localStorage:", err);
      return "";
    }
  });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSending(true);

    try {
      localStorage.setItem("uht_user_email", trimmedEmail);
    } catch (err) {
      console.warn("Could not save email to localStorage:", err);
    }

    const emailSubject = `Your Tech Transition Action Plan | Score: ${grandTotal}/80 - Unlock Her Tech`;
    const emailBody = [
      `Hello!`,
      ``,
      `Here is the personalized breakdown from your Unlock Her Tech Career Readiness Self-Assessment:`,
      ``,
      `═══════════════════════════════════════`,
      `YOUR SCORE SUMMARY`,
      `═══════════════════════════════════════`,
      `• Overall Score: ${grandTotal} / 80 (${Math.round((totalAnswered / 16) * 100)}% evaluated)`,
      `• Current Readiness Tier: ${readinessBadge.text.replace(/[\u{1F300}-\u{1FAFF}]/gu, "").trim()}`,
      ``,
      `DIMENSIONAL BREAKDOWN:`,
      `1. Mindset & Resilience: ${scores.m1} / 20`,
      `2. Transferable Skills Translation: ${scores.m2} / 20`,
      `3. Technical Literacy & Portfolio: ${scores.m3} / 20`,
      `4. Networking & Execution Strategy: ${scores.m4} / 20`,
      ``,
      `═══════════════════════════════════════`,
      `STRATEGIC RECOMMENDATION`,
      `═══════════════════════════════════════`,
      `Priority Area: ${recommendation.title.replace(/[\u{1F300}-\u{1FAFF}]/gu, "").trim()}`,
      `${recommendation.text}`,
      ``,
      reflectionNotes.trim()
        ? `YOUR PERSONAL ACTION COMMITMENTS:\n"${reflectionNotes.trim()}"\n\n`
        : ``,
      `═══════════════════════════════════════`,
      `YOUR NEXT-STEP RESOURCES`,
      `═══════════════════════════════════════`,
      `1. Join Live She Leads Tech Practice Sessions:`,
      `   https://unlockhertech.com/practices`,
      ``,
      `2. Listen to the Unlock Her Tech Podcast:`,
      `   https://pod.link/1800087284 (Spotify, Apple Podcasts, YouTube)`,
      ``,
      `3. Download Free Career Transition Guides:`,
      `   https://unlockhertech.com/resources`,
      ``,
      `Keep showing up and building your momentum!`,
      `— Unlock Her Tech Team (unlockhertech.com)`,
    ].join("\n");

    // 1. Submit lead capture form asynchronously
    try {
      const formData = new FormData();
      formData.append("form-name", "assessment-results-email");
      formData.append("email", trimmedEmail);
      formData.append("grandTotal", String(grandTotal));
      formData.append("readinessBadge", readinessBadge.text);
      formData.append("mindsetScore", String(scores.m1));
      formData.append("skillsScore", String(scores.m2));
      formData.append("techScore", String(scores.m3));
      formData.append("networkingScore", String(scores.m4));
      formData.append("recommendationTitle", recommendation.title);
      formData.append("notes", reflectionNotes);

      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });
    } catch (err) {
      console.warn("Form submission exception:", err);
    }

    // 2. Open client mailto
    const mailtoUrl = `mailto:${encodeURIComponent(trimmedEmail)}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailtoUrl;

    trackEvent("email_assessment_results", "Assessment", readinessBadge.text, grandTotal);

    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
    }, 400);
  };

  const handleReset = () => {
    setIsSent(false);
    setError("");
  };

  return (
    <div
      data-testid="email-results-card"
      className="mt-8 bg-linear-to-br from-blue-50/60 via-white to-pink-50/50 border border-brand-blue/20 rounded-3xl p-6 sm:p-8 shadow-sm print:hidden"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
          <HiEnvelope className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-stone-900">
            Email Results & Action Plan to Myself
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm mt-0.5 leading-relaxed">
            Send a formatted report of your dimensional scores, recommendations, and next-step links directly to your inbox.
          </p>
        </div>
      </div>

      {isSent ? (
        <EmailResultsSuccess email={email} onReset={handleReset} />
      ) : (
        <EmailResultsForm
          email={email}
          isSending={isSending}
          error={error}
          onEmailChange={(val) => {
            setEmail(val);
            if (error) setError("");
          }}
          onSubmit={handleSend}
        />
      )}
    </div>
  );
}
