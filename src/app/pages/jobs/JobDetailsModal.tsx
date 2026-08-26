import {
  HiXMark,
  HiFlag,
  HiHeart,
  HiOutlineHeart,
  HiArrowTopRightOnSquare,
} from "react-icons/hi2";
import type { Job } from "../../types";
import { cleanHtmlDescription } from "../../utils/atsSync";
import { trackJobApplyClick } from "../../utils/analytics";

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  onReport: (job: Job) => void;
}

export function JobDetailsModal({
  job,
  onClose,
  isSaved,
  onToggleSave,
  onReport,
}: JobDetailsModalProps) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-label="Close modal background"
      />

      <div className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl border border-gray-200 z-10 space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-brand-coral">
                {job.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800">
                {job.remoteStatus}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-gray-700">
                {job.experienceLevel}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">{job.title}</h2>
            <p className="text-sm font-bold text-gray-600 mt-1">
              {job.company} • {job.location}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Compensation & Culture Highlights */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 block">
                Transparent Compensation
              </span>
              <span className="text-lg font-black text-emerald-950">{job.salaryRange}</span>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-white px-3 py-1.5 rounded-full shadow-2xs">
              {job.employmentType}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs sm:text-sm leading-relaxed">
            <p className="font-extrabold text-amber-900 mb-1">Why This Role Passed Our Vetting:</p>
            <p>
              {job.whyApply?.trim() ||
                "Verified for compensation transparency, flexible working arrangements, and psychological safety standards."}
            </p>
          </div>
        </div>

        {/* Culture Signals Chips */}
        {job.inclusiveHighlights && job.inclusiveHighlights.length > 0 && (
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-2">
              Verified Inclusivity Signals
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.inclusiveHighlights.map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-brand-blue border border-blue-100"
                >
                  ✓ {badge}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {job.techStack && job.techStack.length > 0 && (
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-2">
              Key Technologies & Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {job.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-stone-100 text-gray-700 border border-stone-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Role Overview */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500">Role Overview</h3>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {cleanHtmlDescription(job.description)}
          </p>
        </div>

        {/* Modal Bottom CTA Bar */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>Source: {job.source || "Company ATS"}</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                onReport(job);
                onClose();
              }}
              className="text-gray-400 hover:text-amber-600 font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <HiFlag className="w-3.5 h-3.5" />
              <span>Report closed / expired</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onToggleSave(job.id)}
              className="px-4 py-3 rounded-full border border-gray-200 font-bold text-xs hover:bg-stone-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <HiHeart className="w-4 h-4 text-brand-coral" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <HiOutlineHeart className="w-4 h-4" />
                  <span>Save Role</span>
                </>
              )}
            </button>

            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackJobApplyClick(job.company, job.title, job.applyUrl)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-brand-coral text-white font-extrabold text-sm hover:opacity-90 transition-opacity shadow-md cursor-pointer"
            >
              <span>Apply Directly</span>
              <HiArrowTopRightOnSquare className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
