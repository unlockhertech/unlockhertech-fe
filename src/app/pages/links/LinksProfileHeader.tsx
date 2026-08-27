
interface LinksProfileHeaderProps {
  onHandleClick: () => void;
}

export function LinksProfileHeader({ onHandleClick }: LinksProfileHeaderProps) {
  return (
    <header className="flex flex-col items-center text-center mb-8">
      <div className="relative mb-4 group">
        <div className="absolute -inset-1 rounded-full bg-linear-to-r from-brand-yellow via-brand-pink to-brand-blue blur-xs opacity-75 group-hover:opacity-100 transition-opacity" />
        <img
          src="/logo.webp"
          alt="Unlock Her Tech Logo"
          width={96}
          height={96}
          className="relative w-24 h-24 rounded-full object-cover border-3 border-white shadow-xl bg-white"
        />
      </div>

      <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-2 drop-shadow-xs">
        Links to Unlock Her Tech
      </h1>

      <a
        href="https://www.instagram.com/unlockhertech/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onHandleClick}
        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#92d599] text-[#580322] font-black text-xs tracking-wide shadow-xs hover:scale-105 transition-transform mb-3 cursor-pointer"
      >
        @unlockhertech
      </a>

      <p className="text-white/90 text-sm max-w-xs font-medium leading-relaxed">
        Conversations that unlock careers in tech. <br />
        <span className="font-bold text-white">Don’t miss your favorites.</span>
      </p>
    </header>
  );
}
