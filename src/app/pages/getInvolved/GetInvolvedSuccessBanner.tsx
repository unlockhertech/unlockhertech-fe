import { HiCheckCircle } from "react-icons/hi2";
import type { InvolvementType } from "./getInvolvedTypes";

interface GetInvolvedSuccessBannerProps {
  activeTab: InvolvementType;
  onReset: () => void;
}

export function GetInvolvedSuccessBanner({ activeTab, onReset }: Readonly<GetInvolvedSuccessBannerProps>) {
  return (
    <div className="mt-8 p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
      <HiCheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
      <h3 className="text-xl font-extrabold text-gray-900 mb-2">
        {activeTab === "job" ? "Thank you for submitting your transparent role!" : "Thank you for reaching out!"}
      </h3>
      <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
        {activeTab === "job"
          ? "Your email client was opened with your role submission details pre-filled. Our curation team reviews all listings against our 4 vetting standards within 24–48 hours."
          : "Your email client was opened with your application details pre-filled. You can also reach us directly anytime at info@unlockhertech.com."}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="px-6 py-2.5 rounded-full bg-brand-coral text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
      >
        {activeTab === "job" ? "Submit another role" : "Submit another request"}
      </button>
    </div>
  );
}
