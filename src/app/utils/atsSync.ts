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
 * Utility to detect and fix double-encoded UTF-8 / Windows-1252 mojibake artifacts
 * (e.g. â€™ -> ’, â€” -> —, â€¦ -> …, â€¢ -> •, Â§ -> §)
 */
export function cleanMojibake(input: string): string {
  if (!input) return "";

  let str = input;

  // 1. Direct character-level mojibake replacements (UTF-8 bytes misdecoded as Latin1)
  str = str
    // Dashes & Hyphens first (to prevent prefix collisions)
    .replace(/\u00E2\u0080\u0094|â\u0080\u0094|â€”/g, "—")
    .replace(/\u00E2\u0080\u0093|â\u0080\u0093|â€“/g, "–")
    // Punctuation & Symbols
    .replace(/\u00E2\u0080\u00A6|â\u0080\u00A6|â\u0080¦|â€¦/g, "…")
    .replace(/\u00E2\u0080\u00A2|â\u0080\u00A2|â€¢/g, "•")
    .replace(/\u00E2\u0084\u00A2|â\u0084\u00A2|â„¢/g, "™")
    // Quotation marks & apostrophes
    .replace(/\u00E2\u0080\u0099|â\u0080\u0099|â€™/g, "’")
    .replace(/\u00E2\u0080\u0098|â\u0080\u0098|â€˜/g, "‘")
    .replace(/\u00E2\u0080\u009C|â\u0080\u009C|â€œ/g, "“")
    .replace(/\u00E2\u0080\u009D|â\u0080\u009D|â€\u009D|â€(?![—–…•™\u0080-\u00BF])/g, "”")
    // Latin-1 symbol prefixes
    .replace(/\u00C2\u00A9|Â©/g, "©")
    .replace(/\u00C2\u00AE|Â®/g, "®")
    .replace(/\u00C2\u00A7|Â§/g, "§")
    .replace(/\u00C2\u00B7|Â·/g, "·")
    .replace(/\u00C2\u00B0|Â°/g, "°")
    .replace(/\u00C2\u00B1|Â±/g, "±")
    .replace(/\u00C2\u00A3|Â£/g, "£")
    .replace(/\u00C2\u00A5|Â¥/g, "¥")
    .replace(/\u00C2\u0080|Â€/g, "€")
    .replace(/\u00C2\u00A0|Â /g, " ")
    .replace(/\u00C2/g, "")
    // Accented characters
    .replace(/\u00C3\u00A9|Ã©/g, "é")
    .replace(/\u00C3\u00A8|Ã¨/g, "è")
    .replace(/\u00C3\u00A1|Ã¡/g, "á")
    .replace(/\u00C3\u00A0|Ã /g, "à")
    .replace(/\u00C3\u00B3|Ã³/g, "ó")
    .replace(/\u00C3\u00B2|Ã²/g, "ò")
    .replace(/\u00C3\u00BA|Ãº/g, "ú")
    .replace(/\u00C3\u00B9|Ã¹/g, "ù")
    .replace(/\u00C3\u00AD|Ã­/g, "í")
    .replace(/\u00C3\u00AC|Ã¬/g, "ì")
    .replace(/\u00C3\u00B1|Ã±/g, "ñ")
    .replace(/\u00C3\u00A7|Ã§/g, "ç")
    .replace(/\u00C3\u00A3|Ã£/g, "ã")
    .replace(/\u00C3\u00AA|Ãª/g, "ê")
    .replace(/\u00C3\u00BC|Ã¼/g, "ü")
    .replace(/\u00C3\u00B6|Ã¶/g, "ö")
    .replace(/\u00C3\u00A4|Ã¤/g, "ä")
    .replace(/\u00C3\u0081|Ã\x81/g, "Á")
    .replace(/\u00F0\u009F\u008D\u0094|ð\x9F\x8D\x94/g, "🍔");

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
        return !Number.isNaN(code) && code > 0 ? String.fromCharCode(code) : "";
      })
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
        const code = Number.parseInt(hex, 16);
        return !Number.isNaN(code) && code > 0 ? String.fromCharCode(code) : "";
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
  
  // 1. First pass entity decoding and mojibake cleanup
  let text = decodeHtmlEntities(rawHtml);

  // 2. Remove script and style elements completely
  text = text
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  // 3. Format list items and break tags
  text = text
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|header|aside|tr|table|h[1-6])>/gi, "\n\n")
    .replace(/<(p|div|section|article|header|aside|tr|table|h[1-6])[^>]*>/gi, "\n");

  // 4. Strip any other HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // 5. Final entity decoding pass
  text = decodeHtmlEntities(text);

  // 6. Normalize newlines, collapse excessive empty lines and spaces
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
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

