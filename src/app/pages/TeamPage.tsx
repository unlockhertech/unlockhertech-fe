import { HiOutlineUsers, HiOutlineArrowRight } from "react-icons/hi2";
import { Link } from "react-router";
import { TeamMember } from "../components/TeamMember";
import { SubscribeCTA } from "../components/SubscribeCTA";
import { useMetaData } from "../hooks/useMetaData";
import {BERRY, ORANGE, BLUE, PINK, GREEN, IMG_AUDIO_EQ, teamMembers} from "../data";

const PALETTE = [BERRY, BLUE, GREEN, ORANGE, PINK];
const cycleColor = (i: number) => PALETTE[i % PALETTE.length];

export function TeamPage() {
  useMetaData("Meet the Team", "Meet the passionate team behind Unlock Her Tech, dedicated to telling the stories of women shaping the future of technology.");
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
            <span className="text-white">Team</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-2xl bg-white/15">
              <HiOutlineUsers className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-white font-extrabold" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}>
              Meet the Team
            </h1>
          </div>
          <p className="text-white/70 max-w-125 leading-[1.8]">
            Nine passionate people united by one mission — amplifying the voices of women in tech.
          </p>

          {/* Colour dots */}
          <div className="flex gap-2 mt-6">
        {[BERRY, ORANGE, PINK, GREEN, BLUE].map((c) => (
        <div key={c} className="w-3 h-3 rounded-full bg-white opacity-60" />
))}
          </div>
        </div>
      </div>

      {/* ── Team Grid ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Co-founders label */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest mb-1 text-brand-coral font-bold">Co-Founders</p>
            <div className="h-0.5 w-12 rounded-full bg-brand-coral" />
          </div>

          {/* Founders row (first 3) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-14">
        {teamMembers.slice(0, 2).map((m, i) => (
                <TeamMember key={m.name} {...m} avatarColor={cycleColor(i)} />
            ))}
          </div>

          {/* Team label */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest mb-1 text-brand-blue font-bold">The Team</p>
            <div className="h-0.5 w-12 rounded-full bg-brand-blue" />
          </div>

          {/* Remaining team (4–7) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {teamMembers.slice(2).map((m, i) => (
                <TeamMember key={m.name} {...m} avatarColor={cycleColor(i + 2)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Join the Mission CTA ───────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-10 text-center bg-linear-to-br from-[#fdf0f7] to-[#f0f6fd] border-2 border-brand-pink">
            <p className="text-xs uppercase tracking-widest mb-3 text-brand-coral font-bold">Be part of the story</p>
            <h2 className="mb-4 text-neutral-900 font-extrabold" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
              Want to Hear From Them?
            </h2>
            <p className="text-gray-500 mb-8 max-w-105 mx-auto leading-[1.75]">
              Tune in to our latest episode and hear the team in action — or subscribe so you never miss what we create next.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/about"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white transition-all hover:opacity-90 shadow-md bg-brand-coral font-semibold"
              >
                Listen to Our Podcast <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 transition-all hover:bg-pink-50 border-brand-coral text-brand-coral font-semibold"
              >
                Our Mission <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Subscribe ──────────────────────────────────────────────────────── */}
      <SubscribeCTA
        bgImage={IMG_AUDIO_EQ}
        title="Subscribe & Join the Community"
        subtitle="Follow along on your favourite platform — a new episode drops every single month."
      />

    </div>
  );
}
