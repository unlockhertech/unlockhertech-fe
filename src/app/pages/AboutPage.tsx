import { HiOutlineLightBulb, HiOutlineHeart, HiOutlineMicrophone, HiOutlineUsers, HiOutlineArrowRight } from "react-icons/hi2";
import { Link } from "react-router";
import { WomanSitting, WheelChair, WomanStanding } from "../components/Illustrations";
import { SubscribeCTA } from "../components/SubscribeCTA";
import { useMetaData } from "../hooks/useMetaData";
import {IMG_AUDIO_EQ} from "../data";
import coFoundersPhoto from "../../assets/432250e0d9dc1c4cd94a60209ef0327c90f41452.png";

const values = [
  {
    icon: HiOutlineMicrophone,
    title: "Authentic Storytelling",
    desc: "Every episode is an unfiltered, honest conversation — no scripts, no filters, just real stories from real women.",
    color: "var(--podcast-coral)",
    bg: "#fdf0f7",
  },
  {
    icon: HiOutlineHeart,
    title: "Radical Inclusion",
    desc: "We celebrate every woman in tech regardless of role, background, ability, or stage of career.",
    color: "var(--podcast-yellow)",
    bg: "#fff3f0",
  },
  {
    icon: HiOutlineLightBulb,
    title: "Actionable Insight",
    desc: "We leave our listeners with something they can actually use — a new perspective, a tool, or a spark of courage.",
    color: "var(--podcast-blue)",
    bg: "#f0f6fd",
  },
  {
    icon: HiOutlineUsers,
    title: "Community First",
    desc: "This podcast is built for the community, by the community. We grow together, lift each other, and celebrate every win.",
    color: "var(--podcast-green)",
    bg: "#f2fbf3",
  },
];

export function AboutPage() {
  useMetaData("About Us", "Learn about our mission to amplify the voices of women in tech. Our story, values, and the initiative behind the podcast.");
  return (
    <div>

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="relative py-16 overflow-hidden bg-linear-to-br from-brand-coral to-[#8a1f55]">
        <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full opacity-10 bg-brand-pink" />
        <div className="absolute -bottom-16 -left-8 w-52 h-52 rounded-full opacity-10 bg-brand-yellow" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">About</span>
          </div>
          <h1 className="text-white mb-4 font-extrabold" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}>
            About Our Initiative
          </h1>
          <p className="text-white/70 max-w-130 leading-[1.8]">
            We started with a mic, a mission, and a belief that every woman's story in tech deserves to be heard.
          </p>
        </div>
      </div>

      {/* ── Mission ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Photo */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl aspect-4/3">
                <img
                  src={coFoundersPhoto}
                  alt="Unlock Her Tech co-founders at the Women in IT Summit"
                  className="w-full h-full object-cover origin-[center_35%] scale-[1.35]"
                  style={{ objectPosition: "50% 20%" }}
                />
              </div>
              {/* Colour bar */}
              <div className="absolute -bottom-4 -left-4 flex gap-2">
                <div className="w-10 h-3 rounded-full bg-brand-coral" />
                <div className="w-10 h-3 rounded-full bg-brand-yellow" />
                <div className="w-10 h-3 rounded-full bg-brand-pink" />
                <div className="w-10 h-3 rounded-full bg-brand-green" />
                <div className="w-10 h-3 rounded-full bg-brand-blue" />
              </div>
            </div>

            {/* Text */}
            <div>
              <p className="text-xs uppercase tracking-widest mb-3 text-brand-coral font-bold">Our story</p>
              <h2 className="mb-5 text-neutral-900">Why We Started</h2>
              <p className="text-gray-500 mb-5 text-[1.05rem] leading-[1.85]">
                We started Unlock Her Tech with a simple belief: the best ideas come from genuine conversations.
                Each month, we bring together thinkers, makers, and doers who are shaping our future.
              </p>
              <p className="text-gray-500 mb-8 text-[1.05rem] leading-[1.85]">
                Our mission is to inspire action through stories that matter — stories of women who navigated
                impossible odds, built extraordinary things, and refused to be invisible in their industry.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to="/episodes"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full text-white text-sm transition-all hover:opacity-90 shadow-md bg-brand-coral font-semibold"
                >
                  <span>Browse Episodes</span>
                  <HiOutlineArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/team"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm border-2 transition-all hover:bg-pink-50 border-brand-coral text-brand-coral font-semibold"
                >
                  Meet the Team <HiOutlineArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── For Every Woman ─────────────────────────────────────────────────── */}
      <section className="overflow-hidden bg-white border-t-4 border-brand-pink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-14 pb-4">
            <p className="mb-1 text-xs uppercase tracking-widest text-brand-coral font-bold">Inclusion at our core</p>
            <h2 className="text-neutral-900 font-extrabold" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
              For Every Woman in Tech
            </h2>
            <p className="text-gray-500 text-sm mx-auto mt-2 max-w-110 leading-[1.75]">
              We are intentional about who we platform and whose stories we amplify. Diversity is not an afterthought — it's our foundation.
            </p>
          </div>

          <div className="flex items-end justify-center gap-0 sm:gap-4">
            <div className="w-32 sm:w-44 shrink-0">
              <WomanSitting className="w-full h-auto" />
            </div>
            <div className="w-32 sm:w-44 shrink-0 translate-y-3">
              <WheelChair className="w-full h-auto" />
            </div>
            <div className="w-32 sm:w-44 shrink-0">
              <WomanStanding className="w-full h-auto" />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pb-14 -mt-2">
            {[
              { label: "Engineers",        className: "bg-brand-coral" },
              { label: "Designers",        className: "bg-brand-blue"   },
              { label: "Founders",         className: "bg-brand-yellow" },
              { label: "Researchers",      className: "bg-brand-green"  },
              { label: "Product Managers", className: "bg-brand-pink"   },
            ].map(({ label, className }) => (
              <span
                key={label}
                className={`px-4 py-1.5 rounded-full text-white text-sm font-semibold ${className}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest mb-2 text-brand-coral font-bold">What drives us</p>
            <h2 className="text-neutral-900">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className="rounded-2xl p-6 hover:shadow-md transition-shadow"
                style={{ backgroundColor: bg, border: `1.5px solid ${color}22` }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: color }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                                <p className="mb-2" style={{ color: "#1a1a1a", fontWeight: 700 }}>{title}</p>
                                <p className="text-gray-500 text-sm" style={{ lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom dual CTA ────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="mb-4" style={{ color: "#1a1a1a" }}>Ready to Dive In?</h2>
                    <p className="text-gray-500 mb-8" style={{ lineHeight: 1.75 }}>
            Start listening, meet the people behind the mic, or subscribe so you never miss a conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/episodes"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white transition-all hover:opacity-90 shadow-lg bg-brand-coral font-semibold"
            >
              Browse All Episodes <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/team"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 transition-all hover:bg-pink-50 border-brand-coral text-brand-coral font-semibold"
            >
              Meet the Team <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Subscribe ──────────────────────────────────────────────────────── */}
      <SubscribeCTA bgImage={IMG_AUDIO_EQ} />

    </div>
  );
}