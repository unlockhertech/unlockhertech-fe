import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router";
import {
  HiCheckCircle,
  HiExclamationTriangle,
  HiXCircle,
  HiArrowPath,
  HiDocumentText,
  HiCalendarDays,
  HiBriefcase,
  HiBookmark,
  HiChevronDown,
  HiChevronUp,
  HiArrowTopRightOnSquare,
  HiServerStack,
  HiSignal,
  HiArrowLeft,
} from "react-icons/hi2";
import { sanityClient } from "../../utils/sanity";

export type HealthStatus = "checking" | "healthy" | "warning" | "error";

export interface DocMetric {
  id: string;
  schemaType: string;
  label: string;
  totalCount: number;
  latestTitle?: string;
  latestDate?: string;
  status: "synced" | "empty" | "error";
  error?: string;
}

export interface HealthCheckData {
  status: HealthStatus;
  latencyMs: number;
  lastChecked: string;
  projectId: string;
  dataset: string;
  apiVersion: string;
  metrics: DocMetric[];
  errorMessage?: string;
  diagnostics: string[];
}

function getStatusBadgeClasses(status: HealthStatus): string {
  switch (status) {
    case "healthy":
      return "bg-emerald-500/15 text-emerald-700 border-emerald-500/30";
    case "warning":
      return "bg-amber-500/15 text-amber-700 border-amber-500/30";
    case "error":
      return "bg-rose-500/15 text-rose-700 border-rose-500/30";
    case "checking":
    default:
      return "bg-sky-500/15 text-sky-700 border-sky-500/30";
  }
}

function getStatusIndicatorDot(status: HealthStatus): string {
  switch (status) {
    case "healthy":
      return "bg-emerald-500";
    case "warning":
      return "bg-amber-500";
    case "error":
      return "bg-rose-500";
    case "checking":
    default:
      return "bg-sky-500 animate-pulse";
  }
}

function getStatusLabel(status: HealthStatus): string {
  switch (status) {
    case "healthy":
      return "Sanity Studio Connected & Synced";
    case "warning":
      return "Connection Active · Content Empty or Stale";
    case "error":
      return "Sanity Synchronization Error";
    case "checking":
    default:
      return "Checking Sanity Health…";
  }
}

const DOC_ICONS: Record<string, typeof HiDocumentText> = {
  post: HiDocumentText,
  event: HiCalendarDays,
  resource: HiBookmark,
  job: HiBriefcase,
};

interface MetricCardProps {
  metric: DocMetric;
}

