import { Link } from "react-router";
import { HiExclamationTriangle, HiEnvelope } from "react-icons/hi2";

export function GuidelinesPolicySections() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xs space-y-12">
        {/* Section 1 */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-brand-coral/10 text-brand-coral font-bold text-sm flex items-center justify-center shrink-0">
              1
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900">Our Purpose & Scope</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            This Code of Conduct applies to all spaces managed or hosted by Unlock Her Tech, including our podcast events, She Leads Tech live coding sessions, problem-solving breakout rooms, virtual coffee chats, workshops, social media channels, and any related communications.
          </p>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base mt-3">
            By participating in our community, attending sessions, or interacting with our platforms, you agree to abide by these guidelines and help us maintain a culture of mutual respect, learning, and celebration.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-brand-coral/10 text-brand-coral font-bold text-sm flex items-center justify-center shrink-0">
              2
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900">Expected Behavior</h2>
          </div>
          <div className="space-y-3 text-gray-600 text-sm sm:text-base leading-relaxed">
            <p>We expect all members, speakers, hosts, and participants to:</p>
            <ul className="list-disc pl-6 space-y-2.5">
              <li>
                <strong className="text-gray-900">Demonstrate empathy and kindness:</strong> Treat everyone with dignity and respect, recognizing that everyone comes with different levels of experience and varying life contexts.
              </li>
              <li>
                <strong className="text-gray-900">Foster collaborative learning:</strong> In coding sessions and discussions, offer constructive feedback, encourage peers who are trying, and prioritize shared growth over showing off.
              </li>
              <li>
                <strong className="text-gray-900">Use welcoming, inclusive language:</strong> Be mindful of gendered language, avoid exclusionary jargon when explaining concepts, and honor chosen names and pronouns.
              </li>
              <li>
                <strong className="text-gray-900">Practice active listening:</strong> Create space for quieter voices, avoid talking over others in breakout sessions, and value different perspectives.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold text-sm flex items-center justify-center shrink-0">
              3
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900">Unacceptable Behavior</h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4">
            Unlock Her Tech maintains a zero-tolerance policy for discriminatory, predatory, or disruptive behavior. Unacceptable actions include, but are not limited to:
          </p>
          <div className="bg-red-50/70 rounded-2xl p-5 border border-red-100 space-y-2 text-sm text-red-950">
            <p className="font-semibold flex items-center gap-2 text-red-700">
              <HiExclamationTriangle className="w-5 h-5 shrink-0" />
              Prohibited actions:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-gray-700">
              <li>Harassment, discrimination, or hate speech targeting gender, gender identity, sexual orientation, race, ethnicity, religion, disability, age, or physical appearance.</li>
              <li>Gatekeeping, condescending remarks, or public mocking of someone&apos;s code, questions, or background.</li>
              <li>Unsolicited commercial promotion, spamming, or mass scraping of community members&apos; contact details.</li>
              <li>Inappropriate sexual attention, imagery, comments, or non-consensual sharing of personal information (doxxing).</li>
              <li>Recording, photographing, or publishing breakout rooms without explicit participant consent.</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-brand-coral/10 text-brand-coral font-bold text-sm flex items-center justify-center shrink-0">
              4
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900">Guidelines for Live Technical Practices</h2>
          </div>
          <div className="space-y-3 text-gray-600 text-sm sm:text-base leading-relaxed">
            <p>During our <em>She Leads Tech Practice</em>, LeetCode meetups, and workshops:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-gray-900">Low-pressure participation:</strong> Cameras are always optional. You are free to engage through voice, chat, or by observing if you are not ready to code live.</li>
              <li><strong className="text-gray-900">Pair programming etiquette:</strong> When pairing, allow your partner time to think through problems and share their approach before jumping in with the solution.</li>
              <li><strong className="text-gray-900">Supportive code review:</strong> Frame feedback around patterns, trade-offs, and optimization rather than criticism.</li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section className="bg-stone-50 rounded-2xl p-6 sm:p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <HiEnvelope className="w-6 h-6 text-brand-coral" />
            <h2 className="text-xl font-bold text-gray-900">Reporting & Enforcement</h2>
          </div>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
            If you experience or witness behavior that violates this Code of Conduct, or have any concerns, please reach out to our team immediately:
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <a
              href="mailto:conduct@unlockhertech.com?subject=Code%20of%20Conduct%20Report"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-brand-coral text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <HiEnvelope className="w-4 h-4" />
              Contact conduct@unlockhertech.com
            </a>
            <span className="text-xs text-gray-500">All reports are handled confidentially by community leadership.</span>
          </div>
          <p className="text-gray-500 text-xs mt-4 leading-relaxed">
            Consequences for violations may include verbal warnings, temporary removal from session breakout rooms, or permanent bans from all future events and channels.
          </p>
        </section>

        {/* Footer note */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-400 gap-2">
          <span>Last reviewed: August 2026</span>
          <div className="flex gap-4">
            <Link to="/about" className="text-brand-coral hover:underline">About Our Mission</Link>
            <Link to="/practices" className="text-brand-coral hover:underline">She Leads Tech Practice</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
