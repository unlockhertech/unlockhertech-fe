import { Link } from "react-router";
import type { LinkItem } from "./linksData";

interface LinksListProps {
  links: LinkItem[];
  onLinkClick: (title: string, url: string) => void;
}

export function LinksList({ links, onLinkClick }: LinksListProps) {
  return (
    <section aria-label="Quick links" className="w-full space-y-3.5 mb-8">
      {links.map((item) => {
        const Icon = item.icon;

        const buttonClasses = item.isFeatured
          ? "w-full p-4 rounded-2xl bg-[#92d599] hover:bg-[#82cb8a] text-[#580322] font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between group border border-emerald-300/40 cursor-pointer"
          : "w-full p-4 rounded-2xl bg-[#fffdf1] hover:bg-white text-[#580322] font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between group border border-stone-200/50 cursor-pointer";

        const content = (
          <>
            <div className="flex items-center gap-3.5 text-left">
              {Icon && (
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                    item.isFeatured
                      ? "bg-[#580322]/10 text-[#580322]"
                      : "bg-pink-50 text-brand-coral"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="text-sm sm:text-base font-black leading-tight text-[#580322]">
                  {item.title}
                </div>
                {item.subtitle && (
                  <div className="text-[11px] text-[#580322]/70 font-medium leading-normal mt-0.5 line-clamp-1">
                    {item.subtitle}
                  </div>
                )}
              </div>
            </div>

            {item.badge && (
              <span
                className={`ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                  item.isFeatured
                    ? "bg-[#580322] text-white"
                    : "bg-brand-coral/10 text-brand-coral"
                }`}
              >
                {item.badge}
              </span>
            )}
          </>
        );

        if (item.isExternal) {
          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onLinkClick(item.title, item.url)}
              className={buttonClasses}
            >
              {content}
            </a>
          );
        }

        return (
          <Link
            key={item.id}
            to={item.url}
            onClick={() => onLinkClick(item.title, item.url)}
            className={buttonClasses}
          >
            {content}
          </Link>
        );
      })}
    </section>
  );
}
