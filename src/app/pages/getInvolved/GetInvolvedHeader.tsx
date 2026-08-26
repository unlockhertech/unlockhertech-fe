import { HiUserGroup } from "react-icons/hi2";
import { BrandPatternOverlay } from "../../components/BrandPatternBackground";

export function GetInvolvedHeader() {
  return (
    <header className="relative py-16 lg:py-20 overflow-hidden bg-brand-coral text-white">
      <BrandPatternOverlay />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-6">
          <HiUserGroup className="w-4 h-4 text-brand-yellow" />
          <span>Join the Movement</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight leading-[1.15]">
          Get Involved With <br />
          <span className="text-brand-pink">Unlock Her Tech</span>
        </h1>

        <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
          Whether you want to mentor aspiring engineers, share your journey on our podcast, or partner with us — we&apos;d love to collaborate with you.
        </p>
      </div>
    </header>
  );
}
