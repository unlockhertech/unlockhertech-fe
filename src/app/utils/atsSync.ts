import type { 
  Job, 
  JobCategory, 
  JobRemoteStatus, 
  JobExperienceLevel, 
  JobEmploymentType 
} from "../types";

export interface AtsPartnerConfig {
  company: string;
  type: "greenhouse" | "lever" | "ashby";
  boardId: string;
  companyLogoUrl?: string;
  whyApplyDefault?: string;
  inclusiveHighlightsDefault?: string[];
  defaultCategory?: JobCategory;
}

export interface AtsSyncOptions {
  requireSalaryTransparency?: boolean;
  filterKeywords?: string[];
  maxJobsPerCompany?: number;
}

/**
 * Utility to detect and fix double-encoded UTF-8 / Windows-1252 mojibake artefacts
 * (e.g. â€™ -> ’, â€” -> —, â€¦ -> …, â€¢ -> •, Â§ -> §)
 */
export function cleanMojibake(input: string): string {
  if (!input) return "";

  let str = input;

  // 1. Direct character-level mojibake replacements (UTF-8 bytes misdecoded as Latin1)
  str = str
    // Dashes & Hyphens first (to prevent prefix collisions)
    .replace(/\u00E2\u0080\u0094|â€”/g, "—")
    .replace(/\u00E2\u0080\u0093|â€“/g, "–")
    // Punctuation & Symbols
    .replace(/\u00E2\u0080\u00A6|â€¦/g, "…")
    .replace(/\u00E2\u0080\u00A2|â€¢/g, "•")
    .replace(/\u00E2\u0084\u00A2|â„¢/g, "™")
    // Quotation marks & apostrophes
    .replace(/\u00E2\u0080\u0099|â€™/g, "’")
    .replace(/\u00E2\u0080\u0098|â€˜/g, "‘")
    .replace(/\u00E2\u0080\u009C|â€œ/g, "“")
    .replace(/\u00E2\u0080\u009D|â€\u009D|â€(?![—–…•™\u0080-\u00BF])/g, "”")
    // Latin-1 symbol prefixes
    .replaceAll("\u00C2\u00A9", "©")
    .replaceAll("\u00C2\u00AE", "®")
    .replaceAll("\u00C2\u00A7", "§")
    .replaceAll("\u00C2\u00B7", "·")
    .replaceAll("\u00C2\u00B0", "°")
    .replaceAll("\u00C2\u00B1", "±")
    .replaceAll("\u00C2\u00A3", "£")
    .replaceAll("\u00C2\u00A5", "¥")
    .replace(/\u00C2\u0080|Â€/g, "€")
    .replace(/\u00C2\u00A0|Â /g, " ")
    .replaceAll("\u00C2", "")
    // Accented characters
    .replaceAll("\u00C3\u00A9", "é")
    .replaceAll("\u00C3\u00A8", "è")
    .replaceAll("\u00C3\u00A1", "á")
    .replaceAll("\u00C3\u00A0", "à")
    .replaceAll("\u00C3\u00B3", "ó")
    .replaceAll("\u00C3\u00B2", "ò")
    .replaceAll("\u00C3\u00BA", "ú")
    .replaceAll("\u00C3\u00B9", "ù")
    .replaceAll("\u00C3\u00AD", "í")
    .replaceAll("\u00C3\u00AC", "ì")
    .replaceAll("\u00C3\u00B1", "ñ")
    .replaceAll("\u00C3\u00A7", "ç")
    .replaceAll("\u00C3\u00A3", "ã")
    .replaceAll("\u00C3\u00AA", "ê")
    .replaceAll("\u00C3\u00BC", "ü")
    .replaceAll("\u00C3\u00B6", "ö")
    .replaceAll("\u00C3\u00A4", "ä")
    .replaceAll("\u00C3\u0081", "Á")
    .replaceAll("\u00F0\u009F\u008D\u0094", "🍔");

  // 2. Remove unprintable control characters in C1 control code range (U+0080 to U+009F except \t, \n, \r) and replacement chars
  str = str.replace(/[\u0080-\u009F\uFFFD\uFEFF]/g, "");

  return str;
}

/**
 * Utility to decode HTML entities (both named and decimal/hexadecimal numeric entities)
 */
export function decodeHtmlEntities(raw: string): string {
  if (!raw) return "";
  let text = cleanMojibake(raw);

  // Perform multiple passes (up to 3) in case entities are double-encoded like &amp;amp;
  for (let pass = 0; pass < 3; pass++) {
    const prev = text;
    text = text
      .replace(/&#(\d+);/g, (_, dec) => {
        const code = Number.parseInt(dec, 10);
        return !Number.isNaN(code) && code > 0 ? String.fromCodePoint(code) : "";
      })
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
        const code = Number.parseInt(hex, 16);
        return !Number.isNaN(code) && code > 0 ? String.fromCodePoint(code) : "";
      })
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&quot;", '"')
      .replaceAll("&#39;", "'")
      .replaceAll("&apos;", "'")
      .replaceAll("&#x27;", "'")
      .replaceAll("&amp;", "&")
      .replaceAll("&nbsp;", " ")
      .replaceAll("&ndash;", "–")
      .replaceAll("&mdash;", "—")
      .replaceAll("&rsquo;", "’")
      .replaceAll("&lsquo;", "‘")
      .replaceAll("&rdquo;", "”")
      .replaceAll("&ldquo;", "“")
      .replaceAll("&hellip;", "…")
      .replaceAll("&bull;", "•")
      .replaceAll("&trade;", "™")
      .replaceAll("&reg;", "®")
      .replaceAll("&copy;", "©")
      .replaceAll("&pound;", "£")
      .replaceAll("&euro;", "€")
      .replaceAll("&yen;", "¥")
      .replaceAll("&middot;", "·")
      .replaceAll("&shy;", "");

    if (text === prev) break;
  }

  return cleanMojibake(text);
}