/**
 * Infer job category from title and department names.
 */
export function inferJobCategory(title: string, department: string = ""): JobCategory {
  const t = title.toLowerCase();
  const combined = `${title} ${department}`.toLowerCase();
  
  if (t.includes("contract") || t.includes("freelance")) {
    return "Freelance & Contract";
  }

  if (
    t.includes("data") ||
    t.includes("analytics") ||
    t.includes("machine learning") ||
    t.includes("scientist") ||
    t.includes("bi developer") ||
    t.includes("ai ") ||
    t.includes("ai-")
  ) {
    return "Data & Research";
  }

  if (
    t.includes("frontend") ||
    t.includes("backend") ||
    t.includes("full stack") ||
    t.includes("software") ||
    t.includes("engineer") ||
    t.includes("developer") ||
    t.includes("devops") ||
    t.includes("cloud") ||
    t.includes("qa") ||
    t.includes("platform") ||
    t.includes("architect")
  ) {
    return "Engineering & Dev";
  }

  if (
    combined.includes("designer") ||
    combined.includes("product manager") ||
    combined.includes("ux") ||
    combined.includes("ui") ||
    combined.includes("design") ||
    combined.includes("product owner")
  ) {
    return "Product & Design";
  }

  if (
    combined.includes("data") ||
    combined.includes("analytics") ||
    combined.includes("scientist")
  ) {
    return "Data & Research";
  }

  if (
    combined.includes("engineer") ||
    combined.includes("developer")
  ) {
    return "Engineering & Dev";
  }

  return "Non-Technical Tech";
}

/**
 * Infer workplace remote model from location string.
 */
export function inferRemoteStatus(locationName: string = ""): JobRemoteStatus {
  const loc = locationName.toLowerCase();

  if (loc.includes("hybrid")) {
    return "Hybrid";
  }
  if (loc.includes("on-site") || loc.includes("onsite")) {
    return "On-site";
  }
  if (loc.includes("global") || loc.includes("anywhere") || loc.includes("worldwide")) {
    return "Remote (Global)";
  }
  if (loc.includes("uk") || loc.includes("europe") || loc.includes("london") || loc.includes("emea")) {
    return "Remote (UK/Europe)";
  }
  if (
    loc.includes("us") ||
    loc.includes("usa") ||
    loc.includes("united states") ||
    loc.includes("canada") ||
    loc.includes("americas") ||
    loc.includes("san francisco") ||
    loc.includes("new york")
  ) {
    return "Remote (US/Americas)";
  }
  if (loc.includes("remote")) {
    return "Remote (Global)";
  }
  return "Hybrid";
}

/**
 * Infer experience level from title.
 */
export function inferExperienceLevel(title: string): JobExperienceLevel {
  const t = title.toLowerCase();
  if (t.includes("junior") || t.includes("associate") || t.includes("entry") || t.includes("graduate") || t.includes("intern")) {
    return "Junior";
  }
  if (t.includes("staff") || t.includes("principal") || t.includes("lead") || t.includes("head")) {
    return "Lead / Staff";
  }
  if (t.includes("director") || t.includes("vp") || t.includes("executive") || t.includes("chief")) {
    return "Executive";
  }
  if (t.includes("senior") || t.includes("sr") || t.includes("sr.")) {
    return "Senior";
  }
  return "Mid-Level";
}

