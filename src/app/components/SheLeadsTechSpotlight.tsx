import React from "react";
import { Link } from "react-router";
import { HiArrowRight, HiSparkles, HiCodeBracket, HiUsers, HiCalendarDays } from "react-icons/hi2";
import { imgSheLeadsTech } from "../data";

export function SheLeadsTechSpotlight() {
  return (
    <section className="py-16 bg-linear-to-br from-[#8a1f55] via-[#b42970] to-[#e8563a] text-white relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute -top-24 -left-20 w-80 h-80 bg-brand-pink/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-brand-blue/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Logo / Asset graphic */}
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
            <div className="relative group max-w-sm w-full">
              <div className="absolute -inset-1 bg-linear-to-r from-brand-pink via-brand-yellow to-brand-blue rounded-3xl blur-md opacity-80 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-white rounded-3xl p-4 shadow-2xl overflow-hidden border border-white/20">
                <img
                  src={imgSheLeadsTech}
                  alt="She Leads Tech Practices Logo"
                  className="w-full h-auto rounded-2xl object-cover aspect-video"
                />
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="lg:col-span-7 text-center lg:text-left order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 text-xs font-bold uppercase tracking-wider mb-4">
              <HiSparkles className="w-3.5 h-3.5 text-brand-yellow" />
              <span>New Initiative by Unlock Her Tech</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4 text-white">
              She Leads Tech <span className="text-brand-pink">Practices</span>
            </h2>

            <p className="text-white/90 text-base sm:text-lg mb-6 leading-relaxed max-w-2xl font-medium">
              LeetCode & Problem Solving Series designed to help developers strengthen coding, problem-solving, and technical interview skills through live interactive sessions every two weeks.
            </p>

            {/* Quick feature pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8 text-xs font-semibold text-white">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 border border-white/20">
                <HiCodeBracket className="w-4 h-4 text-brand-yellow" /> LeetCode & Algorithmic Patterns
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 border border-white/20">
                <HiUsers className="w-4 h-4 text-brand-blue" /> Live Pair Programming
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 border border-white/20">
                <HiCalendarDays className="w-4 h-4 text-brand-green" /> Every 2 Weeks
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/practices"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-brand-coral hover:bg-white/90 font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Join She Leads Tech Practices <HiArrowRight className="w-4 h-4 text-brand-coral" />
              </Link>
              <Link
                to="/events"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold transition-all flex items-center justify-center gap-2"
              >
                View Upcoming Events
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
