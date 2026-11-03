import { useState } from "react";
import { HiOutlineShare, HiCheck, HiLink } from "react-icons/hi2";
import { FaLinkedinIn, FaXTwitter, FaWhatsapp } from "react-icons/fa6";

export interface BlogShareBarProps {
  url?: string;
  title?: string;
  className?: string;
}

export function BlogShareBar({
  url,
  title = "",
  className = "",
}: Readonly<BlogShareBarProps>) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    url ||
    (globalThis.window === undefined ? "" : globalThis.location.href);

  const handleCopyLink = async () => {
    try {
      if (globalThis.navigator?.clipboard) {
        await globalThis.navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.warn("Failed to copy link to clipboard:", err);
    }
  };

  return (
    <div className={`flex items-center gap-3 not-prose ${className}`}>
      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
        <HiOutlineShare className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Share</span>
      </span>

      <div className="flex items-center gap-2">
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share this post on LinkedIn"
          title="Share on LinkedIn"
          className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-xs border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5] transition-all"
        >
          <FaLinkedinIn className="w-3.5 h-3.5" />
        </a>

        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share this post on X"
          title="Share on X"
          className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-xs border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
        >
          <FaXTwitter className="w-3.5 h-3.5" />
        </a>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share this post on WhatsApp"
          title="Share on WhatsApp"
          className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-xs border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all"
        >
          <FaWhatsapp className="w-3.5 h-3.5" />
        </a>

        <button
          type="button"
          onClick={handleCopyLink}
          aria-label={copied ? "Link copied to clipboard" : "Copy link to clipboard"}
          title={copied ? "Copied!" : "Copy Link"}
          className={`h-8 px-2.5 rounded-full text-xs font-semibold shadow-xs border transition-all flex items-center gap-1.5 cursor-pointer ${
            copied
              ? "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-berry hover:text-brand-berry"
          }`}
        >
          {copied ? (
            <>
              <HiCheck className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <HiLink className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
