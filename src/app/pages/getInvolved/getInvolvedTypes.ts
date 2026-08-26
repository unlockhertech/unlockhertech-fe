export type InvolvementType = "job" | "mentor" | "guest" | "partner";

export interface GetInvolvedFormData {
  name: string;
  email: string;
  roleCompany: string;
  expertise: string;
  contributions: string;
  topics: string;
  linkedinUrl: string;
  additionalInfo: string;
  jobTitle: string;
  salaryRange: string;
  workplaceModel: string;
  applyUrl: string;
  whyApply: string;
}

export const INITIAL_FORM_DATA: GetInvolvedFormData = {
  name: "",
  email: "",
  roleCompany: "",
  expertise: "",
  contributions: "",
  topics: "",
  linkedinUrl: "",
  additionalInfo: "",
  jobTitle: "",
  salaryRange: "",
  workplaceModel: "Remote (Global)",
  applyUrl: "",
  whyApply: "",
};
