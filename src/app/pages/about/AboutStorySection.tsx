import { Link } from "react-router";
import { HiOutlineArrowRight } from "react-icons/hi2";
import coFoundersPhoto from "../../../assets/432250e0d9dc1c4cd94a60209ef0327c90f41452.png";

export function AboutStorySection() {
  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Photo Column */}
          <div className="lg:col-span-5">
            <div className="relative group max-w-md mx-auto">
              <div className="absolute -inset-1.5 bg-linear-to-r from-brand-pink via-brand-yellow to-brand-blue rounded-3xl blur-md opacity-75" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-stone-100 border border-white/40 aspect-4/3">
                <img
                  src={coFoundersPhoto}
                  alt="Unlock Her Tech co-founders"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Visual Brand Bar */}
              <div className="flex gap-1.5 mt-4 justify-center lg:justify-start">
                <div className="w-8 h-2 rounded-full bg-brand-coral" />
                <div className="w-8 h-2 rounded-full bg-brand-yellow" />
                <div className="w-8 h-2 rounded-full bg-brand-pink" />
                <div className="w-8 h-2 rounded-full bg-brand-green" />
                <div className="w-8 h-2 rounded-full bg-brand-blue" />
              </div>
            </div>
          </div>

          {/* Narrative Column */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-brand-coral text-xs font-bold uppercase tracking-wider mb-3">
              <span>Our Evolution</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 leading-tight">
              From a Storytelling Podcast to a <span className="text-brand-coral">Hands-On Technical Community</span>
            </h2>
            <div className="space-y-4 text-gray-600 text-base sm:text-lg leading-relaxed">
              <p>
                Unlock Her Tech began with a microphone and a clear conviction: to dismantle the isolation often felt by women, non-binary technologists, and underrepresented groups in technology through authentic, unfiltered conversations.
              </p>
              <p>
                As our community grew, we saw that inspiration alone was only half the equation. Technologists wanted <strong>practical, career-defining skills</strong> — a supportive space to practice algorithmic problem solving, pair program, and master technical interview patterns without judgment.
              </p>
              <p className="text-gray-900 font-semibold">
                Today, we operate on dual pillars: inspiring podcast dialogues with tech trailblazers, paired with <strong className="text-brand-coral">She Leads Tech</strong> sessions (spanning Theory, Practice, and Review).
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                to="/she-leads-tech"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white text-sm font-bold shadow-md hover:shadow-lg transition-all bg-brand-coral"
              >
                <span>Explore She Leads Tech</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/episodes"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold border-2 border-brand-coral text-brand-coral hover:bg-pink-50 transition-colors"
              >
                <span>Listen to Podcast</span>
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
