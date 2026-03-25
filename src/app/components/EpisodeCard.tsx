import {useState, useEffect} from "react";
import {createPortal} from 'react-dom'
import {HiPlay, HiPause, HiOutlineClock, HiXMark, HiCalendar, HiClock} from "react-icons/hi2";
import { IoHeadset } from "react-icons/io5";
import {ImageWithFallback} from "./ImageWithFallback";
import {useAudioPlayer} from "../hooks/useAudioPlayer";
import {platforms} from '../data'
import type {Episode} from "../data";

// ── Episode Detail Modal ────────────────────────────────────────────────────
function EpisodeModal({
                          episode,
                          onClose,
                      }: {
    episode: Episode;
    onClose: () => void;
}) {
    const {title, description, duration, date, episodeNumber, coverColor, imageUrl} = episode;
    const {toggle, isThisPlaying} = useAudioPlayer();
    const playing = isThisPlaying(episode.id);

    // Lock body scroll while modal is open
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    // Close on the Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="episode-modal-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal card */}
            <div
                className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Hero cover */}
                <div className="relative h-52 flex-shrink-0 overflow-hidden">
                    {imageUrl ? (
                        <>
                            <ImageWithFallback
                                src={imageUrl}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: `linear-gradient(160deg, ${coverColor}ee 0%, ${coverColor}99 50%, transparent 100%)`,
                                }}
                            />
                        </>
                    ) : (
                        <div className="w-full h-full" style={{backgroundColor: coverColor}}/>
                    )}

                    {/* Episode badge */}
                    <div className="absolute top-4 left-4">
            <span
                className="inline-block text-white text-xs px-3 py-1.5 rounded-lg"
                style={{
                    backgroundColor: "rgba(0,0,0,0.35)",
                    backdropFilter: "blur(6px)",
                    fontWeight: 700,
                    letterSpacing: "0.06em"
                }}
            >
              EP {episodeNumber}
            </span>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 rounded-full p-1.5 bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
                        aria-label="Close"
                    >
                        <HiXMark className="w-4 h-4"/>
                    </button>

                    {/* Play / Pause */}
                    <button
                        onClick={() => toggle(episode)}
                        className="absolute bottom-4 right-4 rounded-full p-3.5 shadow-lg hover:scale-110 transition-transform bg-white"
                        aria-label={playing ? "Pause episode" : "Play episode"}
                    >
                        {playing
                            ? <HiPause className="w-5 h-5" style={{color: coverColor}} fill="currentColor"/>
                            : <HiPlay className="w-5 h-5" style={{color: coverColor}} fill="currentColor"/>
                        }
                    </button>

                    {/* Playing indicator */}
                    {playing && (
                        <div className="absolute top-4 right-14 flex items-end gap-0.5 h-5">
                            {[3, 5, 4, 6, 3].map((h, i) => (
                                <div
                                    key={i}
                                    className="w-1 rounded-full"
                                    style={{
                                        height: `${h * 3}px`,
                                        backgroundColor: "white",
                                        animation: `epBounce 0.6s ease-in-out ${i * 0.1}s infinite alternate`,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto p-6 flex flex-col gap-4">
                    {/* Meta row */}
                    <div className="flex items-center gap-4 text-gray-400 text-xs">
            <span className="flex items-center gap-1.5">
              <HiCalendar className="w-3.5 h-3.5"/>
                {date}
            </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"/>
                        <span className="flex items-center gap-1.5">
              <HiClock className="w-3.5 h-3.5"/>
                            {duration}
            </span>
                    </div>

                    {/* Title */}
                    <h2 id="episode-modal-title" className="text-gray-900" style={{lineHeight: 1.3}}>
                        {title}
                    </h2>

                    {/* Accent line */}
                    <div className="h-0.5 w-12 rounded-full" style={{backgroundColor: coverColor}}/>

                    {/* Full description */}
                    <p className="text-gray-600 text-sm" style={{lineHeight: 1.75}}>
                        {description}
                    </p>

                    {/* Listen on platforms */}
                    <div className="pt-2">
                        <p className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
                            <IoHeadset className="w-3.5 h-3.5"/> Listen on
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {platforms.map((p) => {
                                const Icon = p.icon;
                                return (
                                    <a
                                        key={p.name}
                                        href={p.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl border transition-all hover:scale-105 hover:shadow-sm"
                                        style={{
                                            borderColor: `${coverColor}55`,
                                            color: coverColor,
                                            backgroundColor: `${coverColor}0d`,
                                        }}
                                    >
                                        <Icon className="w-3.5 h-3.5"/>
                                        {p.name}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes epBounce { from { transform: scaleY(1); } to { transform: scaleY(0.3); } }
      `}</style>
        </div>,
        document.body
    );
}

// ── Episode Card ────────────────────────────────────────────────────────────
interface EpisodeCardProps {
    episode: Episode;
}

export function EpisodeCard({episode}: EpisodeCardProps) {
    const {title, description, duration, date, episodeNumber, coverColor, imageUrl} = episode;
    const {toggle, isThisPlaying} = useAudioPlayer();
    const playing = isThisPlaying(episode.id);
    const [modalOpen, setModalOpen] = useState(false);

    // Only show the toggle if the description is long enough to be truncated
    const isLong = description.length > 100;

    return (
        <>
            <div
                className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 bg-white border border-black/7"
            >
                {/* Cover */}
                <div className="h-48 relative overflow-hidden bg-gray-100">
                    {imageUrl ? (
                        <>
                            <ImageWithFallback src={imageUrl} alt={title} className="w-full h-full object-cover"/>
                            <div
                                className="absolute inset-0"
                                style={{background: `linear-gradient(135deg, ${coverColor}dd 0%, ${coverColor}88 50%, transparent 100%)`}}
                            />
                        </>
                    ) : (
                        <div className="w-full h-full" style={{backgroundColor: coverColor}}/>
                    )}

                    {/* Episode badge */}
                    <div className="absolute top-4 left-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 font-bold tracking-wider">
                            <div className="text-white text-xs uppercase">EP {episodeNumber}</div>
                        </div>
                    </div>

                    {/* Play / Pause button */}
                    <button
                        onClick={() => toggle(episode)}
                        className="absolute bottom-4 right-4 rounded-full p-3 shadow-lg hover:scale-110 transition-transform bg-white"
                        aria-label={playing ? `Pause episode ${episodeNumber}` : `Play episode ${episodeNumber}`}
                    >
                        {playing
                            ? <HiPause className="w-5 h-5" style={{color: coverColor}} fill="currentColor"/>
                            : <HiPlay className="w-5 h-5" style={{color: coverColor}} fill="currentColor"/>
                        }
                    </button>

                    {/* Animated playing indicator */}
                    {playing && (
                        <div className="absolute top-4 right-4 flex items-end gap-0.5 h-5">
                            {[3, 5, 4, 6, 3].map((h, i) => (
                                <div
                                    key={i}
                                    className="w-1 rounded-full"
                                    style={{
                                        height: `${h * 3}px`,
                                        backgroundColor: "white",
                                        animation: `bounce 0.6s ease-in-out ${i * 0.1}s infinite alternate`,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="flex items-center gap-3 text-gray-400 text-xs mb-3">
                        <span>{date}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"/>
                        <span className="flex items-center gap-1"><HiOutlineClock className="w-3 h-3"/>{duration}</span>
                    </div>
                    <h3 className="mb-2 text-neutral-900">{title}</h3>
                    {/* description */}
                    <p
                        className="text-gray-500 text-sm"
                        style={{
                            lineHeight: 1.6,
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                        }}
                    >
                        {description}
                    </p>

                    {/* Read more → opens modal */}
                    {isLong && (
                        <button
                            onClick={() => setModalOpen(true)}
                            className="flex items-center gap-1 text-xs mt-1.5 transition-colors hover:opacity-70 underline underline-offset-2"
                            style={{color: coverColor, fontWeight: 600}}
                        >
                            Read more
                        </button>
                    )}

                    <div className="mt-4 h-0.5 w-10 rounded-full" style={{backgroundColor: coverColor}}/>
                </div>
            </div>

            {modalOpen && (
                <EpisodeModal episode={episode} onClose={() => setModalOpen(false)}/>
            )}

            <style>{`@keyframes bounce { from { transform: scaleY(1); } to { transform: scaleY(0.3); } }`}</style>
        </>
    );
}
