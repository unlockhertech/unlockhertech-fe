import { jsPDF } from "jspdf";
import {
  CATEGORIES,
  MAX_TOTAL_SCORE,
  MAX_CATEGORY_SCORE,
  type AssessmentScores,
  type CategoryRecommendation,
} from "./assessmentData";
import type { ReadinessBadgeInfo } from "./useAssessment";
import { getAutoMatchedResources } from "./matchedResources";

export interface GenerateCareerPlanPdfOptions {
  scores: AssessmentScores;
  grandTotal: number;
  totalAnswered: number;
  readinessBadge: ReadinessBadgeInfo;
  recommendation: CategoryRecommendation;
  reflectionNotes?: string;
  candidateName?: string;
}

const COLOR_BERRY = [180, 41, 112] as const; // #b42970
const COLOR_CORAL = [232, 86, 58] as const;  // #e8563a
const COLOR_BLUE  = [95, 157, 227] as const; // #5f9de3
const COLOR_GREEN = [114, 196, 114] as const; // #72c472
const COLOR_DARK  = [28, 25, 23] as const;   // Stone 900
const COLOR_MUTED = [87, 83, 78] as const;   // Stone 600
const COLOR_LIGHT = [248, 248, 247] as const; // Stone 50
const COLOR_BORDER = [229, 231, 235] as const; // Grey 200

const CATEGORY_COLOR_MAP: Record<string, readonly [number, number, number]> = {
  m1: COLOR_BERRY,
  m2: COLOR_CORAL,
  m3: COLOR_BLUE,
  m4: COLOR_GREEN,
};

const CATEGORY_ACTION_ITEMS: Record<string, string[]> = {
  m1: [
    "Establish a sustainable daily 45-60 minute study habit rather than sporadic weekend cramming.",
    "Track a 'Small Wins' journal to log completed exercises and counter imposter syndrome.",
    "Treat interview rejections as objective market feedback to refine your preparation strategy.",
  ],
  m2: [
    "Rewrite past resume bullets to lead with quantifiable business impact and tech terminology.",
    "Document your vertical domain strengths (e.g. Finance, Healthcare, Retail) as unique value props.",
    "Practice translating soft skills (stakeholder management, conflict resolution) in mock interviews.",
  ],
  m3: [
    "Move from tutorial consumption to building 2 original, end-to-end portfolio projects.",
    "Practice articulating your architecture decisions out loud using the STAR method.",
    "Join live technical sessions (like She Leads Tech) to get comfortable thinking aloud.",
  ],
  m4: [
    "Optimize your LinkedIn headline to clearly state your target role, stack, and domain focus.",
    "Conduct 2-3 informal informational chats per month with working engineers in your target field.",
    "Engage actively in developer communities, share your learning publicly, and attend meetups.",
  ],
};

/**
 * Sanitises strings for jsPDF standard fonts (Helvetica, Times, Courier)
 * which only support WinAnsi / ASCII (0-255).
 * Removes emojis and replaces Unicode symbols (bullets, em-dashes, smart quotes)
 * with clean printable ASCII equivalents to prevent corrupted characters like Ø<ß¯, Ø=Ü», Ø=ÜÚ.
 */
export function sanitizeForPdf(text: string): string {
  if (!text) return "";
  return text
    // Replace smart quotes and apostrophes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Replace dashes
    .replace(/[\u2013\u2014]/g, "-")
    // Replace bullets
    .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, "|")
    // Replace ellipsis
    .replaceAll('\u2026', "...")
    // Strip emojis and miscellaneous symbols outside ASCII printable range
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/[\uFE00-\uFE0F]/g, "")
    // Remove any remaining non-ASCII characters that corrupt standard PDF encoding
    .replace(/[^\x20-\x7E\r\n\t]/g, "")
    // Clean up redundant spaces created by removed emojis
    .replace(/ +/g, " ")
    .trim();
}

