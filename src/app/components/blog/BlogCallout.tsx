import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import {
  HiLightBulb,
  HiCheckCircle,
  HiBookmark,
  HiSparkles,
  HiInformationCircle,
  HiArrowTopRightOnSquare,
} from "react-icons/hi2";
import type { CalloutVariant } from "../../types";

export interface BlogCalloutProps {
  variant?: CalloutVariant;
  title?: string;
  content?: string | ReactNode;
  points?: string[];
  referenceText?: string;
  referenceUrl?: string;
  children?: ReactNode;
  className?: string;
}

interface CalloutTheme {
  containerClass: string;
  badgeClass: string;
  titleClass: string;
  textClass: string;
  bulletClass: string;
  linkClass: string;
  referenceClass: string;
  defaultTitle: string;
  Icon: typeof HiLightBulb;
}

function getCalloutTheme(variant: CalloutVariant = "didYouKnow"): CalloutTheme {
  switch (variant) {
    case "didYouKnow":
      return {
        containerClass:
          "bg-amber-500/10 border-l-4 border-amber-500 text-amber-950 dark:text-amber-100 shadow-xs",
        badgeClass: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
        titleClass: "text-amber-900 dark:text-amber-200",
        textClass: "text-amber-950/90 dark:text-amber-100/90",
        bulletClass: "bg-amber-500",
        linkClass:
          "text-amber-900 dark:text-amber-200 underline decoration-amber-500/50 hover:text-amber-700 dark:hover:text-amber-100 hover:decoration-amber-600 transition-colors",
        referenceClass: "border-amber-500/20 text-amber-900/80 dark:text-amber-200/80",
        defaultTitle: "Did You Know?",
        Icon: HiLightBulb,
      };
    case "keyTakeaway":
      return {
        containerClass:
          "bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-xs",
        badgeClass: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
        titleClass: "text-emerald-900 dark:text-emerald-200",
        textClass: "text-emerald-950/90 dark:text-emerald-100/90",
        bulletClass: "bg-emerald-500",
        linkClass:
          "text-emerald-900 dark:text-emerald-200 underline decoration-emerald-500/50 hover:text-emerald-700 dark:hover:text-emerald-100 hover:decoration-emerald-600 transition-colors",
        referenceClass: "border-emerald-500/20 text-emerald-900/80 dark:text-emerald-200/80",
        defaultTitle: "Key Takeaway",
        Icon: HiCheckCircle,
      };
    case "tip":
      return {
        containerClass:
          "bg-sky-500/10 border-l-4 border-sky-500 text-sky-950 dark:text-sky-100 shadow-xs",
        badgeClass: "bg-sky-500/20 text-sky-700 dark:text-sky-300",
        titleClass: "text-sky-900 dark:text-sky-200",
        textClass: "text-sky-950/90 dark:text-sky-100/90",
        bulletClass: "bg-sky-500",
        linkClass:
          "text-sky-900 dark:text-sky-200 underline decoration-sky-500/50 hover:text-sky-700 dark:hover:text-sky-100 hover:decoration-sky-600 transition-colors",
        referenceClass: "border-sky-500/20 text-sky-900/80 dark:text-sky-200/80",
        defaultTitle: "Pro Tip",
        Icon: HiBookmark,
      };
    case "highlight":
      return {
        containerClass:
          "bg-rose-500/10 border-l-4 border-rose-500 text-rose-950 dark:text-rose-100 shadow-xs",
        badgeClass: "bg-rose-500/20 text-rose-700 dark:text-rose-300",
        titleClass: "text-rose-900 dark:text-rose-200",
        textClass: "text-rose-950/90 dark:text-rose-100/90",
        bulletClass: "bg-rose-500",
        linkClass:
          "text-rose-900 dark:text-rose-200 underline decoration-rose-500/50 hover:text-rose-700 dark:hover:text-rose-100 hover:decoration-rose-600 transition-colors",
        referenceClass: "border-rose-500/20 text-rose-900/80 dark:text-rose-200/80",
        defaultTitle: "Key Highlight",
        Icon: HiSparkles,
      };
    case "quote":
    default:
      return {
        containerClass:
          "bg-purple-500/10 border-l-4 border-purple-500 text-purple-950 dark:text-purple-100 shadow-xs",
        badgeClass: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
        titleClass: "text-purple-900 dark:text-purple-200",
        textClass: "text-purple-950/90 dark:text-purple-100/90",
        bulletClass: "bg-purple-500",
        linkClass:
          "text-purple-900 dark:text-purple-200 underline decoration-purple-500/50 hover:text-purple-700 dark:hover:text-purple-100 hover:decoration-purple-600 transition-colors",
        referenceClass: "border-purple-500/20 text-purple-900/80 dark:text-purple-200/80",
        defaultTitle: "Note",
        Icon: HiInformationCircle,
      };
  }
}

function renderFormattedMarkdown(text: string, linkClass: string) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
        ul: ({ children }) => (
          <ul className="space-y-1.5 my-2.5 ml-4 list-disc marker:opacity-75">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="space-y-1.5 my-2.5 ml-4 list-decimal marker:opacity-75">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-semibold underline underline-offset-2 ${linkClass}`}
          >
            {children}
          </a>
        ),
        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

export function BlogCallout({
  variant = "didYouKnow",
  title,
  content,
  points,
  referenceText,
  referenceUrl,
  children,
  className = "",
}: Readonly<BlogCalloutProps>) {
  const theme = getCalloutTheme(variant);
  const IconComponent = theme.Icon;
  const headingText = title || theme.defaultTitle;
  const bodyContent = content || children;
  const hasPoints = Array.isArray(points) && points.length > 0;
  const hasReference = Boolean(referenceText || referenceUrl);

  return (
    <aside
      className={`my-8 rounded-2xl p-5 md:p-6 transition-all duration-200 not-prose ${theme.containerClass} ${className}`}
      aria-label={headingText}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${theme.badgeClass}`}
          aria-hidden="true"
        >
          <IconComponent className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`text-base font-bold tracking-tight mb-2 ${theme.titleClass}`}>
            {headingText}
          </h4>

          {typeof bodyContent === "string" && (
            <div className={`text-sm md:text-base leading-relaxed font-normal ${theme.textClass}`}>
              {renderFormattedMarkdown(bodyContent, theme.linkClass)}
            </div>
          )}

          {typeof bodyContent !== "string" && bodyContent && (
            <div className={`text-sm md:text-base leading-relaxed font-normal ${theme.textClass}`}>
              {bodyContent}
            </div>
          )}

          {hasPoints && (
            <ul className="space-y-2 mt-3 mb-1">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-2.5 leading-relaxed text-sm md:text-base">
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 mt-2 ${theme.bulletClass}`}
                    aria-hidden="true"
                  />
                  <div className={`flex-1 min-w-0 ${theme.textClass}`}>
                    {renderFormattedMarkdown(point, theme.linkClass)}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {hasReference && (
            <div
              className={`mt-4 pt-3 border-t flex flex-wrap items-center gap-1.5 text-xs font-medium ${theme.referenceClass}`}
            >
              <span className="font-semibold uppercase tracking-wider text-[11px] opacity-75">
                Reference:
              </span>
              {referenceUrl ? (
                <a
                  href={referenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-100 transition-opacity ${theme.linkClass}`}
                >
                  <span>{referenceText || referenceUrl}</span>
                  <HiArrowTopRightOnSquare className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                </a>
              ) : (
                <span>{referenceText}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
