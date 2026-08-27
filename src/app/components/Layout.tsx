import { useState, type ReactNode } from "react";
import { Outlet, NavLink, Link, ScrollRestoration } from "react-router";
import { HiBars3, HiXMark, HiChevronDown } from "react-icons/hi2";
import logoImage from "../../assets/logo-header.webp";
import { MiniPlayer } from "./MiniPlayer";
import { CookieBanner } from "./CookieBanner";
import { AnnouncementBar } from "./AnnouncementBar";
import { AudioPlayerProvider } from "../context/AudioPlayerContext";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { BERRY, ORANGE, BLUE, PINK, GREEN, platforms } from "../data";

export function Layout() {
  return (
    <AudioPlayerProvider>
      <LayoutInner />
      <CookieBanner />
    </AudioPlayerProvider>
  );
}

function LayoutInner() {
  const [mobileOpen, setMobileOpen]             = useState(false);
  const [showPlatforms, setShowPlatforms]       = useState(false);
  const [showResources, setShowResources]       = useState(false);
  const [showAbout, setShowAbout]               = useState(false);

  const enableBlog = import.meta.env.VITE_ENABLE_BLOG === 'true';
  const enableEvents = import.meta.env.VITE_ENABLE_EVENTS === 'true';
  const enableResources = import.meta.env.VITE_ENABLE_RESOURCES === 'true';
  const enableAssessment = import.meta.env.VITE_ENABLE_ASSESSMENT === 'true';
  const enableGetInvolved = import.meta.env.VITE_ENABLE_GET_INVOLVED === 'true';
  const enableJobs = import.meta.env.VITE_ENABLE_JOBS !== 'false';

  const hasMultipleResources = enableResources && enableAssessment;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <ScrollRestoration />

      {/* ── Accessible Skip to Main Content Link ─────────────────────────────────── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-brand-coral focus:text-white focus:font-extrabold focus:rounded-xl focus:shadow-2xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* ── Top Announcement Banner ────────────────────────────────────────────── */}
      <AnnouncementBar />

      {/* ── Nav ────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 shadow-sm bg-brand-coral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 sm:gap-3">
              <img
                src={logoImage}
                alt="Unlock Her Tech Logo"
                width={44}
                height={44}
                className="h-10 sm:h-11 w-auto object-contain"
              />
              <span className="text-white text-base sm:text-lg lg:text-xl font-black tracking-tight leading-none">
                Unlock Her Tech
              </span>
            </Link>

            {/* Desktop Navigation (Miller's Law 7±2 Items) */}
            <div className="hidden md:flex items-center gap-5 lg:gap-6">

              {/* 1. Episodes */}
              <NavLink
                  to="/episodes"
                  className={({ isActive }) =>
                      `text-sm font-semibold transition-all pb-0.5 inline-flex items-center gap-1.5 ${isActive
                          ? "text-white border-b-2 border-white"
                          : "text-white/80 hover:text-white"
                      }`
                  }
              >
                Episodes
              </NavLink>

              {/* 2. Practices */}
              <NavLink
                to="/practices"
                className={({ isActive }) =>
                  `text-sm font-semibold transition-all pb-0.5 inline-flex items-center gap-1.5 ${isActive
                    ? "text-white border-b-2 border-white"
                    : "text-white/80 hover:text-white"
                  }`
                }
              >
                Practices
              </NavLink>

              {/* 3. Jobs (if enabled) */}
              {enableJobs && (
                <NavLink
                  to="/jobs"
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-all pb-0.5 inline-flex items-center gap-1.5 ${isActive
                      ? "text-white border-b-2 border-white"
                      : "text-white/80 hover:text-white"
                    }`
                  }
                >
                  Jobs
                </NavLink>
              )}

              {/* 4. Events (if enabled) */}
              {enableEvents && (
                <NavLink
                  to="/events"
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-all pb-0.5 inline-flex items-center gap-1.5 ${isActive
                      ? "text-white border-b-2 border-white"
                      : "text-white/80 hover:text-white"
                    }`
                  }
                >
                  Events
                </NavLink>
              )}

              {/* 4. Resources (Grouped Dropdown when multiple resources exist) */}
              {hasMultipleResources ? (
                <div className="relative">
                  <button
                    onClick={() => setShowResources(!showResources)}
                    className="text-sm font-semibold text-white/80 hover:text-white transition-all inline-flex items-center gap-1 pb-0.5 cursor-pointer"
                  >
                    <span>Resources</span>
                    <HiChevronDown className={`w-3.5 h-3.5 transition-transform ${showResources ? "rotate-180" : ""}`} />
                  </button>

                  {showResources && (
                    <>
                      <button
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setShowResources(false)}
                        aria-label="Close resources menu"
                        type="button"
                      />
                      <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-black/10 p-2">
                        <Link
                          to="/resources"
                          onClick={() => setShowResources(false)}
                          className="flex flex-col px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                        >
                          <span className="text-gray-900 font-bold text-sm">Career Playbooks</span>
                          <span className="text-gray-500 text-xs">Free weekly downloadable PDF guides</span>
                        </Link>
                        <Link
                          to="/assessment"
                          onClick={() => setShowResources(false)}
                          className="flex flex-col px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                        >
                          <span className="text-gray-900 font-bold text-sm">Career Fit Assessment</span>
                          <span className="text-gray-500 text-xs">Interactive 16-question worksheet</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              ) : enableResources ? (
                <NavLink
                  to="/resources"
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-all pb-0.5 inline-flex items-center gap-1.5 ${isActive
                      ? "text-white border-b-2 border-white"
                      : "text-white/80 hover:text-white"
                    }`
                  }
                >
                  Resources
                </NavLink>
              ) : enableAssessment ? (
                <NavLink
                  to="/assessment"
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-all pb-0.5 inline-flex items-center gap-1.5 ${isActive
                      ? "text-white border-b-2 border-white"
                      : "text-white/80 hover:text-white"
                    }`
                  }
                >
                  Assessment
                </NavLink>
              ) : null}

              {/* 5. Blog (if enabled) */}
              {enableBlog && (
                <NavLink
                  to="/blog"
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-all pb-0.5 inline-flex items-center gap-1.5 ${isActive
                      ? "text-white border-b-2 border-white"
                      : "text-white/80 hover:text-white"
                    }`
                  }
                >
                  Blog
                </NavLink>
              )}

              {/* 6. About Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowAbout(!showAbout);
                    setShowResources(false);
                    setShowPlatforms(false);
                  }}
                  className="text-sm font-semibold text-white/80 hover:text-white transition-all inline-flex items-center gap-1 pb-0.5 cursor-pointer"
                >
                  <span>About</span>
                  <HiChevronDown className={`w-3.5 h-3.5 transition-transform ${showAbout ? "rotate-180" : ""}`} />
                </button>

                {showAbout && (
                  <>
                    <button
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setShowAbout(false)}
                      aria-label="Close about menu"
                      type="button"
                    />
                    <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-black/10 p-2">
                      <Link
                        to="/about"
                        onClick={() => setShowAbout(false)}
                        className="flex flex-col px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                      >
                        <span className="text-gray-900 font-bold text-sm">Our Mission & Story</span>
                        <span className="text-gray-500 text-xs">Why we started Unlock Her Tech</span>
                      </Link>
                      <Link
                        to="/team"
                        onClick={() => setShowAbout(false)}
                        className="flex flex-col px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                      >
                        <span className="text-gray-900 font-bold text-sm">Meet the Team</span>
                        <span className="text-gray-500 text-xs">Leaders & contributors</span>
                      </Link>
                      <Link
                        to="/community-guidelines"
                        onClick={() => setShowAbout(false)}
                        className="flex flex-col px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                      >
                        <span className="text-gray-900 font-bold text-sm">Community Guidelines</span>
                        <span className="text-gray-500 text-xs">Our values & code of conduct</span>
                      </Link>
                    </div>
                  </>
                )}
              </div>

              {/* 7. Get Involved (if enabled) */}
              {enableGetInvolved && (
                <NavLink
                  to="/get-involved"
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-all px-3 py-1 rounded-full ${isActive
                      ? "bg-white/25 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white"
                    }`
                  }
                >
                  Get Involved
                </NavLink>
              )}

              {/* Subscribe Dropdown CTA */}
              <div className="relative ml-1">
                <button
                  onClick={() => setShowPlatforms(!showPlatforms)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all hover:opacity-95 bg-white text-brand-coral shadow-xs cursor-pointer"
                >
                  <span>Listen to Podcast On</span>
                  <HiChevronDown className={`w-3.5 h-3.5 transition-transform ${showPlatforms ? "rotate-180" : ""}`} />
                </button>
                {showPlatforms && (
                  <>
                    <button
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setShowPlatforms(false)}
                      aria-label="Close menu"
                      type="button"
                    />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-black/10">
                      {platforms.map(({ name, icon: Icon, url }) => (
                        <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Listen on ${name}`} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                          <Icon className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700 text-sm font-medium">{name}</span>
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
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
              <NavLink
                to="/practices"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${isActive
                    ? "bg-white/20 text-white font-semibold"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                Practices
              </NavLink>

              <NavLink
                to="/episodes"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${isActive
                    ? "bg-white/20 text-white font-semibold"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                Episodes
              </NavLink>

              {enableJobs && (
                <NavLink
                  to="/jobs"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${isActive
                      ? "bg-white/20 text-white font-semibold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  Jobs
                </NavLink>
              )}

              {enableEvents && (
                <NavLink
                  to="/events"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${isActive
                      ? "bg-white/20 text-white font-semibold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  Events
                </NavLink>
              )}

              {enableResources && (
                <NavLink
                  to="/resources"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${isActive
                      ? "bg-white/20 text-white font-semibold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  Career Playbooks
                </NavLink>
              )}

              {enableAssessment && (
                <NavLink
                  to="/assessment"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${isActive
                      ? "bg-white/20 text-white font-semibold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  Career Fit Assessment
                </NavLink>
              )}

              {enableBlog && (
                <NavLink
                  to="/blog"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${isActive
                      ? "bg-white/20 text-white font-semibold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  Blog
                </NavLink>
              )}

              {/* About & Mission Sub-links */}
              <div className="bg-black/10 rounded-xl overflow-hidden p-1 space-y-0.5">
                <p className="text-white/60 text-[11px] font-bold uppercase tracking-wider px-3 pt-2 pb-1">About Unlock Her Tech</p>
                <NavLink
                  to="/about"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${isActive
                      ? "bg-white/20 text-white font-semibold"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  Our Mission & Story
                </NavLink>
                <NavLink
                  to="/team"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${isActive
                      ? "bg-white/20 text-white font-semibold"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  Meet the Team
                </NavLink>
                <NavLink
                  to="/community-guidelines"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${isActive
                      ? "bg-white/20 text-white font-semibold"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  Community Guidelines
                </NavLink>
              </div>

              {enableGetInvolved && (
                <NavLink
                  to="/get-involved"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                      ? "bg-white text-brand-coral"
                      : "bg-white/15 text-white hover:bg-white/25"
                    }`
                  }
                >
                  Get Involved
                </NavLink>
              )}

              <div className="pt-3 mt-3 border-t border-white/20">
                <p className="text-white/50 text-xs px-4 mb-2 uppercase tracking-wider">Listen on</p>
                {platforms.map(({ name, icon: Icon, url }) => (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Listen on ${name}`} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all text-sm">
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
      <main className="flex-1 focus:outline-none" id="main-content" tabIndex={-1}>
        <PlayerPaddedContent>

          <Outlet />
        </PlayerPaddedContent>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="py-14 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${enableGetInvolved ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-8 lg:gap-6 mb-12`}>
            <div>
              <img
                src={logoImage}
                alt="Unlock Her Tech Logo"
                width={36}
                height={36}
                loading="lazy"
                decoding="async"
                className="h-9 w-auto object-contain mb-4"
              />
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">Conversations and technical practices that inspire change and action.</p>
              <div className="flex gap-1.5 mt-5">
                {[
                  { id: "dot-berry", c: BERRY },
                  { id: "dot-orange", c: ORANGE },
                  { id: "dot-pink", c: PINK },
                  { id: "dot-green", c: GREEN },
                  { id: "dot-blue", c: BLUE },
                ].map((dot) => (
                  <div key={dot.id} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dot.c }} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-white text-sm mb-4 font-bold">Content</p>
              <ul className="space-y-1 text-gray-400 text-xs sm:text-sm">
                <li><Link to="/episodes" className="inline-block py-1 hover:text-white transition-colors">Latest Episode</Link></li>
                <li><Link to="/episodes" className="inline-block py-1 hover:text-white transition-colors">All Episodes</Link></li>
                <li><Link to="/practices" className="inline-block py-1 hover:text-white transition-colors">Practices</Link></li>
                {enableJobs && (
                    <li><Link to="/jobs" className="inline-block py-1 hover:text-white transition-colors">Inclusive Job Board</Link></li>
                )}
                {enableResources && (
                    <li><Link to="/resources" className="inline-block py-1 hover:text-white transition-colors">Free Career Guides</Link></li>
                )}
                {enableAssessment && (
                    <li><Link to="/assessment" className="inline-block py-1 hover:text-white transition-colors">Career Fit Self-Assessment</Link></li>
                )}
                {enableBlog ? <li><Link to="/blog" className="inline-block py-1 hover:text-white transition-colors">Blog</Link></li> : null}
                {enableEvents ? <li><Link to="/events" className="inline-block py-1 hover:text-white transition-colors">Upcoming Events</Link></li> : null}
              </ul>
            </div>

            <div>
              <p className="text-white text-sm mb-4 font-bold">About & Team</p>
              <ul className="space-y-1 text-gray-400 text-xs sm:text-sm">
                <li><Link to="/about" className="inline-block py-1 hover:text-white transition-colors">Our Mission & Story</Link></li>
                <li><Link to="/team" className="inline-block py-1 hover:text-white transition-colors">Meet the Team</Link></li>
              </ul>
            </div>

            {enableGetInvolved && (
              <div>
                <p className="text-white text-sm mb-4 font-bold">Get Involved</p>
                <ul className="space-y-1 text-gray-400 text-xs sm:text-sm">
                  <li><Link to="/get-involved" className="inline-block py-1 hover:text-white transition-colors">Mentor With Us</Link></li>
                  <li><Link to="/get-involved" className="inline-block py-1 hover:text-white transition-colors">Request to be a Guest</Link></li>
                  <li><Link to="/get-involved" className="inline-block py-1 hover:text-white transition-colors">Partner With Us</Link></li>
                </ul>
              </div>
            )}

            <div>
              <p className="text-white text-sm mb-4 font-bold">Trust & Legal</p>
              <ul className="space-y-1 text-gray-400 text-xs sm:text-sm mb-4">
                <li><Link to="/privacy-policy" className="inline-block py-1 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/community-guidelines" className="inline-block py-1 hover:text-white transition-colors">Community Guidelines</Link></li>
                <li><Link to="/code-of-conduct" className="inline-block py-1 hover:text-white transition-colors">Code of Conduct</Link></li>
                <li><Link to="/cookie-policy" className="inline-block py-1 hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><a href="mailto:info@unlockhertech.com" className="inline-block py-1 hover:text-white transition-colors" aria-label="Contact us via email">Contact Us</a></li>
              </ul>
              <div className="flex gap-2.5 pt-1">
                {platforms.map(({ name, icon: Icon, url }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Listen on ${name}`}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/10">
            <p className="text-gray-400 text-sm">&copy; 2026 Unlock Her Tech. All rights reserved.</p>
            <div className="flex gap-1.5">
              {[
                { id: "bar-berry", c: BERRY },
                { id: "bar-orange", c: ORANGE },
                { id: "bar-pink", c: PINK },
                { id: "bar-green", c: GREEN },
                { id: "bar-blue", c: BLUE },
              ].map((bar) => (
                <div key={bar.id} className="w-6 h-1.5 rounded-full" style={{ backgroundColor: bar.c }} />
              ))}
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
function PlayerPaddedContent({ children }: Readonly<{ children: ReactNode }>) {
  const { currentEpisode } = useAudioPlayer();
  return (
    <div className={currentEpisode ? "pb-24" : ""}>
      {children}
    </div>
  );
}