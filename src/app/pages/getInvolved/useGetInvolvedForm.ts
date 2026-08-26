import { useState, useMemo, useCallback, type ChangeEvent, type SyntheticEvent } from "react";
import { useSearchParams, useLocation } from "react-router";
import {
  type InvolvementType,
  type GetInvolvedFormData,
  INITIAL_FORM_DATA,
} from "./getInvolvedTypes";

export function useGetInvolvedForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const tabParam = searchParams.get("tab") || searchParams.get("type");
  const activeTab: InvolvementType = useMemo(() => {
    if (tabParam === "job" || tabParam === "jobs" || tabParam === "role" || tabParam === "hiring") return "job";
    if (tabParam === "guest" || tabParam === "speaker" || tabParam === "podcast") return "guest";
    if (tabParam === "partner" || tabParam === "sponsor") return "partner";
    if (tabParam === "mentor" || tabParam === "lead") return "mentor";

    if (location.pathname.includes("mentor")) return "mentor";
    if (location.pathname.includes("speaker") || location.pathname.includes("guest")) return "guest";
    if (location.pathname.includes("partner") || location.pathname.includes("sponsor")) return "partner";
    if (location.pathname.includes("job") || location.pathname.includes("hiring")) return "job";

    return "mentor";
  }, [tabParam, location.pathname]);

  const [formData, setFormData] = useState<GetInvolvedFormData>(INITIAL_FORM_DATA);
  const [submitted, setSubmitted] = useState(false);

  const metaTitle = useMemo(() => {
    if (activeTab === "job") return "Submit a Transparent Role | Unlock Her Tech";
    if (activeTab === "guest") return "Be a Podcast Speaker | Unlock Her Tech";
    if (activeTab === "partner") return "Partner & Sponsor | Unlock Her Tech";
    return "Get Involved & Mentor | Unlock Her Tech";
  }, [activeTab]);

  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleTabClick = useCallback((tab: InvolvementType) => {
    setSubmitted(false);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", tab);
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleSubmit = useCallback((e: SyntheticEvent) => {
    e.preventDefault();

    let subject: string;
    let body: string;

    if (activeTab === "job") {
      subject = `[Job Submission: Transparent Role] ${formData.jobTitle || "Open Role"} at ${formData.roleCompany || "Company"}`;
      body =
        `Contact Name: ${formData.name}\n` +
        `Contact Email: ${formData.email}\n` +
        `Company / Organization: ${formData.roleCompany}\n` +
        `Role Title: ${formData.jobTitle}\n` +
        `Workplace Model / Location: ${formData.workplaceModel}\n` +
        `Compensation Range: ${formData.salaryRange}\n` +
        `Application / Requisition URL: ${formData.applyUrl}\n` +
        `Why Apply / Inclusivity Highlights: ${formData.whyApply}\n\n` +
        `Additional Details:\n${formData.additionalInfo}`;
    } else {
      subject = `[Get Involved: ${activeTab.toUpperCase()}] Application from ${formData.name}`;
      body =
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Role/Company: ${formData.roleCompany}\n` +
        `Expertise: ${formData.expertise}\n` +
        (activeTab === "mentor" ? `Contribution Interest: ${formData.contributions}\n` : "") +
        (activeTab === "guest" ? `Speaking Topics: ${formData.topics}\n` : "") +
        `LinkedIn/Profile: ${formData.linkedinUrl}\n\n` +
        `Additional Information:\n${formData.additionalInfo}`;
    }

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    window.location.href = `mailto:info@unlockhertech.com?subject=${encodedSubject}&body=${encodedBody}`;
    setSubmitted(true);
  }, [activeTab, formData]);

  const handleResetForm = useCallback(() => {
    setSubmitted(false);
  }, []);

  return {
    activeTab,
    metaTitle,
    submitted,
    formData,
    handleChange,
    handleTabClick,
    handleSubmit,
    handleResetForm,
  };
}
