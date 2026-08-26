import type { ChangeEvent, SyntheticEvent } from "react";
import { Link } from "react-router";
import { HiPaperAirplane } from "react-icons/hi2";
import type { InvolvementType, GetInvolvedFormData } from "./getInvolvedTypes";

interface GetInvolvedFormProps {
  activeTab: InvolvementType;
  formData: GetInvolvedFormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: SyntheticEvent) => void;
}

export function GetInvolvedForm({
  activeTab,
  formData,
  onChange,
  onSubmit,
}: GetInvolvedFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6 pt-6 border-t border-gray-100">
      {activeTab === "job" ? (
        <>
          {/* Job Submission Fields */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Contact / Hiring Lead Name <span className="text-brand-coral">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={onChange}
                placeholder="e.g. Sarah Jenkins"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 text-sm bg-stone-50/50"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Work / Recruiting Email <span className="text-brand-coral">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={onChange}
                placeholder="recruiting@company.com"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 text-sm bg-stone-50/50"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="roleCompany" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Company / Organization <span className="text-brand-coral">*</span>
              </label>
              <input
                type="text"
                id="roleCompany"
                name="roleCompany"
                required
                value={formData.roleCompany}
                onChange={onChange}
                placeholder="e.g. GitLab, Figma, Monzo"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 text-sm bg-stone-50/50"
              />
            </div>

            <div>
              <label htmlFor="jobTitle" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Role Title <span className="text-brand-coral">*</span>
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                required
                value={formData.jobTitle}
                onChange={onChange}
                placeholder="e.g. Senior Full Stack Engineer"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 text-sm bg-stone-50/50"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="salaryRange" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Transparent Salary Range <span className="text-brand-coral">*</span>
              </label>
              <input
                type="text"
                id="salaryRange"
                name="salaryRange"
                required
                value={formData.salaryRange}
                onChange={onChange}
                placeholder="e.g. $130,000 – $160,000 USD or £85k – £100k GBP"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 text-sm bg-stone-50/50"
              />
            </div>

            <div>
              <label htmlFor="workplaceModel" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Workplace Model / Location <span className="text-brand-coral">*</span>
              </label>
              <select
                id="workplaceModel"
                name="workplaceModel"
                value={formData.workplaceModel}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 text-sm bg-stone-50/50 cursor-pointer"
              >
                <option value="Remote (Global)">Remote (Global)</option>
                <option value="Remote (US/Americas)">Remote (US/Americas)</option>
                <option value="Remote (UK/Europe)">Remote (UK/Europe)</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="applyUrl" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Direct Application / ATS Requisition URL <span className="text-brand-coral">*</span>
            </label>
            <input
              type="url"
              id="applyUrl"
              name="applyUrl"
              required
              value={formData.applyUrl}
              onChange={onChange}
              placeholder="https://boards.greenhouse.io/company/jobs/12345"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 text-sm bg-stone-50/50"
            />
          </div>

          <div>
            <label htmlFor="whyApply" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Why Apply / Inclusivity Signals
            </label>
            <input
              type="text"
              id="whyApply"
              name="whyApply"
              value={formData.whyApply}
              onChange={onChange}
              placeholder="e.g. Equal 16-week parental leave, flexible core hours, dedicated $2k annual learning stipend"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 text-sm bg-stone-50/50"
            />
          </div>

          <div>
            <label htmlFor="additionalInfo" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Job Description / Additional Details
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              rows={4}
              value={formData.additionalInfo}
              onChange={onChange}
              placeholder="Paste your job description, required tech stack (e.g. React, TypeScript, Python), and team structure..."
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 text-sm bg-stone-50/50"
            />
          </div>
        </>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Full Name <span className="text-brand-coral">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={onChange}
                placeholder="e.g. Jane Doe"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 text-sm bg-stone-50/50"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Email Address <span className="text-brand-coral">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={onChange}
                placeholder="jane@example.com"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 text-sm bg-stone-50/50"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="roleCompany" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Role & Company / Organization <span className="text-brand-coral">*</span>
              </label>
              <input
                type="text"
                id="roleCompany"
                name="roleCompany"
                required
                value={formData.roleCompany}
                onChange={onChange}
                placeholder="e.g. Senior Software Engineer at Stripe"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 text-sm bg-stone-50/50"
              />
            </div>

            <div>
              <label htmlFor="expertise" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Primary Area of Expertise <span className="text-brand-coral">*</span>
              </label>
              <input
                type="text"
                id="expertise"
                name="expertise"
                required
                value={formData.expertise}
                onChange={onChange}
                placeholder="e.g. Frontend, Algorithms, AI/ML, DevOps"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 text-sm bg-stone-50/50"
              />
            </div>
          </div>

          {activeTab === "mentor" && (
            <div>
              <label htmlFor="contributions" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                How would you like to contribute?
              </label>
              <input
                type="text"
                id="contributions"
                name="contributions"
                value={formData.contributions}
                onChange={onChange}
                placeholder="e.g. Lead a LeetCode breakout session, 1-on-1 career mentorship"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 text-sm bg-stone-50/50"
              />
            </div>
          )}

          {activeTab === "guest" && (
            <div>
              <label htmlFor="topics" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Topics you would like to speak about <span className="text-brand-coral">*</span>
              </label>
              <input
                type="text"
                id="topics"
                name="topics"
                required
                value={formData.topics}
                onChange={onChange}
                placeholder="e.g. Breaking into staff engineering, navigating startup leadership"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 text-sm bg-stone-50/50"
              />
            </div>
          )}

          <div>
            <label htmlFor="linkedinUrl" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              LinkedIn / Portfolio Profile URL
            </label>
            <input
              type="url"
              id="linkedinUrl"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={onChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 text-sm bg-stone-50/50"
            />
          </div>

          <div>
            <label htmlFor="additionalInfo" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Additional Notes or Questions
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              rows={4}
              value={formData.additionalInfo}
              onChange={onChange}
              placeholder="Tell us a little more about yourself and what excites you about collaborating with Unlock Her Tech..."
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-brand-coral/40 text-sm bg-stone-50/50"
            />
          </div>
        </>
      )}

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-coral text-white font-bold text-sm hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <HiPaperAirplane className="w-4 h-4" />
          <span>{activeTab === "job" ? "Submit Role for Review" : "Send Application"}</span>
        </button>

        <p className="text-[11px] text-gray-500 leading-relaxed max-w-sm">
          We respect your privacy. Submissions are processed directly by our team. View our{" "}
          <Link to="/privacy-policy" className="text-brand-coral underline hover:text-brand-coral/80 font-medium">
            Privacy Policy
          </Link>.
        </p>
      </div>
    </form>
  );
}
