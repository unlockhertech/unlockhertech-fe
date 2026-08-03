import React from "react";
import { Link } from "react-router";
import { 
  HiCodeBracket, 
  HiUsers, 
  HiAcademicCap, 
  HiChatBubbleLeftRight, 
  HiRocketLaunch, 
  HiCheckCircle, 
  HiCalendarDays, 
  HiSparkles,
  HiHeart
} from "react-icons/hi2";
import { imgSheLeadsTech, BERRY } from "../data";
import { useMetaData } from "../hooks/useMetaData";
import { SubscribeCTA } from "../components/SubscribeCTA";

export function PracticesPage() {
  useMetaData(
    "She Leads Tech Practices | Unlock Her Tech",
    "Join live, interactive LeetCode and problem-solving sessions every two weeks. Build coding confidence, pair program, and master interview techniques in an inclusive community."
  );

  const sessionPillars = [
    {
      icon: HiCodeBracket,
      title: "Solve LeetCode-Style Problems",
      description: "Hands-on practice tackling curated algorithmic challenges in real time.",
      color: "bg-pink-50 text-brand-coral border-pink-100",
    },
    {
      icon: HiUsers,
      title: "Pair Program & Discuss Approaches",
      description: "Collaborate in breakout groups to share ideas, clean code, and edge cases.",
      color: "bg-blue-50 text-brand-blue border-blue-100",
    },
    {
      icon: HiAcademicCap,
      title: "Master Interview Patterns",
      description: "Recognize patterns like Two Pointers, Sliding Window, Trees & Graphs quickly.",
      color: "bg-amber-50 text-brand-coral border-amber-100",
    },
    {
      icon: HiChatBubbleLeftRight,
      title: "Ask Questions Freely",
      description: "Safe, supportive space where no question is too basic and curiosity is celebrated.",
      color: "bg-emerald-50 text-brand-green border-emerald-100",
    },
    {
      icon: HiRocketLaunch,
      title: "Build Interview Confidence",
      description: "Overcome interview anxiety with regular, structured practice among peers.",
      color: "bg-pink-50 text-[#b42970] border-pink-100",
    },
  ];

  const requirements = [
    { text: "A free LeetCode account", detail: "For attempting problems during live sessions." },
    { text: "Basic JavaScript or TypeScript", detail: "Familiarity with loops, functions, and arrays." },
    { text: "Curiosity & Collaboration", detail: "Willingness to learn together and support peers." },
  ];

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <header className="relative bg-linear-to-br from-[#8a1f55] via-[#b42970] to-[#e8563a] text-white overflow-hidden py-20 lg:py-24">
        {/* Glow backdrop effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-pink/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-brand-blue/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left text column */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 text-sm font-semibold mb-6">
                <HiSparkles className="w-4 h-4 text-brand-yellow animate-pulse" />
                <span>Community Initiative by Unlock Her Tech</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-white">
                She Leads Tech <br />
                <span className="text-brand-pink">
                  Practices
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-white/90 font-medium mb-8 leading-relaxed max-w-2xl">
                LeetCode & Problem Solving Series designed to help developers strengthen coding skills, master algorithmic patterns, and ace technical interviews in a supportive environment.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#schedule"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-brand-coral hover:bg-white/90 font-bold transition-all shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <HiCalendarDays className="w-5 h-5 text-brand-coral" />
                  Explore Bi-Weekly Schedule
                </a>
                <Link
                  to="/events"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold transition-all flex items-center justify-center gap-2"
                >
                  View Upcoming Sessions
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-white/80 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                  Bi-weekly live sessions
                </span>
                <span>•</span>
                <span>Beginner to Intermediate Friendly</span>
              </div>
            </div>

            {/* Right Logo / Graphic Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-md w-full">
                <div className="absolute -inset-1 bg-linear-to-r from-brand-pink via-brand-yellow to-brand-blue rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500" />
                <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden border border-white/20 text-neutral-900">
                  <img
                    src={imgSheLeadsTech}
                    alt="She Leads Tech Practices Logo"
                    className="w-full h-auto rounded-2xl shadow-sm mb-6 object-cover aspect-video"
                  />
                  <div className="text-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-coral bg-brand-pink/20 px-3 py-1 rounded-full">
                      Interactive Practice Series
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-3">
                      Build your problem-solving habit together
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Overview Section ────────────────────────────────────────────── */}
      <section id="overview" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs uppercase tracking-widest font-extrabold text-brand-coral mb-2 block">
              Welcome to the Series
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
              Empowering Engineers Through Hands-On Collaboration
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Whether you're preparing for software engineering interviews, aiming for your next role, or simply looking to build a consistent problem-solving habit, this series is built for you.
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessionPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-stone-50 rounded-3xl p-8 border border-gray-200/80 hover:border-brand-coral/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-14 h-14 rounded-2xl ${pillar.color} border flex items-center justify-center mb-6`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{pillar.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{pillar.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center text-xs font-semibold text-brand-coral">
                    <span>In Every Session ✨</span>
                  </div>
                </div>
              );
            })}

            {/* Special Highlight Card */}
            <div className="bg-linear-to-br from-brand-coral to-[#b42970] text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 text-white">
                  <HiHeart className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Inclusive & Supportive</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  We encourage a friendly, inclusive environment where learning together matters far more than finding the perfect solution on the first try.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/20 text-xs font-semibold text-white/90">
                Everyone is welcome 🌱
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Requirements & Schedule Section ──────────────────────────────── */}
      <section id="schedule" className="py-20 bg-stone-50 border-t border-gray-200/60 scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left: What You'll Need */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-sm">
                <div className="inline-flex items-center gap-2 text-brand-coral font-bold text-xs uppercase tracking-wider mb-4">
                  <span>📌 What You'll Need</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
                  Simple Prerequisites
                </h3>
                <div className="space-y-6">
                  {requirements.map((req) => (
                    <div key={req.text} className="flex items-start gap-4">
                      <div className="mt-1 p-1 rounded-full bg-emerald-100 text-brand-green shrink-0">
                        <HiCheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{req.text}</h4>
                        <p className="text-gray-500 text-sm">{req.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Cadence & Progression */}
            <div className="lg:col-span-6">
              <div className="bg-linear-to-br from-[#8a1f55] via-[#b42970] to-[#e8563a] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-white/20">
                <div className="inline-flex items-center gap-2 text-brand-yellow font-bold text-xs uppercase tracking-wider mb-4">
                  <span>🌱 Bi-Weekly Progression</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold mb-4">
                  Progressive Skill Growth
                </h3>
                <p className="text-white/90 text-sm leading-relaxed mb-6">
                  This is an ongoing series held <strong className="text-white">every two weeks</strong>. We start with Easy and Medium problems, gradually progressing to harder challenges as we build our skills together.
                </p>

                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 border border-white/20">
                    <span className="px-3 py-1 rounded-full bg-brand-green text-white font-bold text-xs">Phase 1</span>
                    <span>Easy & Foundational Algorithmic Warmups</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 border border-white/20">
                    <span className="px-3 py-1 rounded-full bg-brand-blue text-white font-bold text-xs">Phase 2</span>
                    <span>Medium Level Core Interview Patterns</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 border border-white/20">
                    <span className="px-3 py-1 rounded-full bg-brand-yellow text-neutral-900 font-bold text-xs">Phase 3</span>
                    <span>Advanced Problem-Solving & Mock Discussions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Subscribe CTA ─────────────────────────────────────────────────── */}
      <SubscribeCTA />
    </div>
  );
}
