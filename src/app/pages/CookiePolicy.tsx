import { HiShieldCheck } from "react-icons/hi2";
import { useMetaData } from "../hooks/useMetaData";
import { CookieTable } from "./cookie/CookieTable";
import { BrandPatternOverlay } from "../components/BrandPatternBackground";

export function CookiePolicyContent() {
  return (
    <div className="prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What are cookies?</h2>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Cookies are small text files that are stored on your computer or mobile device when you visit a website. 
        They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How we use cookies</h2>
      <p className="text-gray-600 mb-4 leading-relaxed">
        We use cookies for the following purposes:
      </p>
      <ul className="list-disc pl-6 text-gray-600 mb-8 space-y-2">
        <li>
          <strong>Essential Cookies:</strong> These are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
        </li>
        <li>
          <strong>Analytics Cookies:</strong> We use Google Analytics to understand how visitors interact with our website. This helps us improve our content and user experience. These cookies collect information in an anonymous form.
        </li>
        <li>
          <strong>Functional Cookies:</strong> These allow the website to remember choices you make (such as your cookie consent preferences) to provide a more personalized experience.
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Specific cookies we use</h2>
      <CookieTable />

      <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Your choices</h2>
      <p className="text-gray-600 mb-4 leading-relaxed">
        You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer.
      </p>
      <p className="text-gray-600 mb-8 leading-relaxed">
        If you decline analytics cookies, your visit will not be tracked by Google Analytics, but the website will still function for essential purposes.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">5. More information</h2>
      <p className="text-gray-600 leading-relaxed mb-6">
        For more information about how we handle your privacy, please contact us. 
        European residents have certain rights under the General Data Protection Regulation (GDPR) regarding their personal data, including the right to withdraw consent at any time.
      </p>

      <p className="text-xs text-gray-500 pt-6 border-t border-gray-100">
        Last updated: August 24, 2026.
      </p>
    </div>
  );
}

export function CookiePolicy() {
  useMetaData(
    "Cookie Policy | Unlock Her Tech",
    "Information about how Unlock Her Tech uses cookies, analytics, and your privacy on our website.",
    "https://unlockhertech.com/cookie-policy",
    {
      image: "/logo.png",
      type: "website",
    }
  );

  return (
    <div className="bg-stone-50 min-h-screen pb-24">
      {/* ── Header Banner (Matching Community Guidelines & Privacy Policy) ── */}
      <header className="relative py-16 lg:py-20 overflow-hidden bg-brand-coral text-white">
        <BrandPatternOverlay />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-6">
            <HiShieldCheck className="w-4 h-4 text-brand-yellow" />
            <span>Privacy & Tracking Transparency</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight leading-[1.15]">
            Cookie Policy & <br />
            <span className="text-brand-pink">Consent Choices</span>
          </h1>

          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Learn how Unlock Her Tech uses essential and analytics cookies to maintain website reliability and improve your experience.
          </p>
        </div>
      </header>

      {/* ── Content Container Card ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xs">
          <CookiePolicyContent />
        </div>
      </main>
    </div>
  );
}
