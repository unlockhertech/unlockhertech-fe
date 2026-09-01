import { SOCIAL_LINKS } from "./linksData";

interface LinksSocialNavProps {
  onSocialClick: (name: string, url: string) => void;
}

export function LinksSocialNav({ onSocialClick }: Readonly<LinksSocialNavProps>) {
  return (
    <nav aria-label="Social media links" className="flex items-center justify-center gap-3 mb-8 flex-wrap">
      {SOCIAL_LINKS.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Unlock Her Tech on ${social.name}`}
            onClick={() => onSocialClick(social.name, social.url)}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-brand-coral flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-110 cursor-pointer"
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </nav>
  );
}
