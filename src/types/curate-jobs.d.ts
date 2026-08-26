declare module '*/scripts/curate-jobs.mjs' {
  export interface EvaluatedJobResult {
    passed: boolean;
    issues: string[];
    evaluatedJob: Record<string, unknown>;
  }

  export function evaluateJobListing(job: Record<string, unknown>): EvaluatedJobResult;
  export function appendUtm(url: string, source?: string, medium?: string, campaign?: string): string;
}

declare module '../../scripts/curate-jobs.mjs' {
  export interface EvaluatedJobResult {
    passed: boolean;
    issues: string[];
    evaluatedJob: Record<string, unknown>;
  }

  export function evaluateJobListing(job: Record<string, unknown>): EvaluatedJobResult;
  export function appendUtm(url: string, source?: string, medium?: string, campaign?: string): string;
}
