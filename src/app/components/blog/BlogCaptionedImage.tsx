export interface BlogCaptionedImageProps {
  src: string;
  alt?: string;
  caption?: string;
  className?: string;
}

export function BlogCaptionedImage({
  src,
  alt = "",
  caption,
  className = "",
}: Readonly<BlogCaptionedImageProps>) {
  return (
    <figure className={`my-10 not-prose ${className}`}>
      <div className="overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 shadow-sm">
        <img
          src={src}
          alt={alt || caption || "Article illustration"}
          loading="lazy"
          className="w-full h-auto object-cover max-h-[500px]"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
