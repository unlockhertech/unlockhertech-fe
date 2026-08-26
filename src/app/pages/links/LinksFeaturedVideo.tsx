
export function LinksFeaturedVideo() {
  return (
    <section aria-label="Featured video" className="w-full mb-8">
      <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-black aspect-video relative group">
        <iframe
          src="https://www.youtube-nocookie.com/embed/5EFBQsGvlUs"
          title="Unlock Her Tech Featured Episode"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>
    </section>
  );
}
