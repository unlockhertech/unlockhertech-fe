import { FaLinkedinIn } from "react-icons/fa6";
import { HiOutlineUser } from "react-icons/hi2";

export interface BlogAuthorBioProps {
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  authorBio?: string;
  authorLinkedin?: string;
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return (parts[0]?.[0] ?? "U").toUpperCase();
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

export function BlogAuthorBio({
  author,
  authorRole = "Contributor & Technologist",
  authorAvatar,
  authorBio,
  authorLinkedin,
  className = "",
}: Readonly<BlogAuthorBioProps>) {
  const fallbackBio = `${author} is a dedicated technologist and passionate advocate for diversity, leadership, and inclusion in tech with Unlock Her Tech.`;
  const bioText = authorBio || fallbackBio;

  return (
    <aside
      className={`my-12 rounded-3xl bg-linear-to-br from-white to-stone-50 dark:from-gray-900 dark:to-gray-800 p-6 sm:p-8 border border-gray-200/90 dark:border-gray-800 shadow-sm not-prose ${className}`}
      aria-label={`About the author: ${author}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
        <div className="relative shrink-0">
          {authorAvatar ? (
            <img
              src={authorAvatar}
              alt={author}
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border-2 border-white dark:border-gray-800 shadow-md ring-2 ring-brand-berry/20"
              loading="lazy"
            />
          ) : (
            <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-linear-to-br from-brand-berry to-brand-coral text-white font-extrabold text-2xl shadow-md">
              {getInitials(author)}
            </div>
          )}
          <div
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-green text-white ring-2 ring-white dark:ring-gray-900"
            title="Verified Contributor"
          >
            <HiOutlineUser className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-1.5">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-berry">
                Author Spotlight
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                {author}
              </h3>
            </div>

            {authorLinkedin && (
              <a
                href={authorLinkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${author}'s LinkedIn Profile`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#0077B5] bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 hover:bg-[#0077B5] hover:text-white transition-all shadow-2xs"
              >
                <FaLinkedinIn className="w-3.5 h-3.5" />
                <span>Connect</span>
              </a>
            )}
          </div>

          <p className="text-xs sm:text-sm font-semibold text-brand-blue mb-2.5">
            {authorRole}
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
            {bioText}
          </p>
        </div>
      </div>
    </aside>
  );
}
