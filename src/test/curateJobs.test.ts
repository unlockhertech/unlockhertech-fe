import { describe, it, expect } from 'vitest';
import { evaluateJobListing } from '../../scripts/curate-jobs.mjs';

describe('Job Curation & Inclusivity Vetting Engine', () => {
  it('passes a fully transparent and inclusive job listing', () => {
    const validJob = {
      title: 'Senior Frontend Engineer',
      company: 'Transparent Co',
      remoteStatus: 'Remote (Global)',
      salaryRange: '$130,000 – $160,000 USD',
      minSalary: 130000,
      description: 'Collaborate with our cross-functional team to build accessible user interfaces. We offer 16 weeks paid parental leave and asynchronous flexible hours.',
      whyApply: 'Supportive team environment with comprehensive wellness stipends.',
    };

    const { passed, issues, evaluatedJob } = evaluateJobListing(validJob);

    expect(passed).toBe(true);
    expect(issues).toHaveLength(0);
    expect(evaluatedJob.verifiedInclusive).toBe(true);
    expect(evaluatedJob.inclusiveHighlights).toContain('Salary Transparent');
    expect(evaluatedJob.inclusiveHighlights).toContain('Parental Leave');
    expect(evaluatedJob.inclusiveHighlights).toContain('Flexible Hours');
  });

  it('rejects a job listing with missing salary transparency', () => {
    const unvettedJob = {
      title: 'Software Developer',
      company: 'SecretPay Inc',
      remoteStatus: 'Remote (Global)',
      salaryRange: '',
      description: 'Competitive salary based on experience.',
    };

    const { passed, issues } = evaluateJobListing(unvettedJob);

    expect(passed).toBe(false);
    expect(issues.some((i: string) => i.includes('MISSING_SALARY_TRANSPARENCY'))).toBe(true);
  });

  it('rejects a job listing containing exclusionary buzzwords', () => {
    const toxicJob = {
      title: 'Full Stack Rockstar',
      company: 'Hustle Co',
      remoteStatus: 'Remote (Global)',
      salaryRange: '$120,000 – $150,000 USD',
      description: 'Looking for a 10x ninja developer who can crush it and work hard play hard.',
    };

    const { passed, issues } = evaluateJobListing(toxicJob);

    expect(passed).toBe(false);
    expect(issues.some((i: string) => i.includes('EXCLUSIONARY_LANGUAGE'))).toBe(true);
  });

  it('rejects a job listing with ambiguous workplace model', () => {
    const ambiguousJob = {
      title: 'Data Analyst',
      company: 'Vague Corp',
      remoteStatus: 'Everywhere & Anywhere',
      salaryRange: '$90,000 – $110,000 USD',
      description: 'Join our growing team.',
    };

    const { passed, issues } = evaluateJobListing(ambiguousJob);

    expect(passed).toBe(false);
    expect(issues.some((i: string) => i.includes('AMBIGUOUS_LOCATION'))).toBe(true);
  });
});
