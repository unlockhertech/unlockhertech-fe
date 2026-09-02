export type CategoryKey = "m1" | "m2" | "m3" | "m4";

export interface Question {
  id: string;
  catKey: CategoryKey;
  text: string;
}

export interface AssessmentCategory {
  key: CategoryKey;
  number: string;
  title: string;
  shortTitle: string;
  description: string;
  badgeColor: string;
  borderColor: string;
  activeBg: string;
}

export interface CategoryRecommendation {
  title: string;
  text: string;
}

export interface AssessmentScores {
  m1: number;
  m2: number;
  m3: number;
  m4: number;
}

export const SCORE_LABELS: Record<number, string> = {
  1: "Rarely",
  2: "Occasionally",
  3: "Sometimes",
  4: "Often",
  5: "Always",
};

export const CATEGORIES: AssessmentCategory[] = [
  {
    key: "m1",
    number: "1",
    title: "Mindset & Resilience",
    shortTitle: "Mindset",
    description: "How you handle self-doubt, failure, and long-term skill acquisition.",
    badgeColor: "bg-pink-100 text-brand-coral",
    borderColor: "border-pink-200",
    activeBg: "bg-pink-50",
  },
  {
    key: "m2",
    number: "2",
    title: "Transferable Skills Translation",
    shortTitle: "Skills Translation",
    description: "Reframing past non-tech professional experience into tech-aligned metrics.",
    badgeColor: "bg-amber-100 text-brand-yellow",
    borderColor: "border-amber-200",
    activeBg: "bg-amber-50",
  },
  {
    key: "m3",
    number: "3",
    title: "Technical Literacy & Portfolio",
    shortTitle: "Tech & Portfolio",
    description: "Understanding core software concepts, tools, and proof of work.",
    badgeColor: "bg-blue-100 text-brand-blue",
    borderColor: "border-blue-200",
    activeBg: "bg-blue-50",
  },
  {
    key: "m4",
    number: "4",
    title: "Networking & Execution Strategy",
    shortTitle: "Networking",
    description: "Proactive relationship building, LinkedIn optimization, and job search targeting.",
    badgeColor: "bg-emerald-100 text-brand-green",
    borderColor: "border-emerald-200",
    activeBg: "bg-emerald-50",
  },
];

export const QUESTIONS: Question[] = [
  // Category 1: Mindset & Resilience
  { id: "m1_q1", catKey: "m1", text: "1. I view imposter syndrome or self-doubt as proof that I am growing, rather than proof that I don't belong." },
  { id: "m1_q2", catKey: "m1", text: "2. I maintain a consistent routine (e.g., 45-60 mins daily) rather than unpredictable weekend marathons." },
  { id: "m1_q3", catKey: "m1", text: "3. When I hit a technical roadblock, I treat it as a puzzle to solve rather than a reflection of my capability." },
  { id: "m1_q4", catKey: "m1", text: "4. I treat rejections and unanswered job applications as market feedback rather than personal invalidation." },

  // Category 2: Transferable Skills Translation
  { id: "m2_q1", catKey: "m2", text: "5. I can clearly map past non-tech work (e.g., teaching, sales, operations, healthcare) to tech vocabulary on my resume." },
  { id: "m2_q2", catKey: "m2", text: "6. My resume bullet points highlight quantifiable outcomes and problem-solving rather than passive job duty lists." },
  { id: "m2_q3", catKey: "m2", text: "7. I understand how to position my vertical domain expertise (e.g., FinTech, HealthTech, EdTech) as a distinct hiring advantage." },
  { id: "m2_q4", catKey: "m2", text: "8. I am confident articulating core soft skills (stakeholder management, conflict resolution, active listening) in interview settings." },

  // Category 3: Technical Literacy & Portfolio
  { id: "m3_q1", catKey: "m3", text: "9. I understand fundamental industry concepts (e.g., APIs, Git/GitHub, Agile/Scrum, MVP, Tech Debt)." },
  { id: "m3_q2", catKey: "m3", text: "10. I am actively building original, functional projects or case studies rather than solely following video tutorials." },
  { id: "m3_q3", catKey: "m3", text: "11. I have an easily accessible online portfolio, GitHub account, or case study showcase linked on my resume/LinkedIn." },
  { id: "m3_q4", catKey: "m3", text: "12. I practice explaining my technical projects out loud using structured frameworks like the STAR method." },

  // Category 4: Networking & Execution Strategy
  { id: "m4_q1", catKey: "m4", text: "13. My LinkedIn headline explicitly states my target role, tech stack, and background rather than passive phrases like 'Aspiring Developer'." },
  { id: "m4_q2", catKey: "m4", text: "14. I actively reach out to practitioners for 15-minute informational chats rather than solely cold-applying on job boards." },
  { id: "m4_q3", catKey: "m4", text: "15. I participate in tech communities, local meetups, Slack groups, or 'Build in Public' by sharing my learning online." },
  { id: "m4_q4", catKey: "m4", text: "16. I target companies where my previous background or domain knowledge gives me an extra advantage." },
];

export const RECOMMENDATIONS: Record<CategoryKey, CategoryRecommendation> = {
  m1: {
    title: "Mindset & Resilience Focus",
    text: "Your primary growth opportunity is Mindset & Resilience. Reframe self-doubt as a natural byproduct of growth. Focus on establishing a consistent daily routine (45–60 mins) and treat technical roadblocks as puzzles to solve rather than a reflection of your capability.",
  },
  m2: {
    title: "Transferable Skills Translation Focus",
    text: "Your primary growth opportunity is Transferable Skills Translation. Transform your non-tech background into your competitive advantage by quantifying achievements, highlighting cross-functional leadership, and using tech-aligned vocabulary on your resume.",
  },
  m3: {
    title: "Technical Literacy & Portfolio Focus",
    text: "Your primary growth opportunity is Technical Proof of Work. Shift from passive tutorial watching to building 2–3 original, deployed projects with comprehensive READMEs, and practice explaining your technical decisions out loud using the STAR method.",
  },
  m4: {
    title: "Networking & Execution Strategy Focus",
    text: "Your primary growth opportunity is Strategic Networking & Execution. Replace cold job-board applications with proactive relationship building: optimize your LinkedIn headline for your target stack, participate in tech communities, and prioritize 15-minute informational chats.",
  },
};

export const TOTAL_QUESTIONS_COUNT = QUESTIONS.length;
export const MAX_CATEGORY_SCORE = 20;
export const MAX_TOTAL_SCORE = 80;
