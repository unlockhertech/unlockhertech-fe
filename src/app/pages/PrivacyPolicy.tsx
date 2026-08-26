import { Link } from "react-router";
import { useMetaData } from "../hooks/useMetaData";
import { BrandPatternOverlay } from "../components/BrandPatternBackground";
import {
  HiShieldCheck,
  HiLockClosed,
} from "react-icons/hi2";

export function PrivacyPolicyContent() {
  return (
    <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-8">
      {/* Overview Notice */}
      <div className="p-6 rounded-2xl bg-pink-50/60 border border-brand-pink/30 flex items-start gap-4 not-prose">
        <HiShieldCheck className="w-8 h-8 text-brand-coral shrink-0 mt-1" />
        <div>
          <h3 className="font-extrabold text-stone-900 text-base mb-1">
            Our Privacy Commitment
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Unlock Her Tech is committed to protecting your privacy under the General Data Protection Regulation (GDPR), the UK Data Protection Act 2018, and global privacy standards. We collect only what is strictly necessary, provide full control over your data, and never sell or monetize your personal information.
          </p>
        </div>
      </div>

      {/* 1. Who We Are */}
      <div>
        <h2 className="text-2xl font-extrabold text-stone-900 mb-3 flex items-center gap-2">
          <span>1. Data Controller Information</span>
        </h2>
        <p>
          The data controller responsible for your personal information is <strong>Unlock Her Tech</strong>.
        </p>
        <p className="mt-2">
          If you have questions regarding this Privacy Policy, your personal data, or wish to exercise your legal rights, you can reach our Data Privacy Lead directly at:
        </p>
        <p className="font-semibold text-brand-coral">
          Email: <a href="mailto:info@unlockhertech.com" className="underline hover:text-brand-coral/80">info@unlockhertech.com</a>
        </p>
      </div>

      {/* 2. Information We Collect */}
      <div>
        <h2 className="text-2xl font-extrabold text-stone-900 mb-3">
          2. Personal Data We Collect
        </h2>
        <p>We may collect and process the following categories of personal data:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            <strong>Contact & Identity Data:</strong> Your name, email address, and optional WhatsApp phone number or Discord username when you register for weekly PDF playbooks, assessment results, workshop reminders, or community circles.
          </li>
          <li>
            <strong>Career Assessment & Preference Data:</strong> Self-assessed competency scores, focus areas, and optional reflection notes. <em>(Note: Your scores and reflection notes are stored locally in your browser's localStorage by default and are only transmitted to our servers if you explicitly choose to email them to yourself or submit an application.)</em>
          </li>
          <li>
            <strong>Community & Application Data:</strong> Information submitted via Get Involved forms (e.g. mentor/speaker topics, LinkedIn URLs, and portfolio links).
          </li>
          <li>
            <strong>Technical & Analytics Data:</strong> Anonymized usage data such as page views, device type, browser information, and referral sources collected via privacy-conscious analytics cookies.
          </li>
        </ul>
      </div>

      {/* 3. Legal Bases for Processing */}
      <div>
        <h2 className="text-2xl font-extrabold text-stone-900 mb-3">
          3. Legal Bases for Processing (GDPR Art. 6)
        </h2>
        <p>Under GDPR and UK GDPR, we rely on the following lawful bases:</p>
        <div className="grid sm:grid-cols-2 gap-4 mt-4 not-prose">
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <h4 className="font-extrabold text-sm text-stone-900 mb-1 flex items-center gap-1.5">
              <HiShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Explicit Consent (Art. 6(1)(a))</span>
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              When you voluntarily provide your email or details to download guides, receive assessment plans, or join our WhatsApp / Discord community circles.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <h4 className="font-extrabold text-sm text-stone-900 mb-1 flex items-center gap-1.5">
              <HiLockClosed className="w-4 h-4 text-brand-blue" />
              <span>Legitimate Interests (Art. 6(1)(f))</span>
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              To ensure website reliability, prevent spam/abuse, maintain cyber security, and understand aggregate community trends.
            </p>
          </div>
        </div>
      </div>

      {/* 4. How We Use Your Data */}
      <div>
        <h2 className="text-2xl font-extrabold text-stone-900 mb-3">
          4. How We Use Your Information
        </h2>
        <p>We use your personal data exclusively to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Deliver requested weekly PDF guides, career roadmaps, and podcast updates.</li>
          <li>Send community invitations for our WhatsApp group, Discord server, and live coding sessions.</li>
          <li>Respond to your direct inquiries and mentor/speaker submissions.</li>
          <li>Continuously improve platform usability and content relevance.</li>
        </ul>
        <p className="mt-3 font-bold text-stone-900">
          We do not sell, rent, trade, or share your personal data with third-party advertisers or data brokers.
        </p>
      </div>

      {/* 5. Third-Party Processors & Community Tools */}
      <div>
        <h2 className="text-2xl font-extrabold text-stone-900 mb-3">
          5. Third-Party Service Providers & Community Platforms
        </h2>
        <p>
          We partner with vetted, GDPR-compliant infrastructure providers to operate the platform:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong>Netlify:</strong> Secure static hosting, SSL encryption, and form processing.</li>
          <li><strong>Sanity.io:</strong> Headless Content Management System for articles, episodes, and resources.</li>
          <li><strong>Google Analytics:</strong> Anonymized website analytics (controlled via our <Link to="/cookie-policy" className="text-brand-coral underline">Cookie Banner</Link>).</li>
          <li>
            <strong>WhatsApp & Discord Communities:</strong> Our community channels. Joining our WhatsApp group or Discord server is entirely voluntary and subject to <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-coral underline">WhatsApp's Privacy Policy</a> and <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-coral underline">Discord's Privacy Policy</a>. We do not transfer your personal data beyond providing direct invitation links.
          </li>
        </ul>
      </div>

      {/* 6. Your Rights Under GDPR */}
      <div>
        <h2 className="text-2xl font-extrabold text-stone-900 mb-3">
          6. Your Legal Rights
        </h2>
        <p>Under GDPR and UK data protection laws, you possess the following rights:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><strong>Right of Access:</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
          <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request permanent deletion of your data from our mailing lists and databases.</li>
          <li><strong>Right to Withdraw Consent:</strong> Unsubscribe from email updates at any time via the 1-click unsubscribe link or by contacting us.</li>
          <li><strong>Right to Data Portability:</strong> Request your data in a structured, machine-readable format.</li>
          <li><strong>Right to Lodge a Complaint:</strong> You have the right to contact your local supervisory authority (such as the UK Information Commissioner's Office - ICO).</li>
        </ul>
      </div>

      {/* 7. How to Exercise Your Rights */}
      <div>
        <h2 className="text-2xl font-extrabold text-stone-900 mb-3">
          7. How to Exercise Your Rights
        </h2>
        <p>
          To make a subject access request, update your preferences, or request data deletion, simply email us at:
        </p>
        <div className="mt-3 p-5 rounded-2xl bg-stone-100 border border-stone-200">
          <p className="font-extrabold text-stone-900 text-sm">Unlock Her Tech Privacy Desk</p>
          <p className="text-xs text-stone-600 mt-1">
            Email: <a href="mailto:info@unlockhertech.com" className="text-brand-coral font-bold underline">info@unlockhertech.com</a>
          </p>
          <p className="text-xs text-stone-500 mt-1">
            We respond to and fulfill all legitimate data requests within 30 days at zero charge.
          </p>
        </div>
      </div>

      {/* 8. Policy Updates */}
      <div className="pt-4 border-t border-stone-200 text-xs text-stone-500">
        <p>
          This Privacy Policy was last updated on <strong>August 24, 2026</strong>. Any material revisions will be reflected on this page with an updated timestamp.
        </p>
      </div>
    </div>
  );
}

export function PrivacyPolicy() {
  useMetaData(
    "Privacy Policy & GDPR Disclosures | Unlock Her Tech",
    "Learn how Unlock Her Tech protects your privacy, complies with GDPR and UK data protection regulations, and manages your personal data.",
    "https://unlockhertech.com/privacy-policy",
    {
      image: "/logo.png",
      type: "website",
    }
  );

  return (
    <div className="bg-stone-50 min-h-screen pb-24">
      {/* ── Header Banner (Matching Community Guidelines Brand Pattern) ── */}
      <header className="relative py-16 lg:py-20 overflow-hidden bg-brand-coral text-white">
        <BrandPatternOverlay />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-6">
            <HiShieldCheck className="w-4 h-4 text-brand-yellow" />
            <span>GDPR & UK Data Protection Compliant</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight leading-[1.15]">
            Privacy Policy & <br />
            <span className="text-brand-pink">Data Protection</span>
          </h1>

          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Transparency, data minimization, and user rights are at the heart of our community. Learn how we protect and manage your personal information.
          </p>
        </div>
      </header>

      {/* ── Content Container Card ── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xs">
          <PrivacyPolicyContent />
        </div>
      </main>
    </div>
  );
}