/**
 * Utility to clean single-line strings like job titles, company names, or location strings
 */
export function cleanJobText(text: string): string {
  if (!text) return "";
  const decoded = decodeHtmlEntities(text);
  return cleanMojibake(
    decoded
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Utility to strip HTML tags, unescape entities, and preserve readable formatting without excessive white space
 */
export function cleanHtmlDescription(rawHtml: string): string {
  if (!rawHtml) return "";
  
  // 1. First pass entity decoding and mojibake clean-up
  let text = decodeHtmlEntities(rawHtml);

  // 2. Remove script and style elements completely using linear unrolled character classes
  text = text
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // 3. Format list items and break tags
  text = text
    .replace(/<li\b[^>]*>/gi, "\n• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\b[^>]*>/gi, "\n")
    .replace(/<\/(?:p|div|section|article|header|aside|tr|table|h[1-6])>/gi, "\n\n")
    .replace(/<(?:p|div|section|article|header|aside|tr|table|h[1-6])\b[^>]*>/gi, "\n");

  // 4. Strip any other HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // 5. Final entity decoding pass
  text = decodeHtmlEntities(text);

  // 6. Normalise newlines, collapse excessive empty lines and spaces
  text = text.replaceAll('\r\n', "\n").replaceAll('\r', "\n");
  const lines = text.split("\n");
  const cleanedLines: string[] = [];
  let prevLineEmpty = false;

  for (const line of lines) {
    const trimmed = line.replace(/[ \t]+/g, " ").trim();
    if (trimmed.length === 0) {
      if (!prevLineEmpty) {
        cleanedLines.push("");
        prevLineEmpty = true;
      }
    } else {
      cleanedLines.push(cleanMojibake(trimmed));
      prevLineEmpty = false;
    }
  }

  return cleanMojibake(cleanedLines.join("\n").trim());
}

/**
 * Standard list of vetted partner companies with transparent cultures and public ATS boards.
 */
export const VETTED_ATS_PARTNERS: AtsPartnerConfig[] = [
  {
    company: "GitLab",
    type: "greenhouse",
    boardId: "gitlab",
    companyLogoUrl: "https://about.gitlab.com/images/press/logo/png/gitlab-icon-rgb.png",
    whyApplyDefault: "100% all-remote organization with public compensation bands, flexible async workflows, and annual learning stipends.",
    inclusiveHighlightsDefault: ["Verified Inclusive", "Salary Transparent", "Flexible Hours", "Parental Leave", "Learning Stipend"],
  },
  {
    company: "Monzo",
    type: "greenhouse",
    boardId: "monzo",
    companyLogoUrl: "https://monzo.com/static/images/favicon.png",
    whyApplyDefault: "Committed to closing the gender pay gap, 26 weeks paid parental leave for all caregivers, and neurodiversity-affirming interviews.",
    inclusiveHighlightsDefault: ["Verified Inclusive", "Salary Transparent", "Parental Leave", "Neurodiversity Friendly", "Diverse Panel"],
  },
  {
    company: "Carta",
    type: "greenhouse",
    boardId: "carta",
    companyLogoUrl: "https://carta.com/favicon.ico",
    whyApplyDefault: "Structured junior mentorship program for career switchers, transparent equity education, and annual learning stipends.",
    inclusiveHighlightsDefault: ["Verified Inclusive", "Salary Transparent", "Learning Stipend", "Diverse Panel"],
  },
  {
    company: "Figma",
    type: "greenhouse",
    boardId: "figma",
    companyLogoUrl: "https://static.figma.com/app/icon/1/favicon.svg",
    whyApplyDefault: "Collaborative design culture with extensive mentorship programs, transparent compensation bands, and wellness stipends.",
    inclusiveHighlightsDefault: ["Verified Inclusive", "Salary Transparent", "Learning Stipend", "Diverse Panel"],
  },
  {
    company: "Gusto",
    type: "greenhouse",
    boardId: "gusto",
    companyLogoUrl: "https://gusto.com/favicon.ico",
    whyApplyDefault: "Dedicated Women in Tech ERG, generous equal parental leave, and structured career development frameworks.",
    inclusiveHighlightsDefault: ["Verified Inclusive", "Salary Transparent", "Parental Leave", "Flexible Hours"],
  },
  {
    company: "Dropbox",
    type: "greenhouse",
    boardId: "dropbox",
    companyLogoUrl: "https://cfl.dropboxstatic.com/static/images/favicon-vflUeLeeY.ico",
    whyApplyDefault: "Virtual First workplace with core collaboration hours, equal caregiver leave, and home office stipends.",
    inclusiveHighlightsDefault: ["Verified Inclusive", "Salary Transparent", "Flexible Hours", "Parental Leave"],
  },
  {
    company: "Mozilla",
    type: "greenhouse",
    boardId: "mozilla",
    companyLogoUrl: "https://www.mozilla.org/media/img/favicons/mozilla/favicon.d25cd852d242.ico",
    whyApplyDefault: "Non-profit mission building open internet tools with public DEI disclosures and fully distributed teams.",
    inclusiveHighlightsDefault: ["Verified Inclusive", "Salary Transparent", "Flexible Hours", "Diverse Panel"],
  },
  {
    company: "Zapier",
    type: "ashby",
    boardId: "zapier",
    companyLogoUrl: "https://cdn.zapier.com/zapier/images/favicon.ico",
    whyApplyDefault: "100% remote pioneer since 2011, $2,000 home office allowance, 14 weeks paid caregiver leave, and active ERGs.",
    inclusiveHighlightsDefault: ["Verified Inclusive", "Salary Transparent", "Flexible Hours", "Learning Stipend", "LGBTQ+ Safe"],
  },
  {
    company: "Linear",
    type: "ashby",
    boardId: "linear",
    companyLogoUrl: "https://linear.app/favicon.ico",
    whyApplyDefault: "High-craft engineering team with transparent compensation formula, asynchronous culture, and equal parental leave.",
    inclusiveHighlightsDefault: ["Verified Inclusive", "Salary Transparent", "Flexible Hours", "Parental Leave"],
  },
  {
    company: "Ramp",
    type: "ashby",
    boardId: "ramp",
    companyLogoUrl: "https://ramp.com/favicon.ico",
    whyApplyDefault: "Transparent compensation bands, fast-growth learning opportunities, and structured mentorship.",
    inclusiveHighlightsDefault: ["Verified Inclusive", "Salary Transparent", "Learning Stipend"],
  },
];

const CONTRACT_KEYWORDS = ["contract", "freelance"] as const;
const DATA_RESEARCH_KEYWORDS = [
  "data",
  "analytics",
  "machine learning",
  "scientist",
  "bi developer",
  "ai ",
  "ai-",
] as const;
const ENGINEERING_KEYWORDS = [
  "frontend",
  "backend",
  "full stack",
  "software",
  "engineer",
  "developer",
  "devops",
  "cloud",
  "qa",
  "platform",
  "architect",
] as const;
const PRODUCT_DESIGN_KEYWORDS = [
  "designer",
  "product manager",
  "ux",
  "ui",
  "design",
  "product owner",
] as const;

function matchesKeyword(text: string, keywords: readonly string[]): boolean {
  return keywords.some((k) => text.includes(k));
}

/**
 * Infer job category from title and department names.
 */
export function inferJobCategory(title: string, department: string = ""): JobCategory {
  const t = title.toLowerCase();
  const combined = `${title} ${department}`.toLowerCase();

  if (matchesKeyword(t, CONTRACT_KEYWORDS)) return "Freelance & Contract";
  if (matchesKeyword(t, DATA_RESEARCH_KEYWORDS)) return "Data & Research";
  if (matchesKeyword(t, ENGINEERING_KEYWORDS)) return "Engineering & Dev";
  if (matchesKeyword(combined, PRODUCT_DESIGN_KEYWORDS)) return "Product & Design";
  if (matchesKeyword(combined, DATA_RESEARCH_KEYWORDS)) return "Data & Research";
  if (matchesKeyword(combined, ENGINEERING_KEYWORDS)) return "Engineering & Dev";

  return "Non-Technical Tech";
}

const GLOBAL_REMOTE_KEYWORDS = ["global", "anywhere", "worldwide"] as const;
const UK_EUROPE_KEYWORDS = ["uk", "europe", "london", "emea"] as const;
const US_AMERICAS_KEYWORDS = [
  "us",
  "usa",
  "united states",
  "canada",
  "americas",
  "san francisco",
  "new york",
] as const;

/**
 * Infer a workplace remote model from a location string.
 */
export function inferRemoteStatus(locationName: string = ""): JobRemoteStatus {
  const loc = locationName.toLowerCase();

  if (loc.includes("hybrid")) return "Hybrid";
  if (loc.includes("on-site") || loc.includes("onsite")) return "On-site";
  if (matchesKeyword(loc, GLOBAL_REMOTE_KEYWORDS)) return "Remote (Global)";
  if (matchesKeyword(loc, UK_EUROPE_KEYWORDS)) return "Remote (UK/Europe)";
  if (matchesKeyword(loc, US_AMERICAS_KEYWORDS)) return "Remote (US/Americas)";
  if (loc.includes("remote")) return "Remote (Global)";

  return "Hybrid";
}

const JUNIOR_KEYWORDS = ["junior", "associate", "entry", "graduate", "intern"] as const;
const LEAD_KEYWORDS = ["staff", "principal", "lead", "head"] as const;
const EXECUTIVE_KEYWORDS = ["director", "vp", "executive", "chief"] as const;
const SENIOR_KEYWORDS = ["senior", "sr", "sr."] as const;

/**
 * Infer experience level from the title.
 */
export function inferExperienceLevel(title: string): JobExperienceLevel {
  const t = title.toLowerCase();
  if (matchesKeyword(t, JUNIOR_KEYWORDS)) return "Junior";
  if (matchesKeyword(t, LEAD_KEYWORDS)) return "Lead / Staff";
  if (matchesKeyword(t, EXECUTIVE_KEYWORDS)) return "Executive";
  if (matchesKeyword(t, SENIOR_KEYWORDS)) return "Senior";
  return "Mid-Level";
}

function getCurrencyFromSymbol(symbol: string): string {
  if (symbol === "£") return "GBP";
  if (symbol === "€") return "EUR";
  return "USD";
}

/**
 * Parses salary ranges or extracts pay from job descriptions/metadata.
 */
export function extractSalaryRange(
  text: string,
  defaultCurrency = "USD"
): { salaryRange: string; minSalary: number; currency: string } {
  // Regex matches $120k-$150k or $120,000 - $150,000 or £80,000 - £100,000 or €90,000
  const salaryRegex = /([$£€])\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?k?)\s*(?:-|–|to)\s*[$£€]?\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?k?)/i;
  const match = salaryRegex.exec(text);

  if (match?.[0] && match[1] && match[2]) {
    const symbol = match[1];
    const currency = getCurrencyFromSymbol(symbol);
    const rawMin = match[2].toLowerCase().replaceAll(',', "");
    const minVal = rawMin.endsWith("k") ? Number.parseFloat(rawMin) * 1000 : Number.parseFloat(rawMin);
    
    return {
      salaryRange: match[0].trim(),
      minSalary: Math.round(minVal) || 0,
      currency,
    };
  }

  // Single figure fallback
  const singleRegex = /([$£€])\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?k?)/i;
  const singleMatch = singleRegex.exec(text);
  if (singleMatch?.[0] && singleMatch[1] && singleMatch[2]) {
    const symbol = singleMatch[1];
    const currency = getCurrencyFromSymbol(symbol);
    const rawMin = singleMatch[2].toLowerCase().replaceAll(',', "");
    const minVal = rawMin.endsWith("k") ? Number.parseFloat(rawMin) * 1000 : Number.parseFloat(rawMin);

    return {
      salaryRange: `${singleMatch[0].trim()}+ ${currency}`,
      minSalary: Math.round(minVal) || 0,
      currency,
    };
  }

  return {
    salaryRange: "Competitive & Transparent Band",
    minSalary: 0,
    currency: defaultCurrency,
  };
}

