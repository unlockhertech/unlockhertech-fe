import { useMemo } from "react";
import { Link } from "react-router";
import { HiGlobeAlt } from "react-icons/hi2";
import { useMetaData } from "../hooks/useMetaData";
import { BrandPatternOverlay } from "../components/BrandPatternBackground";
import { trackEvent } from "../utils/analytics";
import { getLinkItems } from "./links/linksData";
import { LinksProfileHeader } from "./links/LinksProfileHeader";
import { LinksList } from "./links/LinksList";
import { LinksFeaturedVideo } from "./links/LinksFeaturedVideo";
import { LinksSocialNav } from "./links/LinksSocialNav";

export function LinksPage() {
  useMetaData(
    "Links & Socials | Unlock Her Tech",
    "Connect with Unlock Her Tech: Listen to our podcast, join She Leads Tech problem-solving practices, read articles, and explore our community.",
    "https://unlockhertech.com/links",
    {
      image: "/logo.png",
      type: "website",
    }
  );

  const activeLinks = useMemo(() => getLinkItems().filter((l) => l.enabled), []);

  const handleLinkClick = (title: string, url: string) => {
    trackEvent("click_bio_link", "LinkTree", `${title} -> ${url}`);
  };

  return (
    <main className="min-h-screen bg-brand-coral relative overflow-hidden py-12 px-4 sm:px-6 flex flex-col justify-between items-center selection:bg-pink-300 selection:text-brand-coral">
      {/* Signature Brand Geometric Pattern Background */}
      <BrandPatternOverlay />

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center">
        {/* ── 1. Profile / Header ────────────────────────────────────────── */}
        <LinksProfileHeader
          onHandleClick={() => handleLinkClick("Instagram Handle", "@unlockhertech")}
        />

        {/* ── 2. Link Buttons ───────────────────────────────────────────── */}
        <LinksList links={activeLinks} onLinkClick={handleLinkClick} />

        {/* ── 3. Featured Video Section ─────────────────────────────────── */}
        <LinksFeaturedVideo />

        {/* ── 4. Social Bar ─────────────────────────────────────────────── */}
        <LinksSocialNav onSocialClick={handleLinkClick} />

        {/* ── 5. Back to Main Website & Quick Policy Links ─────────────── */}
        <footer className="pt-2 text-center space-y-3">
          <Link
            to="/"
            onClick={() => handleLinkClick("Main Website Footer", "/")}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white/90 hover:text-white text-xs font-bold transition-all border border-white/10"
          >
            <HiGlobeAlt className="w-4 h-4 text-brand-yellow" />
            <span>Visit unlockhertech.com</span>
          </Link>

          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] text-white/70">
            <Link to="/community-guidelines" className="hover:text-white hover:underline transition-colors">
              Community Guidelines
            </Link>
            <span>•</span>
            <Link to="/privacy-policy" className="hover:text-white hover:underline transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/cookie-policy" className="hover:text-white hover:underline transition-colors">
              Cookie Policy
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
