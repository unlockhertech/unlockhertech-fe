import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  decodeHtmlEntities,
  cleanJobText,
  cleanHtmlDescription,
  extractSalaryRange,
  inferJobCategory,
  inferRemoteStatus,
  inferExperienceLevel,
  slugify,
  appendUtmParameters,
  fetchGreenhouseJobs,
  fetchRemotiveJobs,
  fetchArbeitnowJobs,
} from '../app/utils/atsSync';

describe('ATS Sync and Ingestion Engine', () => {
  describe('decodeHtmlEntities and cleanJobText', () => {
    it('decodes named and numeric HTML entities accurately', () => {
      expect(decodeHtmlEntities('Engineering &amp; Operations')).toBe('Engineering & Operations');
      expect(decodeHtmlEntities('Jane &#38; John&#39;s Team')).toBe("Jane & John's Team");
      expect(decodeHtmlEntities('Pay: &#36;120k &ndash; &#36;150k')).toBe('Pay: $120k – $150k');
      expect(decodeHtmlEntities('&quot;Inclusive Culture&quot;')).toBe('"Inclusive Culture"');
    });

    it('handles double-encoded entities', () => {
      expect(decodeHtmlEntities('Company &amp;amp; Co')).toBe('Company & Co');
    });

    it('fixes double-encoded UTF-8 mojibake (â€™, â€”, â€¦, Â§, etc.)', () => {
      expect(cleanJobText('WHAT YOUâ€™LL DO')).toBe('WHAT YOU’LL DO');
      expect(cleanJobText('every roleâ€”from Sales Advisors')).toBe('every role—from Sales Advisors');
      expect(cleanJobText('people withâ€¦')).toBe('people with…');
      expect(cleanJobText('things â€“ our inclusive')).toBe('things – our inclusive');
      expect(cleanJobText('Under 8 U.S.C. Â§ 1157')).toBe('Under 8 U.S.C. § 1157');
    });

    it('cleans job titles and company names properly', () => {
      expect(cleanJobText('  <strong>Senior Engineer</strong> &amp; Architect  ')).toBe('Senior Engineer & Architect');
      expect(cleanJobText('Work &amp; Co ')).toBe('Work & Co');
    });
  });

  describe('cleanHtmlDescription', () => {
    it('cleans HTML tags and decodes common HTML entities into readable text', () => {
      const raw = '<p>We are seeking a <strong>Senior Engineer</strong> &amp; Architect.</p><br/><p>Pay &ndash; transparent &mdash; rate &#39;best&#39;.</p>';
      const cleaned = cleanHtmlDescription(raw);
      expect(cleaned).toContain('Senior Engineer & Architect');
      expect(cleaned).toContain('Pay – transparent — rate \'best\'');
      expect(cleaned).not.toContain('<p>');
      expect(cleaned).not.toContain('<strong>');
    });

    it('collapses excessive vertical white space and formats list items cleanly', () => {
      const rawWithWhitespace = `
        <div>
          <p>Role summary</p>
          <br/><br/><br/>
          <ul>
            <li>First responsibility</li>
            <li>Second responsibility</li>
          </ul>
        </div>
      `;
      const cleaned = cleanHtmlDescription(rawWithWhitespace);
      expect(cleaned).not.toContain('\n\n\n');
      expect(cleaned).toContain('• First responsibility');
      expect(cleaned).toContain('• Second responsibility');
    });

    it('returns empty string for falsy input', () => {
      expect(cleanHtmlDescription('')).toBe('');
    });
  });

  describe('extractSalaryRange', () => {
    it('extracts explicit salary ranges with currency symbols', () => {
      const res = extractSalaryRange('Compensation: $140,000 - $175,000 per year');
      expect(res.salaryRange).toBe('$140,000 - $175,000');
      expect(res.minSalary).toBe(140000);
      expect(res.currency).toBe('USD');
    });

    it('extracts single minimum figures with k abbreviation', () => {
      const res = extractSalaryRange('Starting at £95k per year');
      expect(res.salaryRange).toContain('£95k+ GBP');
      expect(res.minSalary).toBe(95000);
      expect(res.currency).toBe('GBP');
    });

    it('returns transparent band fallback when no figure is provided', () => {
      const res = extractSalaryRange('Competitive pay with standard benefits');
      expect(res.salaryRange).toBe('Competitive & Transparent Band');
      expect(res.minSalary).toBe(0);
    });
  });

  describe('Taxonomy Inferrers', () => {
    it('infers category correctly', () => {
      expect(inferJobCategory('Staff Frontend Engineer')).toBe('Engineering & Dev');
      expect(inferJobCategory('Lead Product Designer')).toBe('Product & Design');
      expect(inferJobCategory('Machine Learning Scientist')).toBe('Data & Research');
      expect(inferJobCategory('Contract Technical Writer')).toBe('Freelance & Contract');
    });

    it('infers remote status correctly', () => {
      expect(inferRemoteStatus('Remote, US')).toBe('Remote (US/Americas)');
      expect(inferRemoteStatus('London, UK')).toBe('Remote (UK/Europe)');
      expect(inferRemoteStatus('Anywhere')).toBe('Remote (Global)');
      expect(inferRemoteStatus('On-site Office')).toBe('On-site');
    });

    it('infers experience level correctly', () => {
      expect(inferExperienceLevel('Junior Frontend Developer')).toBe('Junior');
      expect(inferExperienceLevel('Senior Backend Engineer')).toBe('Senior');
      expect(inferExperienceLevel('Staff Platform Architect')).toBe('Lead / Staff');
      expect(inferExperienceLevel('Engineering Director')).toBe('Executive');
      expect(inferExperienceLevel('Software Engineer')).toBe('Mid-Level');
    });
  });

  describe('appendUtmParameters & slugify', () => {
    it('attaches UTM parameters to requisition URLs', () => {
      const url = appendUtmParameters('https://job-boards.greenhouse.io/gitlab/jobs/123');
      expect(url).toContain('utm_source=unlockhertech');
      expect(url).toContain('utm_medium=job_board');
      expect(url).toContain('utm_campaign=inclusive_careers');
    });

    it('slugifies titles and companies cleanly', () => {
      expect(slugify('GitLab Senior Full-Stack Engineer! #1')).toBe('gitlab-senior-full-stack-engineer-1');
    });
  });

  describe('Sanity Fallback Dataset', () => {
    it('loads more than 10 vetted jobs from fallback data', async () => {
      const realSanity = await vi.importActual<typeof import('../app/utils/sanity')>('../app/utils/sanity');
      expect(realSanity.CURATED_SEED_JOBS.length).toBeGreaterThan(10);
      const jobs = await realSanity.getAllJobs();
      expect(jobs.length).toBeGreaterThan(10);
      
      // Ensure all jobs have valid application URLs, non-empty descriptions, whyApply, and decoded entities
      jobs.forEach((job) => {
        expect(job.title).toBeTruthy();
        expect(job.company).toBeTruthy();
        expect(job.applyUrl).toMatch(/^https?:\/\//);
        expect(job.description.length).toBeGreaterThan(10);
        expect(job.whyApply).toBeTruthy();
        expect(job.whyApply?.length).toBeGreaterThan(5);
        expect(job.title).not.toContain('&amp;');
        expect(job.company).not.toContain('&amp;');
      });
    });
  });

  describe('Public API Ingestion Mock Handlers', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    it('fetches and maps Greenhouse jobs accurately', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          jobs: [
            {
              id: 999,
              title: 'Senior Site Reliability Engineer',
              absolute_url: 'https://job-boards.greenhouse.io/test/jobs/999',
              updated_at: '2026-08-15T10:00:00Z',
              location: { name: 'Remote (US/Americas)' },
              departments: [{ id: 1, name: 'Infrastructure' }],
              content: '<p>Salary: $150,000 - $180,000. Maintain global cloud infrastructure.</p>',
            },
          ],
        }),
      });

      const partner = {
        company: 'TestCo',
        type: 'greenhouse' as const,
        boardId: 'testco',
      };

      const jobs = await fetchGreenhouseJobs(partner);
      expect(jobs).toHaveLength(1);
      expect(jobs[0].title).toBe('Senior Site Reliability Engineer');
      expect(jobs[0].applyUrl).toContain('https://job-boards.greenhouse.io/test/jobs/999');
      expect(jobs[0].minSalary).toBe(150000);
      expect(jobs[0].description).toContain('Maintain global cloud infrastructure');
    });

    it('fetches and maps Remotive jobs accurately', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          jobs: [
            {
              id: 888,
              url: 'https://remotive.com/job/888',
              title: 'Staff AI Engineer',
              company_name: 'AI Co',
              category: 'Software Development',
              tags: ['python', 'llm'],
              salary: '$160k - $200k',
              description: '<p>Design scalable machine learning systems.</p>',
            },
          ],
        }),
      });

      const jobs = await fetchRemotiveJobs();
      expect(jobs).toHaveLength(1);
      expect(jobs[0].title).toBe('Staff AI Engineer');
      expect(jobs[0].company).toBe('AI Co');
      expect(jobs[0].minSalary).toBe(160000);
      expect(jobs[0].applyUrl).toContain('https://remotive.com/job/888');
    });

    it('fetches and maps Arbeitnow jobs accurately', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: [
            {
              slug: 'frontend-lead-777',
              company_name: 'EuroTech',
              title: 'Frontend Lead',
              description: '<p>Lead modern TypeScript and React applications.</p>',
              remote: true,
              url: 'https://www.arbeitnow.com/view/frontend-lead-777',
              tags: ['React', 'TypeScript'],
              created_at: 1723500000,
            },
          ],
        }),
      });

      const jobs = await fetchArbeitnowJobs();
      expect(jobs).toHaveLength(1);
      expect(jobs[0].title).toBe('Frontend Lead');
      expect(jobs[0].company).toBe('EuroTech');
      expect(jobs[0].remoteStatus).toBe('Remote (Global)');
      expect(jobs[0].applyUrl).toContain('https://www.arbeitnow.com/view/frontend-lead-777');
    });
  });
});