/**
 * Generate clean URL-friendly slug.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function filterRawJobs<T>(
  rawList: T[],
  getTitle: (item: T) => string,
  options: AtsSyncOptions
): T[] {
  let filtered = rawList;
  if ((options.filterKeywords?.length ?? 0) > 0) {
    const keywords = options.filterKeywords?.map((k) => k.toLowerCase()) ?? [];
    filtered = filtered.filter((item) => {
      const title = getTitle(item).toLowerCase();
      return keywords.some((k) => title.includes(k));
    });
  }
  if ((options.maxJobsPerCompany ?? 0) > 0) {
    filtered = filtered.slice(0, options.maxJobsPerCompany);
  }
  return filtered;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Greenhouse Public Board API Ingest
// ─────────────────────────────────────────────────────────────────────────────

interface GreenhouseJobRaw {
  id: number;
  title: string;
  absolute_url: string;
  updated_at: string;
  location?: { name: string };
  departments?: Array<{ id: number; name: string }>;
  content?: string;
  metadata?: Array<{ name: string; value: string | number | boolean }>;
}

function mapGreenhouseJob(j: GreenhouseJobRaw, partner: AtsPartnerConfig): Job {
  const locationName = cleanJobText(j.location?.name || "Remote (Global)");
  const departmentName = cleanJobText(j.departments?.[0]?.name || "");
  const contentText = j.content || "";
  const salaryInfo = extractSalaryRange(contentText);
  const cleanTitle = cleanJobText(j.title);
  const cleanCompany = cleanJobText(partner.company);
  const cleanDesc = cleanHtmlDescription(contentText).slice(0, 4000);

  return {
    id: `gh-${partner.boardId}-${j.id}`,
    title: cleanTitle,
    slug: `${slugify(cleanCompany)}-${slugify(cleanTitle)}-${j.id}`,
    company: cleanCompany,
    companyLogoUrl: partner.companyLogoUrl,
    category: partner.defaultCategory || inferJobCategory(cleanTitle, departmentName),
    location: locationName,
    remoteStatus: inferRemoteStatus(locationName),
    employmentType: "Full-time" as JobEmploymentType,
    experienceLevel: inferExperienceLevel(cleanTitle),
    salaryRange: salaryInfo.salaryRange,
    minSalary: salaryInfo.minSalary,
    currency: salaryInfo.currency,
    techStack: [],
    whyApply: cleanJobText(partner.whyApplyDefault || "Verified inclusive company with transparent compensation bands, flexible workflows, and supportive team culture."),
    description: cleanDesc || `${cleanTitle} opportunity at ${cleanCompany}. Direct application available on the official ATS.`,
    inclusiveHighlights: partner.inclusiveHighlightsDefault || ["Verified Inclusive", "Salary Transparent", "Flexible Hours"],
    applyUrl: appendUtmParameters(j.absolute_url),
    source: `${cleanCompany} Greenhouse ATS`,
    status: "active",
    isArchived: false,
    featured: false,
    verifiedInclusive: true,
    publishedAt: j.updated_at ? new Date(j.updated_at).toISOString() : new Date().toISOString(),
  };
}

export async function fetchGreenhouseJobs(
  partner: AtsPartnerConfig,
  options: AtsSyncOptions = {}
): Promise<Job[]> {
  try {
    const endpoint = `https://boards-api.greenhouse.io/v1/boards/${partner.boardId}/jobs?content=true`;
    const res = await fetch(endpoint);
    if (!res.ok) {
      console.warn(`[ATS Sync] Greenhouse API error for ${partner.company}: ${res.status}`);
      return [];
    }

    const data: { jobs: GreenhouseJobRaw[] } = await res.json();
    if (!data.jobs || !Array.isArray(data.jobs)) return [];

    const filtered = filterRawJobs(data.jobs, (j) => j.title, options);
    return filtered.map((j) => mapGreenhouseJob(j, partner));
  } catch (err) {
    console.error(`[ATS Sync] Error syncing Greenhouse jobs for ${partner.company}:`, err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Lever Public Postings API Ingest
// ─────────────────────────────────────────────────────────────────────────────

interface LeverPostingRaw {
  id: string;
  text: string;
  hostedUrl: string;
  applyUrl: string;
  createdAt: number;
  categories?: {
    commitment?: string;
    department?: string;
    location?: string;
    team?: string;
  };
  descriptionPlain?: string;
  salaryDescription?: string;
}

function mapLeverJob(j: LeverPostingRaw, partner: AtsPartnerConfig): Job {
  const locationName = cleanJobText(j.categories?.location || "Remote (Global)");
  const departmentName = cleanJobText(j.categories?.department || j.categories?.team || "");
  const textToSearch = `${j.salaryDescription || ""} ${j.descriptionPlain || ""}`;
  const salaryInfo = extractSalaryRange(textToSearch);
  const cleanTitle = cleanJobText(j.text);
  const cleanCompany = cleanJobText(partner.company);
  const cleanDesc = cleanHtmlDescription(j.descriptionPlain || "").slice(0, 4000);

  return {
    id: `lever-${partner.boardId}-${j.id}`,
    title: cleanTitle,
    slug: `${slugify(cleanCompany)}-${slugify(cleanTitle)}-${j.id}`,
    company: cleanCompany,
    companyLogoUrl: partner.companyLogoUrl,
    category: partner.defaultCategory || inferJobCategory(cleanTitle, departmentName),
    location: locationName,
    remoteStatus: inferRemoteStatus(locationName),
    employmentType: "Full-time" as JobEmploymentType,
    experienceLevel: inferExperienceLevel(cleanTitle),
    salaryRange: salaryInfo.salaryRange,
    minSalary: salaryInfo.minSalary,
    currency: salaryInfo.currency,
    techStack: [],
    whyApply: cleanJobText(partner.whyApplyDefault || "Verified inclusive company with transparent compensation bands, flexible workflows, and supportive team culture."),
    description: cleanDesc || `${cleanTitle} opportunity at ${cleanCompany}. Direct application available on the official ATS.`,
    inclusiveHighlights: partner.inclusiveHighlightsDefault || ["Verified Inclusive", "Salary Transparent", "Flexible Hours"],
    applyUrl: appendUtmParameters(j.hostedUrl || j.applyUrl),
    source: `${cleanCompany} Lever ATS`,
    status: "active",
    isArchived: false,
    featured: false,
    verifiedInclusive: true,
    publishedAt: j.createdAt ? new Date(j.createdAt).toISOString() : new Date().toISOString(),
  };
}

export async function fetchLeverJobs(
  partner: AtsPartnerConfig,
  options: AtsSyncOptions = {}
): Promise<Job[]> {
  try {
    const endpoint = `https://api.lever.co/v0/postings/${partner.boardId}?mode=json`;
    const res = await fetch(endpoint);
    if (!res.ok) {
      console.warn(`[ATS Sync] Lever API error for ${partner.company}: ${res.status}`);
      return [];
    }

    const data: LeverPostingRaw[] = await res.json();
    if (!Array.isArray(data)) return [];

    const filtered = filterRawJobs(data, (j) => j.text, options);
    return filtered.map((j) => mapLeverJob(j, partner));
  } catch (err) {
    console.error(`[ATS Sync] Error syncing Lever jobs for ${partner.company}:`, err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Ashby Public Job Board API Ingest
// ─────────────────────────────────────────────────────────────────────────────

interface AshbyJobRaw {
  id: string;
  title: string;
  locationName?: string;
  departmentName?: string;
  jobPostingUrl?: string;
  publishedAt?: string;
  compensation?: {
    summary?: string;
    compensationTierSummary?: string;
  };
  descriptionHtml?: string;
  descriptionPlain?: string;
}

export function appendUtmParameters(
  url: string,
  utmSource = "unlockhertech",
  utmMedium = "job_board",
  utmCampaign = "inclusive_careers"
): string {
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("utm_source")) {
      parsed.searchParams.set("utm_source", utmSource);
      parsed.searchParams.set("utm_medium", utmMedium);
      parsed.searchParams.set("utm_campaign", utmCampaign);
    }
    return parsed.toString();
  } catch (err) {
    console.debug("Failed to append UTM parameters to invalid URL, using raw url:", err);
    return url;
  }
}

function mapAshbyJob(
  j: AshbyJobRaw & { jobUrl?: string; applyUrl?: string },
  partner: AtsPartnerConfig
): Job {
  const locationName = cleanJobText(j.locationName || "Remote (Global)");
  const departmentName = cleanJobText(j.departmentName || "");
  const compText = `${j.compensation?.summary || ""} ${j.compensation?.compensationTierSummary || ""}`;
  const salaryInfo = extractSalaryRange(compText);
  const cleanTitle = cleanJobText(j.title);
  const cleanCompany = cleanJobText(partner.company);
  const desc = cleanHtmlDescription(j.descriptionPlain || j.descriptionHtml || "").slice(0, 4000);

  return {
    id: `ashby-${partner.boardId}-${j.id}`,
    title: cleanTitle,
    slug: `${slugify(cleanCompany)}-${slugify(cleanTitle)}-${j.id}`,
    company: cleanCompany,
    companyLogoUrl: partner.companyLogoUrl,
    category: partner.defaultCategory || inferJobCategory(cleanTitle, departmentName),
    location: locationName,
    remoteStatus: inferRemoteStatus(locationName),
    employmentType: "Full-time" as JobEmploymentType,
    experienceLevel: inferExperienceLevel(cleanTitle),
    salaryRange: salaryInfo.salaryRange,
    minSalary: salaryInfo.minSalary,
    currency: salaryInfo.currency,
    techStack: [],
    whyApply: cleanJobText(partner.whyApplyDefault || "Verified inclusive company with transparent compensation bands, flexible workflows, and supportive team culture."),
    description: desc || `${cleanTitle} opportunity at ${cleanCompany}. Apply directly through Ashby ATS.`,
    inclusiveHighlights: partner.inclusiveHighlightsDefault || ["Verified Inclusive", "Salary Transparent", "Flexible Hours"],
    applyUrl: appendUtmParameters(
      j.applyUrl || j.jobUrl || j.jobPostingUrl || `https://jobs.ashbyhq.com/${partner.boardId}/${j.id}`
    ),
    source: `${cleanCompany} Ashby ATS`,
    status: "active",
    isArchived: false,
    featured: false,
    verifiedInclusive: true,
    publishedAt: j.publishedAt ? new Date(j.publishedAt).toISOString() : new Date().toISOString(),
  };
}

export async function fetchAshbyJobs(
  partner: AtsPartnerConfig,
  options: AtsSyncOptions = {}
): Promise<Job[]> {
  try {
    const endpoint = `https://api.ashbyhq.com/posting-api/job-board/${partner.boardId}`;
    const res = await fetch(endpoint);
    if (!res.ok) {
      console.warn(`[ATS Sync] Ashby API error for ${partner.company}: ${res.status}`);
      return [];
    }

    const data: { jobs: Array<AshbyJobRaw & { jobUrl?: string; applyUrl?: string }> } = await res.json();
    if (!data.jobs || !Array.isArray(data.jobs)) return [];

    const filtered = filterRawJobs(data.jobs, (j) => j.title, options);
    return filtered.map((j) => mapAshbyJob(j, partner));
  } catch (err) {
    console.error(`[ATS Sync] Error syncing Ashby jobs for ${partner.company}:`, err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RemoteOK Public API Ingest
// ─────────────────────────────────────────────────────────────────────────────

interface RemoteOkJobRaw {
  id?: string;
  slug?: string;
  company?: string;
  company_logo?: string;
  position?: string;
  tags?: string[];
  description?: string;
  location?: string;
  apply_url?: string;
  url?: string;
  salary_min?: number;
  salary_max?: number;
  date?: string;
}

function getRemoteOkSalary(j: RemoteOkJobRaw, cleanDesc: string): { salaryRange: string; minSalary: number } {
  if (j.salary_min && j.salary_min > 0) {
    const maxStr = j.salary_max ? ` – $${j.salary_max.toLocaleString()}` : "";
    return {
      salaryRange: `$${j.salary_min.toLocaleString()}${maxStr} USD`,
      minSalary: j.salary_min,
    };
  }
  const extracted = extractSalaryRange(cleanDesc);
  return {
    salaryRange: extracted.salaryRange,
    minSalary: extracted.minSalary,
  };
}

function mapRemoteOkJob(j: RemoteOkJobRaw): Job {
  const cleanDesc = cleanHtmlDescription(j.description || "").slice(0, 4000);
  const cleanTitle = cleanJobText(j.position || "Remote Specialist");
  const cleanCompany = cleanJobText(j.company || "Remote Co");
  const locationName = cleanJobText(j.location || "Remote (Global)");
  const salary = getRemoteOkSalary(j, cleanDesc);
  const targetUrl = j.apply_url || j.url || `https://remoteok.com/remote-jobs/${j.slug || ""}`;

  return {
    id: `remoteok-${j.id || j.slug || crypto.randomUUID()}`,
    title: cleanTitle,
    slug: `${slugify(cleanCompany)}-${slugify(cleanTitle)}-${j.id || slugify(j.slug || "")}`,
    company: cleanCompany,
    companyLogoUrl: j.company_logo,
    category: inferJobCategory(cleanTitle, (j.tags || []).join(" ")),
    location: locationName,
    remoteStatus: inferRemoteStatus(locationName),
    employmentType: "Full-time" as JobEmploymentType,
    experienceLevel: inferExperienceLevel(cleanTitle),
    salaryRange: salary.salaryRange,
    minSalary: salary.minSalary,
    currency: "USD",
    techStack: j.tags?.slice(0, 6) || [],
    whyApply: "100% flexible remote organization with transparent compensation bands, asynchronous workflows, and distributed team practices.",
    description: cleanDesc || `${cleanTitle} opportunity at ${cleanCompany}. Direct application available.`,
    inclusiveHighlights: ["Verified Inclusive", "Salary Transparent", "Flexible Hours"],
    applyUrl: appendUtmParameters(targetUrl),
    source: "RemoteOK API",
    status: "active",
    isArchived: false,
    featured: false,
    verifiedInclusive: true,
    publishedAt: j.date || new Date().toISOString(),
  };
}

export async function fetchRemoteOkJobs(options: AtsSyncOptions = {}): Promise<Job[]> {
  try {
    const res = await fetch("https://remoteok.com/api", {
      headers: { "User-Agent": "UnlockHerTech-JobCuration/1.0" },
    });
    if (!res.ok) return [];

    const data: RemoteOkJobRaw[] = await res.json();
    if (!Array.isArray(data)) return [];

    const validJobs = data.filter((j) => j.position && (j.apply_url || j.url));
    const filtered = filterRawJobs(validJobs, (j) => j.position || "", options);
    const limit = options.maxJobsPerCompany || 15;

    return filtered.slice(0, limit).map(mapRemoteOkJob);
  } catch (err) {
    console.error("[ATS Sync] Error syncing RemoteOK jobs:", err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Remotive Public API Ingest
// ─────────────────────────────────────────────────────────────────────────────

interface RemotiveJobRaw {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string;
  category?: string;
  tags?: string[];
  job_type?: string;
  publication_date?: string;
  candidate_required_location?: string;
  salary?: string;
  description?: string;
}

function mapRemotiveJob(j: RemotiveJobRaw): Job {
  const cleanDesc = cleanHtmlDescription(j.description || "").slice(0, 4000);
  const cleanTitle = cleanJobText(j.title);
  const cleanCompany = cleanJobText(j.company_name);
  const locationName = cleanJobText(j.candidate_required_location || "Remote (Global)");
  const salaryInfo = extractSalaryRange(`${j.salary || ""} ${cleanDesc}`);

  return {
    id: `remotive-${j.id}`,
    title: cleanTitle,
    slug: `${slugify(cleanCompany)}-${slugify(cleanTitle)}-${j.id}`,
    company: cleanCompany,
    companyLogoUrl: j.company_logo,
    category: inferJobCategory(cleanTitle, j.category || (j.tags || []).join(" ")),
    location: locationName,
    remoteStatus: inferRemoteStatus(locationName),
    employmentType: (j.job_type === "contract" ? "Contract" : "Full-time") as JobEmploymentType,
    experienceLevel: inferExperienceLevel(cleanTitle),
    salaryRange: salaryInfo.salaryRange,
    minSalary: salaryInfo.minSalary,
    currency: salaryInfo.currency,
    techStack: j.tags?.slice(0, 6) || [],
    whyApply: "Remote-first role with verified compensation transparency, flexible working hours, and distributed team culture.",
    description: cleanDesc || `${cleanTitle} opportunity at ${cleanCompany}. Apply directly through the listing.`,
    inclusiveHighlights: ["Verified Inclusive", "Salary Transparent", "Flexible Hours"],
    applyUrl: appendUtmParameters(j.url),
    source: "Remotive Public API",
    status: "active",
    isArchived: false,
    featured: false,
    verifiedInclusive: true,
    publishedAt: j.publication_date ? new Date(j.publication_date).toISOString() : new Date().toISOString(),
  };
}

export async function fetchRemotiveJobs(options: AtsSyncOptions = {}): Promise<Job[]> {
  try {
    const res = await fetch("https://remotive.com/api/remote-jobs?limit=25");
    if (!res.ok) {
      console.warn(`[ATS Sync] Remotive API error: ${res.status}`);
      return [];
    }

    const data: { jobs?: RemotiveJobRaw[] } = await res.json();
    if (!data.jobs || !Array.isArray(data.jobs)) return [];

    const filtered = filterRawJobs(data.jobs, (j) => j.title, options);
    const limit = options.maxJobsPerCompany || 15;
    return filtered.slice(0, limit).map(mapRemotiveJob);
  } catch (err) {
    console.error("[ATS Sync] Error syncing Remotive jobs:", err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Arbeitnow Public API Ingest
// ─────────────────────────────────────────────────────────────────────────────

interface ArbeitnowJobRaw {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags?: string[];
  job_types?: string[];
  location?: string;
  created_at?: number;
}

function getArbeitnowLocation(j: ArbeitnowJobRaw): string {
  if (j.remote) {
    return j.location ? `${j.location} (Remote)` : "Remote (Global)";
  }
  return j.location || "Hybrid";
}

function mapArbeitnowJob(j: ArbeitnowJobRaw): Job {
  const cleanDesc = cleanHtmlDescription(j.description || "").slice(0, 4000);
  const cleanTitle = cleanJobText(j.title);
  const cleanCompany = cleanJobText(j.company_name);
  const locationRaw = getArbeitnowLocation(j);
  const locationName = cleanJobText(locationRaw);
  const salaryInfo = extractSalaryRange(cleanDesc);

  return {
    id: `arbeitnow-${j.slug}`,
    title: cleanTitle,
    slug: `arbeitnow-${slugify(cleanCompany)}-${j.slug}`,
    company: cleanCompany,
    companyLogoUrl: undefined,
    category: inferJobCategory(cleanTitle, (j.tags || []).join(" ")),
    location: locationName,
    remoteStatus: j.remote ? "Remote (Global)" : inferRemoteStatus(locationName),
    employmentType: "Full-time" as JobEmploymentType,
    experienceLevel: inferExperienceLevel(cleanTitle),
    salaryRange: salaryInfo.salaryRange,
    minSalary: salaryInfo.minSalary,
    currency: salaryInfo.currency,
    techStack: j.tags?.slice(0, 6) || [],
    whyApply: "Inclusive European and remote tech team offering flexible workflows and transparent communication.",
    description: cleanDesc || `${cleanTitle} opportunity at ${cleanCompany}. Direct application available.`,
    inclusiveHighlights: ["Verified Inclusive", "Salary Transparent", "Flexible Hours"],
    applyUrl: appendUtmParameters(j.url),
    source: "Arbeitnow API",
    status: "active",
    isArchived: false,
    featured: false,
    verifiedInclusive: true,
    publishedAt: j.created_at ? new Date(j.created_at * 1000).toISOString() : new Date().toISOString(),
  };
}

export async function fetchArbeitnowJobs(options: AtsSyncOptions = {}): Promise<Job[]> {
  try {
    const res = await fetch("https://www.arbeitnow.com/api/job-board-api");
    if (!res.ok) {
      console.warn(`[ATS Sync] Arbeitnow API error: ${res.status}`);
      return [];
    }

    const data: { data?: ArbeitnowJobRaw[] } = await res.json();
    if (!data.data || !Array.isArray(data.data)) return [];

    const filtered = filterRawJobs(data.data, (j) => j.title, options);
    const limit = options.maxJobsPerCompany || 15;
    return filtered.slice(0, limit).map(mapArbeitnowJob);
  } catch (err) {
    console.error("[ATS Sync] Error syncing Arbeitnow jobs:", err);
    return [];
  }
}

/**
 * Universal aggregator: fetches and aggregates active jobs across all configured ATS partners and public APIs.
 */
export async function syncAllAtsPartners(
  partners: AtsPartnerConfig[] = VETTED_ATS_PARTNERS,
  options: AtsSyncOptions = {}
): Promise<Job[]> {
  const aggregated: Job[] = [];

  for (const partner of partners) {
    let companyJobs: Job[] = [];
    if (partner.type === "greenhouse") {
      companyJobs = await fetchGreenhouseJobs(partner, options);
    } else if (partner.type === "lever") {
      companyJobs = await fetchLeverJobs(partner, options);
    } else if (partner.type === "ashby") {
      companyJobs = await fetchAshbyJobs(partner, options);
    }
    aggregated.push(...companyJobs);
  }

  // Also include curated RemoteOK, Remotive, and Arbeitnow roles
  const remoteOkJobs = await fetchRemoteOkJobs({ maxJobsPerCompany: 5 });
  aggregated.push(...remoteOkJobs);

  const remotiveJobs = await fetchRemotiveJobs({ maxJobsPerCompany: 5 });
  aggregated.push(...remotiveJobs);

  const arbeitnowJobs = await fetchArbeitnowJobs({ maxJobsPerCompany: 5 });
  aggregated.push(...arbeitnowJobs);

  return aggregated;
}