function MetricCard({ metric }: Readonly<MetricCardProps>) {
  const Icon = DOC_ICONS[metric.schemaType] ?? HiServerStack;

  const statusBg =
    metric.status === "synced"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : metric.status === "empty"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#B42970]/10 text-[#B42970] flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">{metric.label}</h4>
            <span className="text-[10px] text-stone-400 font-mono">_type: &quot;{metric.schemaType}&quot;</span>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBg}`}>
          {metric.status.toUpperCase()}
        </span>
      </div>

      <div className="flex items-baseline justify-between pt-2 border-t border-stone-100">
        <div>
          <span className="text-2xl font-black text-stone-900">{metric.totalCount}</span>
          <span className="text-[11px] text-stone-500 ml-1.5 font-medium">documents</span>
        </div>
        {metric.latestDate && (
          <span className="text-[10px] text-stone-400" title={metric.latestTitle}>
            Latest: {metric.latestDate}
          </span>
        )}
      </div>
      {metric.latestTitle && (
        <p className="text-[11px] text-stone-600 truncate mt-1" title={metric.latestTitle}>
          &ldquo;{metric.latestTitle}&rdquo;
        </p>
      )}
      {metric.error && (
        <p className="text-[10px] text-rose-600 mt-1 truncate" title={metric.error}>
          Error: {metric.error}
        </p>
      )}
    </div>
  );
}

interface SanityHealthCheckProps {
  onStatusChange?: (status: HealthStatus) => void;
}

export function SanityHealthCheck({ onStatusChange }: Readonly<SanityHealthCheckProps>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [data, setData] = useState<HealthCheckData>({
    status: "checking",
    latencyMs: 0,
    lastChecked: "",
    projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "Not Configured",
    dataset: import.meta.env.VITE_SANITY_DATASET || "production",
    apiVersion: import.meta.env.VITE_SANITY_API_VERSION || "2024-03-01",
    metrics: [],
    diagnostics: [],
  });

  const runHealthCheck = useCallback(async () => {
    const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
    const dataset = import.meta.env.VITE_SANITY_DATASET || "production";
    const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || "2024-03-01";

    if (!projectId) {
      const errResult: HealthCheckData = {
        status: "error",
        latencyMs: 0,
        lastChecked: new Date().toLocaleTimeString(),
        projectId: "Missing (VITE_SANITY_PROJECT_ID)",
        dataset,
        apiVersion,
        metrics: [],
        errorMessage: "VITE_SANITY_PROJECT_ID is not configured in environment variables.",
        diagnostics: [
          "Add VITE_SANITY_PROJECT_ID to your .env file or deployment environment settings.",
          "Ensure VITE_SANITY_DATASET is set to 'production' or your target dataset.",
        ],
      };
      setData(errResult);
      onStatusChange?.("error");
      return;
    }

    setData((prev) => ({ ...prev, status: "checking" }));

    const startTime = performance.now();
    try {
      // 1. Health check queries for document counts and recent documents
      const postQuery = `*[_type == "post"] | order(date desc)[0...1] { title, date }`;
      const eventQuery = `*[_type == "event"] | order(date desc)[0...1] { title, date }`;
      const resourceQuery = `*[_type == "resource"] | order(publishedAt desc)[0...1] { title, publishedAt }`;
      const jobQuery = `*[_type == "job"] | order(publishedAt desc)[0...1] { title, publishedAt }`;

      const [postCount, eventCount, resourceCount, jobCount, posts, events, resources, jobs] = await Promise.all([
        sanityClient.fetch<number>(`count(*[_type == "post"])`),
        sanityClient.fetch<number>(`count(*[_type == "event"])`),
        sanityClient.fetch<number>(`count(*[_type == "resource"])`),
        sanityClient.fetch<number>(`count(*[_type == "job"])`),
        sanityClient.fetch<Array<{ title?: string; date?: string }>>(postQuery),
        sanityClient.fetch<Array<{ title?: string; date?: string }>>(eventQuery),
        sanityClient.fetch<Array<{ title?: string; publishedAt?: string }>>(resourceQuery),
        sanityClient.fetch<Array<{ title?: string; publishedAt?: string }>>(jobQuery),
      ]);

      const duration = Math.round(performance.now() - startTime);

      const latestPost = posts?.[0];
      const latestEvent = events?.[0];
      const latestResource = resources?.[0];
      const latestJob = jobs?.[0];

      const metrics: DocMetric[] = [
        {
          id: "metric-post",
          schemaType: "post",
          label: "Blog Posts",
          totalCount: postCount ?? 0,
          latestTitle: latestPost?.title,
          latestDate: latestPost?.date ? new Date(latestPost.date).toLocaleDateString() : undefined,
          status: (postCount ?? 0) > 0 ? "synced" : "empty",
        },
        {
          id: "metric-event",
          schemaType: "event",
          label: "Community Events",
          totalCount: eventCount ?? 0,
          latestTitle: latestEvent?.title,
          latestDate: latestEvent?.date ? new Date(latestEvent.date).toLocaleDateString() : undefined,
          status: (eventCount ?? 0) > 0 ? "synced" : "empty",
        },
        {
          id: "metric-resource",
          schemaType: "resource",
          label: "Career Resources",
          totalCount: resourceCount ?? 0,
          latestTitle: latestResource?.title,
          latestDate: latestResource?.publishedAt ? new Date(latestResource.publishedAt).toLocaleDateString() : undefined,
          status: (resourceCount ?? 0) > 0 ? "synced" : "empty",
        },
        {
          id: "metric-job",
          schemaType: "job",
          label: "Inclusive Jobs",
          totalCount: jobCount ?? 0,
          latestTitle: latestJob?.title,
          latestDate: latestJob?.publishedAt ? new Date(latestJob.publishedAt).toLocaleDateString() : undefined,
          status: (jobCount ?? 0) > 0 ? "synced" : "empty",
        },
      ];

      const totalDocs = (postCount ?? 0) + (eventCount ?? 0) + (resourceCount ?? 0) + (jobCount ?? 0);
      const computedStatus: HealthStatus = totalDocs === 0 ? "warning" : "healthy";

      const diagnostics: string[] = [];
      if (totalDocs === 0) {
        diagnostics.push(
          "Dataset responded successfully but contains 0 documents across all schemas. Publish content in the Studio below."
        );
      } else {
        diagnostics.push(`Successfully queried ${totalDocs} live documents from dataset "${dataset}".`);
      }
      if (duration > 1500) {
        diagnostics.push(`High API latency detected (${duration}ms). Ensure your CDN configuration is enabled.`);
      }

      const result: HealthCheckData = {
        status: computedStatus,
        latencyMs: duration,
        lastChecked: new Date().toLocaleTimeString(),
        projectId,
        dataset,
        apiVersion,
        metrics,
        diagnostics,
      };

      setData(result);
      onStatusChange?.(computedStatus);
    } catch (err: unknown) {
      const duration = Math.round(performance.now() - startTime);
      const errorMsg = err instanceof Error ? err.message : "Unknown error while communicating with Sanity API";
      console.warn("[Sanity Health Check] Check failed:", err);

      const diagnostics: string[] = [
        "Verify your project ID and dataset are correct in .env.",
        "Check CORS settings in Sanity Manage (https://www.sanity.io/manage) and add your current origin.",
        "Verify network connectivity and whether Sanity API endpoints are reachable.",
      ];

      const errResult: HealthCheckData = {
        status: "error",
        latencyMs: duration,
        lastChecked: new Date().toLocaleTimeString(),
        projectId,
        dataset,
        apiVersion,
        metrics: [],
        errorMessage: errorMsg,
        diagnostics,
      };

      setData(errResult);
      onStatusChange?.("error");
    }
  }, [onStatusChange]);

  useEffect(() => {
    let isCancelled = false;
    const timer = setTimeout(() => {
      if (!isCancelled) {
        runHealthCheck().catch((err) => {
          if (!isCancelled) {
            console.warn("Health check error:", err);
          }
        });
      }
    }, 0);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [runHealthCheck]);

  const totalDocuments = useMemo(() => {
    return data.metrics.reduce((acc, m) => acc + m.totalCount, 0);
  }, [data.metrics]);

  return (
    <div className="w-full bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold transition-colors border border-stone-700"
            title="Return to Main Website"
          >
            <HiArrowLeft className="w-3.5 h-3.5" />
            <span>Website</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-tight">Admin Hub</span>
            <span className="text-stone-600">•</span>
            <span className="text-xs font-medium text-stone-400">Content Studio</span>
          </div>

          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClasses(
              data.status
            )}`}
          >
            <span className={`w-2 h-2 rounded-full ${getStatusIndicatorDot(data.status)}`} />
            <span>{getStatusLabel(data.status)}</span>
            {data.latencyMs > 0 && (
              <span className="text-[10px] opacity-75 font-mono">({data.latencyMs}ms)</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {data.status === "healthy" && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-400">
              <HiSignal className="w-3.5 h-3.5 text-emerald-400" />
              <span>{totalDocuments} Synced Docs</span>
            </span>
          )}

          <button
            type="button"
            onClick={runHealthCheck}
            disabled={data.status === "checking"}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors border border-stone-700 disabled:opacity-50 cursor-pointer"
            title="Re-run live health and synchronization checks"
          >
            <HiArrowPath className={`w-3.5 h-3.5 ${data.status === "checking" ? "animate-spin" : ""}`} />
            <span>Check Sync</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#B42970] hover:bg-[#B42970]/90 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span>{isExpanded ? "Hide Diagnostics" : "Health Diagnostics"}</span>
            {isExpanded ? <HiChevronUp className="w-3.5 h-3.5" /> : <HiChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── Collapsible Synchronization Dashboard ────────────────────────── */}
      {isExpanded && (
        <div className="bg-stone-950/80 border-t border-stone-800 px-4 sm:px-6 py-6 transition-all animate-in fade-in duration-150">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header / Environment Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <HiServerStack className="w-4 h-4 text-[#B42970]" />
                  <span>Sanity CMS Real-Time Synchronization Dashboard</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Live verification of content schemas, API latency, and dataset health.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-stone-300 font-mono">
                  Project: <strong className="text-white">{data.projectId}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-stone-300 font-mono">
                  Dataset: <strong className="text-white">{data.dataset}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-stone-300 font-mono">
                  API: <strong className="text-white">{data.apiVersion}</strong>
                </span>
                {data.lastChecked && (
                  <span className="text-stone-500 text-[11px]">Checked at {data.lastChecked}</span>
                )}
              </div>
            </div>

            {/* Error Banner */}
            {data.status === "error" && (
              <div className="bg-rose-950/60 border border-rose-800/80 rounded-2xl p-4 text-rose-200">
                <div className="flex items-start gap-3">
                  <HiXCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-300">Sanity Synchronization Failed</h4>
                    <p className="text-xs text-rose-200 mt-1 font-mono">{data.errorMessage}</p>
                    <div className="mt-3 space-y-1">
                      {data.diagnostics.map((diag) => (
                        <div key={diag} className="flex items-center gap-1.5 text-xs text-rose-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          <span>{diag}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <a
                        href={`https://www.sanity.io/manage/project/${data.projectId}/api`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold transition-colors"
                      >
                        <span>Open Sanity CORS Settings</span>
                        <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Warning Banner */}
            {data.status === "warning" && (
              <div className="bg-amber-950/60 border border-amber-800/80 rounded-2xl p-4 text-amber-200">
                <div className="flex items-start gap-3">
                  <HiExclamationTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-300">Dataset Connected with Empty Content</h4>
                    <p className="text-xs text-amber-200 mt-1">
                      Sanity API is reachable, but 0 documents were returned across all schemas. Content created in
                      the Studio will synchronize to public pages automatically.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Document Schemas Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.metrics.map((metric) => (
                <MetricCard key={metric.id} metric={metric} />
              ))}
            </div>

            {/* Success Diagnostics Footnote */}
            {data.status === "healthy" && (
              <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center gap-2">
                  <HiCheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>All schema types connected and actively synchronized with Sanity Content Lake.</span>
                </div>
                <a
                  href={`https://www.sanity.io/manage/project/${data.projectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-300 hover:text-white font-semibold underline"
                >
                  <span>Sanity Manage</span>
                  <HiArrowTopRightOnSquare className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
