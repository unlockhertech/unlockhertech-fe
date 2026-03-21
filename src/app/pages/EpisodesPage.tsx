import { useState } from "react";
import { HiOutlineMagnifyingGlass, HiOutlineSquares2X2, HiOutlineListBullet, HiOutlineAdjustmentsHorizontal, HiOutlineMusicalNote, HiOutlineRss, HiOutlineExclamationCircle } from "react-icons/hi2";
import { Link } from "react-router";
import { EpisodeCard } from "../components/EpisodeCard";
import { EpisodeListItem } from "../components/EpisodeListItem";
import { SubscribeCTA } from "../components/SubscribeCTA";
import { useRssFeed } from "../hooks/useRssFeed";
import { useMetaData } from "../hooks/useMetaData";
import {IMG_AUDIO_EQ} from "../data";

type SortOrder = "newest" | "oldest";
type ViewMode  = "grid" | "list";

const PAGE_SIZE = 6;

const TAG_FILTERS = [
  { label: "All",      value: ""            }];

// Simple keyword mapping per episode id
const EPISODE_TAGS: Record<number, string[]> = {
  1:  [],
  2:  [],
  3:  [],
  4:  [],
  5:  [],
  6:  [],
  7:  [],
  8:  [],
  9:  [],
  10: [],
  11: [],
  12: [],
};

export function EpisodesPage() {
  useMetaData("Episodes", "Browse all episodes of Unlock Her Tech podcast. Search and filter through conversations with founders, engineers, and innovators.");
  const { episodes, loading, error, isLive } = useRssFeed();
  const [search,       setSearch]       = useState("");
  const [sort,         setSort]         = useState<SortOrder>("newest");
  const [view,         setView]         = useState<ViewMode>("grid");
  const [activeTag,    setActiveTag]    = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = episodes
    .filter((ep) => {
      const q = search.toLowerCase();
      const matchesText = !q || ep.title.toLowerCase().includes(q) || ep.description.toLowerCase().includes(q);
      const matchesTag  = !activeTag || (EPISODE_TAGS[ep.id] ?? []).includes(activeTag);
      return matchesText && matchesTag;
    })
    .sort((a, b) => sort === "newest" ? b.episodeNumber - a.episodeNumber : a.episodeNumber - b.episodeNumber);

  const visible = filtered.slice(0, visibleCount);

  function handleSearchChange(val: string) {
    setSearch(val);
    setVisibleCount(PAGE_SIZE);
  }
  function handleTagChange(tag: string) {
    setActiveTag(tag);
    setVisibleCount(PAGE_SIZE);
  }
  function handleSortChange(s: SortOrder) {
    setSort(s);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div>

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="relative py-16 overflow-hidden bg-linear-to-br from-brand-coral to-[#8a1f55]">
        {/* decorative circles */}
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-10 bg-brand-pink" />
        <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full opacity-10 bg-brand-yellow" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Episodes</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-2xl bg-white/15">
              <HiOutlineMusicalNote className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-white font-extrabold" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}>All Episodes</h1>
          </div>
          <p className="text-white/70 max-w-125 leading-[1.75]">
            Every conversation we've ever had — search, filter, and find the one that speaks to you.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="px-3 py-1 rounded-full text-white text-xs font-semibold bg-brand-pink">
              {episodes.length} Episodes
            </span>
            <span className="px-3 py-1 rounded-full text-white text-xs font-semibold bg-brand-yellow">
              Season 1
            </span>
            <span className="px-3 py-1 rounded-full text-white text-xs font-semibold bg-brand-blue">
              Monthly drops
            </span>
          </div>
        </div>
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div className="bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Tag filters */}
          <div className="flex gap-2 flex-wrap mb-5">
            {TAG_FILTERS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleTagChange(value)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${
                  activeTag === value 
                    ? "bg-brand-coral text-white border-brand-coral" 
                    : "bg-white text-gray-700 border-black/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search + sort + view row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search episodes…"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-800 text-sm outline-none transition-all border border-black/10 focus:ring-2 focus:ring-brand-coral/20 focus:border-brand-coral"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <HiOutlineAdjustmentsHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value as SortOrder)}
                className="pl-9 pr-8 py-3 rounded-xl bg-white text-sm text-gray-700 outline-none appearance-none cursor-pointer border border-black/10 focus:ring-2 focus:ring-brand-coral/20 focus:border-brand-coral"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>

            {/* View toggle */}
            <div className="flex rounded-xl overflow-hidden shrink-0 border border-black/10">
              {(["grid", "list"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm transition-all ${view === v ? "bg-brand-coral text-white" : "bg-white text-gray-500 hover:text-gray-700"}`}
                >
                  {v === "grid" ? <HiOutlineSquares2X2 className="w-4 h-4" /> : <HiOutlineListBullet className="w-4 h-4" />}
                  <span className="hidden sm:inline capitalize">{v}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ────────────────────────────────────────────────────────── */}
      <div className="py-8 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Live / fallback status badge */}
          {isLive && (
            <div className="flex items-center gap-2 mb-4 text-xs text-brand-green">
              <HiOutlineRss className="w-3.5 h-3.5" />
              <span className="font-semibold">Live from RSS feed</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 mb-4 text-xs text-amber-600">
              <HiOutlineExclamationCircle className="w-3.5 h-3.5" />
              <span>Using cached data — RSS fetch failed: {error}</span>
            </div>
          )}
          {loading && (
            <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
              <div className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
              <span>Loading from RSS feed…</span>
            </div>
          )}

          {/* Count */}
          <p className="text-gray-400 text-sm mb-6">
            Showing{" "}
            <span className="text-brand-coral font-semibold">{Math.min(visibleCount, filtered.length)}</span>
            {" "}of{" "}
            <span className="font-semibold">{filtered.length}</span>
            {" "}episode{filtered.length !== 1 ? "s" : ""}
            {search && <span> matching "<em>{search}</em>"</span>}
          </p>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🎙️</div>
              <p className="text-gray-500 text-lg mb-2">No episodes found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
              <button
                onClick={() => { setSearch(""); setActiveTag(""); }}
                className="mt-6 px-6 py-2.5 rounded-full text-sm text-white transition-all hover:opacity-90 bg-brand-coral font-semibold"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* Grid view */}
          {filtered.length > 0 && view === "grid" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((ep) => <EpisodeCard key={ep.id} episode={ep} />)}
            </div>
          )}

          {/* List view */}
          {filtered.length > 0 && view === "list" && (
            <div className="flex flex-col gap-3">
              {visible.map((ep) => <EpisodeListItem key={ep.id} episode={ep} />)}
            </div>
          )}

          {/* Load more / Show less */}
          {filtered.length > PAGE_SIZE && (
            <div className="flex justify-center gap-3 mt-12">
              {visibleCount < filtered.length && (
                <button
                  onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                  className="px-8 py-3 rounded-full text-white transition-all hover:opacity-90 bg-brand-coral font-semibold shadow-md"
                >
                  Load more episodes
                </button>
              )}
              {visibleCount > PAGE_SIZE && (
                <button
                  onClick={() => setVisibleCount(PAGE_SIZE)}
                  className="px-8 py-3 rounded-full transition-all hover:bg-pink-50 text-brand-coral border-2 border-brand-coral bg-white font-semibold"
                >
                  Show less
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Subscribe CTA ──────────────────────────────────────────────────── */}
      <SubscribeCTA
        bgImage={IMG_AUDIO_EQ}
        title="Subscribe & Never Miss a Drop"
        subtitle="A new episode lands every month. Pick your platform and stay plugged in."
      />

    </div>
  );
}