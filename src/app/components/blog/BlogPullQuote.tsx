import type { ReactNode } from "react";
import { FaQuoteLeft } from "react-icons/fa6";

export interface BlogPullQuoteProps {
  quote?: string;
  attribution?: string;
  role?: string;
  children?: ReactNode;
  className?: string;
}

export function BlogPullQuote({
  quote,
  attribution,
  role,
  children,
  className = "",
}: Readonly<BlogPullQuoteProps>) {
  const quoteText = quote || children;

  return (
    <figure
      className={`my-10 relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-berry/5 via-rose-50/50 to-brand-coral/5 dark:from-brand-berry/15 dark:to-brand-coral/10 p-7 md:p-10 border border-brand-berry/15 shadow-xs not-prose ${className}`}
    >
      <div className="relative z-10">
        <div
          className="mb-4 inline-flex items-center justify-center p-2.5 rounded-2xl bg-brand-berry/10 dark:bg-brand-berry/20 text-brand-berry dark:text-brand-berry/90 shadow-2xs"
          aria-hidden="true"
        >
          <FaQuoteLeft className="w-5 h-5 md:w-6 md:h-6" />
        </div>

        <blockquote className="text-xl md:text-2xl font-serif italic font-medium leading-relaxed text-gray-900 dark:text-gray-100 break-words whitespace-normal">
          {typeof quoteText === "string" ? `“${quoteText.replace(/^["“]|["”]$/g, "")}”` : quoteText}
        </blockquote>

        {(attribution || role) && (
          <figcaption className="mt-6 flex items-center gap-3 pt-4 border-t border-brand-berry/10 dark:border-brand-berry/20">
            <div className="h-1 w-6 rounded-full bg-brand-berry" aria-hidden="true" />
            <div className="text-sm md:text-base">
              {attribution && (
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {attribution}
                </span>
              )}
              {attribution && role && (
                <span className="text-gray-400 dark:text-gray-500 mx-1.5" aria-hidden="true">
                  ·
                </span>
              )}
              {role && (
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {role}
                </span>
              )}
            </div>
          </figcaption>
        )}
      </div>
    </figure>
  );
}
