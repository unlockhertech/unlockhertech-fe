import { HiMicrophone } from "react-icons/hi2";
import { platforms } from "../data";

interface SubscribeCTAProps {
  title?: string;
  subtitle?: string;
  bgImage?: string;
}

export function SubscribeCTA({
                                 title    = "Never Miss an Episode",
                                 subtitle = "Subscribe on your favourite platform and get notified the moment a new episode drops each month.",
  bgImage,
}: SubscribeCTAProps) {
  return (
    <section className="py-20 relative overflow-hidden bg-brand-coral">
      {bgImage && (
        <div className="absolute inset-0">
          <img src={bgImage} alt="" className="w-full h-full object-cover opacity-10" />
        </div>
      )}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-white/15"
        >
          <HiMicrophone className="w-4 h-4 text-white" />
          <span className="text-sm text-white font-semibold">Listen anywhere, anytime</span>
        </div>

        <h2 className="text-white mb-4 font-extrabold" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
          {title}
        </h2>
        <p className="text-white/75 mb-10 mx-auto text-[1.05rem] max-w-115 leading-[1.75]">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 flex-wrap">
          {platforms.map(({ name, icon: Icon, url }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-white hover:opacity-90 transition-all shadow-md hover:-translate-y-0.5 text-brand-coral font-semibold"
            >
              <Icon className="w-5 h-5" />
              <span>{name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}