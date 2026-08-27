import type { MouseEvent } from "react";
import {
  HiMapPin,
  HiCurrencyDollar,
  HiCheckBadge,
  HiArrowTopRightOnSquare,
  HiHeart,
  HiOutlineHeart,
  HiShare,
  HiCheck,
  HiFlag,
} from "react-icons/hi2";
import type { Job } from "../../types";
import { trackJobApplyClick } from "../../utils/analytics";

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  copiedSlug: string | null;
  onSelectJob: (job: Job) => void;
  onToggleSave: (jobId: string, e?: MouseEvent) => void;
  onShare: (job: Job, e?: MouseEvent) => void;
  onReport: (job: Job, e?: MouseEvent) => void;
}

export function JobCard({
  job,
  isSaved,
  copiedSlug,
  onSelectJob,
  onToggleSave,
  onShare,
  onReport,
}: JobCardProps) {
  return (
    <article
      id={job.slug}
      onClick={() => onSelectJob(job)}
      className={`bg-white rounded-3xl p-6 sm:p-8 border transition-all cursor-pointer hover:shadow-lg ${
        job.featured
          ? "border-pink-200 ring-1 ring-brand-coral/20 shadow-sm"
          : "border-gray-200/80 shadow-xs hover:border-gray-300"
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        {/* Left details */}
        <div className="flex-1 space-y-3.5">
          {/* Top badges bar */}
          <div className="flex flex-wrap items-center gap-2">
            {job.featured && (
              <span className="px-3 py-1 rounded-full text-[0.7rem] font-black uppercase tracking-wider bg-brand-coral text-white shadow-2xs">
                Featured Role
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-brand-coral border border-pink-100">
              {job.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-gray-700">
              {job.experienceLevel}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <HiMapPin className="w-3.5 h-3.5 text-emerald-600" />
              {job.remoteStatus}
            </span>
            {job.verifiedInclusive && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-brand-blue border border-blue-100 flex items-center gap-1">
                <HiCheckBadge className="w-3.5 h-3.5 text-brand-blue" />
                Verified Culture
              </span>
            )}
          </div>

          {/* Job Title & Company */}
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug group-hover:text-brand-coral transition-colors">
              {job.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1 font-medium">
              <span className="font-bold text-gray-900">{job.company}</span>
              <span>•</span>
              <span>{job.location}</span>
              <span>•</span>
              <span>{job.employmentType}</span>
            </div>
          </div>

          {/* Transparent Compensation Box */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 font-extrabold text-sm sm:text-base">
            <HiCurrencyDollar className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{job.salaryRange}</span>
          </div>

          {/* "Why Apply" Inclusive Culture Highlight */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-xs sm:text-sm leading-relaxed">
            <p>
              <strong className="font-extrabold text-amber-900">Why Apply: </strong>
              {job.whyApply?.trim() ||
                "Verified for compensation transparency, flexible working arrangements, and psychological safety standards."}
            </p>
          </div>

          {/* Tech Stack Chips */}
          {job.techStack && job.techStack.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {job.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
          <div className="flex items-center gap-2">
            {/* Share link button */}
            <button
              type="button"
              onClick={(e) => onShare(job, e)}
              aria-label={`Share job posting for ${job.title} at ${job.company}`}
              className="p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-gray-600 transition-colors cursor-pointer"
              title="Share / Copy role link"
            >
              {copiedSlug === job.slug ? (
                <HiCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <HiShare className="w-4 h-4" />
              )}
            </button>

            {/* Save Bookmark Button */}
            <button
              type="button"
              onClick={(e) => onToggleSave(job.id, e)}
              aria-label={isSaved ? `Remove ${job.title} at ${job.company} from saved roles` : `Save ${job.title} at ${job.company}`}
              className={`p-2.5 rounded-full transition-colors cursor-pointer ${
                isSaved
                  ? "bg-pink-100 text-brand-coral"
                  : "bg-stone-100 hover:bg-stone-200 text-gray-600"
              }`}
              title={isSaved ? "Remove from saved roles" : "Save this role"}
            >
              {isSaved ? (
                <HiHeart className="w-4 h-4 text-brand-coral" />
              ) : (
                <HiOutlineHeart className="w-4 h-4" />
              )}
            </button>

            {/* Report Expired / Closed Button */}
            <button
              type="button"
              onClick={(e) => onReport(job, e)}
              aria-label={`Report ${job.title} at ${job.company} as expired or closed`}
              className="p-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-gray-400 hover:text-amber-600 transition-colors cursor-pointer"
              title="Report job as expired or closed"
            >
              <HiFlag className="w-4 h-4" />
            </button>
          </div>

          {/* Direct Apply Button */}
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Apply directly for ${job.title} at ${job.company}`}
            onClick={(e) => {
              e.stopPropagation();
              trackJobApplyClick(job.company, job.title, job.applyUrl);
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-coral text-white font-extrabold text-xs sm:text-sm hover:opacity-90 transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <span>Apply Directly</span>
            <HiArrowTopRightOnSquare className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => onSelectJob(job)}
            aria-label={`View full details for ${job.title} at ${job.company}`}
            className="text-xs font-bold text-gray-500 hover:text-brand-coral transition-colors underline cursor-pointer"
          >
            View Full Details
          </button>
        </div>
      </div>
    </article>
  );
}
