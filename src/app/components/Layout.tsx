import React, { useState } from "react";
import { Outlet, NavLink, Link, ScrollRestoration } from "react-router";
import { HiBars3, HiXMark, HiChevronDown } from "react-icons/hi2";
import logoImage from "../../assets/3b75a23b50c05dd92e772d611097d91604e0b5b1.png";
import { MiniPlayer } from "./MiniPlayer";
import { AudioPlayerProvider } from "../context/AudioPlayerContext";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { platforms } from "../data";

export function Layout() {
  return (
    <AudioPlayerProvider>
      <LayoutInner />
    </AudioPlayerProvider>
  );
}

function LayoutInner() {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [showPlatforms, setShowPlatforms] = useState(false);

  const navLinks = [
    { to: "/episodes", label: "Episodes" },
    { to: "/about",    label: "About"    },
    { to: "/team",     label: "Team"     },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <ScrollRestoration />

      {/* ── Nav ────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 shadow-sm bg-brand-coral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <Link to="/" onClick={() => setMobileOpen(false)}>
              <img src={logoImage} alt="Unlock Her Tech" className="h-10 w-auto object-contain" />
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `text-sm transition-all pb-0.5 ${isActive
                      ? "text-white border-b-2 border-white"
                      : "text-white/70 hover:text-white"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              {/* Subscribe dropdown */}
              <div className="relative ml-2">
                <button
                  onClick={() => setShowPlatforms(!showPlatforms)}
                                    className="flex items-center gap-2 px-5 py-2 rounded-full text-sm transition-all hover:opacity-90 bg-white text-brand-coral font-bold"
                >
                  Subscribe Now
                  <HiChevronDown className={`w-4 h-4 transition-transform ${showPlatforms ? "rotate-180" : ""}`} />
                </button>
                {showPlatforms && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowPlatforms(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-black/10">
                      {platforms.map(({ name, icon: Icon, url }) => (
                        <a key={name} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                          <Icon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700 text-sm">{name}</span>
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <HiXMark className="w-6 h-6" /> : <HiBars3 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/20 bg-brand-coral">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm transition-all ${isActive
                      ? "bg-white/20 text-white font-semibold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <div className="pt-3 mt-3 border-t border-white/20">
                <p className="text-white/50 text-xs px-4 mb-2 uppercase tracking-wider">Listen on</p>
                {platforms.map(({ name, icon: Icon, url }) => (
                  <a key={name} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all text-sm">
                    <Icon className="w-4 h-4" />
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── Page content ────────────────────────────────────────────────────── */}
      {/* Extra bottom padding when the mini-player is visible */}
      <main className="flex-1">
        <PlayerPaddedContent>
          <Outlet />
        </PlayerPaddedContent>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="py-14 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
              <img src={logoImage} alt="Unlock Her Tech" className="h-9 w-auto object-contain mb-4" />
              <p className="text-gray-400 text-sm leading-relaxed">Conversations that inspire change and action.</p>
              <div className="flex gap-2 mt-5">
                <div className="w-3 h-3 rounded-full bg-brand-coral" />
                <div className="w-3 h-3 rounded-full bg-brand-yellow" />
                <div className="w-3 h-3 rounded-full bg-brand-pink" />
                <div className="w-3 h-3 rounded-full bg-brand-green" />
                <div className="w-3 h-3 rounded-full bg-brand-blue" />
              </div>
            </div>

            <div>
              <p className="text-white text-sm mb-4 font-bold">Episodes</p>
              <ul className="space-y-2.5 text-gray-400 text-sm">
                <li><Link to="/episodes" className="hover:text-white transition-colors">Latest Episode</Link></li>
                <li><Link to="/episodes" className="hover:text-white transition-colors">All Episodes</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-white text-sm mb-4 font-bold">About</p>
              <ul className="space-y-2.5 text-gray-400 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">Our Mission</Link></li>
                <li><Link to="/team"  className="hover:text-white transition-colors">Meet the Team</Link></li>
                <li><a href="#"       className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <p className="text-white text-sm mb-4 font-bold">Subscribe</p>
              <div className="flex flex-col gap-2.5">
                {platforms.map(({ name, icon: Icon, url }) => (
                  <a key={name} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                    <Icon className="w-4 h-4 shrink-0" />
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/10">
            <p className="text-gray-500 text-sm">&copy; 2026 Unlock Her Tech. All rights reserved.</p>
            <div className="flex gap-1.5">
              <div className="w-6 h-1.5 rounded-full bg-brand-coral" />
              <div className="w-6 h-1.5 rounded-full bg-brand-yellow" />
              <div className="w-6 h-1.5 rounded-full bg-brand-pink" />
              <div className="w-6 h-1.5 rounded-full bg-brand-green" />
              <div className="w-6 h-1.5 rounded-full bg-brand-blue" />
            </div>
          </div>
        </div>
      </footer>

      {/* ── Persistent mini player ──────────────────────────────────────────── */}
      <MiniPlayer />
    </div>
  );
}

/** Adds bottom padding equal to the mini-player height when it's visible */
function PlayerPaddedContent({ children }: { children: React.ReactNode }) {
  const { currentEpisode } = useAudioPlayer();
  return (
    <div className={currentEpisode ? "pb-18" : "pb-0"}>
      {children}
    </div>
  );
}