export async function generateCareerPlanPdf({
  scores,
  grandTotal,
  totalAnswered,
  readinessBadge,
  recommendation,
  reflectionNotes = "",
  candidateName,
}: GenerateCareerPlanPdfOptions): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 16;
  const contentWidth = pageWidth - marginX * 2; // 178mm

  const todayStr = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const cleanBadgeText = sanitizeForPdf(readinessBadge.text);
  const cleanRecTitle = sanitizeForPdf(recommendation.title);
  const cleanRecText = sanitizeForPdf(recommendation.text);
  const cleanNotes = sanitizeForPdf(reflectionNotes);

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 1: Executive Summary & Dimensional Breakdown
  // ═══════════════════════════════════════════════════════════════════════════

  // 1. Header Banner
  doc.setFillColor(...COLOR_BERRY);
  doc.rect(0, 0, pageWidth, 32, "F");

  // Accent Bottom Stripe
  doc.setFillColor(...COLOR_CORAL);
  doc.rect(0, 31, pageWidth, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("UNLOCK HER TECH  |  CAREER TRANSITION ROADMAP", marginX, 11);

  doc.setFontSize(16);
  doc.text("Personalized Tech Career Action Plan", marginX, 19);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const candidateText = candidateName ? `Candidate: ${sanitizeForPdf(candidateName)}  |  ` : "";
  doc.text(`${candidateText}Generated on ${todayStr}  |  Confidential Report`, marginX, 26);

  // 2. Score Overview Hero Card
  let currentY = 38;
  doc.setFillColor(...COLOR_LIGHT);
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, currentY, contentWidth, 34, 3, 3, "FD");

  // Left: Overall Score Callout
  doc.setTextColor(...COLOR_MUTED);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("OVERALL READINESS SCORE", marginX + 6, currentY + 8);

  doc.setTextColor(...COLOR_BERRY);
  doc.setFontSize(22);
  doc.text(`${grandTotal}`, marginX + 6, currentY + 19);

  doc.setTextColor(...COLOR_MUTED);
  doc.setFontSize(10);
  doc.text(`/ ${MAX_TOTAL_SCORE}`, marginX + 26, currentY + 19);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  const completionPercent = Math.round((totalAnswered / 16) * 100);
  doc.text(`${totalAnswered}/16 Factors Evaluated (${completionPercent}% Complete)`, marginX + 6, currentY + 26);

  // Divider inside hero card
  doc.setDrawColor(...COLOR_BORDER);
  doc.line(marginX + 66, currentY + 4, marginX + 66, currentY + 30);

  // Right: Readiness Status & Interpretation
  const rightX = marginX + 72;
  doc.setTextColor(...COLOR_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("CURRENT READINESS LEVEL", rightX, currentY + 8);

  // Clean Badge Box
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(...COLOR_CORAL);
  doc.roundedRect(rightX, currentY + 11, 98, 7, 2, 2, "FD");
  doc.setTextColor(...COLOR_CORAL);
  doc.setFontSize(8.5);
  doc.text(cleanBadgeText, rightX + 3, currentY + 15.5);

  doc.setTextColor(...COLOR_MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  const getSummaryExplanation = (total: number): string => {
    if (total >= 65) {
      return "You demonstrate strong foundations across mindsets, technical fluency, and strategy. Prioritize high-leverage portfolio projects and direct networking to secure interviews.";
    }
    if (total >= 45) {
      return "You have solid momentum in core competency areas. Focus on bridging identified gap areas and maintaining consistent practice routines.";
    }
    return "You are in the foundational discovery stage. Focus on daily study habits, basic conceptual models, and connecting with supportive peer communities.";
  };
  const summaryExplanation = getSummaryExplanation(grandTotal);
  
  const splitSummary = doc.splitTextToSize(summaryExplanation, 98);
  doc.text(splitSummary, rightX, currentY + 22);

  // 3. Section Title: Dimensional Competencies
  currentY = 78;
  doc.setTextColor(...COLOR_BERRY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("1. Four Dimensional Competency Scores", marginX, currentY);

  doc.setDrawColor(...COLOR_BERRY);
  doc.setLineWidth(0.4);
  doc.line(marginX, currentY + 2, marginX + contentWidth, currentY + 2);

  // 4. Dimensional Cards Grid / Rows
  currentY = 85;
  CATEGORIES.forEach((cat, index) => {
    const catScore = scores[cat.key];
    const catPercent = Math.min(100, Math.round((catScore / MAX_CATEGORY_SCORE) * 100));
    const catColor = CATEGORY_COLOR_MAP[cat.key] || COLOR_BERRY;

    const cardHeight = 24;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginX, currentY, contentWidth, cardHeight, 2.5, 2.5, "FD");

    // Left coloured accent indicator
    doc.setFillColor(...catColor);
    doc.roundedRect(marginX, currentY, 3, cardHeight, 1.5, 1.5, "F");

    // Title & Number
    doc.setTextColor(...COLOR_DARK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`${index + 1}. ${sanitizeForPdf(cat.title)}`, marginX + 6, currentY + 6);

    // Score on right
    doc.setTextColor(...catColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(`${catScore} / ${MAX_CATEGORY_SCORE} (${catPercent}%)`, marginX + contentWidth - 6, currentY + 6, { align: "right" });

    // Description
    doc.setTextColor(...COLOR_MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(sanitizeForPdf(cat.description), marginX + 6, currentY + 11.5);

    // Progress Bar Track
    const barX = marginX + 6;
    const barY = currentY + 16;
    const barWidth = contentWidth - 12;
    const barHeight = 3.5;

    doc.setFillColor(243, 244, 246);
    doc.roundedRect(barX, barY, barWidth, barHeight, 1.5, 1.5, "F");

    // Filled progress
    if (catPercent > 0) {
      const fillWidth = Math.max(3, (barWidth * catPercent) / 100);
      doc.setFillColor(...catColor);
      doc.roundedRect(barX, barY, fillWidth, barHeight, 1.5, 1.5, "F");
    }

    currentY += cardHeight + 4;
  });

  // 5. Page 1 Footer
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.line(marginX, pageHeight - 14, marginX + contentWidth, pageHeight - 14);

  doc.setTextColor(...COLOR_MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Unlock Her Tech  |  Where Skills Grow And Voices Are Heard  |  unlockhertech.com", marginX, pageHeight - 9);
  doc.text("Page 1 of 2", marginX + contentWidth, pageHeight - 9, { align: "right" });

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 2: Strategic Action Plan & Personal Roadmap
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage();

  // Page 2 Header Banner
  doc.setFillColor(...COLOR_BERRY);
  doc.rect(0, 0, pageWidth, 22, "F");

  doc.setFillColor(...COLOR_CORAL);
  doc.rect(0, 21, pageWidth, 1.5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("UNLOCK HER TECH  |  STRATEGIC RECOMMENDATIONS", marginX, 9);

  doc.setFontSize(13);
  doc.text("Personalized Growth Plan & Next Milestones", marginX, 16);

  // Section 2: Priority Focus Area
  currentY = 29;
  doc.setTextColor(...COLOR_BERRY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("2. Priority Growth Focus", marginX, currentY);

  doc.setDrawColor(...COLOR_BERRY);
  doc.setLineWidth(0.4);
  doc.line(marginX, currentY + 2, marginX + contentWidth, currentY + 2);

  currentY = 36;
  // Recommendation Box
  doc.setFillColor(255, 251, 235); // Amber 50
  doc.setDrawColor(251, 191, 36);  // Amber 400
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, currentY, contentWidth, 48, 3, 3, "FD");

  doc.setTextColor(...COLOR_CORAL);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(`[Priority Focus] ${cleanRecTitle}`, marginX + 6, currentY + 7);

  doc.setTextColor(...COLOR_DARK);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const recTextLines = doc.splitTextToSize(cleanRecText, contentWidth - 12);
  doc.text(recTextLines, marginX + 6, currentY + 13);

  // Action checklist items for this area
  doc.setTextColor(...COLOR_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Recommended Action Steps:", marginX + 6, currentY + 26);

  // Find lowest key based on recommendation title
  const matchingCat = CATEGORIES.find((c) => recommendation.title.toLowerCase().includes(c.shortTitle.toLowerCase())) || CATEGORIES[0];
  const actionItems = CATEGORY_ACTION_ITEMS[matchingCat.key] || CATEGORY_ACTION_ITEMS.m1;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  let actionY = currentY + 31;
  actionItems.forEach((item) => {
    // Checkbox square
    doc.setDrawColor(...COLOR_CORAL);
    doc.rect(marginX + 6, actionY - 2.5, 3, 3);
    
    doc.setTextColor(...COLOR_MUTED);
    const itemLines = doc.splitTextToSize(sanitizeForPdf(item), contentWidth - 18);
    doc.text(itemLines, marginX + 11, actionY);
    actionY += 5;
  });

  // Section 3: Personal Reflection Commitments
  currentY = 90;
  doc.setTextColor(...COLOR_BERRY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("3. Your Personal Action Commitments", marginX, currentY);

  doc.setDrawColor(...COLOR_BERRY);
  doc.setLineWidth(0.4);
  doc.line(marginX, currentY + 2, marginX + contentWidth, currentY + 2);

  currentY = 97;
  doc.setFillColor(...COLOR_LIGHT);
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, currentY, contentWidth, 38, 3, 3, "FD");

  doc.setTextColor(...COLOR_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Notes Recorded During Assessment:", marginX + 6, currentY + 6.5);

  if (cleanNotes) {
    doc.setTextColor(...COLOR_DARK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const splitNotes = doc.splitTextToSize(cleanNotes, contentWidth - 12);
    doc.text(splitNotes, marginX + 6, currentY + 13);
  } else {
    doc.setTextColor(...COLOR_MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text("No specific notes entered. Use these lines to write your top 3 commitments:", marginX + 6, currentY + 12);

    doc.setDrawColor(209, 213, 219);
    doc.line(marginX + 6, currentY + 19, marginX + contentWidth - 6, currentY + 19);
    doc.line(marginX + 6, currentY + 26, marginX + contentWidth - 6, currentY + 26);
    doc.line(marginX + 6, currentY + 33, marginX + contentWidth - 6, currentY + 33);
  }

  // Section 4: Ecosystem Resources & Next Steps
  currentY = 142;
  doc.setTextColor(...COLOR_BERRY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("4. Auto-Matched Resources Tailored to Your Growth Areas", marginX, currentY);

  doc.setDrawColor(...COLOR_BERRY);
  doc.setLineWidth(0.4);
  doc.line(marginX, currentY + 2, marginX + contentWidth, currentY + 2);

  currentY = 149;
  const autoMatches = getAutoMatchedResources(scores, totalAnswered);
  const primaryMatch = autoMatches[0];
  const matchedList = primaryMatch ? primaryMatch.resources.slice(0, 3) : [];

  const resourceCards = matchedList.length > 0
    ? matchedList.map((res) => ({
        title: sanitizeForPdf(res.title),
        desc: sanitizeForPdf(res.description),
        link: res.isExternal ? "pod.link/1800087284" : `unlockhertech.com${res.url}`,
      }))
    : [
        {
          title: "She Leads Tech",
          desc: "Interactive workshops (Theory, Practice, Review). Master engineering and interview concepts together in a supportive environment.",
          link: "unlockhertech.com/practices",
        },
        {
          title: "Unlock Her Tech Podcast",
          desc: "Listen to authentic stories from women in engineering, tech founders, and career switchers.",
          link: "pod.link/1800087284 (Spotify, Apple & YouTube)",
        },
        {
          title: "Free Career Playbooks & Guides",
          desc: "Download curated PDF frameworks for non-tech to tech switchers, interview prep, and salary negotiation.",
          link: "unlockhertech.com/resources",
        },
      ];

  resourceCards.forEach((res) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginX, currentY, contentWidth, 18, 2, 2, "FD");

    doc.setTextColor(...COLOR_BERRY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(res.title, marginX + 5, currentY + 5.5);

    doc.setTextColor(...COLOR_MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(res.desc, marginX + 5, currentY + 10.5);

    doc.setTextColor(...COLOR_CORAL);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(`Link: ${res.link}`, marginX + 5, currentY + 15);

    currentY += 21;
  });

  // Community Encouragement Box
  currentY = 217;
  doc.setFillColor(253, 242, 248); // Pink 50
  doc.setDrawColor(244, 160, 180); // Pink 300
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, currentY, contentWidth, 23, 2.5, 2.5, "FD");

  doc.setTextColor(...COLOR_BERRY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("You belong in tech.", marginX + 6, currentY + 6.5);

  doc.setTextColor(...COLOR_DARK);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Every expert was once a beginner. Progress happens one daily habit, one project, and one conversation at a time.", marginX + 6, currentY + 12);
  doc.text("- Pritanya Fritz & Ellie Tahmasebi, Co-Founders, Unlock Her Tech", marginX + 6, currentY + 17.5);

  // Page 2 Footer
  doc.setDrawColor(...COLOR_BORDER);
  doc.setLineWidth(0.3);
  doc.line(marginX, pageHeight - 14, marginX + contentWidth, pageHeight - 14);

  doc.setTextColor(...COLOR_MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text("Unlock Her Tech  |  Personalized Roadmap Report  |  unlockhertech.com", marginX, pageHeight - 9);
  doc.text("Page 2 of 2", marginX + contentWidth, pageHeight - 9, { align: "right" });

  // Save the PDF file
  const sanitizedDate = todayStr.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  doc.save(`unlock-her-tech-career-plan-${sanitizedDate}.pdf`);
}
