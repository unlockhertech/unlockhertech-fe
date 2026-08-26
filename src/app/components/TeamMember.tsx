import { FaLinkedin } from "react-icons/fa6";
import { HiChatBubbleBottomCenterText } from "react-icons/hi2";
import { ImageWithFallback } from "./ImageWithFallback";

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  tagline?: string;
  linkedinUrl?: string;
  avatarColor: string;
  photoUrl?: string;
  initials?: string;
}

function tintColor(hex: string): string {
  const map: Record<string, string> = {
    "#B42970": "var(--podcast-coral)",
    "#5f9de3": "var(--podcast-blue)",
    "#72c472": "var(--podcast-green)",
    "#e8563a": "var(--podcast-yellow)",
    "#f4a0b4": "var(--podcast-pink)",
  };
  const color = map[hex] ?? "var(--color-stone-50)";
  return `color-mix(in srgb, ${color} 10%, white)`;
}

export function TeamMember({ 
  name, 
  role, 
  bio, 
  tagline,
  linkedinUrl,
  avatarColor, 
  photoUrl, 
  initials 
}: Readonly<TeamMemberProps>) {
  return (
    <div
      className="rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-black/5 bg-white flex flex-col justify-between"
      style={{ borderColor: `${avatarColor}33` }}
    >
      <div>
        {/* Photo / Avatar */}
        <div className="relative h-64 sm:h-72 bg-gray-100">
          {photoUrl ? (
            <>
              <ImageWithFallback
                src={photoUrl}
                alt={name}
                className="w-full h-full object-cover object-top"
              />
              {/* Gradient overlay at the bottom for text legibility */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)" }}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-4xl font-extrabold" style={{ backgroundColor: avatarColor }}>
              {initials}
            </div>
          )}

          {/* Role badge pinned to the bottom-left over photo */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-white font-black text-lg drop-shadow-sm">{name}</div>
            <div 
              className="text-xs mt-0.5 font-bold uppercase tracking-wider" 
              style={{ color: avatarColor === "#72c472" ? "#a8f0b0" : "#fcd5e0" }}
            >
              {role}
            </div>
          </div>
        </div>

        {/* Bio + Personality Tagline */}
        <div className="p-5">
          {tagline && (
            <div 
              className="mb-3.5 p-2.5 rounded-2xl text-xs font-medium text-gray-700 flex items-start gap-2 border border-black/5"
              style={{ backgroundColor: tintColor(avatarColor) }}
            >
              <HiChatBubbleBottomCenterText className="w-4 h-4 shrink-0 mt-0.5" style={{ color: avatarColor }} />
              <span className="leading-snug italic">&ldquo;{tagline}&rdquo;</span>
            </div>
          )}

          <p className="text-gray-600 text-sm leading-[1.65]">{bio}</p>
        </div>
      </div>

      {/* Social / Connect footer */}
      {linkedinUrl && (
        <div className="px-5 pb-5 pt-2">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Connect with ${name} on LinkedIn`}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#0a66c2] transition-colors py-1.5 px-3 rounded-full bg-stone-100 hover:bg-blue-50"
          >
            <FaLinkedin className="w-3.5 h-3.5 text-[#0a66c2]" />
            <span>Connect on LinkedIn</span>
          </a>
        </div>
      )}
    </div>
  );
}