/**
 * Parses salary ranges or extracts pay from job descriptions/metadata.
 */
export function extractSalaryRange(
  text: string,
  defaultCurrency = "USD"
): { salaryRange: string; minSalary: number; currency: string } {
  // Regex matches $120k-$150k or $120,000 - $150,000 or £80,000 - £100,000 or €90,000
  const salaryRegex = /(?:(\$|£|€)\s*(\d{2,3}k|\d{2,3}(?:,\d{3})*)\s*(?:-|–|to)\s*(?:\$|£|€)?\s*(\d{2,3}k|\d{2,3}(?:,\d{3})*))/i;
  const match = text.match(salaryRegex);

  if (match) {
    const symbol = match[1];
    const currency = symbol === "£" ? "GBP" : symbol === "€" ? "EUR" : "USD";
    const rawMin = match[2].toLowerCase().replace(/,/g, "");
    const minVal = rawMin.endsWith("k") ? parseFloat(rawMin) * 1000 : parseFloat(rawMin);
    
    return {
      salaryRange: match[0].trim(),
      minSalary: Math.round(minVal),
      currency,
    };
  }

  // Single figure fallback
  const singleRegex = /(?:(\$|£|€)\s*(\d{2,3}k|\d{2,3}(?:,\d{3})*))/i;
  const singleMatch = text.match(singleRegex);
  if (singleMatch) {
    const symbol = singleMatch[1];
    const currency = symbol === "£" ? "GBP" : symbol === "€" ? "EUR" : "USD";
    const rawMin = singleMatch[2].toLowerCase().replace(/,/g, "");
    const minVal = rawMin.endsWith("k") ? parseFloat(rawMin) * 1000 : parseFloat(rawMin);

    return {
      salaryRange: `${singleMatch[0].trim()}+ ${currency}`,
      minSalary: Math.round(minVal),
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

    let rawList = data.jobs;
    if (options.filterKeywords && options.filterKeywords.length > 0) {
      rawList = rawList.filter((j) =>
        options.filterKeywords?.some((k) => j.title.toLowerCase().includes(k.toLowerCase()))
      );
    }
    if (options.maxJobsPerCompany && options.maxJobsPerCompany > 0) {
      rawList = rawList.slice(0, options.maxJobsPerCompany);
    }

    return rawList.map((j) => {
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
    });
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

    let rawList = data;
    if (options.filterKeywords && options.filterKeywords.length > 0) {
      rawList = rawList.filter((j) =>
        options.filterKeywords?.some((k) => j.text.toLowerCase().includes(k.toLowerCase()))
      );
    }
    if (options.maxJobsPerCompany && options.maxJobsPerCompany > 0) {
      rawList = rawList.slice(0, options.maxJobsPerCompany);
    }

    return rawList.map((j) => {
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
    });
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
  } catch {
    return url;
  }
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

    let rawList = data.jobs;
    if (options.filterKeywords && options.filterKeywords.length > 0) {
      rawList = rawList.filter((j) =>
        options.filterKeywords?.some((k) => j.title.toLowerCase().includes(k.toLowerCase()))
      );
    }
    if (options.maxJobsPerCompany && options.maxJobsPerCompany > 0) {
      rawList = rawList.slice(0, options.maxJobsPerCompany);
    }

    return rawList.map((j) => {
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
    });
  } catch (err) {
    console.error(`[ATS Sync] Error syncing Ashby jobs for ${partner.company}:`, err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RemoteOK Public API Ingest
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchRemoteOkJobs(options: AtsSyncOptions = {}): Promise<Job[]> {
  try {
    const res = await fetch("https://remoteok.com/api", {
      headers: { "User-Agent": "UnlockHerTech-JobCuration/1.0" },
    });
    if (!res.ok) return [];

    const data: Array<{
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
    }> = await res.json();

    if (!Array.isArray(data)) return [];

    const validJobs = data.filter((j) => j.position && (j.apply_url || j.url));
    const limit = options.maxJobsPerCompany || 15;

    return validJobs.slice(0, limit).map((j) => {
      const cleanDesc = cleanHtmlDescription(j.description || "").slice(0, 4000);
      const cleanTitle = cleanJobText(j.position || "Remote Specialist");
      const cleanCompany = cleanJobText(j.company || "Remote Co");
      const locationName = cleanJobText(j.location || "Remote (Global)");
      const hasSalary = (j.salary_min && j.salary_min > 0) || (j.salary_max && j.salary_max > 0);
      const salaryRange = hasSalary
        ? `$${j.salary_min?.toLocaleString()} – $${j.salary_max?.toLocaleString()} USD`
        : extractSalaryRange(cleanDesc).salaryRange;

      const minSalary = j.salary_min || extractSalaryRange(cleanDesc).minSalary;
      const targetUrl = j.apply_url || j.url || `https://remoteok.com/remote-jobs/${j.slug}`;

      return {
        id: `remoteok-${j.id || j.slug || Math.random().toString(36).slice(2)}`,
        title: cleanTitle,
        slug: `${slugify(cleanCompany)}-${slugify(cleanTitle)}-${j.id || slugify(j.slug || "")}`,
        company: cleanCompany,
        companyLogoUrl: j.company_logo,
        category: inferJobCategory(cleanTitle, (j.tags || []).join(" ")),
        location: locationName,
        remoteStatus: inferRemoteStatus(locationName),
        employmentType: "Full-time" as JobEmploymentType,
        experienceLevel: inferExperienceLevel(cleanTitle),
        salaryRange,
        minSalary,
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
    });
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

export async function fetchRemotiveJobs(options: AtsSyncOptions = {}): Promise<Job[]> {
  try {
    const res = await fetch("https://remotive.com/api/remote-jobs?limit=25");
    if (!res.ok) {
      console.warn(`[ATS Sync] Remotive API error: ${res.status}`);
      return [];
    }

    const data: { jobs?: RemotiveJobRaw[] } = await res.json();
    if (!data.jobs || !Array.isArray(data.jobs)) return [];

    let rawList = data.jobs;
    if (options.filterKeywords && options.filterKeywords.length > 0) {
      rawList = rawList.filter((j) =>
        options.filterKeywords?.some((k) => j.title.toLowerCase().includes(k.toLowerCase()))
      );
    }
    const limit = options.maxJobsPerCompany || 15;
    rawList = rawList.slice(0, limit);

    return rawList.map((j) => {
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
    });
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

export async function fetchArbeitnowJobs(options: AtsSyncOptions = {}): Promise<Job[]> {
  try {
    const res = await fetch("https://www.arbeitnow.com/api/job-board-api");
    if (!res.ok) {
      console.warn(`[ATS Sync] Arbeitnow API error: ${res.status}`);
      return [];
    }

    const data: { data?: ArbeitnowJobRaw[] } = await res.json();
    if (!data.data || !Array.isArray(data.data)) return [];

    let rawList = data.data;
    if (options.filterKeywords && options.filterKeywords.length > 0) {
      rawList = rawList.filter((j) =>
        options.filterKeywords?.some((k) => j.title.toLowerCase().includes(k.toLowerCase()))
      );
    }
    const limit = options.maxJobsPerCompany || 15;
    rawList = rawList.slice(0, limit);

    return rawList.map((j) => {
      const cleanDesc = cleanHtmlDescription(j.description || "").slice(0, 4000);
      const cleanTitle = cleanJobText(j.title);
      const cleanCompany = cleanJobText(j.company_name);
      const locationRaw = j.remote ? (j.location ? `${j.location} (Remote)` : "Remote (Global)") : j.location || "Hybrid";
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
    });
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
