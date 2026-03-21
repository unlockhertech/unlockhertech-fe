// import { FaLinkedinIn } from "react-icons/fa6";
// import { HiOutlineEnvelope } from "react-icons/hi2";
import { ImageWithFallback } from "./ImageWithFallback";

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
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

export function TeamMember({ name, role, bio, avatarColor, photoUrl, initials }: TeamMemberProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border-2 border-black/5"
      style={{ borderColor: `${avatarColor}22` }}
    >
      {/* Photo / Avatar */}
      <div className="relative h-65">
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
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-4xl font-extrabold" style={{ backgroundColor: avatarColor }}>
            {initials}
          </div>
        )}

        {/* Role badge pinned to the bottom-left over photo */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-white font-extrabold text-[1.05rem]">{name}</div>
          <div className="text-xs mt-0.5 font-semibold" style={{ color: avatarColor === "#72c472" ? "#a8f0b0" : "#f4a0b4" }}>{role}</div>
        </div>
      </div>

      {/* Bio + socials */}
      <div className="p-5" style={{ backgroundColor: tintColor(avatarColor) }}>
        <p className="text-gray-500 text-sm mb-4 leading-[1.65]">{bio}</p>

        {/*<div className="flex gap-2">*/}
        {/*  {[FaLinkedinIn, HiOutlineEnvelope].map((Icon, i) => (*/}
        {/*    <button*/}
        {/*      key={i}*/}
        {/*      className="p-2 rounded-full bg-white hover:shadow-sm transition-all"*/}
        {/*      style={{ color: avatarColor }}*/}
        {/*    >*/}
        {/*      <Icon className="w-4 h-4" />*/}
        {/*    </button>*/}
        {/*  ))}*/}
        {/*</div>*/}
      </div>
    </div>
  );
}